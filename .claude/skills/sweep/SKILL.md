---
name: sweep
description: Multi-agent codebase sweep. Runs three passes in sequence — Bugs, Taste, Short — each fanning out finders across the code, critically reviewing what they found, deciding what's worth doing, and applying the changes. Use when the user asks to sweep, polish, clean up, find bugs, tighten, or improve the codebase.
---

# Sweep

## Before you start
Tell the user, in one line: this sweep applies changes at the end (it's not read-only). Because it includes the `bugs` pass, **high** reasoning effort is recommended; if the session is on medium, offer `/effort high` first but proceed if they decline.

Run these lenses **in order**: `bugs` → `taste` → `short`. Each is one pass following the protocol below. Run passes sequentially (not parallel) so later passes see earlier edits and no two passes fight over the same files.

## The per-pass protocol

For each lens:

1. **Fan out + review** — delegate to the shared workflow. It spins up 5 finders (each picks a section) then a fresh skeptical reviewer per finder batch, and returns confirmed/rejected findings. It changes no code.
   ```
   Workflow({ scriptPath: ".claude/workflows/sweep-find-and-review.mjs", args: { lens: "<lens>" } })
   ```
   The count and finder/reviewer briefs for each lens live in that workflow — you only pass the lens name.

2. **Decide (do this yourself)** — read the workflow's `confirmed` findings and make up your own mind. This is the point: don't rubber-stamp the reviewers. Drop any finding you can't verify by reading the code yourself, that conflicts with the project's conventions (`CLAUDE.md` and memory: prefer deletion over abstraction, maximally clean architecture, readable code), or that overlaps/conflicts with another kept finding. Tell the user what you're keeping vs. dropping and why.

3. **Apply** — spawn apply agents for the kept findings, **grouped by file** so no two agents touch the same file at once (distinct files run in parallel). Each agent makes exactly its decided edits, matches surrounding style, adds no tests (`CLAUDE.md`), and does not sweep up unrelated hunks (other uncommitted changes may belong to concurrent sessions).

## After all passes

Run `npm run check` to confirm the tree still typechecks; report anything it surfaces. Don't commit unless the user asks. End with a short summary: per pass, found → confirmed → kept → applied.
