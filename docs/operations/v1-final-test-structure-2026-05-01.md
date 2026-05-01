# V1 Final Test Structure

Date: 2026-05-01
Status: READY FOR EXECUTION AFTER DEPLOY FRESHNESS

## Purpose

Provide one execution structure for the final V1 confidence pass after the
latest `main` runtime hardening reaches production. This prevents V1 from being
declared on stale deployed code or partial local evidence.

## Current Freshness Check

Commands run on 2026-05-01:

```powershell
pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: PASS

- API `/health`: `200`
- API `/ready`: `200`
- Web `/`: `200`

Production build-info:

- `gitSha`: `c081f224134fedb65de2ecad716274b92593c373`
- `gitRef`: `main`
- `metadataSource`: `env-runtime`
- `checkedAt`: `2026-05-01T02:21:14.922Z`

Current repository head:

- `577c45a8 fix(api-runtime): harden live close reopen state`

Conclusion:

- Production is healthy but stale for the latest money-path runtime fix.
- `V1DOGE-02` post-deploy verification must not be claimed until production
  build-info reports `577c45a8` or a later commit that includes it.

Stage check:

```powershell
pnpm run ops:deploy:smoke -- --api-base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch --no-workers
```

Result: FAIL

- API `/health`: `503`
- API `/ready`: `503`
- Web `/`: `503`

Conclusion:

- Stage remains unavailable and cannot be used for V1 release-gate evidence
  until Coolify stage services are restored or redeployed.

## Required Gate Order

### Gate 0: Deploy Freshness

Pass condition:

- production build-info `gitSha` is `577c45a8` or later and includes
  `V1DOGE-02`.
- production public smoke passes.
- stage either passes or remains explicitly documented as an environment
  blocker, not a product-code blocker.

Commands:

```powershell
pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Protected checks, with auth supplied only through process environment:

```powershell
pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch
```

### Gate 1: DOGE Runtime Regression Verification

Pass condition:

- active production runtime payload for DOGE-style `LIVE` futures positions no
  longer shows stale DCA after a same-symbol close/reopen lifecycle.
- previous lifecycle keeps its own DCA history.
- runtime close trades/orders preserve `strategyId`.
- runtime events include the new close decision snapshot when automated close
  authority executes.

Evidence to capture:

- current runtime `Positions` payload for the active `LIVE` bot.
- current runtime `History`/trades payload for `DOGEUSDT`.
- runtime event sample containing `SIGNAL_DECISION` or documented absence if no
  close happened after deploy.
- build-info SHA.

Fail condition:

- fresh same-symbol open carries stale DCA levels from a prior closed
  lifecycle.
- close trade lacks `strategyId` after the fixed deployment.
- automated close has no explainable runtime event when one occurred after
  deploy.

### Gate 2: V1EXCEL Production Evidence

Pass condition:

- production public smoke passes.
- protected runtime freshness passes.
- rollback guard returns `shouldRollback=false`.
- rollback proof artifact is regenerated for the current deployed SHA.
- RC status/sign-off/checklist are rebuilt from current evidence.

Commands:

```powershell
pnpm run ops:deploy:rollback-proof -- --profile prod --base-url https://api.soar.luckysparrow.ch
pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-go-live-smoke
```

The full gate must not be marked green if it consumes stale evidence from a
different production SHA.

### Gate 3: Manual Operator Matrix

Pass condition:

- browser-side PAPER action proof is executed or explicitly waived by the
  release owner because API-plus-UI-state proof is sufficient.
- LIVE exchange-authority cases are executed by an authorized operator:
  - manual LIVE open,
  - manual LIVE close,
  - external pending order visibility until fill,
  - exchange-side intervention,
  - restart/recovery truth.

Evidence source:

- `docs/operations/v1excel-manual-verification-matrix-2026-04-29.md`
- `docs/operations/v1live-mixed-origin-verification-matrix-2026-04-29.md`

### Gate 4: Final GO / NO-GO

Pass condition:

- all hard blockers in `DEPLOYMENT_GATE.md` are false.
- applicable `DEFINITION_OF_DONE.md` requirements are backed by current
  evidence.
- remaining stage blocker, if still present, is explicitly accepted by the
  release owner or keeps the decision at `NO-GO`.

Output artifacts:

- fresh production evidence report
- updated manual matrix
- RC gate status
- sign-off record
- final V1 GO/NO-GO record

## Current Blockers

- Production has not yet deployed `577c45a8`.
- Stage still returns `503 no available server`.
- Manual LIVE exchange-authority scenarios are not executed in the current
  evidence set.
- Restore drill and RC rebuild are still missing for the latest deployed SHA.

## Next Smallest Executable Task

After Coolify deploys `577c45a8` or later to production:

1. run Gate 0 production freshness checks,
2. run Gate 1 DOGE runtime regression verification,
3. publish a new production evidence artifact,
4. only then continue broader `V1EXCEL-05` closure.
