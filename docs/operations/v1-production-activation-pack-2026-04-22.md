# V1 Production Activation Pack (2026-04-22)

Status: `APPROVED`

## Purpose

Provide one human-reviewable activation packet for the current V1 candidate
after `REVIEW-D`, `V1FACT-A2`, `V1FACT-07B`, and `V1FACT-A3`.

## Candidate Context

- Target SHA: `49ea8e0c`
- API:
  - stage: `https://stage-api.soar.luckysparrow.ch`
  - prod: `https://api.soar.luckysparrow.ch`
- Web:
  - stage: `https://stage.soar.luckysparrow.ch`
  - prod: `https://soar.luckysparrow.ch`

## Fresh Evidence

### Activation Contract / Planning

- activation contract:
  - [docs/architecture/reference/v1-production-activation-contract.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/architecture/reference/v1-production-activation-contract.md)
- activation plan:
  - [docs/planning/v1-production-activation-and-evidence-plan-2026-04-22.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/planning/v1-production-activation-and-evidence-plan-2026-04-22.md)
- freshness audit:
  - [docs/operations/v1-production-activation-evidence-audit-2026-04-22.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-production-activation-evidence-audit-2026-04-22.md)

### Stage Evidence

- stage release gate `READY`:
  - [docs/operations/v1-release-gate-stage-2026-04-22T19-15-59-493Z.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-release-gate-stage-2026-04-22T19-15-59-493Z.md)
- stage rehearsal `PASS`:
  - [docs/operations/v1-stage-rehearsal-2026-04-22T19-15-59-493Z.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-stage-rehearsal-2026-04-22T19-15-59-493Z.md)
- stage rollback proof `PASS`:
  - [docs/operations/v1-rollback-proof-stage-2026-04-22T20-13-00-826Z.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-rollback-proof-stage-2026-04-22T20-13-00-826Z.md)

### Production Readiness Snapshot

- prod release gate snapshot `READY`:
  - [docs/operations/v1-release-gate-prod-2026-04-22T22-34-05-835Z.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-release-gate-prod-2026-04-22T22-34-05-835Z.md)
- prod rollback proof `PASS`:
  - [docs/operations/v1-rollback-proof-prod-2026-04-22T21-06-24-347Z.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-rollback-proof-prod-2026-04-22T21-06-24-347Z.md)
- prod restore-drill proof `PASS`:
  - [docs/operations/v1-restore-drill-prod-2026-04-22T22-31-28-000Z.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-restore-drill-prod-2026-04-22T22-31-28-000Z.md)
- fresh RC external-gates status:
  - [docs/operations/v1-rc-external-gates-status.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-rc-external-gates-status.md)
- fresh RC sign-off record:
  - [docs/operations/v1-rc-signoff-record.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-rc-signoff-record.md)
- fresh RC checklist:
  - [docs/operations/v1-release-candidate-checklist.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-release-candidate-checklist.md)

### Deployed Runtime Notes

- production API and web were deployed on SHA `49ea8e0c`
- public prod smoke passed for:
  - `GET /health`
  - `GET /ready`
  - `GET /` on web
- protected prod worker/runtime probes were validated from inside the prod API
  runtime:
  - `/workers/health` `200`
  - `/workers/runtime-freshness` `200 PASS`
  - `/alerts` `200`

## Explicit Blockers

- none

## Activation Decision

V1 is **approved for formal production activation sign-off** on `2026-04-22`
from the current repository evidence set.

All four RC gates are now closed:

- `G1=PASS`
- `G2=PASS`
- `G3=PASS`
- `G4=PASS`

## Exact Next Commands

1. keep the fresh prod rollback proof as current reference if deploy/runtime state changes

```bash
pnpm run ops:deploy:rollback-proof:prod -- --base-url https://api.soar.luckysparrow.ch --auth-email <OPS_ADMIN_EMAIL> --auth-password <OPS_ADMIN_PASSWORD>
```

2. if sign-off metadata changes, rebuild the sign-off record

```bash
pnpm run ops:rc:signoff:build -- --engineering-name "<name>" --product-name "<name>" --operations-name "<name>" --owner-name "<name>" --owner-contact "<contact>"
```

3. if any gate artifact changes, resync checklist/state

```bash
pnpm run ops:rc:checklist:sync
```

## Future-Agent Rule

Do not claim V1 activation from stage success, public prod smoke, or fresh docs
alone. Approval remains valid only while the prod proof artifacts and sign-off
record stay fresh and internally consistent.
