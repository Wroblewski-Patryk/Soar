# LUC-34 QVE Gate 2 Evidence

Generated UTC: 2026-07-04T20:41:30Z
Agent: 09 QVE

## Scope

- Source repo: `C:/Personal/Projekty/Aplikacje/Soar`
- No deploy, restart, rollback, secret mutation, or raw secret read/print was performed.
- Protected smoke used the approved read-only bindings: `SMOKE_AUTH_EMAIL` and `SMOKE_AUTH_PASSWORD`.
- `SMOKE_AUTH_TOKEN` was absent.

## Git And Deploy Provenance

- Local branch: `main`
- Local HEAD: `331b5e0480d2933a6d5af8619071f227a853e204` (`ops: disable Soar API core dumps in Coolify stack`)
- Deployed production build-info / `origin/main`: `cf9011b43060c52941dae9232e9a1ca4392ca3f2` (`fix: preserve live dca aggregate fallback positions`)
- Source-control risk: local `main` is ahead of deployed production by two commits. Any promotion of `331b5e0` requires the normal push/deploy gate and fresh post-deploy smoke.

## Protected Production Smoke

Command:

```powershell
pnpm run ops:deploy:smoke -- --base-url $env:SOAR_API_BASE_URL --web-base-url $env:SOAR_PROD_BASE_URL --expected-sha cf9011b43060c52941dae9232e9a1ca4392ca3f2
```

Result: PASS

```text
[deploy-smoke] summary
- PASS API /health -> 200
- PASS API /ready -> 200
- PASS WEB / -> 200
- PASS WEB /api/build-info (gitSha=cf9011b43060c52941dae9232e9a1ca4392ca3f2) -> 200 gitSha=cf9011b43060c52941dae9232e9a1ca4392ca3f2
- PASS API /workers/ready -> 200
[deploy-smoke] all checks passed
```

## Strict RC Gate Check

Command:

```powershell
pnpm run ops:rc:gates:evidence:check:strict:prod -- --json --output history/artifacts/_artifacts-rc-evidence-check-luc-34-qve-2026-07-04.json
```

Result: FAIL as a precise remaining Gate 2 blocker.

```json
{
  "gateLabels": {
    "gate1": "PASS",
    "gate2": "OPEN",
    "gate3": "PASS",
    "gate4": "PASS"
  },
  "missing": [
    "Gate2 status is not PASS (current: OPEN)"
  ],
  "strictPassed": false,
  "gate2Policy": "PASS_ONLY"
}
```

Runbook interpretation: `docs/operations/v1-rc-external-gates-runbook.md` defines Gate 2 as the production queue-lag baseline review. The current `docs/operations/v1-rc-external-gates-status.md` still reports Gate 2 `OPEN` from the older SLO artifact `history/operations/_artifacts-slo-window-2026-05-25T03-47-13-943Z.json` and instructs a fresh SLO artifact/status refresh.

## QVE Disposition

- Implemented and verified: protected production smoke, build-info SHA match for deployed `cf9011b4`, and `/workers/ready -> 200`.
- Blocked by error/policy state: strict RC Gate 2 remains `OPEN` until a fresh production SLO/queue-lag baseline artifact is collected or accepted, `v1-rc-external-gates-status.md` is regenerated to Gate 2 `PASS`, and the strict production evidence check passes.
- Next owner: 09 DRE for production SLO collection/status refresh, then 09 QVE for final strict RC verification.
