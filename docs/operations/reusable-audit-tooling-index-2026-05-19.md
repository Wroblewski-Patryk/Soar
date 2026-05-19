# Reusable Audit Tooling Index - 2026-05-19

## Purpose

This index maps the reusable audit helper scripts and package commands created
around the 2026-05-19 audit baseline. Use it to find the right validation or
comparison tool without scanning `package.json`.

Machine-readable pair:

- `docs/operations/reusable-audit-tooling-index-2026-05-19.json`

## Primary Command

Use this before closing a reusable audit rerun or before comparing a future
manifest:

```powershell
corepack pnpm run audit:manifest:verify
```

It runs:

- manifest checker regression tests;
- manifest comparison regression tests;
- rerun playbook regression tests;
- current manifest validation;
- current manifest self-comparison;
- rerun playbook validation.

## Tools

| Tool ID | Command | Script | Purpose |
| --- | --- | --- | --- |
| `AUDIT-MANIFEST-CHECK` | `corepack pnpm run audit:manifest:check` | `scripts/checkReusableAuditManifest.mjs` | Validate manifest JSON coverage, referenced paths, and open-decision links. |
| `AUDIT-MANIFEST-CHECK-TEST` | `corepack pnpm run audit:manifest:check:test` | `scripts/checkReusableAuditManifest.test.mjs` | Regression-test missing audit IDs, duplicate IDs, missing paths, and missing decision links. |
| `AUDIT-MANIFEST-COMPARE` | `corepack pnpm run audit:manifest:compare -- --base <path> --target <path>` | `scripts/compareReusableAuditManifests.mjs` | Compare two audit manifests for regressions and improvements. |
| `AUDIT-MANIFEST-COMPARE-TEST` | `corepack pnpm run audit:manifest:compare:test` | `scripts/compareReusableAuditManifests.test.mjs` | Regression-test status, summary, decision, and safety-boundary comparison behavior. |
| `AUDIT-MANIFEST-VERIFY` | `corepack pnpm run audit:manifest:verify` | `package.json` | Run the complete manifest/playbook verification bundle. |
| `AUDIT-RERUN-PLAYBOOK-CHECK` | `corepack pnpm run audit:rerun-playbook:check` | `scripts/checkReusableAuditRerunPlaybook.mjs` | Validate rerun playbook coverage, required commands, sections, and safety boundaries. |
| `AUDIT-RERUN-PLAYBOOK-CHECK-TEST` | `corepack pnpm run audit:rerun-playbook:check:test` | `scripts/checkReusableAuditRerunPlaybook.test.mjs` | Regression-test rerun playbook validation behavior. |
| `AUDIT-TOOLING-INDEX-CHECK` | `corepack pnpm run audit:tooling-index:check` | `scripts/checkReusableAuditToolingIndex.mjs` | Validate audit tooling index command/script coverage and safety boundaries. |
| `AUDIT-TOOLING-INDEX-CHECK-TEST` | `corepack pnpm run audit:tooling-index:check:test` | `scripts/checkReusableAuditToolingIndex.test.mjs` | Regression-test tooling index validation behavior. |
| `AUDIT-DATA-DB-ISOLATED` | `corepack pnpm run audit:data:db-isolated` | `scripts/runAud07IsolatedDbPacks.mjs` | Run representative DB-backed `AUD-07` packs sequentially with reset/isolation. |
| `API-ENDPOINT-DOCS-PARITY` | `corepack pnpm run docs:parity:endpoints:api` | `scripts/auditApiEndpointDocsParity.mjs` | Verify endpoint-level API documentation parity. |

## Safety Boundaries

- These tools are local/read-only except for local validation side effects such
  as test databases or generated local reports.
- They do not approve architecture decisions.
- They do not run production data mutation.
- They do not run LIVE order submit/cancel/close.
- They do not run exchange-side mutation.

## Closure Set

After changing this tooling index or related audit tooling, run:

```powershell
corepack pnpm run audit:manifest:verify
corepack pnpm run docs:parity:check
corepack pnpm run quality:guardrails
git diff --check
```

Then confirm local validation cleanup:

```powershell
Get-Process chrome-headless-shell -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5432,6379 -ErrorAction SilentlyContinue
docker compose ps
```
