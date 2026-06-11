# LUC-2847 Controlled Live Proof hashId Missing-Test Link - 2026-06-07

## Header
- ID: LUC-2847
- Title: Controlled live proof hashId missing-test link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2846](/LUC/issues/LUC-2846)
- Priority: P1
- Module Confidence Rows: controlled LIVE proof tooling / architecture evidence graph
- Requirement Rows: REQ-DOC-031
- Risk Rows: RISK-ARCH-DEV-TOOLING-TRACEABILITY-2026-06-07
- Operation Mode: BUILDER
- Mission ID: LUC-2847-CONTROLLED-LIVE-PROOF-HASHID-MISSING-TEST-LINK-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2846](/LUC/issues/LUC-2846) identified `scripts/runControlledLiveSessionProof.mjs#hashId` as the next non-duplicate controlled-proof actionable missing-test link after [LUC-2845](/LUC/issues/LUC-2845) closed `#fetchJson`.

## Goal
Cover `scripts/runControlledLiveSessionProof.mjs#hashId` with the smallest local-only Test Automation proof and add a scanner-readable architecture relation.

## Scope
- `scripts/runControlledLiveSessionProof.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture-awareness exports under `docs/graphs/` and `docs/status/`
- Soar source-of-truth state files for this checkpoint

## Constraints
- Use fake local inputs only.
- Do not call production, app, exchange, or live endpoints.
- Do not run controlled LIVE proof, pass `--i-understand-live-risk`, activate/deactivate LIVE bots, use production auth, run protected smoke, deploy, push, restart, rollback, touch secrets, mutate accounts, database, exchange state, orders, positions, or live-trading state.
- Preserve unrelated dirty worktree changes.

## Implementation Plan
1. Add focused `hashId` coverage for stable trimming, blank/null handling, case-sensitive deterministic hashes, and 12-character hex output.
2. Add `redactBot` coverage proving raw bot/API key/wallet/strategy identifiers are omitted and only hash fields plus safe metadata are exposed.
3. Add one direct relation row from `scripts/runControlledLiveSessionProof.mjs#hashId` to `scripts/runControlledLiveSessionProof.test.mjs`.
4. Run focused proof, graph generation, architecture-awareness refresh, and guardrails.

## Acceptance Criteria
- `node --check scripts/runControlledLiveSessionProof.mjs` passes.
- `node --check scripts/runControlledLiveSessionProof.test.mjs` passes.
- `node --test scripts/runControlledLiveSessionProof.test.mjs` passes.
- `docs/architecture/relations/priority-test-links.csv` has exactly one `LUC-2847` relation for `#hashId`.
- Refreshed architecture-awareness report no longer contains `hashId`.
- Repository guardrails pass.

## Definition of Done
- [x] Local test proof exists.
- [x] Scanner-readable relation exists.
- [x] Architecture-awareness report is refreshed and `hashId` is absent.
- [x] Evidence is recorded.
- [x] No protected/live/deploy/account/secret/database/exchange mutation occurred.

## Validation Evidence
- `node --check scripts/runControlledLiveSessionProof.mjs` PASS.
- `node --check scripts/runControlledLiveSessionProof.test.mjs` PASS.
- `node scripts/runControlledLiveSessionProof.mjs --help` PASS.
- `node --test scripts/runControlledLiveSessionProof.test.mjs` PASS (`14/14`).
- Direct relation readback PASS (`1` row).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains).
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar` PASS (`14984` entities / `34166` relations / `9706` files).
- `docs/status/architecture-awareness-report.md` generated `2026-06-07T14:50:02.331Z`; actionable missing-test links are `294`; `hashId` readback count is `0`.
- `pnpm run quality:guardrails` PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/relations/priority-test-links.csv`, `docs/status/architecture-awareness-report.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: generated graph/awareness exports refreshed.

## Security / Privacy Evidence
- Data classification: local fake identifiers only.
- Trust boundaries: no production/app/exchange calls.
- Secret handling: no secret values read or written.
- Fail-closed behavior: `hashId` returns `null` for blank identifiers; `redactBot` omits raw sensitive identifiers from the proof plan shape.
- Residual risk: `scripts/runControlledLiveSessionProof.mjs#listRunningSessions` is the next controlled-proof helper shown in Top Actionable Missing Test Links.

## Result Report
- Task summary: added focused local proof for controlled live proof redacted identifier hashing and linked it into the architecture evidence graph.
- Files changed: `scripts/runControlledLiveSessionProof.test.mjs`, `docs/architecture/relations/priority-test-links.csv`, generated graph/status exports, source-of-truth state files, this task record.
- How tested: focused node checks/tests, relation readback, graph generation, architecture-awareness refresh, guardrails.
- What is incomplete: no production or controlled LIVE proof was attempted or claimed.
- Next steps: route the next non-duplicate anchor, currently `scripts/runControlledLiveSessionProof.mjs#listRunningSessions`, through a separate owned lane if it remains release-critical.
