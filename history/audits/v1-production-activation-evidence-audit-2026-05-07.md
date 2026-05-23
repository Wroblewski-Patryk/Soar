# V1 Production Activation Evidence Audit (2026-05-07)

## Context
- Environment: production only for V1.
- API URL: `https://api.soar.luckysparrow.ch`
- Web URL: `https://soar.luckysparrow.ch`
- Public web build-info SHA:
  `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`
- Latest production release-gate dry-run:
  `history/releases/v1-release-gate-prod-2026-05-07T17-51-30-000Z.md`

## Evidence Reviewed
- Public build-info wait for
  `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`: PASS on later recheck.
- Public API `/health`: PASS (`status=ok`).
- Public API `/ready`: PASS (`status=ready`).
- V1 release-gate dry-run:
  `history/releases/v1-release-gate-prod-2026-05-07T17-51-30-000Z.md`.
- Previous RC external gates status:
  `docs/operations/v1-rc-external-gates-status.md`.
- Previous RC sign-off record:
  `docs/operations/v1-rc-signoff-record.md`.
- Previous RC checklist:
  `docs/operations/v1-release-candidate-checklist.md`.
- Previous production restore drill:
  `history/evidence/v1-restore-drill-prod-2026-05-02T17-49-41-000Z.md`.
- Previous production rollback proof:
  `history/evidence/v1-rollback-proof-prod-2026-05-02T17-54-13-498Z.md`.

## Findings
- Production public health and readiness are currently healthy.
- Production web build-info exposes the collector hardening commit
  `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`.
- The latest production release-gate dry-run reports `readiness=not_ready`.
- Required production evidence from 2026-05-02 is stale relative to
  2026-05-07:
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
