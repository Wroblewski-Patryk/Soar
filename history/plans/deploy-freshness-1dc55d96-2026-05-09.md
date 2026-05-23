# Deploy Freshness Evidence - 1dc55d96

Date: 2026-05-09  
Target: production Coolify/VPS  
Web base URL: `https://soar.luckysparrow.ch`  
API base URL: `https://api.soar.luckysparrow.ch`  
Expected SHA: `1dc55d9623bab11dacb5b9f8ce9634778c139249`

## Summary

Production Web build-info exposes the Gate.io PAPER pricing enablement batch
`1dc55d9623bab11dacb5b9f8ce9634778c139249`.

Public API/Web smoke passed for the same deployed candidate:

- API `/health`: PASS
- API `/ready`: PASS
- Web `/`: PASS

The no-secret final V1 preflight also passed build-info and public smoke, then
correctly remained `BLOCKED` on protected/formal release evidence:

- missing `LIVEIMPORT-03` auth/readback
- missing rollback guard auth
- missing production DB restore context for a 2026-05-09 restore artifact
- failed RC Gate 4 evidence/sign-off/checklist
- stale 2026-05-08 restore and rollback proof evidence for the current
  evidence date

## Commands

```powershell
node scripts\waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 1dc55d9623bab11dacb5b9f8ce9634778c139249 --timeout-seconds 300 --interval-seconds 15
node scripts\deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
node scripts\runV1FinalPreflight.mjs --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha 1dc55d9623bab11dacb5b9f8ce9634778c139249 --today 2026-05-09 --json-output history/artifacts/_artifacts-v1-final-preflight-1dc55d96-2026-05-09.json --markdown-output history/releases/v1-final-preflight-1dc55d96-2026-05-09.md
```

## Result

- Build-info: PASS on attempt 1.
- Public smoke: PASS.
- No-secret final preflight: BLOCKED after public checks PASS.

## Deployment Impact

Gate.io public PAPER pricing is now deploy-fresh on production. This does not
enable Gate.io LIVE trading, authenticated reads, API-key probe, live submit,
or exchange-side cancel.

## Follow-Up

Use this SHA as the current deployed candidate for Gate.io PAPER UI/API
clickthrough. Continue protected V1 release evidence only after the operator
provides the required app auth, rollback auth, production DB/Coolify context,
and RC approver identities.
