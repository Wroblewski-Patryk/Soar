# Task

## Header
- ID: V1MARKET-02
- Title: Keep Binance catalog symbols selectable in market whitelist
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1MARKET-01
- Priority: P1
- Iteration: 2026-05-02 operator hotfix
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
After `V1MARKET-01` unblocked saving linked market universes after bot
deactivation, the operator still could not add some symbols to a whitelist
because the whitelist multi-select only received markets that survived the
current volume filter. Symbols available in the Binance catalog but below the
automatic filter threshold were hidden from manual selection.

## Goal
Allow operators to manually whitelist any symbol returned by the current
Binance catalog for the selected exchange, market type, and base currency,
while preserving the existing preview contract:
`(volume-filtered catalog U whitelist) - blacklist`.

## Scope
- `apps/web/src/features/markets/components/MarketUniverseForm.tsx`
- `apps/web/src/features/markets/components/SearchableMultiSelect.tsx`
- `apps/web/src/features/markets/components/MarketUniverseForm.test.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Success Signal
- User or operator problem: whitelist dropdown shows all selectable Binance
  catalog symbols, not only symbols passing the volume filter.
- Expected product or reliability outcome: filtered automatic result remains
  unchanged, but manual whitelist can add lower-volume symbols.
- How success will be observed: regression test opens the whitelist dropdown,
  finds `SOLUSDT` below the active volume threshold, selects it, and sees the
  preview count include it.
- Post-launch learning needed: no

## Deliverable For This Stage
Release-ready code, regression coverage, validation evidence, and project
context updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Split market form options into automatic-result options and full-catalog
   selection options.
2. Keep preview/result composition based on the existing filtered-catalog
   contract plus whitelist and minus blacklist.
3. Use the full catalog for whitelist/blacklist dropdowns and select-all.
4. Preserve saved legacy symbols that are outside the current catalog.
5. Add focused regression coverage and improve checkbox labels for accessible
   selection.

## Acceptance Criteria
- [x] Whitelist and blacklist dropdowns include symbols from the full Binance
  catalog for the selected context.
- [x] Volume-filtered preview still starts from filtered catalog symbols.
- [x] Selecting a catalog symbol hidden by the volume filter adds it to the
  resulting preview through whitelist.
- [x] Existing saved out-of-catalog symbols remain editable.
- [x] Focused web test, typecheck, build, and guardrails pass.

## Definition of Done
- [x] Implementation is limited to the market form selection flow.
- [x] Regression coverage captures the operator-reported failure mode.
- [x] Relevant validation is green.
- [x] Source-of-truth context is updated.

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
  - `pnpm --filter web run test -- src/features/markets/components/MarketUniverseForm.test.tsx --run`
  - `pnpm --filter web run typecheck`
  - `pnpm --filter web run build`
  - `pnpm run quality:guardrails`
- Manual checks: code review of option-source split and persisted symbol handling
- Screenshots/logs: not applicable for focused component regression
- High-risk checks: no live trading, auth, secrets, or money-moving behavior changed

## Architecture Evidence
- Architecture source reviewed: existing market form and catalog client contracts
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing market form UI
- Canonical visual target: existing dashboard market form
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: `SearchableMultiSelect`
- New shared pattern introduced: no
- Design-memory entry reused: existing dashboard form conventions
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches: none known
- Required states: success
- Responsive checks: not applicable to behavior-only component fix
- Input-mode checks: pointer, keyboard through native checkbox semantics
- Accessibility checks: option checkboxes now expose symbol `aria-label`
- Parity evidence: component structure and labels remain unchanged

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the frontend option-source split if needed
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: whitelist dropdown source used the volume-filtered catalog.
- Gaps: manual whitelist selection could not reach lower-volume Binance symbols.
- Inconsistencies: preview contract already allowed whitelist to add symbols
  outside the filtered automatic result, but UI prevented selecting them.
- Architecture constraints: reuse existing market catalog and form mechanisms.

### 2. Select One Priority Task
- Selected task: restore full Binance catalog selection for whitelist.
- Priority rationale: direct continuation of the operator-reported market edit
  blocker.
- Why other candidates were deferred: no unrelated market UI changes were
  needed.

### 3. Plan Implementation
- Files or surfaces to modify: market form, shared searchable multi-select, and
  focused tests.
- Logic: catalog options power manual selection; filtered options power
  automatic preview.
- Edge cases: legacy saved symbols outside the catalog remain visible.

### 4. Execute Implementation
- Implementation notes: added `catalogOptions` for dropdowns, kept
  `marketOptions` for filtered preview, and aligned select-all to the full
  selectable catalog.

### 5. Verify and Test
- Validation performed: focused component regression, web typecheck, web build,
  and repository guardrails.
- Result: pass.

### 6. Self-Review
- Simpler option considered: disabling volume filtering for the whole preview
  was rejected because it would break the documented result contract.
- Technical debt introduced: no
- Scalability assessment: option lists still derive from the existing catalog
  payload and memoized transformations.
- Refinements made: added accessible checkbox labels.

### 7. Update Documentation and Knowledge
- Docs updated: this task note
- Context updated: `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`
- Learning journal updated: not applicable

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

## Notes
Assumption: the desired manual selection universe is the Binance catalog for
the currently selected exchange, market type, and base currency; not symbols
outside that catalog.

## Production-Grade Required Contract

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: no
- Real API/service path used: yes, existing market catalog client contract
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not changed
- Error state verified: not changed
- Refresh/restart behavior verified: focused component rerender path covered
- Regression check performed: yes

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: market universe editor operator
- Existing workaround or pain: could not select lower-volume Binance symbols
  for whitelist.
- Smallest useful slice: selection source fix in existing market form.
- Success metric or signal: regression test sees below-threshold symbol in
  whitelist dropdown and preview after selection.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: operator can retry the edit.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: market universe edit
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused component test
- Rollback or disable path: revert commit

## AI Testing Evidence
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: public exchange catalog symbols
- Trust boundaries: no new boundary
- Permission or ownership checks: unchanged
- Abuse cases: not applicable
- Secret handling: unchanged
- Security tests or scans: not applicable
- Fail-closed behavior: unchanged
- Residual risk: low, UI-only selection behavior

## Result Report
- Task summary: full Binance catalog symbols are selectable for manual
  whitelist/blacklist while preview filtering stays intact.
- Files changed: market form, searchable multi-select, focused test, project
  context docs.
- How tested: focused Vitest component test, web typecheck, web build, and
  repository guardrails.
- What is incomplete: no browser screenshot was captured for this behavior-only
  component fix.
- Next steps: operator can retry adding the desired whitelist symbols.
- Decisions made: full catalog drives manual selection; filtered catalog drives
  automatic result.
