# Task

## Header
- ID: LUC-1042
- Title: Source control closure for LUC-1011, LUC-1016, LUC-1019, LUC-1023, and adjacent Account access proof/doc-link slices
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Depends on: [LUC-1011](/LUC/issues/LUC-1011), [LUC-1016](/LUC/issues/LUC-1016), [LUC-1019](/LUC/issues/LUC-1019), [LUC-1023](/LUC/issues/LUC-1023), [LUC-1026](/LUC/issues/LUC-1026), [LUC-1027](/LUC/issues/LUC-1027), [LUC-1030](/LUC/issues/LUC-1030), [LUC-1031](/LUC/issues/LUC-1031), [LUC-1032](/LUC/issues/LUC-1032), [LUC-1035](/LUC/issues/LUC-1035), [LUC-1039](/LUC/issues/LUC-1039)
- Priority: P1
- Module Confidence Rows: not applicable
- Requirement Rows: not applicable
- Quality Scenario Rows: source-control closure, evidence durability
- Risk Rows: local dirty-state drift, uncommitted proof packet loss
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1042-SOURCE-CONTROL-CLOSURE-LUC-1011-LUC-1016-LUC-1019-LUC-1023-PLUS-7-2026-07-14
- Mission Status: VERIFIED

## Context

[LUC-1042](/LUC/issues/LUC-1042) is a source-control closure sidecar for the
current local Account access proof/doc-link batch. The heartbeat had to
classify the full worktree, verify that the dirty set belonged to the listed
issues, run only local non-protected checks, and make a commit/no-commit
decision with evidence.

## Goal

Preserve the current local Account access proof/source-truth packet as one
coherent git commit or explicitly block closure with concrete evidence.

## Constraints

- No push, deploy, restart, rollback, protected smoke, or live-account action.
- No revert or overwrite of unrelated work.
- No secret disclosure in files, comments, logs, or artifacts.
- Keep the packet intact across tests, docs/generated truth, state/context, and
  history evidence.

## Definition of Done

- Dirty paths are classified by layer and ownership.
- Focused local verification passes for the changed API/Web proof files.
- Secret scan passes on the dirty set.
- Commit/no-commit decision is explicit and evidence-backed.
- Project state and task board record the closure.

## Forbidden

- Partial staging that splits proof code from generated truth or evidence.
- Any production mutation.
- Narrative-only closure without a real source-control disposition.

## Scope

- Git worktree inspection for tracked and untracked files.
- Focused API proof files, Web proof files, generated truth/state/context, and
  issue evidence artifacts tied to the listed Account access issues.
- One local source-control closure commit only if verification passes.

## Implementation Plan

1. Read the issue, role, and source-control closure contract.
2. Classify dirty paths into state/context, code, docs/generated, and history.
3. Run focused local checks for touched API/Web proof files plus drift and
   secret scans.
4. Record evidence in history and project truth files.
5. Create one coherent local commit if no no-commit blocker remains.

## Acceptance Criteria

- The dirty set is attributable to the listed issue family with no out-of-scope
  paths.
- API proof pack passes.
- Web proof pack and web typecheck pass.
- Architecture drift strict and secret scan pass.
- A local commit SHA is recorded, or a named blocker prevents commit.

## Result Report

- Task summary: classified the local dirty set as one coherent Account access
  proof/source-truth packet and preserved it as a single local commit.
- Files changed: state/context (`4`), code (`8`), docs/generated truth (`27`),
  history artifacts/evidence/tasks (`34` before LUC-1042 artifacts; `36`
  after).
- How tested:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeMonitoringAggregateFallbacks.service.test.ts src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts src/modules/wallets/wallets.service.test.ts --run --reporter=dot`
  - `corepack pnpm --filter web exec vitest run src/context/AuthContext.test.tsx src/features/auth/components/PasswordVisibilityToggle.test.tsx src/features/auth/hooks/useHydrationReady.test.tsx src/features/auth/pages/RegisterPage.test.tsx`
  - `corepack pnpm --filter web run typecheck`
  - `pnpm run architecture:graph:drift:strict`
  - targeted dirty-file secret scan
- What is incomplete: no push or deploy; those remain out of scope.
- Next steps: none for source-control closure; subsequent app-completion work
  continues in its own issue lanes.
- Decisions made: commit the whole packet as one local batch because the dirty
  set is coherent, verified, and contains no out-of-scope edits.
