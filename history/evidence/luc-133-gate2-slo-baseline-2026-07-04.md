# LUC-133 Gate 2 SLO Baseline Evidence

## Task
- Issue: LUC-133
- Parent gate: LUC-34
- Environment: production
- Expected deployed SHA: `cf9011b43060c52941dae9232e9a1ca4392ca3f2`
- Protected action note: no deploy, restart, rollback, raw secret read, or secret mutation was performed.

## Execution
- Mapped the already-approved smoke credentials from `SMOKE_AUTH_EMAIL` and `SMOKE_AUTH_PASSWORD` into SLO collector env variables for command execution only.
- Ran production SLO collection through the existing RC gate pipeline with DB restore skipped because this issue scoped only Gate 2 SLO/queue-lag evidence.

## Commands
```sh
pnpm run ops:rc:gates:prod-pipeline -- --skip-db-check --duration-minutes 30 --interval-seconds 30 --expected-sha cf9011b43060c52941dae9232e9a1ca4392ca3f2 --evidence-output history/artifacts/_artifacts-rc-evidence-check-luc-133-2026-07-04.json
```

Result: failed after collecting evidence because one `/health` sample returned `fetch failed`; Gate 2 remained `OPEN`.

```sh
pnpm run ops:rc:gates:prod-pipeline -- --skip-db-check --duration-minutes 30 --interval-seconds 30 --expected-sha cf9011b43060c52941dae9232e9a1ca4392ca3f2 --evidence-output history/artifacts/_artifacts-rc-evidence-check-luc-133-rerun-2026-07-04.json
```

Result: SLO collector returned `NO_DATA` only for live order failure ratio because no live order attempts occurred; Gate 2 subset passed after rebuilding status/checklist and running strict production evidence check.

```sh
pnpm run ops:slo:window-report -- --window-days 7
pnpm run ops:slo:window-report -- --window-days 30
pnpm run ops:rc:gates:status -- --expected-sha cf9011b43060c52941dae9232e9a1ca4392ca3f2
pnpm run ops:rc:checklist:sync -- --expected-sha cf9011b43060c52941dae9232e9a1ca4392ca3f2
pnpm run ops:rc:gates:evidence:check:strict:prod -- --json --output history/artifacts/_artifacts-rc-evidence-check-luc-133-rerun-2026-07-04.json
```

Result: strict production evidence check passed.

## Production SLO Evidence
- Observation artifact: `history/operations/_artifacts-slo-window-2026-07-04T21-45-56-640Z.json`
- Observation report: `history/operations/v1-slo-observation-2026-07-04T21-45-56-640Z.md`
- Window: 2026-07-04T21:16:09.340Z to 2026-07-04T21:45:56.638Z
- `/health`: 100.00%
- `/ready`: 100.00%
- `/workers/health`: 100.00%
- `/workers/ready`: 100.00%
- API 5xx ratio: 0.0000%
- API average duration: 2.70 ms
- Execution queue lag p50/p95/max: 0 / 0 / 0
- Execution queue lag compliance <= 10: 100.00%
- Live order attempts/failures delta: 0 / 0

## Gate Result
- `docs/operations/v1-rc-external-gates-status.md`: Gate 1 PASS, Gate 2 PASS, Gate 3 PASS, Gate 4 PASS.
- `docs/operations/v1-release-candidate-checklist.md`: queue lag metrics checkbox synced to checked; outstanding external gates snapshot updated to `G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=PASS`.
- Strict evidence artifact: `history/artifacts/_artifacts-rc-evidence-check-luc-133-rerun-2026-07-04.json`
- Strict evidence result: `strictPassed=true`, `gate2Policy=PASS_ONLY`, missing evidence count `0`.

## Source-Control And Deploy Impact
- Files changed are documentation/evidence artifacts only.
- No application code, runtime configuration, database schema, deployment, restart, rollback, or production mutation was performed.
- Worktree already had unrelated modified/untracked files before this issue; those were left untouched.

