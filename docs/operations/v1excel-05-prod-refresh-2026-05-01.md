# V1EXCEL-05 Production Refresh Evidence

Date: 2026-05-01
Environment: production
Scope: production public smoke, protected runtime freshness, rollback guard
Status: PARTIAL PASS

## Summary

Fresh production evidence on 2026-05-01 confirms the current deployed
candidate is publicly reachable and protected runtime rollback checks are
healthy.

This artifact does not claim full `V1EXCEL-05` closure because stage remains
blocked and broader production release evidence families such as restore drill,
RC status/sign-off/checklist rebuild, restore drill, and any required manual
matrix items still need their own current evidence.

No secrets, session tokens, API keys, or account credentials are recorded in
this artifact.

## Deployment Freshness

Source: `https://soar.luckysparrow.ch/api/build-info`

- `gitSha`: `9460317c7d9409062ff2ddd284a179a60ac89f1a`
- `gitRef`: `main`
- `metadataSource`: `env-runtime`
- `checkedAt`: `2026-05-01T01:19:53.294Z`

Note: a later docs-only evidence commit exists after this deployed candidate.
The runtime code under verification is commit `9460317c`.

## Public Production Smoke

Command:

```powershell
pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: PASS

- API `/health`: `200`
- API `/ready`: `200`
- Web `/`: `200`

## Protected Runtime Freshness

Command shape:

```powershell
pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
```

Auth was supplied through the process environment and was not written to disk.

Result: PASS

Checks:

- `workerHeartbeat`: PASS, `ageMs=2480`, threshold `60000`
- `marketData`: PASS, `ageMs=2480`, threshold `120000`
- `runtimeSignalLag`: PASS, `ageMs=0`, threshold `90000`
- `runtimeSessions`: PASS, `runningCount=4`, `staleSessionIds=[]`
- `runtimeDecisionActivity`: SKIP, not required by this gate

## Rollback Guard

Command shape:

```powershell
pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch
```

Auth was supplied through the process environment and was not written to disk.

Result: PASS

- `shouldRollback`: `false`
- `reasons`: none
- `freshness.status`: `PASS`
- `alerts`: none
- `runningCount`: `4`

## Rollback Proof Artifact

Command shape:

```powershell
pnpm run ops:deploy:rollback-proof -- --profile prod --base-url https://api.soar.luckysparrow.ch
```

Auth was supplied through the process environment and was not written to disk
or into the generated artifacts.

Result: PASS

- Report:
  `docs/operations/v1-rollback-proof-prod-2026-05-01T01-29-17-680Z.md`
- Raw JSON:
  `docs/operations/_artifacts-v1-rollback-proof-prod-2026-05-01T01-29-17-680Z.json`
- `commandExitCodeZero`: PASS
- `shouldRollbackFalse`: PASS
- `noCriticalReasons`: PASS
- `freshnessStatusPass`: PASS
- `alertsClear`: PASS

## Remaining Evidence Gaps

- Stage is not available: `stage-api` and `stage` return
  `503 no available server`.
- Full authenticated stage gates must wait for stage service restore/redeploy.
- Production restore-drill evidence was not regenerated in this pass.
- RC external gate status, sign-off, and checklist were not rebuilt in this
  pass.
- Manual operator matrix remains open for the unexecuted `LIVE` and recovery
  scenarios.

## Result

Production public smoke, protected runtime freshness, rollback guard, and
rollback proof artifact are fresh and green for the current deployed runtime
candidate. `V1EXCEL-05` remains open for the broader release evidence families
listed above.
