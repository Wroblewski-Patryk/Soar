# LUC-2456 Regression Evidence Sweep - 2026-06-06

## Status

`PARTIALLY_VERIFIED`

This was a safe QA regression and smoke evidence sweep for [LUC-2456](/LUC/issues/LUC-2456). It did not mutate code, production, secrets, accounts, databases, exchange settings, live trading state, deploys, restarts, or rollback state.

## Scope

- Local repository guardrails.
- Documentation parity.
- Strict architecture graph drift.
- Focused Web go-live regression pack.
- Coolify stack env checker tests.
- Public no-workers production deploy smoke for API/Web reachability and Web build-info.

## Source Snapshot

- Local `HEAD`: `56d8d440bfe0fd9ee692e9f669e35414d85d2493`
- `origin/main`: `56d8d440bfe0fd9ee692e9f669e35414d85d2493`
- Direct production Web `/api/build-info`: `gitSha=56d8d440bfe0fd9ee692e9f669e35414d85d2493`, `gitRef=main`, `checkedAt=2026-06-06T14:30:30.045Z`

## Validation Results

| Command or probe | Result | Evidence |
| --- | --- | --- |
| `pnpm softwarehouse:control-tick` | BLOCKED_BY_TOOLING_DRIFT | Command is not exposed in this checkout: `Command "softwarehouse:control-tick" not found`. |
| `pnpm run quality:guardrails` | PASS | Repository guardrails check passed, including architecture graph drift, lockfile policy, file budgets, monolith budget, copy guardrails, runtime Dockerfiles, Web wrapper, env file policy, and secret argv policy. |
| `pnpm run docs:parity:check` | PASS | API `22/22`, Web `16/16`, Routes `39/39`, no stale or missing doc inventory rows. |
| `pnpm run architecture:graph:drift:strict` | PASS | `831/831` covered, `0` missing. |
| `pnpm run test:go-live:web` | PASS | `3` files / `18` tests passed. |
| `pnpm run ops:coolify-stack:env-check:test` | PASS | `8/8` node tests passed. |
| `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --no-workers` | FAIL, repeated abort symptom | First run: API `/health` PASS, API `/ready` PASS, Web `/` PASS, Web `/api/build-info` failed with `This operation was aborted` while printing expected gitSha. Second run: Web `/api/build-info` PASS with expected gitSha, API `/ready` PASS, Web `/` PASS, API `/health` failed with `This operation was aborted`. |
| Direct `Invoke-RestMethod https://api.soar.luckysparrow.ch/health` | PASS | JSON `status=ok`, `service=api`. |
| Direct `Invoke-RestMethod https://api.soar.luckysparrow.ch/ready` | PASS | JSON `status=ready`, `service=api`. |
| Direct `Invoke-RestMethod https://soar.luckysparrow.ch/` | PASS | Returned without error. |
| Direct `Invoke-RestMethod https://soar.luckysparrow.ch/api/build-info` | PASS | Expected gitSha returned. |
| `curl.exe -s -o NUL -w "workers_ready_status=%{http_code}\n" https://api.soar.luckysparrow.ch/workers/ready` | PASS fail-closed | Unauthenticated worker readiness returned `401`. |

## Finding

`ops:deploy:smoke` is not currently stable enough to be the only public smoke evidence source in this runner. The failures moved between public endpoints across two consecutive runs, while direct endpoint probes succeeded immediately afterward.

Classification: `evidence tooling instability`, not confirmed product outage.

## Follow-Up

Created [LUC-2475](/LUC/issues/LUC-2475) for Test Automation to harden or triage `scripts/deploySmokeCheck.mjs` around abort handling/retry diagnostics for public no-workers smoke. The follow-up should preserve fail-closed behavior, avoid hiding real endpoint failures, and include a focused test or documented reproducible probe.

## Residual Risk

- V1 release confidence remains fail-closed on protected runtime/worker/SLO/rollback/RC/input proof lanes.
- This sweep does not claim authenticated dashboard/admin, protected worker, liveimport, rollback, database restore, exchange, or live trading readiness.
- The production public surface is directly reachable in this sweep, but the canonical smoke runner produced repeated abort failures and needs owner-scoped repair.
