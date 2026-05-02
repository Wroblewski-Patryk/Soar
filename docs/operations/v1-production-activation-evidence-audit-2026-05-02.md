# V1 Production Activation Evidence Audit (2026-05-02)

## Context
- Environment: production only for V1.
- Coolify project: Soar / production / Root Team.
- API URL: `https://api.soar.luckysparrow.ch`
- Web URL: `https://soar.luckysparrow.ch`
- Production database container: `x11cfnz1dd9x0yzccftqzcoe`
- Redis container: `tsij579cy1kfcuxs8onbbxll`

## Evidence Reviewed
- RC external gates status: `docs/operations/v1-rc-external-gates-status.md`
- RC sign-off record: `docs/operations/v1-rc-signoff-record.md`
- RC checklist: `docs/operations/v1-release-candidate-checklist.md`
- Production restore drill: `docs/operations/v1-restore-drill-prod-2026-05-02T17-49-41-000Z.md`
- Production rollback proof: `docs/operations/v1-rollback-proof-prod-2026-05-02T17-54-13-498Z.md`
- Production release gate attempt: `docs/operations/v1-release-gate-prod-2026-05-02T17-54-17-880Z.md`
- Final production release gate: `docs/operations/v1-release-gate-prod-2026-05-02T17-56-17-239Z.md`

## Findings
- Production DB restore evidence is present and PASS. The drill created a compressed backup from the production `postgres` database, restored it into an isolated temporary database, validated key table counts, and removed temporary artifacts.
- Production runtime evidence is present and PASS. Protected worker health returned `200`; runtime freshness returned `PASS`; rollback guard returned `shouldRollback=false` with no reasons and no alerts.
- The first release gate execution was non-dry-run and all runtime steps passed, but its readiness remained `not_ready` because the canonical activation audit and activation plan artifacts from 2026-04-22 were stale relative to 2026-05-02.
- After refreshing the current production-only activation audit and plan, the final non-dry-run production release gate passed with readiness `ready`.

## Result
- Status: **PASS**
- Required follow-up: none for V1 production release evidence.
