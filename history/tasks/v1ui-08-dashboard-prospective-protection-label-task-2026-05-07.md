# V1UI-08 Dashboard Prospective Protection Label

## Header
- ID: V1UI-08
- Title: fix(web-runtime): label prospective dashboard TTP protection
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-07
- Priority: P1
- Iteration: 8
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Dashboard home can display `fallbackTtpProtectedPercent` derived from trailing
take-profit configuration before backend runtime stop state arrives. The
runtime lifecycle parity contract allows showing configured trailing levels
only when the UI clearly labels them as prospective or degraded protection
truth.

## Goal
Label fallback TTP protection in dashboard home as prospective so operators do
not confuse config-derived protection with backend runtime stop execution
truth.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- `apps/web/src/i18n/namespaces/dashboard-home.{en,pl,pt,de-CH}.ts`
- planning/context/module docs

## Success Signal
- User or operator problem: dashboard TTP column can imply fallback protection
  is active runtime protection.
- Expected reliability outcome: prospective TTP display is text-labeled and
  backend dynamic TTP remains unlabeled as prospective.
- How success will be observed: focused tests prove source classification and
  table label rendering.
- Post-launch learning needed: no

## Deliverable For This Stage
Release-ready evidence for prospective TTP labeling in dashboard home
open-position rows.

## Constraints
- Do not change backend runtime calculations or command paths.
- Preserve existing fallback TTP sticky behavior.
- Keep label route-owned under `dashboard.home.runtime.*`.
- Do not hide configured trailing levels; label their weaker execution truth.

## Implementation Plan
1. Add a dashboard runtime helper that resolves TTP display value plus source.
2. Render a compact prospective label only when the displayed TTP comes from
   fallback configuration.
3. Add localized dashboard-home labels.
4. Add focused tests for helper source precedence and table rendering.
5. Run relevant Web validations and sync docs/context.

## Acceptance Criteria
- Backend dynamic TTP displays as before.
- Fallback/config-derived TTP displays with a prospective label.
- TSL remains hidden when either backend or fallback TTP is displayed.
- Existing dashboard actionability and mark-price labels remain unchanged.

## Definition of Done
- [x] Focused dashboard runtime derivation tests pass.
- [x] Focused dashboard table presenter tests pass.
- [x] Web typecheck passes.
- [x] i18n route audit passes.
- [x] Guardrails pass.
- [x] Source-of-truth docs are synchronized.

## Forbidden
- Backend/API behavior changes.
- New action controls.
- Hiding degraded protection truth.
- Live-money mutations.

## Validation Evidence
- Tests:
  - `pnpm --filter web run test -- src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx --run` PASS (`13/13`)
  - `pnpm --filter web run typecheck` PASS
  - `pnpm i18n:audit:route-reachable:web` PASS (`findings=0`)
  - `pnpm --filter web run lint` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm --filter web run build` PASS
  - `git diff --check` PASS
- Manual checks:
  - Browser plugin attempt was made first and blocked by `node_repl` resolving
    workstation Node `v22.13.0` while requiring `>= v22.22.0`.
  - Fallback rendered smoke used bundled Codex Node plus Playwright against
    `/dashboard`.
- Screenshots/logs:
  - Rendered smoke screenshot:
    `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui08-dashboard.png`
  - Rendered smoke result: `/dashboard` loaded with no console errors.
- High-risk checks: no money mutation path is changed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
  - `docs/modules/web-dashboard-home.md`
  - `docs/modules/web-bots.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, fallback TTP protection was not visually labeled
  as prospective.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: docs will record parity closure.

## UX/UI Evidence
- Design source type: existing implementation
- Design source reference: dashboard home dense runtime table.
- Canonical visual target: compact table cell with percent plus small
  prospective label.
- Fidelity target: structurally_faithful
- Existing shared pattern reused: small uppercase diagnostic sublabel.
- New shared pattern introduced: no
- Required states: backend TTP, prospective fallback TTP, no TTP, TSL fallback
  suppression.
- Responsive checks: table remains horizontally scrollable as before.
- Accessibility checks: prospective state is text, not color-only.
- Parity evidence: focused derivation and table presenter tests prove backend
  dynamic TTP remains primary, fallback TTP is labeled prospective, and null
  TTP remains empty.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Rollback note: revert Web display changes.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: fallback TTP display can look equivalent to backend dynamic stop
  truth.
- Gaps: architecture requires prospective/degraded labeling for read-model
  protection truth.
- Inconsistencies: dashboard home derives fallback protection locally but did
  not label the source.
- Architecture constraints: runtime/read models must not imply stronger
  protection than the runtime engine can execute.

### 2. Select One Priority Task
- Selected task: V1UI-08 dashboard prospective protection label.
- Priority rationale: protection truth is money-impacting operator telemetry.
- Why other candidates were deferred: broader protection UI redesign would
  exceed one tiny slice.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: classify TTP source as backend or fallback and render a label for
  fallback only.
- Edge cases: null TTP remains `-`; backend TTP wins over fallback.

### 4. Execute Implementation
- Implementation notes: added a source resolver for dashboard TTP display and
  a compact prospective label only when the visible TTP value comes from
  fallback configuration rather than backend runtime stop truth.

### 5. Verify and Test
- Validation performed: focused dashboard runtime derivation and table
  presenter tests, Web typecheck, i18n audit, Web lint, repository guardrails,
  Web build, diff check, and rendered dashboard smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: rename the TTP column globally. Rejected because
  backend TTP should not be labeled prospective.
- Technical debt introduced: no.
- Scalability assessment: small display-source helper fits existing presenter
  and derivation boundaries.
- Refinements made: source classification is separate from numeric display so
  backend TTP precedence remains explicit.

### 7. Update Documentation and Knowledge
- Docs updated: task evidence, MVP planning, module documentation.
- Context updated: project state and task board.
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.

## Result Report
- Task summary: dashboard home now labels fallback/config-derived TTP
  protection as prospective.
- Files changed: dashboard runtime derivation helper, dashboard table
  presenter, dashboard-home i18n namespaces, focused tests,
  planning/context/module docs, i18n audit artifact.
- How tested: focused Web tests, typecheck, i18n audit, lint, guardrails,
  build, diff check, rendered route smoke.
- What is incomplete: rendered smoke used an empty fresh-account dashboard; the
  prospective runtime row is covered by focused component tests.
- Next steps: continue scanning runtime UI surfaces for protection/action
  truth that is still unlabeled.
- Decisions made: no backend/API behavior change was needed.
