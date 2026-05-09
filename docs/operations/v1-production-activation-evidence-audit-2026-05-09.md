# V1 Production Activation Evidence Audit (2026-05-09)

## Context
- Environment: production only for V1.
- API URL: `https://api.soar.luckysparrow.ch`
- Web URL: `https://soar.luckysparrow.ch`
- Public Web build-info SHA:
  `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`
- Current no-secret final preflight:
  `docs/operations/v1-final-preflight-6c54bb5d-2026-05-09.md`
- Public/unauthenticated production UI access audit:
  `docs/operations/prod-ui-public-access-clickthrough-6c54bb5d-2026-05-09.md`

## Evidence Reviewed
- Public build-info for
  `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`: PASS on production.
- Public deploy smoke without workers: PASS (`API /health`, API `/ready`,
  and Web `/`) from the final preflight.
- Public/unauthenticated production UI access: PASS for public routes and
  fail-closed protected-route redirects.
- V1 final no-secret preflight:
  `docs/operations/v1-final-preflight-6c54bb5d-2026-05-09.md`.
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
- Production Web build-info exposes the current source-of-truth synchronization
  batch: `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`.
- Public/unauthenticated production access is healthy, and protected
  dashboard/admin routes redirect to `/auth/login` without a session.
- The current no-secret final preflight reports release status `BLOCKED`.
- Required 2026-05-09 production release evidence is still incomplete:
  - authenticated `LIVEIMPORT-03` runtime readback is missing
  - live-import auth is missing
  - rollback guard auth is missing
  - production DB restore context is missing for a fresh restore refresh
  - RC external gates status is fresh for 2026-05-09 but failed/open
  - RC sign-off record is fresh for 2026-05-09 but not approved
  - RC checklist is fresh for 2026-05-09 but not all gates pass
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
