---
type: history_index
status: canonical
area: operations
last_verified: 2026-05-23
---

# Operations History

This folder contains dated operational evidence, generated artifacts, audit
reports, release packets, smoke results, SLO observations, restore/rollback
proofs, and production readbacks that used to live in `docs/operations/`.

Use this folder when you need proof, audit trail, or historical release context.
For current operating procedures, start from:

- [Post-deploy smoke checklist](../../docs/operations/post-deploy-smoke-checklist.md)
- [Deployment rollback playbook](../../docs/operations/deployment-rollback-playbook.md)
- [Service reliability and observability](../../docs/operations/service-reliability-and-observability.md)
- [Coolify Linux VPS setup guide](../../docs/operations/coolify-linux-vps-setup-guide.md)
- [V1 release gate runbook](../../docs/operations/v1-release-gate-runbook.md)
- [V1 RC external gates runbook](../../docs/operations/v1-rc-external-gates-runbook.md)

## Evidence Policy

- Generated proof belongs here by default.
- Living runbooks, checklists, operator guides, and current gate templates stay
  in `docs/operations/`.
- Historical evidence may be cited by state files and module ledgers, but it
  must not redefine current architecture.
