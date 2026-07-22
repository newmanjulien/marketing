---
name: sweep-short
description: Multi-agent sweep for one thing only — making code shorter. Fans out finders to spot lines/blocks that could be tightened without losing clarity, critically reviews them, decides what's worth doing, and applies the changes. Use when the user asks specifically to shorten or tighten the code.
---

# Sweep (short only)

## Before you start
Tell the user, in one line: this sweep applies changes at the end (it's not read-only). **Medium** reasoning effort is the sweet spot here — it's subjective, small-gains work, so high mostly adds cost/latency across the agents.

Run the single `short` lens as one pass following the protocol below.

1. **Fan out + review** — delegate to the shared workflow. It spins up 5 finders (each picks a section) then a fresh skeptical reviewer per finder batch, and returns confirmed/rejected findings. It changes no code.
   ```
   Workflow({ scriptPath: ".claude/workflows/sweep-find-and-review.mjs", args: { lens: "short" } })
   ```
   The `short` brief (small local tightenings only — no big structural changes, no new components) lives in that workflow.

2. **Decide (do this yourself)** — read the workflow's `confirmed` findings and make up your own mind. Don't rubber-stamp the reviewers. Drop any finding you can't verify by reading the code yourself, where the shorter version is less clear, or that conflicts with the project's conventions (`CLAUDE.md` and memory: prefer deletion over abstraction, readable code). Tell the user what you're keeping vs. dropping and why.

3. **Apply** — spawn apply agents for the kept findings, **grouped by file** so no two agents touch the same file at once (distinct files run in parallel). Each agent makes exactly its decided edits, matches surrounding style, adds no tests (`CLAUDE.md`), and does not sweep up unrelated hunks (other uncommitted changes may belong to concurrent sessions).

## After

Run `npm run check` to confirm the tree still typechecks; report anything it surfaces. Don't commit unless the user asks. End with a short summary: found → confirmed → kept → applied.
