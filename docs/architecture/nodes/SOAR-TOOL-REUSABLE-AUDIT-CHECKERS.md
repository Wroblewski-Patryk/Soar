---
id: SOAR-TOOL-REUSABLE-AUDIT-CHECKERS
name: "Reusable audit validators"
type: validator
status: verified_local
layer: tooling
module: audit
feature: release-audit-tooling
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validator, tooling, verified_local]
---

# Reusable audit validators

| Field | Value |
| --- | --- |
| Description | Reusable audit manifest handoff rollup remediation tooling index and rerun playbook validators using shared path resolution. |
| File path | scripts/checkReusableAuditManifest.mjs |
| Related files | scripts/checkReusableAuditRerunPlaybook.mjs, scripts/checkFullReusableAuditHandoff.mjs, scripts/checkAuditRemediationPlan.mjs, scripts/checkFullReusableAuditRollup.mjs, scripts/checkReusableAuditToolingIndex.mjs |
| Parent | [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]] |
| Children |  |
| Depends on | [[SOAR-TOOL-REPOSITORY-PATH-RESOLVER]] |
| Used by | [[SOAR-WORKFLOW-RELEASE-AUDIT-TOOLING-CHAIN]] |
| UI related |  |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-RELEASE-AUDIT-TOOLING]] |
| Docs related | [[SOAR-DOC-TESTING]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Full reusable audit aggregate passes after history path resolver migration. |

## Relations

- uses -> [[SOAR-TOOL-REPOSITORY-PATH-RESOLVER]] (verified_local)
- verified_by -> [[SOAR-TEST-RELEASE-AUDIT-TOOLING]] (verified_local)
- contains <- [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
