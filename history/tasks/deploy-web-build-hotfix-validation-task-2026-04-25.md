# Task

## Header
- ID: DEPLOY-2026-04-25-B
- Title: qa(web-build): validate Coolify deploy hotfix locally and sync closure evidence
- Status: DONE
- Owner: QA/Test
- Depends on: DEPLOY-2026-04-25-A
- Priority: P1

## Context
`PROJECT_STATE.md` and `TASK_BOARD.md` already record a same-day hotfix for the
Coolify web deploy failure caused by one `no-explicit-any` violation and one
redundant React dependency warning. The remaining smallest follow-up is to
attach local closure evidence for the exact web build contract that blocked the
deployment and synchronize the canonical queue/context wording to that evidence.

## Goal
Prove locally that the web deploy hotfix restores the required `apps/web`
build gate and synchronize canonical docs/context to a fully evidenced closed
state.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep the scope limited to validation and source-of-truth sync unless the
  validation exposes a real defect

## Definition of Done
- [x] `pnpm --filter web run build` passes locally after the deploy hotfix.
- [x] Repository guardrails still pass after closure sync.
- [x] Canonical queue/context reflects explicit validation evidence for the
      web deploy hotfix.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: `pnpm --filter web run build`
- Manual checks: none
- Screenshots/logs: command output only
- High-risk checks: build gate parity with the exact failure class reported by
  Coolify

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: Coolify deploy log for web commit
- Required states: success | error
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: local `apps/web` build matches the required deployment gate

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This slice should remain validation-only unless the local build gate still
fails, in which case the task escalates into a new fix slice.

## Completion Notes
- Local web build now passes cleanly after the same-day Coolify hotfix, so the
  originally reported deploy gate is no longer reproducible in the repository.
- Closure remained validation-only; no additional code changes were required.

## Validation Evidence
- `pnpm --filter web run build`
- `pnpm run quality:guardrails`
