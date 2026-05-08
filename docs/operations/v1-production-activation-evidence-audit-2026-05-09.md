# V1 Production Activation Evidence Audit (2026-05-09)

## Context
- Environment: production only for V1.
- API URL: `https://api.soar.luckysparrow.ch`
- Web URL: `https://soar.luckysparrow.ch`
- Public Web build-info SHA:
  `90cd07d602f0a31f315719b8a5cd5be3fd112313`
- Current no-secret final preflight:
  `docs/operations/v1-final-preflight-90cd07d6-2026-05-09.md`
- Public/unauthenticated production UI access audit:
  `docs/operations/prod-ui-public-access-clickthrough-90cd07d6-2026-05-09.md`

## Evidence Reviewed
- Public build-info for
  `90cd07d602f0a31f315719b8a5cd5be3fd112313`: PASS on production.
- Public deploy smoke without workers: PASS (`API /health`, API `/ready`,
  and Web `/`) from the final preflight.
- Public/unauthenticated production UI access: PASS for public routes and
  fail-closed protected-route redirects.
- V1 final no-secret preflight:
  `docs/operations/v1-final-preflight-90cd07d6-2026-05-09.md`.
- RC external gates status:
  `docs/operations/v1-rc-external-gates-status.md`.
- RC sign-off record:
  `docs/operations/v1-rc-signoff-record.md`.
- RC checklist:
  `docs/operations/v1-release-candidate-checklist.md`.
- Previous production restore drill:
  `docs/operations/v1-restore-drill-prod-2026-05-08T15-16-24Z.md`.
- Previous production rollback proof:
  `docs/operations/v1-rollback-proof-prod-2026-05-08T15-30-28-231Z.md`.

## Findings
- Production public health and readiness are currently healthy.
- Production Web build-info exposes the deployed Gate.io fail-closed batch:
  `90cd07d602f0a31f315719b8a5cd5be3fd112313`.
- Public/unauthenticated production access is healthy, and protected
  dashboard/admin routes redirect to `/auth/login` without a session.
- The current no-secret final preflight reports release status `BLOCKED`.
- Required 2026-05-09 production release evidence is still incomplete:
  - authenticated `LIVEIMPORT-03` runtime readback is missing
  - live-import auth is missing
  - rollback guard auth is missing
  - production DB restore context is missing for a fresh restore refresh
  - RC external gates status is stale for 2026-05-09
  - RC sign-off record is stale for 2026-05-09 and not approved
  - RC checklist is stale for 2026-05-09
  - backup/restore drill evidence is stale for 2026-05-09
  - rollback proof pack is stale for 2026-05-09
- Public smoke and no-auth route checks are useful readiness signals, but they
  are not final production approval.

## Result
- Status: **NO-GO**
- Required follow-up:
  - capture authenticated `LIVEIMPORT-03` runtime readback evidence
  - refresh production backup/restore drill evidence
  - refresh production rollback proof evidence
  - refresh RC gates, checklist, and sign-off after protected evidence is fresh
  - run the production release gate without `--dry-run`
