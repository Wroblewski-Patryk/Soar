# V1UI-09 Runtime TTP Source Parity Task

## Header
- ID: V1UI-09
- Title: Label strategy-fallback TTP protection consistently across runtime web surfaces
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-08
- Priority: P1
- Iteration: 9
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`V1UI-08` made `/dashboard` label web-computed fallback TTP protection as
prospective. The bot monitoring detail route still receives API
`dynamicTtpStopLoss` without source metadata, so strategy-derived fallback can
look equivalent to canonical runtime TTP state.

## Goal
Expose dynamic TTP stop source from the API read model and render
strategy-fallback protection as prospective in both dashboard home and bot
monitoring.

## Scope
- API runtime position serialization and position read response.
- Web bot runtime position types and shared open-position derivation.
- `/dashboard` open-position TTP display source resolution.
- `/dashboard/bots` monitoring open-position TTP display.
- Focused API/Web tests and source-of-truth docs.

## Success Signal
- User or operator problem: fallback/config-derived TTP no longer appears as
  stronger runtime stop truth in monitoring.
- Expected product or reliability outcome: backend runtime truth is reflected
  consistently in web detail and summary surfaces.
- How success will be observed: focused tests and rendered smoke show no
  regressions; TTP fallback source renders as prospective.
- Post-launch learning needed: no.

## Deliverable For This Stage
One implemented and verified vertical slice for dynamic TTP source parity.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] API distinguishes runtime dynamic TTP from strategy fallback in the read
  model.
- [x] Web derives and renders prospective TTP labels from API fallback source.
- [x] Focused API and Web tests pass.
- [x] Docs and context are updated with validation evidence.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/bots/runtimePositionSerialization.service.test.ts --run` PASS (`8/8`)
  - `pnpm --filter web run test -- src/features/bots/utils/runtimeOpenPositionDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/components/BotsManagement.test.tsx --run` PASS (`32/32`)
- Manual checks:
  - Authenticated rendered `/dashboard/bots` smoke via bundled Codex Node +
    Playwright fallback PASS; page loaded at
    `http://localhost:3002/dashboard/bots` with no relevant console errors.
- Screenshots/logs:
  - `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui09-bots-dashboard.png`
- High-risk checks:
  - `pnpm --filter api run typecheck` PASS
  - `pnpm --filter web run typecheck` PASS after build artifact race retry
  - `pnpm i18n:audit:route-reachable:web` PASS (`findings=0`)
  - `pnpm --filter web run lint` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm --filter web run build` PASS

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`,
  `docs/modules/web-dashboard-home.md`, `docs/modules/web-bots.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: module docs only.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing dashboard runtime table badge/label pattern
- Canonical visual target: existing compact uppercase runtime source labels
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: compact uppercase secondary label below TTP
- New shared pattern introduced: no
- Design-memory update required: no
- Required states: success
- Responsive checks: desktop
- Accessibility checks: text-visible label, no icon-only meaning
- Parity evidence: focused component tests prove prospective label with runtime
  rows; rendered `/dashboard/bots` smoke proves route shell loads without
  console errors.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert additive API field and UI label commit
- Observability or alerting impact: improves operator-visible runtime truth
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: API `dynamicTtpStopLoss` can be strategy fallback, but web detail
  monitoring has no source label.
- Gaps: bot monitoring does not distinguish prospective protection from
  runtime TTP state.
- Inconsistencies: dashboard summary has prospective label for web fallback;
  bot monitoring detail does not.
- Architecture constraints: runtime/read-model protection truth must not imply
  stronger dynamic stop execution truth than the runtime engine has.

### 2. Select One Priority Task
- Selected task: V1UI-09 runtime TTP source parity.
- Priority rationale: money-impacting operator surface and architecture parity.
- Why other candidates were deferred: larger V1 gate and production evidence
  work remains separate; this is the smallest reversible code slice found.

### 3. Plan Implementation
- Files or surfaces to modify:
  API serialization/read model, web runtime derivation/types, monitoring table,
  i18n, tests, docs/context.
- Logic: return `dynamicTtpStopLossSource` as `runtime_state` or
  `strategy_fallback`; map fallback to `prospective` in UI.
- Edge cases: null source when no TTP stop; runtime source wins over fallback;
  TSL remains hidden when TTP display exists.

### 4. Execute Implementation
- Implementation notes: added API `dynamicTtpStopLossSource` metadata from the
  dynamic stop serializer, carried it into runtime position reads, mapped it in
  the shared Web open-position derivation, and rendered prospective labels in
  dashboard and bot monitoring TTP cells. Extracted
  `BotsMonitoringProtectionCell` to keep the monitoring tab under the
  production monolith line budget.

### 5. Verify and Test
- Validation performed: focused API/Web tests, API/Web typecheck,
  route-reachable i18n audit, Web lint, repository guardrails, Web build, and
  authenticated rendered `/dashboard/bots` smoke.
- Result: PASS. Initial guardrails failure exposed `BotsMonitoringTab.tsx`
  crossing the 1000-line budget; fixed by extracting the protection cell.
  Initial parallel Web typecheck failed due `.next/types` files racing with
  concurrent `next build`; rerun after build passed.

### 6. Self-Review
- Simpler option considered: UI-only inference; rejected because API is the
  only layer that knows whether `dynamicTtpStopLoss` came from runtime state or
  strategy fallback.
- Technical debt introduced: no
- Scalability assessment: additive response metadata, compatible with existing
  clients.
- Refinements made: extracted the TTP protection cell presenter to avoid
  growing the already-large monitoring container.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-bots.md`, `docs/modules/web-bots.md`,
  `docs/modules/web-dashboard-home.md`,
  `docs/planning/mvp-next-commits.md`,
  `docs/planning/mvp-execution-plan.md`, and this task file.
- Context updated: `.codex/context/PROJECT_STATE.md` and
  `.codex/context/TASK_BOARD.md`.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: authenticated rendered route reload/load smoke
- Regression check performed: focused API/Web tests and build/typecheck gates

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: runtime operator telemetry
- Trust boundaries: authenticated user-scoped runtime read APIs
- Permission or ownership checks: unchanged
- Abuse cases: UI must not overstate protection truth
- Secret handling: no change
- Security tests or scans: repository guardrails PASS
- Fail-closed behavior: non-actionable/runtime state semantics unchanged
- Residual risk: production sample evidence still belongs to V1 gate work

## Result Report
- Task summary: API and Web now carry dynamic TTP source truth and label
  strategy fallback as prospective in runtime operator surfaces.
- Files changed: API bot runtime serialization/read model, Web bot runtime
  types/derivations/presenters/i18n/tests, module docs, planning/context files.
- How tested: focused API/Web tests, API/Web typecheck, i18n audit, lint,
  guardrails, Web build, rendered authenticated `/dashboard/bots` smoke.
- What is incomplete: production sample evidence remains part of separate V1
  release-gate work.
- Next steps: continue one-slice backend-to-web parity checks.
- Decisions made: expose source at API boundary instead of inferring in UI.
