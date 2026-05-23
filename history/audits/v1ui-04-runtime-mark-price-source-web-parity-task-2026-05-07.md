# V1UI-04 Runtime Mark Price Source Web Parity

## Header
- ID: V1UI-04
- Title: feat(web-runtime): surface runtime mark-price source in monitoring
- Task Type: feature
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: MARKETDATA-FUT-01
- Priority: P1
- Iteration: 4
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`MARKETDATA-FUT-01` added backend `markPriceSource` metadata to runtime
position rows for futures evidence. Web types accepted the optional field, but
operator surfaces still rendered only the numeric mark price, so backend truth
was not visible in the UI.

## Goal
Expose the selected mark-price source in Web runtime open-position surfaces
without changing price-selection behavior or adding a new pricing system.

## Scope
- `apps/web/src/features/bots/utils/runtimeOpenPositionDerivations.ts`
- `apps/web/src/features/bots/utils/runtimeOpenPositionDerivations.test.ts`
- `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx`
- `apps/web/src/features/bots/components/BotsManagement.test.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- dashboard-bots and dashboard-home i18n namespace files
- planning/context docs

## Success Signal
- User or operator problem: backend knows whether mark price came from runtime
  stats, ticker fallback, exchange-unrealized-PnL derivation, or unavailable
  truth, but Web does not show that context.
- Expected product or reliability outcome: runtime open-position tables show an
  auditable source label next to the mark price.
- How success will be observed: focused component/unit tests prove source label
  rendering and derivation precedence; rendered smoke confirms the monitoring
  UI still works.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement and verify the focused Web parity reflection for runtime mark-price
source.

## Constraints
- Reuse existing runtime open-position derivation and table systems.
- Do not change backend price-selection behavior.
- Do not add route aliases, new pricing systems, or temporary display
  fallbacks.
- Preserve current stream-first live mark-price enrichment.

## Implementation Plan
1. Extend shared open-position derivation with selected display source metadata.
2. Render source label under mark price in Bots monitoring.
3. Add compact mark/source column to Dashboard home open positions.
4. Add focused tests for source precedence and UI labels.
5. Run focused Web tests, typecheck, rendered smoke, i18n audit, guardrails, and
   diff check.
6. Sync planning and context docs.

## Acceptance Criteria
- API `markPriceSource` is visible in Web when API mark price is used.
- Stream-enriched mark prices show a deterministic stream source label.
- Missing mark price shows `-` and unavailable source context.
- `/dashboard` and `/dashboard/bots` runtime open-position displays stay aligned
  through shared derivation.
- Existing runtime price/PnL calculations remain unchanged.

## Definition of Done
- [x] Focused runtime derivation and component tests pass.
- [x] Web typecheck passes.
- [x] Rendered runtime smoke was attempted; local API startup is blocked by
  missing `API_KEY_ENCRYPTION_KEYS` in the workstation `.env`.
- [x] i18n route audit and guardrails pass.
- [x] Source-of-truth docs are synchronized.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New pricing system.
- Duplicated mark-price logic outside the existing shared derivation.
- Temporary bypasses or mock-only behavior.
- Backend/API behavior changes in this Web parity slice.
- Live-money mutations.

## Validation Evidence
- Tests:
  - `pnpm --filter web run test -- src/features/bots/utils/runtimeOpenPositionDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/components/BotsManagement.test.tsx --run`
    PASS (`26/26`).
  - `pnpm --filter web run typecheck` PASS.
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm --filter web run lint` PASS.
  - `pnpm --filter web run build` PASS.
  - `pnpm i18n:audit:route-reachable:web` PASS (`findings=0`).
  - `pnpm run quality:guardrails` PASS.
  - `git diff --check` PASS.
- Manual checks:
  - `docker ps` confirmed local Postgres and Redis containers are running.
  - `pnpm --filter api exec prisma migrate deploy` applied the pending local
    migration `20260503013000_enforce_single_active_bot_market_group`.
  - API dev startup attempted after migration; startup failed before serving
    HTTP because local `.env` is missing `API_KEY_ENCRYPTION_KEYS`.
- Screenshots/logs: rendered authenticated runtime smoke could not complete
  until the local API secret baseline is corrected.
- High-risk checks: no live-money or API mutation paths are changed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/dashboard-route-map.md`
  - `docs/modules/web-dashboard-home.md`
  - `history/tasks/marketdata-fut-runtime-mark-price-source-task-2026-05-07.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, backend source metadata was typed but not surfaced
  in Web runtime open-position UI.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: docs will record parity closure.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: current dashboard runtime tables and
  `docs/ux/dashboard-design-system.md`.
- Canonical visual target: existing dense runtime monitoring table style.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable for this narrow table
  contract.
- Existing shared pattern reused: DataTable/table cells, compact badges, shared
  runtime open-position derivation.
- New shared pattern introduced: no
- Design-memory entry reused: runtime table source/diagnostic rows.
- Design-memory update required: no
- Visual gap audit completed: yes, source labels are compact text below the
  mark value and reuse existing table-cell density.
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: blocked by local API secret readiness
  (`API_KEY_ENCRYPTION_KEYS` missing).
- Remaining mismatches: none in the implemented Web derivation/rendering
  contract; local runtime smoke requires env correction.
- Required states: loading, empty, error, success
- Responsive checks: desktop, mobile where local auth/runtime smoke allows
- Input-mode checks: pointer, keyboard for table controls where applicable
- Accessibility checks: source labels remain text, not color-only.
- Parity evidence: pending

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this Web display/derivation change.
- Observability or alerting impact: improves operator readback context.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: backend `markPriceSource` was not visible in Web runtime
  open-position surfaces.
- Gaps: shared Web derivation did not preserve selected mark-price source.
- Inconsistencies: `/dashboard` and `/dashboard/bots` could compute live mark
  price from shared logic, but neither exposed price-source diagnostics.
- Architecture constraints: use existing runtime read APIs and shared derivation;
  no new pricing path.

### 2. Select One Priority Task
- Selected task: V1UI-04 runtime mark-price source Web parity.
- Priority rationale: direct backend-to-Web mismatch on money-critical runtime
  evidence.
- Why other candidates were deferred: broader dashboard runtime sweeps require
  separate slices to avoid mixing risk surfaces.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: carry a display source through shared derivation, preserving
  stream-first mark price selection; render source in compact table cells.
- Edge cases: stream price overrides API source; API mark price without source
  uses unavailable fallback; no mark price remains visible as unavailable.

### 4. Execute Implementation
- Implementation notes: shared runtime open-position derivation now carries
  `liveMarkPriceSource` beside `liveMarkPrice`. Stream-enriched prices report
  `runtime_stream`; API mark prices preserve backend `markPriceSource`; symbol
  stat fallback reports `runtime_symbol_stat`; unavailable truth stays
  explicit. Bots monitoring and Dashboard home render the source label next to
  the mark value.

### 5. Verify and Test
- Validation performed: focused Web derivation/component pack, Web typecheck,
  API typecheck, Web lint, Web build, route-reachable i18n audit, guardrails,
  diff check, local infra/migration check, and attempted API runtime smoke.
- Result: code validation passed. Authenticated rendered smoke is blocked by
  local secret readiness, not by Postgres or this Web parity change.

### 6. Self-Review
- Simpler option considered: only render raw `position.markPriceSource`.
  Rejected because Web can override mark price with stream enrichment, making
  the raw API source misleading.
- Technical debt introduced: no
- Scalability assessment: source selection stays in the shared derivation, so
  both runtime tables remain aligned.
- Refinements made: Dashboard home uses the same label resolver as Bots
  monitoring so source names cannot drift between routes.

### 7. Update Documentation and Knowledge
- Docs updated: this task packet, `docs/modules/web-dashboard-home.md`,
  `docs/engineering/local-development.md`, planning queue files.
- Context updated: `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`.
- Learning journal updated: yes, local API startup blocker recorded.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
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
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for display-only Web
  parity; existing real API contract is reused.
- Real API/service path used: yes, existing runtime positions payload.
- Endpoint and client contract match: yes, existing runtime positions payload
  `markPriceSource` is reused by Web display derivation.
- DB schema and migrations verified: not applicable
- Loading state verified: unchanged by this slice.
- Error state verified: unavailable source remains explicit when no mark price
  truth is present.
- Refresh/restart behavior verified: shared derivation remains stream-first on
  refresh.
- Regression check performed: pending

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: runtime operator monitoring open positions.
- Existing workaround or pain: operator must infer source from backend logs or
  raw payload instead of UI.
- Smallest useful slice: source preservation and compact UI label.
- Success metric or signal: mark price displays source in runtime tables.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable
- Critical user journey: inspect active runtime positions and PnL basis.
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: runtime table UI
- Smoke command or manual smoke: local API startup attempted after applying the
  pending local migration; blocked by missing `API_KEY_ENCRYPTION_KEYS` in
  workstation `.env`.
- Rollback or disable path: revert display/derivation commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: runtime trading telemetry already visible to the owner.
- Trust boundaries: no auth, permission, or ownership checks changed.
- Permission or ownership checks: existing protected runtime APIs.
- Abuse cases: no mutation path introduced.
- Secret handling: none
- Security tests or scans: focused Web tests and guardrails
- Fail-closed behavior: unavailable source remains explicit instead of
  inventing a source label.
- Residual risk: low

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: Web runtime open-position rows now surface the selected
  mark-price source beside the mark value in both Bots monitoring and
  Dashboard home.
- Files changed: shared Web runtime derivation/tests, Bots monitoring
  component/tests, Dashboard home table presenters/tests, i18n namespaces,
  planning/context docs, local development docs, learning journal.
- How tested: focused Web tests (`26/26`), Web/API typecheck, Web lint,
  production Web build, route-reachable i18n audit (`findings=0`), guardrails,
  diff check, local Postgres migration check.
- What is incomplete: authenticated rendered runtime smoke is blocked until
  local `.env` includes `API_KEY_ENCRYPTION_KEYS` and
  `API_KEY_ENCRYPTION_ACTIVE_VERSION`.
- Next steps: continue backend-to-Web runtime parity sweep with the next
  smallest mismatch from active V1 evidence.
- Decisions made: no new pricing source was introduced; Web source labels are
  derived from the existing stream/API/symbol-stat precedence.
