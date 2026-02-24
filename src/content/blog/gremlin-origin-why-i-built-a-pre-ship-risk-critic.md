---
title: "Why I Built a Pre-Ship Risk Critic"
description: "The origin story of Gremlin - an AI tool that systematically asks 'what if?' questions before code ships. How 93 curated risk patterns from real incidents add genuine signal on top of LLM reasoning."
pubDate: 2026-02-23
tags: ["AI", "QA", "Gremlin", "Prompt Engineering", "Python"]
draft: false
githubRepo: "https://github.com/abhi10/gremlin"
---

I've spent years watching the same pattern repeat. A team ships a feature. It's well-tested. The PR was reviewed. And then something breaks in production that nobody thought to check.

Not a typo. Not a missing null check. Something structural — a race condition between the webhook and the database write. A session that survives logout under specific timing. A retry loop that turns a transient failure into a permanent one.

The postmortem always says the same thing: "We didn't think of that scenario."

So I asked myself: what if there was a tool that systematically asked the "what if?" questions before the code ships?

## The Insight

Good QA engineers don't just verify that features work. They think adversarially. They ask: what if the network drops halfway through? What if two users hit the same endpoint at the same time? What if the third-party API returns something unexpected?

This kind of thinking is a skill. It takes years to develop, and even experienced engineers can only hold so many scenarios in their head at once. Worse, it's inconsistent — the engineer who's been burned by webhook race conditions will check for them. The one who hasn't, won't.

But here's the thing: most of these failure scenarios follow patterns. They repeat across projects, across teams, across industries. The specific details change, but the shape of the risk is the same.

What if you could encode those patterns and apply them systematically?

## Gremlin v0.1: The Experiment

I started by cataloging the "what if?" questions I'd seen matter most across real projects and production incidents. Not theoretical risks — real things that actually broke.

The first version had 93 patterns across 11 domains:

- **Payments**: What if the webhook arrives before the order record is committed?
- **Auth**: What if the session token is cached after the user's permissions change?
- **Concurrency**: What if two requests modify the same resource within the same transaction window?
- **Infrastructure**: What if the config reload happens during a request that read the old config?
- **Database**: What if the migration runs while the old code is still serving traffic?

Each pattern is a pointed question, not a generic warning. "Check for race conditions" is useless advice. "What if the webhook arrives before the database write commits?" is something you can actually verify.

## How It Works

The approach is simple:

1. **You describe what you're building** — a checkout flow, an auth system, a file upload pipeline. Plain English, a spec, or a git diff.

2. **Gremlin infers which domains are relevant** — "checkout flow" triggers payments, API, and concurrency patterns.

3. **It applies the matching patterns via an LLM** — Claude takes the patterns and your context, and reasons through each one to produce specific risk scenarios.

4. **You get a ranked list of risks** — each with a severity level, confidence score, concrete scenario, and business impact.

```bash
pip install gremlin-critic
gremlin review "checkout flow with Stripe"
```

```
CRITICAL (95%) — Webhook Race Condition
  What if the Stripe webhook arrives before the order record is committed?
  Impact: Payment captured but order not created. Customer charged with no confirmation.

HIGH (87%) — Double Submit on Payment Button
  What if the user clicks "Pay Now" twice before the first request completes?
  Impact: Potential duplicate charges. Refund process required.
```

The output is actionable. Each risk is something you can go verify in your code right now.

## Does Adding Patterns Even Help?

This was the question I needed to answer honestly. LLMs are already good at reasoning about software risks. Does a curated pattern library actually add value, or is it just overhead?

I built an evaluation framework to find out. 54 real-world test cases, A/B tested: Gremlin (patterns + Claude) versus raw Claude with no patterns.

The results surprised me:

| Metric | Result |
|--------|--------|
| Quality parity (tie rate) | 90.7% |
| Gremlin wins | 7.4% |
| Claude wins | 1.9% |
| **Win + Tie rate** | **98.1%** |

Most of the time, the patterns match raw Claude quality. But in 7.4% of cases, Gremlin caught risks that Claude alone missed — domain-specific edge cases that require the kind of pattern recognition you get from experience with real incidents.

And the 1.9% where Claude did better? Minor category labeling differences. Not quality differences.

The patterns don't replace the LLM's reasoning. They focus it. They ensure that specific, high-value questions get asked every time, regardless of whether the model would have thought to ask them on its own.

## What I Learned Building v0.1

**Patterns need to be specific, not generic.** "Check for security issues" produces noise. "What if the OAuth state parameter is reused across sessions?" produces signal. Every pattern in Gremlin is a concrete scenario, not a category.

**Domain inference matters more than I expected.** If you blindly apply all 93 patterns to every review, most of the output is irrelevant. Matching patterns to domains (payments, auth, concurrency) based on the user's scope makes the difference between useful output and noise.

**Confidence scores are essential.** Not every risk is equally likely. A 95% confidence critical risk needs immediate attention. A 70% medium risk is worth noting but shouldn't block a release. Without confidence scores, everything feels urgent and nothing gets prioritized.

**The tool is a complement, not a replacement.** Gremlin doesn't find bugs in your code. It finds gaps in your thinking. It works best when paired with code review and testing — it adds the layer that asks "but what if this assumption is wrong?"

## What's Next

v0.1 proved the approach works. Patterns add genuine value on top of LLM reasoning, and the output is actionable enough to change how you review features before shipping.

But the pipeline was monolithic — one big call that does everything. The next step is breaking it apart so each stage can be run, cached, and composed independently. And I want to move beyond the CLI into a proper Python API that agents and CI pipelines can use programmatically.

That's v0.2 and v0.3 — but that's a story for the next post.

---

*Gremlin is open-source and available on [PyPI](https://pypi.org/project/gremlin-critic/) as `gremlin-critic`. Source on [GitHub](https://github.com/abhi10/gremlin).*

*If you've ever shipped a feature that broke in a way nobody thought to check — this tool is for you.*
