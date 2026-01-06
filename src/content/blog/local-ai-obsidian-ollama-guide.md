---
title: "Build Your Second Brain with Free Local AI (Obsidian + Ollama Guide)"
description: "Run a private AI assistant inside your note-taking app — no API costs, no data leaving your Mac."
pubDate: 2024-12-20
tags: ["AI", "Ollama", "Obsidian", "Local LLM", "Productivity"]
draft: false
---

The promise of AI-powered note-taking is compelling: ask questions about your knowledge base, get intelligent summaries, and have a copilot that understands your personal context. The problem? Most solutions require sending your private notes to external APIs.

This guide shows you how to set up a **100% local AI** inside Obsidian using Ollama. Everything runs on your Mac — no internet required after setup, no subscription fees, complete privacy.

## What You'll Build

By the end of this guide, you'll have:
- **AI-powered chat** within Obsidian (ask questions, get summaries)
- **Semantic vault search** using RAG (Retrieval-Augmented Generation)
- **Complete privacy** — all processing happens locally

## Architecture Overview

```
📝 Obsidian + Copilot Plugin
          ↕️
      HTTP Request
          ↕️
🚀 Ollama Server (localhost:11434)
          │
    ┌─────┴─────┐
    ↓           ↓
🦙 llama3.2    🔍 nomic-embed-text
   (Chat)         (Embeddings)
```

## Prerequisites

- **macOS** (Apple Silicon or Intel)
- **Obsidian** installed
- **~3GB disk space** for models
- **8GB+ RAM** recommended

---

## Step 1: Install Ollama

Download and install from [ollama.ai](https://ollama.ai). After installation, you'll see the Ollama icon in your menu bar.

## Step 2: Download the Models

Open Terminal and run:

```bash
# Chat model (~2GB)
ollama pull llama3.2

# Embedding model for search (~274MB)
ollama pull nomic-embed-text
```

Verify with:

```bash
ollama list
```

## Step 3: Allow Ollama to Talk to Obsidian

This step is critical — without it, Obsidian can't connect to Ollama:

```bash
launchctl setenv OLLAMA_ORIGINS "app://obsidian.md*"
```

Then **quit and restart Ollama** from the menu bar.

## Step 4: Install the Copilot Plugin

1. Open Obsidian → Settings → Community Plugins → Browse
2. Search for "Copilot"
3. Install and enable **"Copilot for Obsidian"**

## Step 5: Configure Copilot

### Add the Chat Model

1. Settings → Copilot → Custom Models → Add Custom Model
2. Configure:
   - **Model name:** `llama3.2`
   - **Provider:** Ollama
   - **Base URL:** `http://localhost:11434`
   - **API Key:** Leave blank

### Add the Embedding Model

1. Add another custom model:
   - **Model name:** `nomic-embed-text`
   - **Provider:** Ollama

### Set Defaults

In Copilot's Basic tab:
- **Chat Model:** llama3.2
- **Embedding Model:** nomic-embed-text

## Step 6: Index Your Vault

1. Press `Cmd+P` to open Command Palette
2. Run: `Copilot: Index Vault`
3. Wait for indexing to complete

---

## Testing Your Setup

**Verify Ollama is running:**
```bash
curl http://localhost:11434
# Should return: Ollama is running
```

**Start the chat model:**
```bash
ollama run llama3.2
```

**Verify models are loaded:**
```bash
ollama ps
```

Now open the Copilot sidebar in Obsidian and ask a question about your notes!

---

## Troubleshooting

### "Connection Refused" Error
Re-run the `launchctl setenv` command and restart Ollama.

### "Embedding EOF" Error
Make sure models are running with `ollama run llama3.2`.

### General Debugging
Open Obsidian's console with `Cmd+Option+I` and check for errors.

---

## Alternative Models

```bash
# Smaller/faster (1B parameters)
ollama pull llama3.2:1b

# Larger/smarter (requires more RAM)
ollama pull llama3.1:8b

# Code-focused
ollama pull codellama
```

---

## Why This Matters

| Benefit | Details |
|---------|---------|
| **Cost** | Free forever — no API fees |
| **Privacy** | Notes never leave your Mac |
| **Offline** | Works without internet |
| **Performance** | Optimized for Apple Silicon |

---

## Quick Reference Checklist

- Ollama installed and running
- llama3.2 and nomic-embed-text pulled
- OLLAMA_ORIGINS set and Ollama restarted
- Copilot plugin installed
- Models configured in Copilot settings
- Vault indexed
- Chat working

---

*Your second brain is now AI-powered — and it's entirely yours.*
