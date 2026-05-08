# V1 Production Activation Evidence Audit (2026-05-08)

## Context
- Environment: production only for V1.
- API URL: `https://api.soar.luckysparrow.ch`
- Web URL: `https://soar.luckysparrow.ch`
- Public web build-info SHA:
  `da1e52cfec0b70e5a94e59d75fe702a55c348d74`
- Latest production release-gate dry-run:
  `docs/operations/v1-release-gate-prod-2026-05-08T05-27-38-139Z.md`

## Evidence Reviewed
- Public build-info for
  `da1e52cfec0b70e5a94e59d75fe702a55c348d74`: PASS on production.
- Public deploy smoke without workers: PASS (`API /health`, `API /ready`,
  `WEB /`).
- V1 release-gate dry-run:
  `docs/operations/v1-release-gate-prod-2026-05-08T05-27-38-139Z.md`.
- RC external gates status:
  `docs/operations/v1-rc-external-gates-status.md`.
- RC sign-off record:
  `docs/operations/v1-rc-signoff-record.md`.
- RC checklist:
  `docs/operations/v1-release-candidate-checklist.md`.
- Previous production restore drill:
  `docs/operations/v1-restore-drill-prod-2026-05-07T18-03-30-000Z.md`.
- Previous production rollback proof:
  `docs/operations/v1-rollback-proof-prod-2026-05-07T18-02-47-935Z.md`.
- No-auth protected runtime freshness probe: failed closed with HTTP `401`.
- No-auth rollback guard probe: returned `shouldRollback=true` due to
  protected runtime freshness and alerts endpoints returning HTTP `401`.
- Names-only environment scan found only `FIGMA_OAUTH_TOKEN` and `IGCCSVC_DB`;
  no Soar production readback, rollback, or DB/Coolify access variables were
  available in this shell.

## Findings
- Production public health and readiness are currently healthy.
- Production web build-info exposes
  `da1e52cfec0b70e5a94e59d75fe702a55c348d74`, which contains the V1 backend
  PAPER/LIVE adapter-pure runtime fix.
- The latest production release-gate dry-run reports `readiness=not_ready`.
- Required production evidence from 2026-05-07 is stale relative to
  2026-05-08:
  - activation evidence audit
  - activation execution plan
  - RC external gates status
  - RC sign-off record
  - RC checklist verification block
  - backup/restore drill evidence
  - rollback proof pack
- Authenticated read-only production runtime evidence for `LIVEIMPORT-03` has
  not been captured in this shell.
- Dry-run release-gate output is useful blocker inventory, but it is not final
  production approval.

## Result
- Status: **NO-GO**
- Required follow-up:
  - capture authenticated `LIVEIMPORT-03` runtime readback evidence
  - refresh production backup/restore drill evidence
  - refresh production rollback proof evidence
  - refresh RC gates, checklist, and sign-off after protected evidence is fresh
  - run the production release gate without `--dry-run`
