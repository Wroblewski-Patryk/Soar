# Task

## Header
- ID: V1DCA-03
- Title: Restore DCA visibility when portfolio-history refresh fails
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Codex Execution Agent
- Depends on: `fbeae8f0`
- Priority: P0

## Context
After production deployed `fbeae8f08926bc838141d53397fc142f52945356`, the
operator reported that DCA stopped showing in the dashboard `Positions` table.
The commit scan from 2026-05-01 09:00 showed only one post-09:00 commit touching
bot runtime/web monitoring code: `fbeae8f0`. That commit added
bot portfolio-history loading into the monitoring refresh path.

## Goal
Keep the runtime `Positions` table, including the DCA ladder cell, visible even
when the optional bot portfolio-history endpoint fails.

## Scope
- Web monitoring controller refresh flow.
- Existing `BotsManagement` monitoring regression coverage.
- No backend runtime read-model changes.

## Implementation Plan
1. Review post-09:00 commits and isolate runtime/web monitoring changes.
2. Make portfolio-history loading fail soft instead of setting global
   monitoring error state.
3. Add/adjust web regression coverage so a portfolio-history failure does not
   hide DCA ladder output in `Positions`.
4. Run focused web validation.

## Acceptance Criteria
- `portfolio-history` failures do not replace monitoring content with the
  global error state.
- Existing `Positions` DCA ladder rendering still appears when positions data
  is valid.
- Focused web test passes.

## Definition of Done
- [x] Regression source identified from commit scan.
- [x] Fix implemented without changing the positions API contract.
- [x] Regression coverage proves DCA remains visible when portfolio history
  fails.
- [x] Focused validation passed.

## Forbidden
- Do not create a parallel positions/DCA read path.
- Do not hide DCA values with UI fallback logic.
- Do not weaken runtime positions tests.
- Do not use GitHub dispatch/deploy automation.

## Validation Evidence
- Tests:
  - `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.test.tsx` -> PASS, `13/13`
  - `pnpm --filter web run build` -> PASS
  - `pnpm --filter web run typecheck` -> PASS after `next build` regenerated
    `.next/types`
  - `pnpm run quality:guardrails` -> PASS
  - `git diff --check` -> PASS
- Manual checks:
  - `git log --since="2026-05-01 09:00"` identified `fbeae8f0` as the only
    commit after 09:00 touching bot runtime/web monitoring files.
- Screenshots/logs: not applicable
- High-risk checks:
  - The fix keeps portfolio-history optional and does not alter money-path or
    backend runtime DCA calculations.

## Architecture Evidence
- Architecture source reviewed: existing bot monitoring contract and DCA
  runtime positions path.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: web-only hotfix candidate.
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the fail-soft hook change if portfolio-history must be
  promoted to a hard monitoring dependency in a future release decision.

## Review Checklist
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated because repository truth changed.

## Result Report
- Task summary: isolated the regression to optional portfolio-history loading
  introduced in `fbeae8f0`; the optional panel now fails soft and no longer
  masks valid runtime positions/DCA content.
- Files changed:
  - `apps/web/src/features/bots/hooks/useBotsMonitoringController.ts`
  - `apps/web/src/features/bots/components/BotsManagement.test.tsx`
  - this task packet and canonical context updates
- How tested:
  - focused `BotsManagement` Vitest pack PASS (`13/13`)
  - web build PASS
  - web typecheck PASS after generated `.next/types` existed
  - repository guardrails PASS
- What is incomplete:
  - production verification after deploy of this hotfix
- Next steps:
  - run web typecheck/build, then deploy the hotfix and verify DCA in the
    dashboard `Positions` table.
