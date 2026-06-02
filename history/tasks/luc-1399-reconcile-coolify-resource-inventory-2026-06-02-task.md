# LUC-1399 Reconcile Coolify Resource Inventory Task

## Context

Soar production has multiple Coolify resources. The active issue was still
blocked even though a same-day read-only Coolify inventory packet existed under
LUC-1371 and the latest issue comment only concerned duplicate-run janitor
cleanup.

## Goal

Reconcile LUC-1399 with the existing redacted Coolify inventory evidence,
refresh the read-only Coolify API projection, promote the verified inventory
into operations source truth, and close the issue with explicit residual risk.

## Constraints

- Do not perform deploy, restart, rollback, env, database, or service mutation.
- Do not print or store secret values, tokens, cookies, credentials, full
  resource ids, database URLs, labels, or proxy config.
- Treat `COOLIFY_SOAR_APP_ID` and single-resource aliases as insufficient for
  Soar production.
- Use project/environment/resource hierarchy.

## Definition Of Done

- LUC-1399 has a reconciled resource inventory packet.
- Operations docs identify the production resource set and resource-by-resource
  verification expectation.
- Current project-id binding status is recorded.
- Paperclip issue receives a clear final disposition.

## Forbidden

- Production mutation.
- Secret disclosure.
- Full UUID disclosure in public issue/docs.
- Assuming one legacy app id represents the whole deployment.

## Stage

- Current stage: verification
- Expected output: reconciliation packet, operations source-truth update, and
  Paperclip issue closure.

## Result Report

- Evidence:
  `history/evidence/luc-1399-coolify-resource-inventory-reconciliation-2026-06-02.md`
- Source-truth update:
  `docs/operations/coolify-vps-deployment-contract.md`
- Verification:
  existing redacted Coolify API inventory from LUC-1371 plus fresh read-only
  Coolify refresh confirm eight production resources: API, Web, four workers,
  PostgreSQL, and Redis.
- Deployment impact: none.
- Residual risk: protected worker readiness remains a separate release gate.
  Earlier project-id binding drift was not reproduced in this heartbeat and is
  retained as a watch item, not an active inventory blocker.
