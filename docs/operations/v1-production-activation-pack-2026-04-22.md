# V1 Production Activation Pack (2026-04-22)

Status: `NOT_READY`

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

- prod release gate snapshot `NOT_READY`:
  - [docs/operations/v1-release-gate-prod-2026-04-22T20-16-25-601Z.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-release-gate-prod-2026-04-22T20-16-25-601Z.md)
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

### Missing Prod Proof Artifacts

1. fresh prod restore-drill evidence is missing
   - expected family: `docs/operations/v1-restore-drill-prod-*.md`
2. fresh prod rollback-proof evidence is missing
   - expected family: `docs/operations/v1-rollback-proof-prod-*.md`

### Human Sign-Off Still Blocked

1. engineering sign-off not recorded
2. product sign-off not recorded
3. operations sign-off not recorded
4. RC owner with rollback authority not assigned in sign-off record

### RC Operational Follow-Up Still Open

1. Gate 2 queue-lag baseline review remains `OPEN`
2. current sign-off record is fresh but still `BLOCKED`

## Activation Decision

V1 is **not ready for formal production activation sign-off** on `2026-04-22`.

The current blocker set is narrow and explicit:

- missing prod restore-drill artifact
- missing prod rollback-proof artifact
- missing named human sign-offs / rollback owner
- RC Gate 2 still open

## Exact Next Commands

1. generate prod restore-drill proof

```bash
pnpm run ops:db:restore-drill:prod
```

2. generate prod rollback proof

```bash
pnpm run ops:deploy:rollback-proof:prod -- --base-url https://api.soar.luckysparrow.ch --auth-token <ADMIN_JWT>
```

3. rebuild prod gate snapshot

```bash
pnpm run ops:release:v1:gate -- --environment prod --dry-run --skip-local-quality --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

4. record named approvers and owner, then rebuild sign-off

```bash
pnpm run ops:rc:signoff:build -- --engineering-name "<name>" --product-name "<name>" --operations-name "<name>" --owner-name "<name>" --owner-contact "<contact>"
pnpm run ops:rc:checklist:sync
```

## Future-Agent Rule

Do not claim V1 activation from stage success, public prod smoke, or fresh docs
alone. The candidate remains blocked until the prod proof artifacts and human
sign-off inputs above exist together on the same day.
