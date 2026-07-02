# LUC-5591 V1 App-Completion Admin Operation Proof Lane

## Header
- ID: LUC-5591
- Title: Slice one V1 app-completion proof lane
- Task Type: coordination / verification-slicing
- Current Stage: verification
- Status: PARTIALLY_VERIFIED / PROOF_LANE_SLICED / RUNNER_TIMEOUT_RESIDUAL
- Owner: Soar Product Manager
- Priority: P0
- Module Confidence Rows: app-completion proof backlog, admin operation
- Requirement Rows: V1 audit-to-completion loop, admin operation proof
- Risk Rows: proof slicing, local runner timeout/process cleanup
- Iteration: 2026-06-27 SPM/QVE checkpoint
- Operation Mode: BUILDER
- Mission ID: LUC-5591-V1-APP-COMPLETION-ADMIN-OPERATION-PROOF-LANE-2026-06-27
- Mission Status: PARTIALLY_VERIFIED

## Context
[LUC-5591](/LUC/issues/LUC-5591) was created after [LUC-5588](/LUC/issues/LUC-5588)
classified the generated app-completion index as Product/QA proof backlog, not
a Technical Solution Architect architecture repair queue. The wake payload had
no pending comments and `fallbackFetchNeeded=false`; checkout was already
claimed by the harness, so this heartbeat did not call checkout again.

The latest generated app-completion index is stale but still the canonical
backlog input for this lane:

- `docs/status/app-completion-index.md`
- `docs/status/app-completion-index.json`
- Generated: `2026-06-20T21:01:59.098Z`
- Counts: `2524` items, `8` user flows, `452` needs browser review,
  `1645` missing test link, `300` missing doc link, `10` blocked

## Goal
Select one V1 app-completion user flow and convert it into exact, owner-scoped
browser/API/doc/test proof requirements that QVE/Delivery can execute without
guessing.

## Scope
- Selected user flow: `Admin operation`.
- Reason for selection: smallest indexed flow (`40` entities) with no exchange,
  configuration, or subscription gate in the flow summary; only auth/admin
  authority is required.
- Included surfaces:
  - API route: `apps/api/src/router/admin.routes.ts`
  - API admin users module:
    `apps/api/src/modules/admin/users/users.routes.ts`,
    `apps/api/src/modules/admin/users/users.controller.ts`,
    `apps/api/src/modules/admin/users/users.service.ts`,
    `apps/api/src/modules/admin/users/users.types.ts`
  - API proof candidate:
    `apps/api/src/modules/admin/users/users.e2e.test.ts`
  - Web route/screen:
    `apps/web/src/app/admin/users/page.tsx`,
    `apps/web/src/features/admin/users/pages/AdminUsersPage.tsx`
  - Web proof candidate:
    `apps/web/src/features/admin/users/pages/AdminUsersPage.test.tsx`
  - Production route-level proof already available:
    `history/evidence/luc-5526-prod-ui-module-clickthrough-2026-06-27.md`
- Excluded: code repair, deploy, push, restart, rollback, env edit, secret or
  account readback, production data mutation, subscription/payment mutation,
  exchange action, order, position, and live-trading action.

## Implementation Plan
1. Read the current app-completion index and [LUC-5588](/LUC/issues/LUC-5588)
   handoff.
2. Choose one small flow with clear ownership and proof boundaries.
3. Inspect the flow's existing API, Web, and production evidence surfaces.
4. Attempt focused local verification with the smallest relevant commands.
5. Record exact proof requirements, current evidence, failed/blocked checks,
   and next owner action.

## Acceptance Criteria
- One user flow is selected by name.
- The selected flow has concrete affected files and routes.
- Existing evidence is classified as pass, partial, missing, or blocked.
- QVE/Delivery receives exact proof commands and expected outputs.
- Runner/process residuals are recorded if verification cannot complete.

## Selected Lane: Admin Operation

### App-Completion Signal
`docs/status/app-completion-index.md` reports:

| User flow | Total | Missing test link | Missing doc link | Needs browser review | Gates |
| --- | ---: | ---: | ---: | ---: | --- |
| Admin operation | 40 | 27 | 4 | 9 | auth: 30 |

Priority queue samples:

| Risk | Kind | Entity | Path |
| --- | --- | --- | --- |
| missing_test_link | api_endpoint | `GET /` | `apps/api/src/router/admin.routes.ts#/` |
| missing_test_link | api_endpoint | `USE /users` | `apps/api/src/router/admin.routes.ts#/users` |
| missing_test_link | api_endpoint | `USE /admin` | `apps/api/src/router/index.ts#/admin` |
| missing_test_link | feature_or_capability | `listUsers` | `apps/api/src/modules/admin/users/users.controller.ts#listUsers` |
| missing_test_link | feature_or_capability | `updateUser` | `apps/api/src/modules/admin/users/users.controller.ts#updateUser` |
| missing_doc_link | feature_or_capability | `users.e2e.test.ts` | `apps/api/src/modules/admin/users/users.e2e.test.ts` |
| missing_doc_link | feature_or_capability | `AdminUsersPage.test.tsx` | `apps/web/src/features/admin/users/pages/AdminUsersPage.test.tsx` |
| missing_test_link | feature_or_capability | `AdminUsersPage` | `apps/web/src/features/admin/users/pages/AdminUsersPage.tsx#AdminUsersPage` |

### Current Evidence
| Layer | Status | Evidence |
| --- | --- | --- |
| API behavior | present in code, behavior not verified in this heartbeat | `apps/api/src/modules/admin/users/users.e2e.test.ts` covers unauthenticated `401`, non-admin `403`, admin list with active subscription metadata, role update, plan override, self-demotion block, and stale-session revocation after demotion. |
| Web component behavior | present in code, behavior not verified in this heartbeat | `apps/web/src/features/admin/users/pages/AdminUsersPage.test.tsx` covers load, role update confirmation, plan assignment confirmation, cancel path, and load error alert. |
| Production route reachability | partially verified | `history/evidence/luc-5526-prod-ui-module-clickthrough-2026-06-27.md` passed `/admin`, `/admin/users`, and `/admin/subscriptions` route rendering on production SHA `42177530f2a2ddc22832133b545bccab6ab404eb`. This is route-render proof, not action-level admin mutation proof. |
| Browser/action proof | missing | No focused same-run Playwright/browser proof for Admin Users list/search/role-toggle/plan-select states was produced in this heartbeat. |
| App-completion traceability | partially verified | Flow and entities are present in `docs/status/app-completion-index.*`, but the index still marks admin rows as missing test/doc/browser links. |

## Focused Verification Attempt
Attempted commands:

```bash
pnpm --filter api test -- src/modules/admin/users/users.e2e.test.ts --run
pnpm --filter web test -- src/features/admin/users/pages/AdminUsersPage.test.tsx --run
```

Both commands timed out after the `120000 ms` tool limit without returning a
Vitest result. The failed commands do not prove an Admin operation product
failure; they prove the package-managed focused-test runner did not return a
usable result inside this heartbeat.

Process hygiene follow-up:

- `Get-Process node,pnpm -ErrorAction SilentlyContinue` after the timeout showed
  many recent `node.exe` processes in the validation window.
- A command-line WMI narrowing query for `vitest|pnpm.*test|users.e2e|AdminUsersPage`
  timed out after `20000 ms`.
- A start-time narrowed `Stop-Process` attempt against recent `node.exe`
  processes also timed out after `25000 ms`.
- Residual risk: local Node/Vitest processes from the timed-out validation may
  require a dedicated cleanup heartbeat or environment owner inspection before
  broader validation is attempted.

## Exact QVE / Delivery Proof Package
Next executable child lane should be assigned to QVE with Backend/Web support:

1. Re-run the two focused tests with a runner that guarantees teardown and
   captures raw output:
   - `pnpm --filter api test -- src/modules/admin/users/users.e2e.test.ts --run`
   - `pnpm --filter web test -- src/features/admin/users/pages/AdminUsersPage.test.tsx --run`
2. If either command hangs again, classify whether the hang is package-manager
   install policy, Vitest worker teardown, DB state, or local process pressure.
3. Run one focused authenticated browser proof for `/admin/users` against the
   safest approved environment available:
   - load `/admin/users` as an admin-capable test account;
   - verify the users table is nonblank or the empty state is explicit;
   - verify search/filter or pagination if available;
   - open role-change confirmation and cancel it;
   - open plan assignment confirmation and cancel it;
   - do not mutate production roles/plans unless a separate explicit protected
     approval exists.
4. Update app-completion traceability after proof:
   - cite the API test proof for `listUsers` and `updateUser`;
   - cite the Web test/browser proof for `AdminUsersPage`;
   - cite admin docs or add a doc-link row if the scanner still reports
     `missing_doc_link`.
5. Expected closure evidence:
   - command outputs with pass/fail counts;
   - browser proof artifact or screenshot-less redacted route/action log;
   - updated app-completion or architecture relation rows if needed;
   - source-control/process cleanup statement.

## Definition of Done
- This PM slicing issue is complete when the proof lane is concrete and
  executable.
- The app-level Admin operation flow is not V1-verified until the QVE/Delivery
  proof package above passes or is blocked with exact owner/action.

## Validation Evidence
- App-completion index readback: pass.
- Existing production route evidence readback: pass for route-level admin
  rendering.
- Focused API/Web test execution: blocked by timeout.
- Process cleanup: attempted, not fully verified because process inspection and
  stop commands timed out.

## Result Report
- Task summary: selected `Admin operation` as the first V1 app-completion proof
  slice and converted it into exact API/Web/browser/doc proof requirements.
- Files changed:
  - `history/tasks/luc-5591-v1-app-completion-admin-operation-proof-lane-2026-06-27-task.md`
- How tested:
  - read `docs/status/app-completion-index.md`
  - inspected `apps/api/src/modules/admin/users/users.e2e.test.ts`
  - inspected `apps/web/src/features/admin/users/pages/AdminUsersPage.test.tsx`
  - read `history/evidence/luc-5526-prod-ui-module-clickthrough-2026-06-27.md`
  - attempted focused API/Web tests; both timed out at `120000 ms`
- Deployment impact: none.
- Commit/push/deploy:
  - not committed; repository already has a broad mixed dirty tree from other
    active state/evidence/runtime lanes and this heartbeat produced only a PM
    task artifact.
  - not pushed.
  - no deploy.
- Residual risk:
  - Admin operation is `partially verified`, not `verified`.
  - Timed-out local test processes may remain until a cleanup owner confirms
    process state.
- Next owner/action:
  - QVE/Delivery executes the proof package above or first cleans the local
    runner/process state if the same timeout repeats.
