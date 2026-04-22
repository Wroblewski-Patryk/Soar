# V1 Release Gate Runbook

Date: 2026-04-22  
Scope: one canonical command for local and target-environment V1 release gating

## Purpose

Provide one operator-facing entrypoint that runs the minimum required release
gates in a deterministic order instead of relying on remembered ad hoc command
chains.

## Canonical Command

```bash
pnpm run ops:release:v1:gate -- --base-url https://<target-api> --auth-token <ADMIN_JWT>
```

## Gate Order

1. repository guardrails
2. repository typecheck
3. repository build
4. go-live smoke pack
5. post-deploy smoke endpoints
6. runtime freshness gate
7. rollback guard gate

## Dry-Run Rehearsal

```bash
pnpm run ops:release:v1:gate -- --dry-run --base-url http://localhost:3001
```

## Target-Only Variant

When local quality/build/go-live gates already passed earlier in CI or on the
same candidate SHA:

```bash
pnpm run ops:release:v1:gate -- --base-url https://<target-api> --auth-token <ADMIN_JWT> --skip-local-quality
```

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
- `docs/operations/v1-release-candidate-checklist.md`
- `docs/operations/v1-rc-external-gates-runbook.md`
