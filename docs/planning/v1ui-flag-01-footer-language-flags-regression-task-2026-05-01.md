# V1UI-FLAG-01 - Footer Language Switcher Flags Regression

## Header
- ID: V1UI-FLAG-01
- Title: Restore and lock footer language switcher flags
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: none
- Priority: P1
- Iteration: 2026-05-01
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator reported a UI regression: flags disappeared from the language
switcher in the footer. Commit review from `2026-05-01 09:00` showed no
post-09:00 commit directly touched the footer or `LanguageSwitcher`, but the
visible contract had no footer-specific regression test.

## Goal
Restore the footer language switcher flag rendering contract and prevent future
loss through focused tests.

## Scope
- `apps/web/src/ui/layout/dashboard/LanguageSwitcher.tsx`
- `apps/web/src/ui/layout/dashboard/Footer.layout.test.tsx`
- `apps/web/src/ui/layout/public/Footer.layout.test.tsx`
- Source-of-truth sync in `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`, and `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Review post-09:00 commits and current footer/language switcher ownership.
2. Preserve the flag visual output without depending on emoji font support.
3. Add footer layout regressions proving the active language flag remains
   rendered in both public and dashboard footers.
4. Run focused web tests, typecheck, web build, and repository guardrails.
5. Sync planning and context docs.

## Acceptance Criteria
- Footer language switcher renders the active language as a visual flag, not
  regional-indicator text such as `GB`.
- Public and dashboard footer tests fail if the active flag disappears.
- No new UI pattern, route, or language system is introduced.
- Web validation passes.

## Definition of Done
- [x] Code builds without errors.
- [x] No mock-only, placeholder, temporary bypass, or duplicate language
  implementation was introduced.
- [x] No existing documented footer behavior was changed beyond preserving the
  flag contract.
- [x] Source-of-truth files record the change and validation evidence.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing footer language switcher contract from
  `LanguageSwitcher` history and current dashboard design system.
- Canonical visual target: footer switcher shows the active flag plus localized
  language label.
- Fidelity target: structurally_faithful
- Existing shared pattern reused: `FooterPreferencesSwitchers` and
  `LanguageSwitcher`
- New shared pattern introduced: no
- Required states: success
- Responsive checks: existing footer mobile/desktop class contract retained in
  footer layout tests
- Input-mode checks: pointer and keyboard remain delegated to existing details
  dropdown behavior
- Accessibility checks: existing `aria-label` and hidden flag semantics retained
- Parity evidence: dashboard and public footer tests assert the active GB flag
  is present in the footer switcher without text content. Browser verification
  on `http://127.0.0.1:3004/` confirmed CSS flag badges render with empty text
  and computed flag backgrounds. Production verification on
  `https://soar.luckysparrow.ch/` still showed deployed `a9a586e...` serving
  the old emoji/text-dependent implementation.

## Architecture Evidence
- Architecture source reviewed: `docs/ux/dashboard-design-system.md`,
  `docs/ux/screen-quality-checklist.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: user-visible footer flag regression, missing footer-specific flag
  regression coverage.
- Gaps: post-09:00 commits did not directly touch the switcher, so the safest
  code change is to harden visual flag rendering and lock behavior.
- Architecture constraints: reuse shared footer and language switcher systems.

### 2. Select One Priority Task
- Selected task: restore and lock footer language switcher flags.
- Priority rationale: visible UI regression in global shell.
- Why other candidates were deferred: runtime and release-gate work is outside
  this UI regression scope.

### 3. Plan Implementation
- Files or surfaces to modify: shared language switcher and footer layout tests.
- Logic: render flag badges with CSS instead of font-dependent flag text.
- Edge cases: browser or OS rendering regional-indicator text instead of flag
  emoji; both public and dashboard footers.

### 4. Execute Implementation
- Implementation notes: replaced font-dependent flag text with visual CSS flag
  badges and added footer flag assertions.

### 5. Verify and Test
- Validation performed:
  - `pnpm --filter web run test -- src/ui/layout/dashboard/LanguageSwitcher.test.tsx src/ui/layout/dashboard/Footer.layout.test.tsx src/ui/layout/public/Footer.layout.test.tsx --run`
  - `pnpm --filter web run typecheck`
  - `pnpm --filter web run build`
  - `pnpm run quality:guardrails`
  - Browser check on production: `https://soar.luckysparrow.ch/api/build-info`
    reported `gitSha=a9a586e5957ae1aac211f5ae11f3b6f4051ddca7`, and the
    footer still used the old `text-sm leading-none` flag implementation.
  - Browser check on local built/dev surface: `http://127.0.0.1:3004/`
    rendered CSS flag badges with empty text and visible computed backgrounds.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave current literals unchanged and add tests only.
- Technical debt introduced: no
- Scalability assessment: no new locale mechanism; the existing array remains
  the only language option source for this component.
- Refinements made: flag rendering no longer relies on emoji font support.

### 7. Update Documentation and Knowledge
- Docs updated: this planning task, MVP next queue, task board, project state.
- Context updated: yes
- Learning journal updated: not applicable.

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
- [x] Docs or context were updated.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
- Task summary: footer language flags now render as visual CSS flag badges and
  are locked by public and dashboard footer tests.
- Files changed:
  - `apps/web/src/ui/layout/dashboard/LanguageSwitcher.tsx`
  - `apps/web/src/ui/layout/dashboard/Footer.layout.test.tsx`
  - `apps/web/src/ui/layout/public/Footer.layout.test.tsx`
  - `docs/planning/v1ui-flag-01-footer-language-flags-regression-task-2026-05-01.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused footer/language switcher tests, web typecheck, web build,
  repository guardrails.
- What is incomplete: production is still on a build that predates this fix.
- Next steps: commit and deploy this diff, then recheck production build-info
  and footer rendering.
