# Task

## Header
- ID: LUC-103
- Title: [Soar] Source-control closure for uncommitted agent work
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Engineering Delivery Lead
- Priority: P0
- Mission Status: BLOCKED

## Context
Repository contains a large cross-lane dirty worktree with mixed code, tests, state ledgers, architecture exports, ops evidence, and many generated artifacts from multiple issues/runs.

## Goal
Produce a safe source-control closure decision for current uncommitted work without mixing unrelated lanes.

## Scope
- Inspect uncommitted changes via `git status --short`, `git diff --stat`, and targeted diff review.
- Classify closure groups.
- Identify commit-safe groups vs blocked groups.
- Explicitly review `apps/api/src/modules/engine/runtimeSignalLoop.service.test.ts` for unsafe test loss.

## Implementation Plan
1. Snapshot workspace diff inventory.
2. Split changes by lane/type.
3. Validate suspicious test deltas.
4. Decide commit eligibility per group.
5. Record closure report with unblock ownership.

## Acceptance Criteria
- Dirty worktree inventory documented.
- Coherent closure groups documented.
- Suspicious runtime test delta explicitly dispositioned.
- Each group has verification status and commit/push/deploy disposition.

## Constraints
- No broad staging of unrelated work.
- No destructive cleanup/revert.
- No push without explicit branch/source-ref intent.

## Definition of Done
- [x] Closure groups documented with file families.
- [x] RuntimeSignalLoop test regression risk explicitly assessed.
- [x] Commit/no-commit decision recorded per group.
- [x] Unblock owner/action named for blocked groups.

## Forbidden
- Mixed-lane bulk commit.
- Committing test-body deletions without repair evidence.
- Implicit push/deploy.

## Validation Evidence
- Commands:
  - `git status --short`
  - `git diff --stat`
  - `git diff -- apps/api/src/modules/engine/runtimeSignalLoop.service.test.ts`
  - `rg "it\([^\n]*\)\s*=>\s*\{\s*\}" apps/api/src/modules/engine/runtimeSignalLoop.service.test.ts`
- Result:
  - Initial pass found `37` tracked files changed (`+4033/-2046`) plus extensive untracked artifacts.
  - Resume pass after child completion showed `35` tracked files changed (`+3424/-949`) plus extensive untracked artifacts before owner-scoped partition commits.
  - 2026-05-26 closure follow-up committed partitions `P1`, `P2`, and `P3` after focused verification; remaining dirty scope is now state/docs/history evidence only.
  - `runtimeSignalLoop.service.test.ts` is no longer modified in working tree; empty-test-body regex scan returned no matches.
- Reality status: blocked

## Source-Control Closure Groups

| Group | Scope | Verification | Commit SHA | Push status | Deploy impact | Disposition |
| --- | --- | --- | --- | --- | --- | --- |
| G1-runtime-tests-repair | `apps/api/src/modules/engine/runtimeSignalLoop.service.test.ts` | Child-lane repair integrated; file not present in current dirty set | not committed in this lane (already resolved outside current dirty set) | not needed | none | CLOSED_IN_CHILD |
| G2-api-auth-code+tests | `apps/api/src/modules/auth/*` | `pnpm --filter api exec vitest run src/modules/auth/auth.service.test.ts src/modules/auth/auth.e2e.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 60000` passed (`13` tests) | `2e145c2e` | not pushed | no immediate deploy; deploy after normal release gate | CLOSED |
| G3-web-test-minor | `apps/web/src/features/logs/components/AuditTrailView.test.tsx` | `pnpm --filter web exec vitest run src/features/logs/components/AuditTrailView.test.tsx --test-timeout 30000` passed (`2` tests) | `8b6c66e4` | not pushed | none | CLOSED |
| G4-ops-smoke-script | `scripts/deploySmokeCheck.mjs` + SHA-aware evidence note | `node --check scripts/deploySmokeCheck.mjs` passed; evidence records successful expected-SHA production smoke | `67efc538` | not pushed | strengthens deploy proof gate; no deploy performed here | CLOSED |
| G5-state-docs-evidence | `.agents/*`, `.codex/context/*`, `docs/*`, `history/*` | Inventory only | not committed (multi-issue cross-lane bundle) | not needed | none | BLOCKED |

## Lane-Scoped Partition Manifest (Unblock Packet)

| Partition ID | Owner lane | Files/surfaces now in dirty tree | Minimal verification before commit | Current closure readiness |
| --- | --- | --- | --- | --- |
| P1-auth-api | Backend API Engineer | `apps/api/src/modules/auth/auth.service.ts`, `apps/api/src/modules/auth/auth.service.test.ts`, `apps/api/src/modules/auth/auth.e2e.test.ts` | `pnpm --filter api exec vitest run src/modules/auth/auth.service.test.ts src/modules/auth/auth.e2e.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 60000` | CLOSED: commit `2e145c2e` |
| P2-web-log-test | Frontend Engineer / QA | `apps/web/src/features/logs/components/AuditTrailView.test.tsx` | `pnpm --filter web exec vitest run src/features/logs/components/AuditTrailView.test.tsx --test-timeout 30000` | CLOSED: commit `8b6c66e4` |
| P3-ops-smoke-script | Ops Release Lead | `scripts/deploySmokeCheck.mjs`, `history/evidence/luc-47-sha-aware-smoke-gate-hardening-2026-05-26.md` | `node --check scripts/deploySmokeCheck.mjs`; prior evidence records expected-SHA production smoke pass | CLOSED: commit `67efc538` |
| P4-state-ledgers | PM/Delivery coordinator | `.agents/state/*`, `.codex/context/*` (excluding unrelated concurrent updates) | Markdown/consistency review + `pnpm run quality:guardrails` if staged | MIXED_WITH_OTHER_LANES |
| P5-history-docs-bundle | Docs/QA/Ops evidence owners | `docs/*`, `history/*` tracked+untracked artifacts | provenance check vs source issue + schema/JSON parse spot-checks | MIXED_WITH_OTHER_LANES |

Partition summary:
- Code/test/ops partitions `P1`, `P2`, and `P3` are now closed with focused proof and commits.
- Remaining unclosed scope is `P4-state-ledgers` and `P5-history-docs-bundle`.
- Remaining state/docs/history partitions still must not be bulk-committed until ownership/provenance is checked issue-by-issue.

## Risk Assessment
- Previous P0 risk from runtime test body deletion is cleared by child-lane repair.
- Active high process risk remains limited to cross-lane artifact mixing across state/docs/history issues (`LUC-47/48/49/86/98/99/100/102` and others) with no safe single-owner commit boundary.

## Unblock Owner/Action
- Owner: Engineering Delivery Lead + respective lane specialists (Backend API Engineer, QA/Test, Ops Release Lead).
- Action:
  1. Keep `LUC-105` closure evidence as resolved for runtime test repair.
  2. Treat `P1`, `P2`, and `P3` as closed by commits `2e145c2e`, `8b6c66e4`, and `67efc538`.
  3. Split remaining `P4/P5` state/docs/history artifacts into explicit lane-scoped commits (one owner each) or keep as no-commit evidence bundles with reasons.
  4. Re-run `LUC-103` closure after remaining lane partitioning; only then decide final closure status.

## Result Report
- Task summary: Safe closure inventory completed; code/test/ops partitions closed with owner-scoped commits.
- Files committed:
  - `2e145c2e` auth generic credential errors and tests.
  - `8b6c66e4` audit trail test timeout stabilization.
  - `67efc538` deploy smoke expected-SHA verification gate.
- How tested: focused API auth tests, focused web audit test, deploy smoke script syntax check, existing SHA-aware smoke evidence.
- What is incomplete: final closure remains blocked until state/docs/history artifacts are partitioned by issue owner/provenance.
- Next steps: execute `P4/P5` unblock actions above, then rerun final source-control closure.
