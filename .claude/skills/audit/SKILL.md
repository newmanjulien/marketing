---
name: audit
description: Multi-agent review of the working-tree changes versus the last commit. Fans out critics over the diff, re-judges their proposals with fresh eyes, and recommends which are worth acting on — proposes only, changes nothing. Use when the user asks to review/audit their uncommitted changes, or asks what you disagree with in the recent changes.
---

# Audit (diff vs last commit)

Review what changed in the working tree versus the last commit and recommend what's worth acting on. **This skill changes nothing** — it proposes and recommends only. The user decides whether to act afterward.

## Before you start
Tell the user, in one line: this pass is propose-only (per their "don't change anything yet") and is best run at **high** reasoning effort since the value is all in the judgement. If the session is on medium, offer `/effort high` first but proceed if they decline.

## Steps

1. **Enumerate the changed files** — run:
   ```
   git diff --name-only HEAD
   ```
   These are the files to audit. (Include staged + unstaged; that's the working tree vs. the last commit.) If empty, tell the user there's nothing to audit and stop.

2. **Fan out + fresh-eyes review** — pass the file list to the workflow. It splits the files among up to 5 critics who each read `git diff HEAD` for their files and look for: changes to disagree with, mistakes/bugs, sloppiness, things that could be shorter, and things whose mental model could be clearer. A fresh reviewer then re-judges each critic's proposals. Nothing is edited.
   ```
   Workflow({ scriptPath: ".claude/workflows/audit-diff.mjs", args: { files: [ ...changed files... ] } })
   ```

3. **Decide with fresh eyes (yourself) and recommend** — read the workflow's `recommended` list, form your own view, and present a clear recommendation to the user: what you'd change, grouped by priority, with a one-line rationale each. Note anything you looked at and decided was fine. It's a valid outcome to recommend changing nothing. **Do not edit any code.**

## Notes
- Lots of small real gains are fine; churn is acceptable if each gain is genuine — but only recommend things you'd stand behind, not preference nitpicks or fights with the repo's conventions (`CLAUDE.md` and memory).
- Other uncommitted changes may span concurrent sessions; still, the whole working-tree diff is in scope here since the user asked about "this codebase vs last commit."
