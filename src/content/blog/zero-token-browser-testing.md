---
title: "Zero-Token Browser Testing with Bun and Playwright"
description: "How I cut browser testing costs by 99% using Daniel Miessler's kai-browser-skill pattern — code-first automation that runs infinitely without burning tokens."
pubDate: 2025-01-06
tags: ["Testing", "Playwright", "Bun", "AI", "Automation"]
draft: false
---

I was spending $60-90/month on AI-driven browser testing. Now I spend less than $1.

The secret? **Pre-written code beats AI-generated code for repetitive tasks.**

## The Problem: Token-Heavy Testing

Traditional AI-powered browser testing works like this:

1. AI receives a prompt: "Test the login flow"
2. AI generates Playwright code (~500 tokens)
3. AI executes and interprets results (~200 tokens)
4. Repeat for every test, every run

With the Playwright MCP, you're loading **~13,700 tokens at startup** — whether you use them or not. Run 100 tests a month and you're burning serious money.

## The Solution: kai-browser-skill Pattern

I discovered [Daniel Miessler's kai-browser-skill](https://github.com/danielmiessler/Personal_AI_Infrastructure/tree/main/Packs/kai-browser-skill) from his Personal AI Infrastructure project. The core insight is beautifully simple:

> **Write the code once. Execute infinitely for free.**

Instead of AI generating tests at runtime, you:

1. Use AI to write the test code **once**
2. Save it as a TypeScript file
3. Run it with Bun — zero tokens consumed

```typescript
const browser = new PlaywrightBrowser()
await browser.launch()
await browser.navigate('https://chitram.io')
await browser.waitForSelector('.gallery')

// ✅ Zero tokens, infinite runs
```

## The Implementation

I built a thin wrapper around Playwright using Bun (a fast TypeScript runtime):

**Project Structure:**
```
browser-tests/
├── src/
│   └── browser.ts       # Playwright wrapper class
├── examples/
│   ├── smoke-test.ts    # Quick health checks
│   └── comprehensive.ts # Full test suite
└── package.json
```

**The Wrapper (simplified):**
```typescript
export class PlaywrightBrowser {
  private browser: Browser | null = null
  private page: Page | null = null

  async launch(options?: LaunchOptions) {
    this.browser = await chromium.launch(options)
    this.page = await this.browser.newPage()
  }

  async navigate(url: string) {
    await this.page?.goto(url, { waitUntil: 'load' })
  }

  async waitForSelector(selector: string, timeout = 5000) {
    await this.page?.waitForSelector(selector, { timeout })
  }

  async screenshot(path: string) {
    await this.page?.screenshot({ path, fullPage: true })
  }
}
```

**Running Tests:**
```bash
bun run examples/smoke-test.ts
# 32 tests in ~12 seconds
```

## Cost Comparison

| Approach | Tokens/Run | Monthly Cost (100 runs) |
|----------|-----------|------------------------|
| Playwright MCP | 13,700+ | $60-90 |
| kai-browser-skill | ~50 | <$1 |
| **Savings** | **99%** | **$59-89** |

## Key Lessons

**1. Sensible Defaults**

Don't make users specify every parameter:

```typescript
// ❌ Verbose
await browser.launch({ headless: true, viewport: { width: 1280, height: 720 } })

// ✅ Sensible defaults
await browser.launch() // headless + standard viewport by default
```

**2. Auto-Capture Everything**

Logs, network requests, console errors — capture automatically:

```typescript
const errors = browser.getConsoleLogs({ type: 'error' })
const apiCalls = browser.getNetworkLogs({ urlPattern: /api/ })
```

**3. Design for Empty States**

Tests should work on fresh databases:

```typescript
// ❌ Assumes data exists
await browser.waitForSelector('.gallery-item')

// ✅ Handles both states
const html = await browser.getVisibleHtml()
const hasGallery = html.includes('gallery-item')
const hasEmptyState = html.includes('No images yet')
```

## When to Use This Pattern

**Use kai-browser-skill when:**
- You have repetitive test scenarios
- Tests run frequently (CI/CD, monitoring)
- Cost matters

**Stick with AI-generated tests when:**
- Exploring new features interactively
- One-off debugging sessions
- You need AI reasoning about results

## View the Code

See the full implementation in my open-source project: [**chitram/browser-tests**](https://github.com/abhi10/chitram/tree/main/browser-tests)

## Credits

This approach is based on [Daniel Miessler's kai-browser-skill](https://github.com/danielmiessler/Personal_AI_Infrastructure/tree/main/Packs/kai-browser-skill) from his excellent Personal AI Infrastructure project. The core insight — that file-based code execution beats token-heavy MCPs — comes from [Anthropic's engineering blog](https://www.anthropic.com/engineering/code-execution-with-mcp).

---

**The takeaway:** AI is great for writing code. But once that code works, stop regenerating it. Write once, run forever.

*Your wallet will thank you.*
