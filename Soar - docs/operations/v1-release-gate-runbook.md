# V1 Release Gate Runbook

Date: 2026-04-22  
Scope: one canonical command for local and target-environment V1 release gating

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

When local quality/build/go-live gates already passed earlier in CI or on the
same candidate SHA:

```bash
pnpm run ops:release:v1:gate -- --environment stage --base-url https://<target-api> --web-base-url https://<target-web> --auth-token <ADMIN_JWT> --skip-local-quality
```

## Evidence Truth

The gate now evaluates required evidence families before claiming readiness.

- `local`: evidence is informational only; dry-run stays available as a non-prod signal.
- `stage`: activation audit and activation plan must be fresh for the current day.
- `prod`: activation audit, activation plan, RC checklist, RC external-gates
  status, RC sign-off record, backup/restore drill evidence, and rollback proof
  pack must all be fresh for the current day.

If any required family is stale or missing, the gate stays `not_ready`.

## Canonical Stage Rehearsal Path

```bash
pnpm run ops:release:v1:stage-rehearsal -- --base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch --auth-token <ADMIN_JWT>
```

Dry-run variant when the target environment or credentials are not available:

```bash
pnpm run ops:release:v1:stage-rehearsal -- --dry-run --base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch
```

Both commands emit release-gate and stage-rehearsal artifacts under
`docs/operations/`.

## Canonical Backup / Rollback Proof Commands

Prod backup/restore drill evidence:

```bash
pnpm run ops:db:restore-drill:prod
```

Stage rollback proof:

```bash
pnpm run ops:deploy:rollback-proof:stage -- --base-url https://stage-api.soar.luckysparrow.ch --auth-token <ADMIN_JWT>
```

Prod rollback proof:

```bash
pnpm run ops:deploy:rollback-proof:prod -- --base-url https://api.soar.luckysparrow.ch --auth-token <ADMIN_JWT>
```

Each command emits human-reviewable artifacts under `docs/operations/`, and
prod activation must remain blocked until fresh prod variants exist for the
current day.

## Stage Execution Preflight

Before treating stage rehearsal as real evidence, confirm all of the following:

1. domain mapping is correct for the current deployment:
   - API: `https://stage-api.soar.luckysparrow.ch`
   - Web: `https://stage.soar.luckysparrow.ch`
2. the target SHA/build is already deployed on stage,
3. OPS auth is available in one canonical form:
   - `--auth-token <ADMIN_JWT>`, or
   - `--auth-email <email> --auth-password <password>`, or
   - OPS private-route protection via `--ops-basic-user/--ops-basic-password`,
   - optional private-route header via `--ops-auth-header-name/--ops-auth-header-value`
4. stage workers are expected to be online and reporting:
   - `/workers/health`
   - `/workers/runtime-freshness`
5. the operator is ready to keep the generated artifacts from the real run and
   not mix them with dry-run-only output.

If any preflight point is unresolved, stage evidence remains `BLOCKED` by
design.

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
