---
id: SOAR-TOOL-REPOSITORY-PATH-RESOLVER
name: "Repository path resolver utility"
type: utility
status: verified_local
layer: tooling
module: scripts
feature: release-audit-tooling
risk_level: high
completion_percent: 100
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, utility, tooling, verified_local]
---

# Repository path resolver utility

| Field | Value |
| --- | --- |
| Description | Shared resolver for repo-relative paths with docs fallback and history path support. |
| File path | scripts/resolveRepositoryPath.mjs |
| Related files | scripts/resolveRepositoryPath.test.mjs |
| Parent | [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]] |
| Children |  |
| Depends on | [[SOAR-DOC-ARCHITECTURE-GRAPH-SYSTEM]] |
| Used by | [[SOAR-TOOL-OPERATOR-UNBLOCK-PACKET-CHECK]], [[SOAR-TOOL-REUSABLE-AUDIT-CHECKERS]] |
| UI related |  |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-RELEASE-AUDIT-TOOLING]] |
| Docs related | [[SOAR-DOC-LOCAL-DEVELOPMENT]], [[SOAR-DOC-TESTING]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Supports history artifacts and docs path compatibility for reusable audit validators. |

## Relations

- contains <- [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]] (verified_local)
- uses <- [[SOAR-TOOL-OPERATOR-UNBLOCK-PACKET-CHECK]] (verified_local)
- uses <- [[SOAR-TOOL-REUSABLE-AUDIT-CHECKERS]] (verified_local)
- verifies <- [[SOAR-TEST-RELEASE-AUDIT-TOOLING]] (verified_local)
- uses <- [[SOAR-TOOL-V1-FINAL-PREFLIGHT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
