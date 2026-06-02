# LUC-1371 Soar Coolify Resource Inventory Task

## Context

Soar production has multiple Coolify resources. Paperclip needs resource-level inventory before post-push auto-redeploy verification can avoid treating a legacy single app id as the whole deployment.

## Goal

Reconcile Soar production Coolify project/environment resources with read-only API access and store redacted names, types, statuses, and evidence.

## Constraints

- Do not perform deploy, restart, rollback, env, database, or service mutation.
- Do not print or store secret values, tokens, cookies, credentials, or full resource ids.
- Treat `COOLIFY_SOAR_APP_ID` and other single-resource aliases as insufficient for Soar production.
- Use project/environment/resource hierarchy.

## Definition Of Done

- Soar project and production environment are identified without exposing full ids.
- The production resource inventory lists resource roles, Coolify type, redacted name, status, and environment.
- Evidence records commands/endpoints used and residual config caveats.
- Paperclip issue receives a clear final disposition.

## Forbidden

- Production mutation.
- Secret disclosure.
- Full UUID disclosure in public issue/docs.
- Assuming one legacy app id represents the whole deployment.

## Stage

- Current stage: verification
- Expected output: redacted inventory evidence packet and Paperclip issue update.

## Result Report

- Evidence: `history/evidence/luc-1371-coolify-resource-inventory-2026-06-02.md`
- Verification: read-only Coolify API list endpoints returned Soar production project/environment resources.
- Result: confirmed 8 canonical Soar production resources: API, Web, four workers, PostgreSQL, and Redis.
- Deployment impact: none.
- Residual risk: `COOLIFY_SOAR_PROJECT_ID` binding is stale/placeholder in this shell and should be corrected before future project-scoped automation depends on it.
