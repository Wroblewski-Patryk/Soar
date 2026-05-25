# RELEASE-PREFLIGHT-REMEDIATION-HINTS-2026-05-24 Task Packet

## Context

After release evidence lookup became accurate, the production preflight showed
several `STALE` and `FAILED` evidence blockers. The printed next actions only
covered a subset of those blockers, which made the release report less useful
for operators and future agents.

## Goal

Expand no-secret remediation hints so every current V1 final-preflight blocker
has a concrete next action and command/path guidance.

## Constraints

- Do not include secret values in JSON, Markdown, stdout, or commands.
- Do not run protected production collectors.
- Do not mark blocked activation evidence as ready.
- Preserve fail-closed release gate semantics.

## Definition of Done

- Remediation hints cover current `FAILED` activation evidence blockers.
- Remediation hints cover stale RC, liveimport, UI clickthrough,
  backup/restore, and rollback proof blockers.
- LIVEIMPORT output guidance points at `history/artifacts`, matching release
  evidence lookup.
- Unit tests and production preflight confirm the new hints.

## Result Report

Status: `implemented, partially verified`

Files changed:

- `scripts/runV1FinalPreflight.mjs`
- `scripts/runV1FinalPreflight.test.mjs`

Evidence:

- `node --test scripts/runV1FinalPreflight.test.mjs scripts/runV1ReleaseGate.test.mjs` passed `28/28`.
- `corepack pnpm run ops:release:v1:preflight -- --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha 380308d10cf0fabb2ea629eb55e6f0ba7d980ed1 --json-output history/artifacts/v1-preflight-production-remediation-hints-2026-05-24.json --markdown-output history/releases/v1-preflight-production-remediation-hints-2026-05-24.md` passed build-info and public smoke, then printed next actions for each protected prerequisite and evidence blocker.

Residual risk:

- The hints do not execute the protected actions. The current candidate remains
  blocked until the approved auth/context and proof artifacts are refreshed.
