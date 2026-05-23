# Deploy Freshness Evidence: `90cd07d6`

Date: 2026-05-08

## Summary

Production Web build-info now exposes the pushed `main` batch ending at
`90cd07d602f0a31f315719b8a5cd5be3fd112313`.

This confirms the deployed production Web target includes the Gate.io
fail-closed regression batch through:

- `EXCHANGE2-10` Web capability gating
- `EXCHANGE2-11` Gate.io wallet/bot UI gating
- `EXCHANGE2-12` Gate.io wallet create fail-closed
- `EXCHANGE2-13` Gate.io wallet update fail-closed
- `EXCHANGE2-14` Gate.io stored API-key probe fail-closed
- `EXCHANGE2-15` Gate.io wallet balance preview fail-closed
- `EXCHANGE2-16` Gate.io positions snapshot fail-closed
- `EXCHANGE2-17` Gate.io open-orders/trade-history snapshot fail-closed
- `EXCHANGE2-18` Gate.io live submit boundary fail-closed
- `EXCHANGE2-19` exchange-backed cancel route fail-closed

## Commands

```powershell
node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 90cd07d6 --timeout-seconds 900 --interval-seconds 30
```

Result:

```text
[wait:web-build-info] attempt=1 status=200 gitSha=9382d9317a5ae82d404559398922a253bef9e697 expected=90cd07d6
[wait:web-build-info] attempt=2 status=200 gitSha=90cd07d602f0a31f315719b8a5cd5be3fd112313 expected=90cd07d6
[wait:web-build-info] PASS
```

```powershell
node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result:

```text
[deploy-smoke] summary
- PASS API /health -> 200
- PASS API /ready -> 200
- PASS WEB / -> 200
[deploy-smoke] all checks passed
```

## Interpretation

- Deploy freshness: PASS
- Public production API health: PASS
- Public production API readiness: PASS
- Public production Web root: PASS
- Protected/authenticated production module clickthrough: still BLOCKED until
  authenticated/admin production app access is available.
- Gate.io `PAPER_PRICING_FEED`, authenticated reads, live submit, and
  exchange-side cancel: still intentionally disabled unless exact operation
  support is implemented and verified.
