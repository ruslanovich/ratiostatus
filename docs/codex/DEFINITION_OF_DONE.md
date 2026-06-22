# Definition of Done

A future task is done only when all applicable criteria are satisfied:

- The assigned scope and acceptance criteria are complete.
- No unrelated features or speculative infrastructure were added.
- Relevant tests were added or updated whenever code changed.
- Architecture, domain, product behavior, content shape, UI behavior, and LLM contract docs were updated when affected.
- Meaningful changes were appended to `docs/codex/CHANGELOG.md`.
- No secrets, credentials, or hardcoded production URLs were introduced.
- `game-core` has no dependency on UI, LLMs, Supabase, Vercel, browser APIs, external APIs, or network calls.
- New game-state numeric values have explicit bounds and validation.
- Content remains schema-valid once schemas exist.
- Available lint, build, test, and validation commands relevant to the task were run successfully, or failures were reported precisely.
- The handoff summarizes files changed, checks run, docs updated, assumptions, and known limitations.

