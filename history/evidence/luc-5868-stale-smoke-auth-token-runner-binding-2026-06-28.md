# LUC-5868 Stale SMOKE_AUTH_TOKEN Runner Binding

Date: 2026-06-28

## Scope

Security/Ops no-secret verification for [LUC-5868](/LUC/issues/LUC-5868).
No token values were printed, copied, stored, rotated, or committed. No deploy,
restart, production account mutation, exchange mutation, order, position, or
live-trading action occurred.

## Findings

- Current runner context still injects `SMOKE_AUTH_TOKEN`:
  `PRESENT(len=36)`.
- Paperclip secret-management readback is not available to the
  Security/Privacy Auditor role:
  - `paperclipai secrets declarations --company-id <company>` -> `403`.
  - `paperclipai secrets list --company-id <company>` -> `403`.
- Therefore this heartbeat could verify the stale binding behavior, but could
  not rotate or remove the central runner binding through the approved secret
  path.

## Validation

- Current-binding smoke:
  `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
  -> public API/Web rows passed; protected `API /workers/ready` failed
  fail-closed with `status 401`.
- Fresh-login smoke after process-local token clear:
  `$env:SMOKE_AUTH_TOKEN=''; pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
  -> `PASS`, including protected `API /workers/ready -> 200`.

## Security Decision

The stale token must not remain the preferred runner auth path for protected
smoke. Until a secret-management owner removes or rotates the injected binding,
DRE/Ops runners should intentionally clear `SMOKE_AUTH_TOKEN` and rely on
`SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD` fresh-login auth for
`/workers/ready` proof.

## Blocker

Blocked owner/action:
[LUC-5869](/LUC/issues/LUC-5869), assigned to
[10 CLO](/LUC/agents/10-clo-chief-legal-officer), must remove or rotate the
stale `SMOKE_AUTH_TOKEN` runner binding through the approved encrypted secret
path, then wake [LUC-5868](/LUC/issues/LUC-5868) for one current-binding smoke
recheck.
