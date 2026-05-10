# Deploy Freshness - 9c125683

Date: 2026-05-10

## Scope

Record production deploy freshness after the pushed batch ending at
`9c12568379ee77cda9c9e9df39879e141b5615fb`.

This batch includes the prior runtime commit:
`b414e523 feat(exchange): enable live order cancel boundary`.

## Commit

- Full SHA: `9c12568379ee77cda9c9e9df39879e141b5615fb`
- Short SHA: `9c125683`
- Included runtime commit: `b414e523`

## Evidence

- PASS: production Web build-info exposed
  `9c12568379ee77cda9c9e9df39879e141b5615fb` on the follow-up wait.
- PASS: public deploy smoke:
  - API `/health` -> HTTP 200
  - API `/ready` -> HTTP 200
  - Web `/` -> HTTP 200
- BLOCKED as expected: no-secret final V1 preflight public checks passed, but
  protected/formal V1 gates remain missing or stale.
  - Artifact:
    `docs/operations/v1-final-preflight-9c125683-2026-05-10.md`
  - JSON:
    `docs/operations/_artifacts-v1-final-preflight-9c125683-2026-05-10.json`

## Meaning

Production is now proven to contain the canonical exchange-side
`LIVE_ORDER_CANCEL` runtime for Binance and Gate.io that was introduced by
`b414e523`. Public service health is good.

This does not close V1. The remaining blockers are protected or formal release
evidence:

- liveimport readback authentication
- rollback guard authentication
- production DB restore context
- current-day activation evidence
- current-day RC status, sign-off, and checklist
- `LIVEIMPORT-03` runtime readback
- current backup/restore drill
- current rollback proof
- authenticated/admin UI clickthrough

## Supersedes

This supersedes `docs/operations/deploy-lag-b414e523-2026-05-10.md`.
