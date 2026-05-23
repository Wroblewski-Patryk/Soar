# V1EXCEL - Final Unblock Runbook

Status: active
Date: 2026-04-29
Owner: Codex Execution Agent

## Purpose

Provide one exact operator-facing sequence for clearing the remaining external
blockers behind the current `V1EXCEL` `NO-GO` decision.

This runbook does not redefine scope. It only turns the already known blocked
items into one deterministic execution order.

## Current Blockers

The repository no longer carries a confirmed core implementation gap for `V1`.
The remaining blockers are:

1. authenticated manual operator matrix for `PAPER` and `LIVE`
2. authenticated stage release-gate evidence
3. authenticated production release-gate evidence families
4. authenticated runtime observability proof

## Required Inputs

Before starting, prepare all of the following:

### Soar operator access

- stage operator credentials or admin JWT
- production operator credentials or admin JWT

Accepted forms:

- `--auth-token <ADMIN_JWT>`
- `--auth-email <email> --auth-password <password>`

### OPS / private-route access

At least one supported protected-route mechanism:

- `--ops-basic-user <user> --ops-basic-password <password>`
- `--ops-auth-header-name <name> --ops-auth-header-value <value>`

### Exchange authority for manual LIVE verification

- authenticated exchange account linked to the tested LIVE bot
- permission to place and observe real exchange orders
- permission to perform one manual exchange-side intervention scenario

## Step 1 - Confirm Current Candidate

Use the currently deployed candidate SHA:

```powershell
git rev-parse HEAD
```

Expected current repo candidate from the latest post-deploy note:

- `4514894127ad07cbe95415043658e10b8c0cf75d`

If production is on a newer SHA, update the evidence trail first.

## Step 2 - Execute the Manual Operator Matrix

Reference matrix:

- [v1excel-manual-verification-matrix-2026-04-29.md](C:/Personal/Projekty/Aplikacje/Soar/history/audits/v1excel-manual-verification-matrix-2026-04-29.md)

Execute and record all of these:

1. `PAPER` manual open through dashboard
2. `PAPER` manual close through dashboard
3. `LIVE` manual open through dashboard
4. `LIVE` manual close through dashboard
5. pending external exchange order stays in `orders` until fill
6. same-symbol DCA on managed LIVE position
7. `TTP` / `TSL` / `SL` behavior after DCA
8. manual exchange-side intervention and subsequent dashboard truth
9. restart / recovery truth after dashboard reopen

Required result format:

- one markdown evidence note under `docs/operations/`
- each scenario marked `PASS`, `FAIL`, or `BLOCKED`
- exact bot/symbol/environment noted

## Step 3 - Refresh Stage Evidence

Run the authenticated stage rehearsal:

```powershell
pnpm run ops:release:v1:stage-rehearsal -- --base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch --auth-token <ADMIN_JWT> --ops-basic-user <user> --ops-basic-password <password>
```

Alternative auth forms are allowed by the existing scripts.

Expected outputs:

- new `v1-release-gate-stage-*.md`
- new `v1-stage-rehearsal-*.md`

Must confirm:

- post-deploy smoke passes
- runtime freshness gate passes
- rollback guard gate passes
- stage evidence is same-day fresh

## Step 4 - Refresh Production Evidence Families

### 4A. Production release gate

```powershell
pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --auth-token <ADMIN_JWT> --ops-basic-user <user> --ops-basic-password <password> --skip-local-quality
```

### 4B. Production restore drill

```powershell
pnpm run ops:db:restore-drill:prod
```

### 4C. Production rollback proof

```powershell
pnpm run ops:deploy:rollback-proof:prod -- --base-url https://api.soar.luckysparrow.ch --auth-token <ADMIN_JWT> --ops-basic-user <user> --ops-basic-password <password>
```

Expected outputs:

- fresh same-day release-gate artifacts
- fresh same-day restore-drill artifacts
- fresh same-day rollback-proof artifacts

## Step 5 - Refresh RC Evidence

If the release gate and protected proofs are green, rebuild RC artifacts:

```powershell
pnpm run ops:rc:gates:status
pnpm run ops:rc:signoff:build -- --engineering-name "<name>" --product-name "<name>" --operations-name "<name>" --owner-name "<name>" --owner-contact "<contact>"
pnpm run ops:rc:checklist:sync
```

If production Gate 2 must be strict, use:

```powershell
pnpm run ops:rc:gates:evidence:check:strict:prod
```

## Step 6 - Re-run Protected Runtime Observability Checks

With OPS/private-route auth available:

```powershell
pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch --auth-token <ADMIN_JWT> --ops-basic-user <user> --ops-basic-password <password>
pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch --auth-token <ADMIN_JWT> --ops-basic-user <user> --ops-basic-password <password>
```

The target state is no longer `401`, and rollback guard should no longer report
auth-derived reasons.

## Step 7 - Decision Rules

### Move from `NO-GO` to `GO` only if all are true

- manual matrix is executed with no unresolved money-path failure
- stage rehearsal is fresh and authenticated
- prod release gate is fresh and authenticated
- prod restore drill is fresh and passes
- prod rollback proof is fresh and passes
- RC artifacts are refreshed
- runtime observability is proven with auth

### Stay `NO-GO` if any of these remain true

- any manual `LIVE` scenario is unexecuted or failed
- protected OPS routes still cannot be exercised
- restore drill or rollback proof is stale or failed
- RC artifacts remain stale

## Output Requirement

After running this runbook, publish one new final decision note under
`docs/operations/` and sync:

- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

