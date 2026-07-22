---
name: sweep-taste
description: Multi-agent sweep for one thing only — code taste. Fans out finders to spot small things that would put off a senior dev (awkward naming, muddled abstractions, style issues), critically reviews them, decides what's worth doing, and applies the changes. Use when the user asks specifically to improve the taste/style/polish of the code.
---

# Sweep (taste only)

## Before you start

Tell the user, in one line: this sweep applies changes at the end (it's not read-only). **Medium** reasoning effort is the sweet spot here — it's subjective, small-gains work, so high mostly adds cost/latency across the agents.

Run the single `taste` lens as one pass following the protocol below.

1. **Fan out + review** — delegate to the shared workflow. It spins up 5 finders (each picks a section) then a fresh skeptical reviewer per finder batch, and returns confirmed/rejected findings. It changes no code.

   ```
   Workflow({ scriptPath: ".claude/workflows/sweep-find-and-review.mjs", args: { lens: "taste" } })
   ```

   The `taste` brief (small things that would put off a senior dev — naming, muddled abstractions, dead code, style; churn is fine for real gains; don't change the user facing text and focus on code) lives in that workflow.

2. **Decide (do this yourself)** — read the workflow's `confirmed` findings and make up your own mind. Don't rubber-stamp the reviewers. Drop any finding you can't verify by reading the code yourself, that's pure preference, or that conflicts with the project's conventions (`CLAUDE.md` and memory: prefer deletion over abstraction, don't invent generic helpers/components, readable code). Tell the user what you're keeping vs. dropping and why.

3. **Apply** — spawn apply agents for the kept findings, **grouped by file** so no two agents touch the same file at once (distinct files run in parallel). Each agent makes exactly its decided edits, matches surrounding style, adds no tests (`CLAUDE.md`), and does not sweep up unrelated hunks (other uncommitted changes may belong to concurrent sessions).

## After

Run `npm run check` to confirm the tree still typechecks; report anything it surfaces. Don't commit unless the user asks. End with a short summary: found → confirmed → kept → applied.
