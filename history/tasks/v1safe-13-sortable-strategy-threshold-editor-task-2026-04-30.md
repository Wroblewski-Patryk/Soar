# Task

## Header
- ID: V1SAFE-13
- Title: feature(web-strategy-form): shared sortable threshold editor for TTP, TSL, and advanced DCA
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1SAFE-11, V1SAFE-12
- Priority: P1

## Context
Strategy create/edit currently renders three separate threshold-list editors with duplicated list-management logic: `TTP`, `TSL`, and advanced `DCA`. New rows always append to the end, which makes real operator workflows noisy when a newly added threshold belongs earlier in the final ladder. The approved architecture already persists strategy `config` as JSON without a schema change, so this slice can stay inside the existing web form and payload mapping contract.

## Goal
Allow operators to add a new threshold, fill it in, reorder it into the intended final position, and save it without manually rewriting the rest of the ladder. Reuse one shared editor for `TTP`, `TSL`, and advanced `DCA`.

## Scope
- `apps/web/src/features/strategies/components/StrategyFormSections/Close.tsx`
- `apps/web/src/features/strategies/components/StrategyFormSections/Additional.tsx`
- `apps/web/src/features/strategies/components/StrategyFormSections/SortableThresholdListEditor.tsx`
- `apps/web/src/features/strategies/utils/StrategyForm.map.ts`
- `apps/web/src/features/strategies/utils/strategyThresholdItems.ts`
- `apps/web/src/features/strategies/hooks/useStrategyForm.ts`
- `apps/web/src/features/strategies/types/StrategyForm.type.tsx`
- `apps/web/src/features/strategies/components/StrategyForm.test.tsx`
- `apps/web/src/features/strategies/utils/StrategyForm.map.test.ts`
- `apps/web/src/i18n/namespaces/dashboard-strategies.{en,pl,pt}.ts`
- `docs/ux/design-memory.md`

## Success Signal
- User or operator problem:
  Adding a new `TTP`, `TSL`, or advanced `DCA` row at the end forces manual rewriting of existing rows.
- Expected product or reliability outcome:
  Operators can reorder threshold ladders before save, and payload serialization remains backend-compatible.
- How success will be observed:
  Reordered values remain stable in form state and are submitted without local-only metadata.
- Post-launch learning needed: no

## Deliverable For This Stage
Implemented shared sortable threshold editor, verified payload compatibility, and attached focused validation evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Introduce feature-local helpers that attach stable client ids to threshold rows and strip them before submit.
2. Build one shared two-field sortable list editor with drag handle plus keyboard-accessible move up/down buttons.
3. Replace duplicated `TTP`, `TSL`, and advanced `DCA` list UIs with the shared editor.
4. Preserve the existing API contract by stripping local ids in `formToPayload`.
5. Lock the behavior with focused form and mapping tests, then run web validation.

## Acceptance Criteria
- [x] `TTP`, `TSL`, and advanced `DCA` use one shared threshold-list editor.
- [x] Operators can reorder rows before save using drag-and-drop and keyboard-accessible move controls.
- [x] Saved payloads keep the chosen ladder order and do not leak local `clientId` fields to the backend contract.
- [x] Existing trailing-threshold validation remains green.

## Definition of Done
- [x] Shared editor is wired into all three target list surfaces.
- [x] Reorder behavior is covered by focused tests.
- [x] Web typecheck, build-facing validation, and relevant i18n checks pass.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter web exec vitest run src/features/strategies/components/StrategyForm.test.tsx src/features/strategies/utils/StrategyForm.map.test.ts --run`
  - `pnpm --filter web run typecheck`
  - `pnpm i18n:audit:route-reachable:web`
  - `pnpm --filter web run build`
  - `pnpm run quality:guardrails`
- Manual checks:
  - Added threshold rows can be moved before save in the strategy form.
- Screenshots/logs:
  - Not captured in this slice.
- High-risk checks:
  - Verified that local `clientId` metadata is stripped from outgoing close and DCA payloads.

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/README.md`
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - not applicable
- Follow-up architecture doc updates:
  - none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference:
  - User-requested strategy-threshold reorder workflow from 2026-04-30
- Canonical visual target:
  - Existing strategy form visual system with clearer threshold-ladder ordering affordances
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: no
- Visual-direction brief reviewed: no
- Existing shared pattern reused:
  - Existing strategy form cards, fields, and button styling
- New shared pattern introduced: yes
- Design-memory entry reused:
  - `docs/ux/design-memory.md`
- Design-memory update required: yes
- Visual gap audit completed: no
- Background or decorative asset strategy:
  - not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches:
  - Native HTML drag interaction is implemented without a dedicated DnD library; keyboard move controls provide the accessibility fallback.
- Required states: success
- Responsive checks: desktop | tablet | mobile
- Input-mode checks: pointer | keyboard
- Accessibility checks:
  - Drag handle has label
  - Move up/down actions are keyboard-accessible buttons
  - Remove actions preserve labels
- Parity evidence:
  - Shared editor now renders the same threshold-row pattern in all three sections.

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes:
  - none
- Health-check impact:
  - none
- Smoke steps updated:
  - no
- Rollback note:
  - revert the web feature slice if form interaction regressions are discovered
- Observability or alerting impact:
  - none
- Staged rollout or feature flag:
  - none

## Review Checklist (mandatory)
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

## Notes
- Backend persistence already stores strategy config as JSON without reordering list arrays at write time, so this slice stays UI-local plus payload sanitation.
- Runtime still sorts `TTP/TSL` for execution semantics, while advanced `DCA` order remains semantically meaningful.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY` or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB -> validation -> error handling -> test. Partial implementations, mock-only paths, placeholders, fake data, and temporary fixes are forbidden.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: yes
- Refresh/restart behavior verified: yes
- Regression check performed:
  - focused strategy form and mapping packs

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected:
  - strategy operators editing close/DCA ladders
- Existing workaround or pain:
  - append-only rows force manual edits across the whole list
- Smallest useful slice:
  - shared sortable editor for `TTP`, `TSL`, and advanced `DCA`
- Success metric or signal:
  - reorder before save works without touching unrelated rows
- Feature flag, staged rollout, or disable path: no
- Post-launch feedback or metric check:
  - user confirmation on strategy create/edit workflow

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey:
  - strategy create/edit save flow
- SLI:
  - successful strategy form submission
- SLO:
  - not applicable
- Error budget posture: not applicable
- Health/readiness check:
  - not applicable
- Logs, dashboard, or alert route:
  - not applicable
- Smoke command or manual smoke:
  - `pnpm --filter web run build`
- Rollback or disable path:
  - revert the web feature slice

## AI Testing Evidence (required for AI features)
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios:
  - not applicable
- Multi-step context scenarios:
  - not applicable
- Adversarial or role-break scenarios:
  - not applicable
- Prompt injection checks:
  - not applicable
- Data leakage and unauthorized access checks:
  - not applicable
- Result:
  - not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification:
  - operator strategy config
- Trust boundaries:
  - browser form state to existing authenticated strategy API
- Permission or ownership checks:
  - unchanged existing strategy ownership model
- Abuse cases:
  - malformed local reorder metadata must not leak to API
- Secret handling:
  - none
- Security tests or scans:
  - focused payload sanitation assertions
- Fail-closed behavior:
  - backend close-threshold validation remains unchanged
- Residual risk:
  - native HTML drag interaction can feel less polished than a dedicated DnD library on some devices

## Result Report

- Task summary:
  - Added one shared sortable threshold editor and reused it in `TTP`, `TSL`, and advanced `DCA`, with local `clientId` handling stripped before API payload serialization.
- Files changed:
  - strategy form sections, strategy mapping/helpers/types/tests, dashboard-strategies translations, design memory, project context docs
- How tested:
  - focused web tests, web typecheck, i18n audit, web build, repository guardrails
- What is incomplete:
  - no browser screenshot evidence was captured in this slice
- Next steps:
  - optional browser-use clickthrough for tactile drag UX on desktop/mobile if you want parity evidence
- Decisions made:
  - stayed within the existing strategy JSON contract and avoided backend/API schema changes
