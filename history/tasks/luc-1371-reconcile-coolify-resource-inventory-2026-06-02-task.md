# LUC-1371 Reconcile Coolify Resource Inventory

## Header

- ID: `LUC-1371`
- Title: `[Ops][Soar] Reconcile Coolify resource inventory`
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: read-only Coolify credentials
- Priority: P0
- Module Confidence Rows: Ops/deployment resource inventory
- Requirement Rows: production resource-by-resource verification readiness
- Quality Scenario Rows: deployment observability and release safety
- Risk Rows: Coolify project binding drift; single-resource deploy verification
- Iteration: 2026-06-02 heartbeat
- Operation Mode: BUILDER
- Mission ID: `LUC-1371`
- Mission Status: VERIFIED

## Mission Block

- Mission objective: Complete a redacted Soar production Coolify resource inventory.
- Release objective advanced: enable post-push auto-redeploy verification per resource.
- Included slices: read-only project discovery, production environment readback,
  resource count reconciliation, redacted evidence packet, Paperclip disposition.
- Explicit exclusions: deploy, restart, rollback, env change, database mutation,
  secret readback, credentials disclosure.
- Checkpoint cadence: one heartbeat, close with durable evidence.
- Stop conditions: missing Coolify auth, missing Soar project, secret exposure risk,
  production mutation request without permit.
- Handoff expectation: Paperclip may update the Coolify resource ledger and use
  the inventory for resource-by-resource post-push verification.

## Context

Soar production has multiple Coolify deployable resources. Release verification
must not rely on one legacy app id. The expected current shape was six
application/service resources plus Postgres and Redis unless a newer ledger
showed otherwise.

## Goal

Use read-only Coolify access to list the Soar production resource inventory and
store redacted resource names, types, and statuses without exposing secrets.

## Constraints

- Use existing Paperclip/Coolify credentials only through environment bindings.
- Do not print or persist secret values.
- Do not mutate production resources.
- Do not assume one app id represents the whole deployment.
- Record config drift if discovered.

## Definition of Done

- [x] Soar project can be found through Coolify API.
- [x] Production environment resource inventory is captured.
- [x] Redacted evidence stores resource name, type, status, and minimal release
      metadata.
- [x] Config drift is recorded.
- [x] Paperclip issue receives a final disposition.

## Validation Evidence

- Tests: not applicable; read-only production inventory task.
- Manual checks:
  - Coolify `GET /api/v1/projects` returned project `Soar`.
  - Coolify `GET /api/v1/projects/{listed-soar-uuid}/production` returned the
    environment resource hierarchy.
  - Allowlisted projection produced 6 applications, 0 services, 1 PostgreSQL,
    1 Redis, total 8 resources.
- Screenshots/logs: not used.
- High-risk checks:
  - No deploy/restart/rollback/env/database mutation performed.
  - Secret-bearing Coolify fields excluded from stored evidence.
- Reality status: verified.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none performed.
- Health-check impact: none.
- Smoke steps updated: resource inventory now supports per-resource post-push
  verification planning.
- Rollback note: not applicable; no production mutation.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Result Report

LUC-1371 is complete. Current Soar production Coolify inventory is six
applications plus one PostgreSQL and one Redis resource. The configured
`COOLIFY_SOAR_PROJECT_ID` binding did not match the API-listed Soar project UUID
in this runner and should be refreshed by Ops/Security before project-scoped
automation depends on it.
