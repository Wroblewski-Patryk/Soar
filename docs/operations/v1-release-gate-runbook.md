# V1 Release Gate Runbook

Date: 2026-04-22  
Scope: local Windows rehearsal and production evidence on the existing Coolify environment; no separate STAGE.

## Purpose

Provide one operator-facing entrypoint that runs the minimum required release
gates in a deterministic order instead of relying on remembered ad hoc command
chains.

## Canonical Command

```bash
pnpm run ops:release:v1:gate -- --environment prod --base-url https://<target-api> --web-base-url https://<target-web> --auth-token <ADMIN_JWT>
```

## Gate Order

1. repository guardrails
2. repository typecheck
3. repository build
4. go-live smoke pack
5. post-deploy smoke endpoints
6. runtime freshness gate
7. rollback guard gate

The gate itself is now only one part of prod readiness. Production activation
also requires fresh proof artifacts for:

- backup/restore drill evidence,
- rollback proof evidence,
- RC external-gates status,
- RC sign-off record,
- RC checklist freshness.

## Dry-Run Rehearsal

```bash
pnpm run ops:release:v1:gate -- --environment local --dry-run --base-url http://localhost:3001 --web-base-url http://localhost:3002
```

## Target-Only Variant

Only after local quality/build/go-live gates passed on the same exact candidate SHA, the owner approved the production window, and the deployment readback matches that SHA:

```bash
pnpm run ops:release:v1:gate -- --environment prod --base-url https://<target-api> --web-base-url https://<target-web> --auth-token <ADMIN_JWT> --skip-local-quality
```

## Evidence Truth

The gate now evaluates required evidence families before claiming readiness.

- `local`: evidence is informational only; dry-run stays available as a non-prod signal.
- `prod`: activation audit, activation plan, RC checklist, RC external-gates
  status, RC sign-off record, backup/restore drill evidence, and rollback proof
  pack must all be fresh for the current day.

If any required family is stale or missing, the gate stays `not_ready`.

## Environment Boundary

The local dry-run is rehearsal only. Soar has no STAGE deployment or second VPS. Production gate output must come from the existing Coolify environment on the approved exact SHA; it cannot be inferred from local or historical stage artifacts.

## Canonical Backup / Rollback Proof Commands

Prod backup/restore drill evidence:

```bash
pnpm run ops:db:restore-drill:prod
```

Prod rollback proof:

```bash
pnpm run ops:deploy:rollback-proof:prod -- --base-url https://api.soar.luckysparrow.ch --auth-token <ADMIN_JWT>
```

Each command emits human-reviewable artifacts under `docs/operations/`, and
prod activation must remain blocked until fresh prod variants exist for the
current day.

## Production Execution Preflight

Before treating the production run as release evidence, verify:

1. The owner separately approved the exact SHA and deployment window.
2. Local Windows gates and protected signed-in user/admin journeys are recorded for that SHA; local PASS remains local evidence.
3. Production backup/restore and rollback proof are ready, migrations are reviewed, and the stop-before-start worker switch can be paused and checked.
4. Coolify readback binds the actual API/Web/worker images to the selected SHA; production health, `/ready`, protected journeys and logs are then checked separately.
5. The operator can access protected OPS routes and keeps real run artifacts distinct from dry-run output.

Unmet preflight points keep production release `NO-GO`.

## Auth Passthrough

Supported options mirror the existing deploy/runtime gate scripts:

- `--auth-token <token>`
- `--auth-email <email> --auth-password <password>`
- `--ops-basic-user <user> --ops-basic-password <password>`
- `--ops-auth-header-name <name> --ops-auth-header-value <value>`

Environment fallbacks:

- `RELEASE_GATE_API_BASE_URL`
- `RELEASE_GATE_AUTH_TOKEN`
- `RELEASE_GATE_AUTH_EMAIL`
- `RELEASE_GATE_AUTH_PASSWORD`
- `RELEASE_GATE_OPS_BASIC_USER`
- `RELEASE_GATE_OPS_BASIC_PASSWORD`
- `RELEASE_GATE_OPS_AUTH_HEADER_NAME`
- `RELEASE_GATE_OPS_AUTH_HEADER_VALUE`

## Related Canonical Docs

- `docs/operations/post-deploy-smoke-checklist.md`
- `docs/operations/deployment-rollback-playbook.md`
- `history/audits/v1-production-activation-evidence-audit-2026-04-22.md`
- `docs/operations/v1-release-candidate-checklist.md`
- `docs/operations/v1-rc-external-gates-runbook.md`
