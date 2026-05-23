# V1EXCEL - Production Post-Deploy Check

Status: partial-pass
Date: 2026-04-29
Owner: Codex Execution Agent
Candidate SHA: `4514894127ad07cbe95415043658e10b8c0cf75d`

## Purpose

Capture the first post-redeploy production verification after pushing the
`V1EXCEL` evidence pack to `main`.

## Executed Checks

### Public production smoke

```powershell
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS WEB `/` -> `200`

### Protected runtime freshness probe without OPS auth

```powershell
pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
```

Result:

- FAIL with HTTP `401`

### Protected rollback-guard probe without OPS auth

```powershell
pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch
```

Result:

- `shouldRollback=true`
- reasons:
  - `runtime_freshness_endpoint_http_401`
  - `alerts_endpoint_http_401`

## Conclusion

The redeployed public production surface is healthy for baseline smoke on the
new candidate SHA.

The remaining blocker is unchanged:

- protected production runtime and alert diagnostics still require OPS/private-route auth

This means the redeploy did not introduce a new public regression, but it also
did not eliminate the external-evidence blocker behind the current `NO-GO`
decision.

