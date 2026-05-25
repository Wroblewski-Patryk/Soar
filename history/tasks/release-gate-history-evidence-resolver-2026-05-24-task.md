# RELEASE-GATE-HISTORY-EVIDENCE-RESOLVER-2026-05-24 Task Packet

## Context

The V1 preflight was still reporting several evidence families as `missing`
because it searched from the active operations docs directory instead of the
canonical history evidence buckets. Existing 2026-05-23 artifacts lived under
`history/audits`, `history/plans`, `history/artifacts`, and `history/evidence`,
so the gate could not distinguish stale evidence from absent evidence.

## Goal

Make release evidence readiness search the correct canonical history buckets
for each evidence family while keeping current RC docs under the active
operations docs root.

## Constraints

- Do not weaken freshness or pass/fail requirements.
- Do not move historical artifacts just to satisfy a script.
- Do not create ready activation evidence for the current candidate without
  protected proof.
- Keep secret-bearing proof blocked until approved context exists.

## Definition of Done

- Activation audit resolves from `history/audits`.
- Activation plan and production UI clickthrough resolve from `history/plans`.
- `LIVEIMPORT-03` resolves from `history/artifacts`.
- Backup/restore and rollback proof resolve from `history/evidence`.
- RC current docs continue resolving from the active operations docs root.
- Production preflight reports stale/failed evidence precisely.

## Result Report

Status: `implemented, partially verified`

Files changed:

- `scripts/runV1ReleaseGate.mjs`
- `scripts/runV1FinalPreflight.mjs`
- `history/audits/v1-production-activation-evidence-audit-2026-05-24.md`
- `history/plans/v1-production-activation-and-evidence-plan-2026-05-24.md`

Implementation:

- Added typed search directories for history audit, plan, artifact, and
  evidence families.
- Passed the repository `history/` root into release gate readiness from both
  the release gate CLI and final preflight.
- Added truthful 2026-05-24 activation audit and plan artifacts with
  `Status: **BLOCKED**` for candidate
  `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`.

Evidence:

- `node --test scripts/runV1ReleaseGate.test.mjs scripts/runV1FinalPreflight.test.mjs` passed `28/28`.
- `corepack pnpm run ops:release:v1:preflight -- --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha 380308d10cf0fabb2ea629eb55e6f0ba7d980ed1 --json-output history/artifacts/v1-preflight-production-history-evidence-resolver-2026-05-24.json --markdown-output history/releases/v1-preflight-production-history-evidence-resolver-2026-05-24.md` passed build-info and public smoke, then reported activation audit/plan as `FAILED` and prior protected evidence as `STALE` rather than `MISSING`.

Residual risk:

- The current production candidate remains blocked until protected production
  proof is refreshed. This task improves evidence classification only.
