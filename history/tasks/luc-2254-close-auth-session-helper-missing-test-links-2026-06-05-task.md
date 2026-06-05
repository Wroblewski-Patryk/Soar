# Task

## Header
- ID: LUC-2254
- Title: Close auth/session helper missing-test links
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend API Engineer
- Depends on: LUC-2250
- Priority: P1
- Module Confidence Rows: API auth/session helpers; API bots shared E2E helper
- Requirement Rows: architecture-awareness helper test relation closure
- Quality Scenario Rows: local backend test traceability
- Risk Rows: auth semantics unchanged; production config unchanged
- Iteration: 2026-06-05 LUC-2254 heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-2254-AUTH-SESSION-HELPER-RELATIONS-2026-06-05
- Mission Status: DONE

## Context
`docs/status/architecture-awareness-report.md` generated `2026-06-05T16:02:05.428Z` still listed three API helper rows in the top actionable missing-test samples:

- `apps/api/src/modules/auth/auth.session.ts#getSessionJwtExpiresIn`
- `apps/api/src/modules/auth/auth.session.ts#getSessionTtlMs`
- `apps/api/src/modules/bots/bots.e2e.shared.ts#createPayload`

The issue is an architecture-backed child of [LUC-2250](/LUC/issues/LUC-2250). Scope is limited to local backend helper proof and scanner-readable test relations.

## Goal
Add focused local proof or direct scanner-readable relation coverage for the named auth/session and bots helper rows without changing auth semantics, token policy, cookie settings, production config, route behavior, database schema, or deployment state.

## Scope
- `apps/api/src/modules/auth/auth.session.ts`
- `apps/api/src/modules/auth/auth.session.test.ts`
- `apps/api/src/modules/bots/bots.e2e.shared.ts#createPayload`
- `apps/api/src/modules/bots/bots.e2e.shared.test.ts`
- `docs/architecture/relations/priority-test-links.csv`
- `docs/status/architecture-awareness-report.md`
- architecture graph generated artifacts if refreshed by project scripts

## Implementation Plan
1. Add a pure unit test for `getSessionTtlMs` and `getSessionJwtExpiresIn`.
2. Add pure helper coverage for the bots `createPayload` E2E shared helper.
3. Add direct `priority-test-links.csv` rows for both auth helpers and the bots shared helper.
4. Run focused API test proof.
5. Run architecture-awareness refresh plus graph generate and strict drift.
6. Update this task packet and project state with evidence.

## Acceptance Criteria
- Focused API test command proves helper behavior.
- The direct architecture relation or test file addition is scanner-readable.
- Architecture graph generate and strict drift pass, or an exact blocker is recorded.
- Handoff reports changed files, commands, commit/push/deploy disposition, and residual risk.

## Definition of Done
- [x] `auth.session` helper tests pass locally.
- [x] `createPayload` is linked to pure helper coverage through a scanner-readable relation.
- [x] Architecture-awareness and strict graph drift are refreshed.
- [x] No auth semantics, token policy, cookie settings, or production config changed.
- [x] Issue is updated with final disposition.

## Forbidden
- Auth semantic changes.
- Token or cookie policy changes.
- Production config changes.
- Runtime/deploy/protected smoke actions.
- Workarounds or scanner-only rows that point to nonexistent files.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/auth/auth.session.test.ts src/modules/bots/bots.e2e.test.ts -t "uses the standard session lifetime|uses the extended lifetime|supports full CRUD for authenticated owner"` partially passed; auth helper tests passed (`2/2`), bots E2E proof failed before assertions because local Postgres was unavailable at `localhost:5432`.
  - `pnpm --filter api exec vitest run src/modules/auth/auth.session.test.ts src/modules/bots/bots.e2e.shared.test.ts` passed (`2` files / `5` tests).
  - Direct relation readback passed: `3` target relation rows, `0` missing test files, `0` duplicate exact pairs, and `0` target helper strings remaining in refreshed `docs/status/architecture-awareness-report.md`.
  - `node --check scripts/build-architecture-awareness-index.mjs` from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` passed.
  - `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` passed (`14382` entities / `22615` relations), generated `2026-06-05T18:06:29.890Z`.
  - `pnpm run architecture:graph:generate` passed (`651` nodes / `842` relations / `27` chains).
  - `pnpm run architecture:graph:drift:strict` passed (`827/827`, `0` missing).
- Manual checks: source inspection confirmed `createPayload` is imported and exercised by existing bots E2E tests; pure helper test added to avoid making this relation DB-dependent.
- Screenshots/logs: not applicable.
- High-risk checks: no secrets, account state, exchange state, live trading, deploy, restart, or rollback touched.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable for this narrow traceability closure.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable unless validation exposes a new risk.
- Reality status: implemented and verified.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`, `docs/architecture/relations/priority-test-links.csv`, `docs/graphs/architecture-awareness.json`, `docs/graphs/architecture-graph.json`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: architecture-awareness and graph refresh completed; refreshed report no longer lists `getSessionJwtExpiresIn`, `getSessionTtlMs`, or `createPayload` in the actionable missing-test sample.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the test file and relation rows if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: three helper rows remain in the actionable missing-test sample.
- Gaps: auth helper behavior lacked direct pure test relation; bots helper had existing E2E use but no direct scanner relation.
- Inconsistencies: none in architecture contract.
- Architecture constraints: use direct scanner-readable relation rows and existing local proof.

### 2. Select One Priority Mission Objective
- Selected task: close [LUC-2254](/LUC/issues/LUC-2254).
- Priority rationale: high-priority child of [LUC-2250](/LUC/issues/LUC-2250) and current scoped wake.
- Why other candidates were deferred: wake contract forbids switching issues before handling this one.

### 3. Plan Implementation
- Files or surfaces to modify: auth session test, priority test links, task evidence/state.
- Logic: pure assertions for remember-me TTL/JWT mapping; direct relation rows for scanner.
- Edge cases: omitted `remember`, explicit `false`, explicit `true`, mapped wallet id, explicit wallet id override, and missing bots wallet mapping.

### 4. Execute Implementation
- Implementation notes: added `apps/api/src/modules/auth/auth.session.test.ts`, added `apps/api/src/modules/bots/bots.e2e.shared.test.ts`, and added three direct `LUC-2254` relation rows in `docs/architecture/relations/priority-test-links.csv`.

### 5. Verify and Test
- Validation performed: focused API helper tests, direct relation readback, architecture-awareness refresh, graph generate, strict drift.
- Result: verified. The first DB-backed bots E2E attempt was blocked by missing local Postgres, so the final helper proof uses DB-free pure coverage for the shared helper.

### 6. Self-Review
- Simpler option considered: relation-only closure for auth and DB-backed bots E2E relation were rejected because pure helper tests are cheaper and avoid local Postgres dependency.
- Technical debt introduced: no.
- Scalability assessment: low blast radius.
- Refinements made: replaced DB-backed bots E2E relation with a pure helper test relation.

### 7. Update Documentation and Knowledge
- Docs updated: task packet, priority test relation CSV, generated architecture-awareness/graph/status outputs.
- Context updated: project state, task board, module confidence ledger.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Exactly one priority task was selected.
- [x] Operation mode selected as BUILDER for this implementation heartbeat.
- [x] Current stage declared.
- [x] Architecture alignment checked.
- [x] Existing systems reused.
- [x] No workaround path introduced.
- [x] No logic duplication introduced.
- [x] Definition of Done evidence attached.
- [x] Relevant validations run.
- [x] Docs/context updated.

## Result Report
- Task summary: closed the three LUC-2254 auth/session and bots helper missing-test links with focused pure tests and scanner-readable relation rows.
- Files changed: `apps/api/src/modules/auth/auth.session.test.ts`, `apps/api/src/modules/bots/bots.e2e.shared.test.ts`, `docs/architecture/relations/priority-test-links.csv`, generated architecture-awareness/graph/status outputs, and source-of-truth state/evidence files.
- How tested: focused API helper tests (`5/5`), direct relation readback, architecture-awareness refresh, graph generate, strict drift, and diff check with CRLF warnings only.
- What is incomplete: no runtime behavior, DB-backed bots E2E, protected smoke, deploy, push, or production proof was performed or needed for this local helper relation closure.
- Next steps: none for this issue.
- Decisions made: add pure auth helper test; add pure `createPayload` helper test after DB-backed bots E2E proof was blocked by local Postgres.
- Commit/push/deploy disposition: not committed because the worktree contains multiple unrelated dirty files from adjacent LUC-2252/LUC-2253/LUC-2255 lanes; push not needed; deploy impact none.
