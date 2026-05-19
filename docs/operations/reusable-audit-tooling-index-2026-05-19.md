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
- rollup regression tests;
- rerun playbook regression tests;
- tooling index regression tests;
- remediation plan regression tests;
- handoff regression tests;
- protected input readiness regression tests;
- current manifest validation;
- current manifest self-comparison;
- rollup validation;
- rerun playbook validation;
- tooling index validation;
- remediation plan validation.
- handoff validation.

## Tools

| Tool ID | Command | Script | Purpose |
| --- | --- | --- | --- |
| `AUDIT-MANIFEST-CHECK` | `corepack pnpm run audit:manifest:check` | `scripts/checkReusableAuditManifest.mjs` | Validate manifest JSON coverage, required source-chain keys and repository-path values, JSON/Markdown summary counts, path metadata, referenced paths, and open-decision links. |
| `AUDIT-MANIFEST-CHECK-TEST` | `corepack pnpm run audit:manifest:check:test` | `scripts/checkReusableAuditManifest.test.mjs` | Regression-test missing audit IDs, duplicate IDs, missing source-chain keys, invalid source-chain paths, JSON/Markdown summary drift, path metadata drift, missing paths, and missing decision links. |
| `AUDIT-MANIFEST-COMPARE` | `corepack pnpm run audit:manifest:compare -- --base <path> --target <path> --json-output <path>` | `scripts/compareReusableAuditManifests.mjs` | Compare two audit manifests for regressions and improvements using leading status buckets, with optional JSON report output. |
| `AUDIT-MANIFEST-COMPARE-TEST` | `corepack pnpm run audit:manifest:compare:test` | `scripts/compareReusableAuditManifests.test.mjs` | Regression-test leading status bucket, summary, decision, safety-boundary comparison behavior, and JSON report output. |
| `AUDIT-MANIFEST-VERIFY` | `corepack pnpm run audit:manifest:verify` | `package.json` | Run the complete manifest/playbook verification bundle. |
| `AUDIT-ROLLUP-CHECK` | `corepack pnpm run audit:rollup:check` | `scripts/checkFullReusableAuditRollup.mjs` | Validate full reusable audit rollup coverage, Markdown/JSON audit ID and summary coverage, source paths, repair queue, and safety booleans. |
| `AUDIT-ROLLUP-CHECK-TEST` | `corepack pnpm run audit:rollup:check:test` | `scripts/checkFullReusableAuditRollup.test.mjs` | Regression-test full reusable audit rollup validation behavior, including Markdown/JSON audit ID and summary drift. |
| `AUDIT-RERUN-PLAYBOOK-CHECK` | `corepack pnpm run audit:rerun-playbook:check` | `scripts/checkReusableAuditRerunPlaybook.mjs` | Validate rerun playbook baseline paths, coverage, required commands, required self-check closure checks, sections, required cleanup checks, and safety boundaries. |
| `AUDIT-RERUN-PLAYBOOK-CHECK-TEST` | `corepack pnpm run audit:rerun-playbook:check:test` | `scripts/checkReusableAuditRerunPlaybook.test.mjs` | Regression-test rerun playbook validation behavior, including missing baseline paths, required self-check closure checks, and required cleanup checks. |
| `AUDIT-HANDOFF-CHECK` | `corepack pnpm run audit:handoff:check` | `scripts/checkFullReusableAuditHandoff.mjs` | Validate full reusable audit handoff source paths, rollup summary parity, residual risks, forbidden boundaries, required validation checks including its self-check, required cleanup validation checks, and safety booleans. |
| `AUDIT-HANDOFF-CHECK-TEST` | `corepack pnpm run audit:handoff:check:test` | `scripts/checkFullReusableAuditHandoff.test.mjs` | Regression-test full reusable audit handoff validation behavior, including rollup summary drift, missing self-check validation, and missing cleanup validation. |
| `AUDIT-REMEDIATION-PLAN-CHECK` | `corepack pnpm run audit:remediation-plan:check` | `scripts/checkAuditRemediationPlan.mjs` | Validate remediation roadmap phases, work packages, blockers, required self-check closure checks, required cleanup checks, and safety boundaries. |
| `AUDIT-REMEDIATION-PLAN-CHECK-TEST` | `corepack pnpm run audit:remediation-plan:check:test` | `scripts/checkAuditRemediationPlan.test.mjs` | Regression-test remediation plan validation behavior, including missing self-check closure commands and required cleanup checks. |
| `AUDIT-TOOLING-INDEX-CHECK` | `corepack pnpm run audit:tooling-index:check` | `scripts/checkReusableAuditToolingIndex.mjs` | Validate audit tooling index Markdown/JSON tool coverage, command/script coverage, package script existence, required self-check closure commands, required cleanup checks, and safety boundaries. |
| `AUDIT-TOOLING-INDEX-CHECK-TEST` | `corepack pnpm run audit:tooling-index:check:test` | `scripts/checkReusableAuditToolingIndex.test.mjs` | Regression-test tooling index validation behavior, including Markdown/JSON drift, missing package scripts, required self-check closure commands, and required cleanup checks. |
| `AUDIT-DATA-DB-ISOLATED` | `corepack pnpm run audit:data:db-isolated` | `scripts/runAud07IsolatedDbPacks.mjs` | Run representative DB-backed `AUD-07` packs sequentially with reset/isolation. |
| `API-ENDPOINT-DOCS-PARITY` | `corepack pnpm run docs:parity:endpoints:api` | `scripts/auditApiEndpointDocsParity.mjs` | Verify endpoint-level API documentation parity. |
| `OPS-PROTECTED-INPUTS-CHECK` | `corepack pnpm run ops:protected-inputs:check -- --today <yyyy-mm-dd> --expected-sha <sha>` | `scripts/checkProtectedInputReadiness.mjs` | Check protected production input env-name readiness without printing or storing secret values. |
| `OPS-PROTECTED-INPUTS-CHECK-TEST` | `corepack pnpm run ops:protected-inputs:check:test` | `scripts/checkProtectedInputReadiness.test.mjs` | Regression-test protected input readiness counting and secret-value redaction. |

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
corepack pnpm run audit:remediation-plan:check
corepack pnpm run audit:tooling-index:check
corepack pnpm run ops:protected-inputs:check:test
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
