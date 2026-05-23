# Task

## Header
- ID: V1READY-2026-04-25-C
- Title: Reconcile residual V1 truth artifacts and expose deployed commit identity for post-deploy verification
- Status: DONE
- Owner: Ops/Release
- Depends on: V1READY-2026-04-25-A, V1READY-2026-04-25-B
- Priority: P1

## Context
The repository canonically says V1 is approved, but one residual audit showed
two remaining truth gaps: the public build-info endpoint could not prove which
commit was deployed, and some V1 checklist/ops summary artifacts still carried
stale partial-state wording after their closure waves were already completed.

## Goal
Make V1 deploy truth directly observable from the deployed app and resynchronize
the remaining activation/checklist artifacts so they no longer imply unfinished
closure waves that are already complete.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] Web build-info endpoint exposes deploy-verifiable git metadata when the build environment can provide or derive it.
- [x] RC summary output makes stale evidence timing explicit instead of silently presenting old evidence as fresh.
- [x] V1 checklist and activation docs no longer claim queued/partial closure for already closed V1 waves.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails`
  - `pnpm run typecheck`
  - `pnpm run build`
- Manual checks:
  - local `pnpm run ops:rc:gates:summary`
  - public `https://soar.luckysparrow.ch/api/build-info` after deploy
- Screenshots/logs:
  - local build output proves build metadata generation ran during `web build`
- High-risk checks:
  - public `/health`
  - public `/ready`
  - public `/api/build-info`

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/reference/v1-production-activation-contract.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates:
  - none

## UX/UI Evidence (required for UX tasks)
- Design source type:
- Design source reference:
- Required states:
- Responsive checks:
- Accessibility checks:
- Parity evidence:

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
- This task intentionally does not claim that production already runs the latest
  SHA. It adds the missing deploy-verification hook so that the answer becomes
  provable after deployment.
