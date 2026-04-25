# Task

## Header
- ID: V1REG-03
- Title: Browser verification sweep for the architecture-V1 functionality checklist
- Status: DONE
- Owner: QA/Test
- Depends on: V1REG-02
- Priority: P1

## Context
`V1REG-02` closed the first automated architecture-V1 sweep and proved that no
new product regression was isolated in the available web and non-DB API
coverage. The next required slice was the manual/browser pass from the same
checklist so weekly regression work can distinguish:

- product-visible regressions
- infra-only blockers
- routes or states that remain operator-visible even while backend/runtime
  infrastructure is degraded

This slice intentionally records what was observable from a real browser run on
the local target instead of inferring behavior from unit tests alone.

## Goal
Execute the reusable browser/manual portion of the architecture-V1 checklist,
capture reproducible findings, and sync canonical queue/context truth without
inventing product failures that are actually caused by local environment
blockers.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep architecture docs as the function inventory source of truth
- record infra blockers explicitly instead of collapsing them into product
  failures

## Definition of Done
- [x] A local browser sweep was executed against the available web target.
- [x] Reproducible findings were added to the reusable checklist execution log.
- [x] Function-level manual verdicts distinguish real browser observations from
      infra-blocked flows.
- [x] Queue/context artifacts now point to `V1REG-04` as the next slice.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- marking auth/runtime-heavy flows as passed when the local environment never
  reached those flows

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails`
- Manual checks:
  - rendered `/auth/login` on desktop/tablet/mobile
  - rendered `/auth/register`
  - verified unauthenticated `/dashboard` redirects back to `/auth/login`
  - submitted invalid sign-in data and verified explicit UI error state
- Screenshots/logs:
  - browser-run notes recorded in
    `docs/operations/v1-architecture-functionality-regression-checklist-2026-04-25.md`
  - local startup evidence recorded from:
    - `.tmp/logs/v1reg03-web.log`
    - `.tmp/logs/v1reg03-api.log`
- High-risk checks:
  - API startup was kept fail-closed when `API_KEY_ENCRYPTION_KEYS` was missing
  - Docker Desktop / local Postgres absence was recorded as infra-blocking
    rather than treated as a product regression

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - n/a
- Follow-up architecture doc updates:
  - none; this slice records verification evidence only

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference:
  - `docs/ux/ux-ui-mcp-collaboration.md`
  - `docs/ux/dashboard-design-system.md`
- Required states: loading | empty | degraded | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks:
  - skip link present on auth routes
  - auth form controls expose readable labels and explicit error text
- Parity evidence:
  - protected-route redirect stayed consistent with the auth-shell contract
    across unauthenticated navigation

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- No new product-visible regression was isolated in this browser slice.
- Manual verification beyond auth-shell and protected-route behavior remains
  infra-blocked locally because:
  - Docker Desktop / local Postgres are unavailable
  - the API dev target fails fast on missing `API_KEY_ENCRYPTION_KEYS`
- Those blockers were already known in canonical repo context, so no new
  learning-journal entry was required here.
