# Task

## Header
- ID: LUC-5146
- Title: Repair protected-route invalid-token expired-session redirect proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager / local repair-source-control lane
- Depends on: none
- Priority: P0
- Module Confidence Rows: Protected auth/session browser proof
- Requirement Rows: Auth/session invalid-token expired-session redirect
- Quality Scenario Rows: fail-closed auth/session behavior
- Risk Rows: stale protected proof blocks release acceptance
- Iteration: 2026-06-21
- Operation Mode: TESTER
- Mission ID: LUC-5146-PROTECTED-ROUTE-INVALID-TOKEN-REDIRECT-PROOF-2026-06-21
- Mission Status: VERIFIED

## Context

The wake comment `7a611f58-8fdc-44a7-80fb-d04dc6c3fbef` selected an
autonomous local repair/source-control lane for [LUC-5146](/LUC/issues/LUC-5146).
The issue originated from an older protected production browser proof where an
invalid token redirected to `/auth/login` without the required
`session=expired` query.

Later repository truth already showed the contract passing:

- `history/tasks/luc-5298-protected-route-redirect-executable-path-2026-06-20-task.md`
- `history/tasks/luc-5300-protected-route-redirect-blocker-reconciliation-2026-06-20-task.md`
- `history/evidence/luc-5362-authenticated-production-acceptance-performance-sweep-2026-06-21-auth-session-browser-proof.md`

## Goal

Close the local proof gap for [LUC-5146](/LUC/issues/LUC-5146) without
protected production mutation by confirming the affected capability, focused
validation, source-control posture, and residual risk.

## Scope

- Affected capability: protected Web routes must fail closed and redirect
  invalid-token `401` auth checks to `/auth/login?session=expired`.
- Affected chain:
  `apps/web/src/middleware.ts` transport cookie gate ->
  `apps/web/src/lib/api.ts` protected-route `401` interceptor ->
  `apps/web/src/context/AuthContext.tsx` expired-session warning/query cleanup ->
  `scripts/runProdAuthSessionBrowserProof.mjs` production proof assertion.
- Files inspected:
  `apps/web/src/lib/api.ts`,
  `apps/web/src/lib/api.test.ts`,
  `history/evidence/luc-5362-authenticated-production-acceptance-performance-sweep-2026-06-21-auth-session-browser-proof.md`.
- Files changed in this heartbeat:
  this task packet plus state/context entries only.

## Implementation Plan

1. Consume the latest wake comment as a local repair/source-control lane.
2. Inspect the current protected-route invalid-token redirect implementation
   and focused tests.
3. Run the smallest validation proving the affected chain.
4. Record source-control closure, regression risk, and issue disposition.

## Acceptance Criteria

- Current Web auth interceptor explicitly redirects protected-route `401`
  responses to `/auth/login?session=expired`.
- Focused Web auth/session tests pass.
- No protected smoke, deploy, push, restart, env edit, secret readback,
  production account mutation, exchange action, payment/subscription mutation,
  or live-trading action occurs.
- Commit/no-commit decision is explicit.

## Definition of Done

- [x] Current affected capability and files are named.
- [x] Focused validation passed.
- [x] Regression risk and follow-up gaps are recorded.
- [x] Source-control decision is recorded.

## Validation Evidence

- Tests:
  `pnpm --filter web test -- src/middleware.test.ts src/lib/api.test.ts src/context/AuthContext.test.tsx --run`
  passed (`3` files, `12` tests).
- Manual checks:
  `apps/web/src/lib/api.ts` still redirects protected-route `401` responses to
  `/auth/login?session=expired`; the latest production auth/session proof in
  `history/evidence/luc-5362-authenticated-production-acceptance-performance-sweep-2026-06-21-auth-session-browser-proof.md`
  passed the invalid-token redirect with `path=/auth/login; search=?session=expired`.
- Screenshots/logs: not applicable; no browser smoke was run.
- High-risk checks:
  no credentials, cookies, tokens, or response bodies were read or written.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed:
  `docs/modules/web-auth.md`, `apps/web/src/lib/api.ts`,
  `apps/web/src/context/AuthContext.tsx`, and the existing LUC-5298/LUC-5300
  task packets.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; no behavior changed.

## Security / Privacy Evidence

- Data classification: auth/session control-plane behavior, no stored secret
  values.
- Trust boundaries:
  Web middleware remains a transport-level cookie presence gate; API `/auth/me`
  remains authoritative for token validity.
- Permission or ownership checks:
  protected production smoke and live account mutation were not authorized and
  were not run.
- Secret handling:
  no secret values, cookies, tokens, passwords, or account data were printed or
  persisted.
- Fail-closed behavior:
  protected-route invalid token redirects to expired-session login; post-logout
  `/auth/me` fail-closed production proof is covered by the LUC-5362 evidence.
- Residual risk:
  production build-info provenance remains separate under release/source-control
  lanes; this task does not approve deploy or release.

## Source-Control Closure

- Repository: `C:\Personal\Projekty\Aplikacje\Soar`
- Initial status:
  `main...origin/main [ahead 10, behind 1]` with a broad pre-existing dirty set
  spanning API runtime edits, operations docs, state files, app-completion
  indexes, and many unrelated history/evidence artifacts.
- Commit decision:
  no commit from this heartbeat. The local proof packet is coherent, but the
  repository is already mixed-dirty and divergent (`ahead 10, behind 1`), so
  staging a local commit would either include unrelated work or leave the
  required state/context packet uncommitted in a dirty tree. Source-control
  closure remains active for the broader release/source-control owner.
- Push status: not pushed; push is forbidden by this wake and would be a
  release operation.
- Deploy impact: none.

## Result Report

- Task summary:
  [LUC-5146](/LUC/issues/LUC-5146) is verified locally as no active Web runtime
  defect. The current implementation and focused tests preserve the
  `/auth/login?session=expired` invalid-token contract, and latest production
  auth/session evidence also passes that exact step.
- Files changed:
  `history/tasks/luc-5146-protected-route-invalid-token-redirect-proof-2026-06-21-task.md`
  plus state/context entries for this checkpoint.
- How tested:
  focused Web auth/session Vitest command passed (`3` files, `12` tests).
- What is incomplete:
  no production protected smoke rerun was performed in this heartbeat, by
  policy. No source-control commit was made because the worktree is already
  mixed-dirty and divergent.
- Next steps:
  mark [LUC-5146](/LUC/issues/LUC-5146) done from this evidence; keep release
  provenance/source-control and production performance residuals in their
  existing lanes.
- Decisions made:
  no runtime code change is required; `session=expired` remains the intended
  product/security proof contract.
