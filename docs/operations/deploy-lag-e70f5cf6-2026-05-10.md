# Deploy Lag - e70f5cf6

Date: 2026-05-10

## Scope

Record production deploy freshness after protected-input readiness was pushed.

## Commit

- Full SHA: `e70f5cf6229d6fc4d26ea0342b81baab80851800`
- Commit: `docs(ops): record v1 protected input readiness`

## Evidence

- BLOCKED: production Web build-info did not expose `e70f5cf6` during two
  bounded 600-second wait windows.
- Last observed production Web build-info:
  `40e9b3c35c96d4acced73bbab980039f9e6b6a22`.
- PASS: public deploy smoke after the second timeout:
  - API `/health` -> HTTP 200
  - API `/ready` -> HTTP 200
  - Web `/` -> HTTP 200

## Resolution

Superseded on 2026-05-10 by the Coolify operator recovery recorded in
`docs/operations/coolify-deploy-queue-recovery-33a2ebc4-2026-05-10.md`.
Production Web build-info later exposed
`33a2ebc468be3dbfab7c784f375672ebead5ae16`, stale `soar-api` jobs were
cancelled, one fresh `soar-api` redeploy finished on the same SHA, public
API/Web smoke passed, and the Coolify queue was empty.

## Meaning

The protected-input readiness commit is pushed to `main`, but production is
not yet proven to contain that documentation/status update.

Historical note: at the time this artifact was created it was a
deploy-freshness blocker, not a public service health failure. It is no longer
the active production blocker after the `33a2ebc4` recovery.
