# V1 Protected Operator Handoff - 3c5da343

## Header

- Date: 2026-05-09
- Author role: Ops/Release
- Related task IDs:
  - `CURRENT-EXECUTABLE-V1-BOUNDARY-3C5DA343-2026-05-09`
  - `V1-PROTECTED-ACCESS-READINESS-2026-05-09`
  - `LIVEIMPORT-03`
  - `PROD-UI-AUDIT-PLAN-2026-05-08`
- Current branch: `main`
- Current stage: release
- Operation mode: BUILDER

## Current Source Of Truth

- Product: `.codex/context/PROJECT_STATE.md`
- Architecture: `docs/architecture/README.md`
- Planning: `docs/planning/mvp-next-commits.md`
- Task board: `.codex/context/TASK_BOARD.md`
- UX/design: `docs/planning/prod-ui-module-clickthrough-audit-plan-2026-05-08.md`
- Deployment/ops: `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`
- User feedback: continue toward 100% V1, but do not fake protected evidence

## What Changed

- Summary: this handoff condenses the remaining protected V1 work into one
  operator checklist for the currently verified deployed candidate.
- Files changed: this handoff plus source-of-truth state references.
- Product behavior changed: no
- Architecture changed: no
- UX changed: no
- Deployment changed: no

## Current Candidate

- Verified deployed SHA:
  `3c5da34371e22aecb1a7aff0a185018870d35cec`
- Public/no-secret evidence:
  - `docs/operations/deploy-freshness-3c5da343-2026-05-09.md`
  - `docs/operations/v1-final-preflight-3c5da343-2026-05-09.md`
  - `docs/operations/prod-ui-public-access-clickthrough-3c5da343-2026-05-09.md`
- Current V1 status: `BLOCKED`

## Required Protected Inputs

Provide these to the operator shell or approved secret manager. Do not commit
values to the repository.

### Application Runtime Readback

One of:
- `LIVEIMPORT_READBACK_AUTH_TOKEN`
- `LIVEIMPORT_READBACK_AUTH_EMAIL` and `LIVEIMPORT_READBACK_AUTH_PASSWORD`

Optional private OPS layer if enabled:
- `LIVEIMPORT_READBACK_OPS_BASIC_USER` and
  `LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD`
- or `LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME` and
  `LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE`

### Rollback Guard

One of:
- `ROLLBACK_GUARD_AUTH_TOKEN`
- `ROLLBACK_GUARD_AUTH_EMAIL` and `ROLLBACK_GUARD_AUTH_PASSWORD`

Optional private OPS layer if enabled:
- `ROLLBACK_GUARD_OPS_BASIC_USER` and
  `ROLLBACK_GUARD_OPS_BASIC_PASSWORD`
- or `ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME` and
  `ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE`

### Production Restore Context

Required from a shell that can reach the production Docker/Coolify context:
- `PROD_DB_CHECK_CONTAINER`
- `PROD_DB_CHECK_USER`
- `PROD_DB_CHECK_NAME`

Known production Postgres container from the latest evidence:
`x11cfnz1dd9x0yzccftqzcoe`.

### RC Approval

Required sign-off identities:
- Engineering name
- Product name
- Operations name
- RC owner name
- RC owner contact

### Authenticated UI Audit

Required:
- valid production app session with dashboard access
- valid admin session or admin-equivalent operator role
- ability to open `https://soar.luckysparrow.ch` and capture screenshots,
  console/network errors, and route outcomes

## Operator Execution Order

Run all commands with one release date:

```powershell
$releaseDate = Get-Date -Format yyyy-MM-dd
$expectedSha = "3c5da34371e22aecb1a7aff0a185018870d35cec"
```

1. Confirm no-secret preflight status:

```powershell
pnpm run ops:release:v1:preflight -- --expected-sha $expectedSha --today $releaseDate --json-output "docs/operations/_artifacts-v1-final-preflight-$releaseDate.json" --markdown-output "docs/operations/v1-final-preflight-$releaseDate.md"
```

2. Verify production build-info:

```powershell
pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --timeout-seconds 900 --interval-seconds 30
```

3. Capture `LIVEIMPORT-03` protected runtime readback:

```powershell
pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output "docs/operations/liveimport-03-prod-readback-$releaseDate.json"
```

4. Run current-date production restore drill:

```powershell
pnpm run ops:db:restore-drill:prod -- --today $releaseDate
```

5. Run production rollback proof:

```powershell
pnpm run ops:deploy:rollback-proof -- --profile prod --base-url https://api.soar.luckysparrow.ch --today $releaseDate
```

6. Refresh RC gates and sign-off:

```powershell
pnpm run ops:rc:gates:prod-pipeline -- --base-url https://api.soar.luckysparrow.ch --duration-minutes 30 --interval-seconds 30
pnpm run ops:rc:gates:status -- --today $releaseDate
pnpm run ops:rc:signoff:build -- --engineering-name "<name>" --product-name "<name>" --operations-name "<name>" --owner-name "<name>" --owner-contact "<email-or-contact>" --today $releaseDate
pnpm run ops:rc:checklist:sync -- --today $releaseDate
```

7. Execute the authenticated production UI module clickthrough from:
   `docs/planning/prod-ui-module-clickthrough-audit-plan-2026-05-08.md`.

8. Run the final non-dry-run production release gate:

```powershell
pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --skip-local-quality --today $releaseDate
```

## Acceptance Criteria

V1 can be marked ready only when all are true:

- build-info matches `$expectedSha`
- `LIVEIMPORT-03` artifact exists and contains protected runtime readback
- restore drill artifact for `$releaseDate` reports `PASS`
- rollback proof artifact for `$releaseDate` reports `PASS`
- RC gates and sign-off report final approval
- authenticated/admin UI clickthrough is complete or every route is explicitly
  classified as `PASS`, `FAIL`, `BLOCKED`, or `NOT_APPLICABLE`
- final production release gate reports `ready` without `--dry-run`

## Do Not Accept As Evidence

- public health checks
- public build-info only
- unauthenticated dashboard/admin redirects
- local regression suites
- sandbox network failures
- `401` or `403` responses from protected production endpoints
- stale 2026-05-08 restore or rollback evidence for a 2026-05-09 release date
- local `HEAD` if production build-info does not expose the same SHA

## Validation

- Commands run for this handoff:
  - `node scripts/repoGuardrails.mjs`
  - `node scripts/checkDocsParity.mjs`
  - `git diff --check`
- Manual checks:
  - reviewed the current final blocker execution pack
  - reviewed the protected access readiness task
- Screenshots or artifacts:
  - no screenshots; docs-only handoff
- Checks not run:
  - protected readback, restore drill, rollback proof, RC approval, and
    authenticated UI clickthrough
- Reason checks were not run:
  - current shell lacks the required protected inputs listed above

## Risks And Assumptions

- Residual risks: protected production runtime/UI behavior remains unverified
  until the operator executes the protected pack.
- Assumptions made: `3c5da34371e22aecb1a7aff0a185018870d35cec` remains the
  intended deployed runtime/dashboard candidate until a later build-info proof
  supersedes it.
- Known blockers: protected app auth, rollback auth, production DB/Coolify
  context, RC approval identities, authenticated/admin UI access.
- Open decisions: whether to push local evidence-only commits before or after
  final protected evidence. Pushing them changes production build-info and may
  require repeating freshness checks.

## Next Tiny Task

- Recommended next task: provide protected inputs and execute step 1 of this
  handoff from an approved operator context.
- Why next: all no-secret evidence is already current for `3c5da343`; protected
  proof is the only path to V1 readiness.
- Suggested owner: Ops/Release with product owner approval.
- Files or surfaces likely touched: generated artifacts under
  `docs/operations/` and synchronized state docs.
- Validation to run: final blocker pack commands in order, then final
  non-dry-run production release gate.

## Resume Instructions

- Read first:
  - `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`
  - `docs/operations/v1-final-preflight-3c5da343-2026-05-09.md`
  - this handoff
- Do not touch:
  - live trading or exchange order execution outside approved release gates
  - secret values in repository files
- Watch out for:
  - evidence date drift near midnight
  - local evidence-only commits changing `HEAD` but not production build-info
  - treating Coolify access as Soar application auth without explicit
    confirmation
- If blocked:
  - record the missing input by variable name or role only
  - do not print secret values
  - keep final V1 status `BLOCKED`
