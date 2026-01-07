---
title: "Test Architecture for a Production Image Hosting Service"
description: "How Chitram structures 4,000+ lines of tests across unit, API, integration, and browser layers — with a TestDependencies pattern that solved our async nightmare."
pubDate: 2026-01-06
tags: ["Testing", "Python", "FastAPI", "Architecture", "CI/CD"]
draft: false
---

> **TL;DR:** Use a TestDependencies container to share session factories (not sessions) between tests and background tasks. This solves async testing chaos in FastAPI.

Our image hosting service [Chitram](https://chitram.io) has 22 test files and 64 test classes. Here's how we structure them — and the pattern that saved us from async testing hell.

## The Testing Pyramid

```
                    ┌─────────────────┐
                    │   Browser (4)   │  ← E2E with Playwright
                    ├─────────────────┤
                    │ Integration (4) │  ← Real DB, mocked storage
                    ├─────────────────┤
                    │    API (4)      │  ← HTTP endpoints
                    ├─────────────────┤
                    │   Unit (10)     │  ← Services, utils, validation
                    └─────────────────┘
```

| Layer | Files | Lines | Purpose |
|-------|-------|-------|---------|
| Unit | 10 | 2,348 | Business logic in isolation |
| API | 4 | 819 | HTTP contracts, status codes |
| Integration | 4 | 974 | Real DB transactions |
| Browser | 4 | 1,959 | User flows via Playwright |

## The Problem: BackgroundTasks and Async Sessions

FastAPI's `BackgroundTasks` run **outside** the request lifecycle. Our thumbnail generation looked like this:

```python
@router.post("/upload")
async def upload_image(
    background_tasks: BackgroundTasks,
    service: ImageService = Depends(get_image_service)
):
    image = await service.create(file)
    background_tasks.add_task(generate_thumbnail, image.id)  # Runs later
    return image
```

In production: works fine. In tests: **chaos**.

The background task would grab a new database session from the global factory. But tests use an isolated session that gets rolled back. The background task couldn't see the test data.

## The Solution: TestDependencies Container (ADR-0014)

We created a container that mirrors `app.state` but with controllable, shared dependencies:

```python
@dataclass
class TestDependencies:
    """All test dependencies in one place."""
    engine: AsyncEngine
    session_maker: async_sessionmaker[AsyncSession]
    session: AsyncSession
    storage: StorageService
    thumbnail_service: ThumbnailService
    image_service: ImageService
```

The key insight: **share the session factory**.

```python
@pytest.fixture
async def test_deps(test_storage) -> AsyncGenerator[TestDependencies, None]:
    # Single engine for test
    engine = create_async_engine(TEST_DATABASE_URL)

    # Shared session factory — this is critical
    session_maker = async_sessionmaker(engine, expire_on_commit=False)

    async with session_maker() as session:
        # ThumbnailService uses SAME factory
        thumbnail_service = ThumbnailService(
            storage=test_storage,
            session_factory=session_maker,  # ← Not a global
        )

        yield TestDependencies(
            engine=engine,
            session_maker=session_maker,
            session=session,
            storage=test_storage,
            thumbnail_service=thumbnail_service,
        )
```

Now when a background task needs a session, it gets one from the test's factory — same database, same transaction visibility.

## Fixture Architecture

```
test_deps (session-scoped)
    ├── engine
    ├── session_maker
    ├── session
    ├── test_storage
    │   └── temp directory (auto-cleanup)
    ├── thumbnail_service
    │   └── uses session_maker
    └── image_service
        └── uses session

client (function-scoped)
    └── wires app.state from test_deps
```

The `client` fixture overrides FastAPI's dependency injection:

```python
@pytest.fixture
async def client(test_deps: TestDependencies) -> AsyncGenerator[AsyncClient, None]:
    # Wire test dependencies into app.state
    app.state.thumbnail_service = test_deps.thumbnail_service
    app.state.storage = test_deps.storage

    app.dependency_overrides[get_db] = lambda: test_deps.session
    app.dependency_overrides[get_storage] = lambda: test_deps.storage

    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
```

## Unit Tests: Fast and Isolated

Unit tests mock external dependencies completely:

```python
class TestImageService:
    @pytest.fixture
    def mock_storage(self):
        storage = AsyncMock(spec=StorageService)
        storage.save.return_value = "stored/path.jpg"
        return storage

    @pytest.fixture
    def service(self, mock_storage, mock_session):
        return ImageService(db=mock_session, storage=mock_storage)

    async def test_create_saves_to_storage(self, service, mock_storage):
        await service.create(file_data, "test.jpg", "image/jpeg")
        mock_storage.save.assert_called_once()
```

No database, no file system, no network. Runs in milliseconds.

## API Tests: HTTP Contracts

API tests verify the contract between client and server:

```python
async def test_upload_returns_201_with_metadata(client, sample_jpeg):
    response = await client.post(
        "/api/v1/images/upload",
        files={"file": ("test.jpg", sample_jpeg, "image/jpeg")},
    )

    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["content_type"] == "image/jpeg"
    assert data["file_size"] > 0
```

They test:
- Status codes
- Response schemas
- Error formats
- Authentication

## Integration Tests: Real Transactions

Integration tests verify database operations work correctly:

```python
async def test_image_persists_across_sessions(test_deps):
    # Create in one session
    async with test_deps.session_maker() as session1:
        service = ImageService(db=session1, storage=test_deps.storage)
        image = await service.create(data, "test.jpg", "image/jpeg")
        await session1.commit()
        image_id = image.id

    # Read in another session
    async with test_deps.session_maker() as session2:
        result = await session2.get(Image, image_id)
        assert result is not None
        assert result.filename == "test.jpg"
```

## Browser Tests: User Flows

Browser tests use Playwright via Bun (TypeScript):

```typescript
// browser-tests/examples/smoke-test.ts
const browser = new PlaywrightBrowser()
await browser.launch()
await browser.navigate('https://chitram.io')

// Verify gallery loads
await browser.waitForSelector('.gallery')
const html = await browser.getVisibleHtml()
assert(html.includes('gallery') || html.includes('No images'))
```

We run these against localhost in CI and production post-deploy.

## CI/CD Pipeline

Four workflows handle different concerns:

| Workflow | Trigger | Tests |
|----------|---------|-------|
| `ci.yml` | Every push | Unit + API + Integration |
| `ui-tests.yml` | Push to main, browser-tests changes | Browser (localhost + prod) |
| `cd.yml` | Push to main | Build + Deploy |
| `post-deployment-tests.yml` | After deploy | Smoke tests against prod |

```yaml
# ci.yml (simplified)
jobs:
  test:
    strategy:
      matrix:
        python-version: ['3.11', '3.12']
    steps:
      - uses: actions/checkout@v4
      - run: uv sync --all-extras
      - run: uv run pytest tests/ -v --cov=app
```

## Mocking External Services

### Redis (Cache)

```python
@pytest.fixture
def mock_redis():
    redis = AsyncMock()
    redis.get.return_value = None  # Cache miss by default
    redis.setex.return_value = True
    return redis
```

### MinIO (Storage)

For unit tests, mock completely. For integration, use local filesystem:

```python
@pytest.fixture
def test_storage(tmp_path):
    return StorageService(
        backend=LocalStorageBackend(base_path=tmp_path)
    )
```

## Key Patterns

**1. Fail-Open in Tests**

Tests should pass on fresh databases:

```python
# ❌ Assumes data exists
images = await service.list_all()
assert len(images) == 5

# ✅ Handles empty state
images = await service.list_all()
assert isinstance(images, list)  # Works empty or populated
```

**2. Explicit Over Implicit**

Don't rely on test order:

```python
# ❌ Relies on previous test
async def test_delete_image(client):
    response = await client.delete(f"/api/v1/images/{GLOBAL_IMAGE_ID}")

# ✅ Self-contained
async def test_delete_image(client, sample_jpeg):
    # Create first
    upload = await client.post("/api/v1/images/upload", files=...)
    image_id = upload.json()["id"]

    # Then delete
    response = await client.delete(f"/api/v1/images/{image_id}")
    assert response.status_code == 204
```

**3. Session Scoping**

Use the right scope for performance:

```python
@pytest.fixture(scope="session")
async def test_deps():
    # Expensive setup once per test session
    ...

@pytest.fixture(scope="function")
async def client(test_deps):
    # Fresh client per test, reuses deps
    ...
```

## Metrics

| Metric | Value |
|--------|-------|
| Total test files | 22 |
| Total test classes | 64 |
| Lines of test code | ~4,100 |
| CI run time | ~2 minutes |
| Coverage | 89% |

## Takeaways

1. **TestDependencies container** — Mirror your `app.state` structure for tests. Share session factories, not sessions.

2. **Layer your tests** — Unit for logic, API for contracts, integration for persistence, browser for user flows.

3. **Mock at boundaries** — External services (Redis, S3) get mocked. Your code gets tested.

4. **Fail-open** — Tests should work on empty databases. Don't assume data exists.

5. **Scope wisely** — Session-scoped fixtures for expensive setup, function-scoped for isolation.

---

The TestDependencies pattern took us from flaky async tests to 100% reliability. The structure scales: 4,000 lines of tests, 2-minute CI runs, and confidence in every deploy.

*Full source: [github.com/abhi10/chitram](https://github.com/abhi10/chitram)*
