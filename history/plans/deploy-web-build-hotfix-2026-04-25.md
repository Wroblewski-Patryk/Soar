# Task

## Header
- ID: DEPLOY-2026-04-25-A
- Title: Restore green `apps/web` production build after Coolify deploy lint failure
- Status: DONE
- Owner: Frontend Builder
- Depends on: none
- Priority: P0

## Context
Coolify deployment on `2026-04-24` failed during `pnpm --filter web build` for
commit `0dd951d1696bd45ac11983c67e72213134a632d3`. The failure was limited to
web lint/build gates: `@typescript-eslint/no-explicit-any` in
`HomeLiveWidgets.test-helpers.ts` and a `react-hooks/exhaustive-deps` warning in
`WalletsListTable.tsx`.

## Goal
Restore a green production web build with the smallest safe code change so the
automatic redeploy can complete.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] The web build no longer fails on the reported lint/type issues.
- [x] The fix stays within the existing dashboard and wallets implementations.
- [x] Canonical context docs reflect the deploy hotfix work.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: `pnpm --filter web run build`; `pnpm run quality:guardrails`
- Manual checks: confirmed the Coolify log errors map directly to the fixed files
- Screenshots/logs: deploy log from `2026-04-24 21:46:53-54` showed the exact failing paths
- High-risk checks: none; scope limited to test helper typing and hook dependency cleanup

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/README.md`, `docs/architecture/01_overview-and-principles.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: not applicable; no UI behavior change
- Required states: not applicable
- Responsive checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: not applicable

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
This is a deploy-unblock hotfix only. It intentionally avoids opportunistic web
cleanup beyond the reported build blockers.
