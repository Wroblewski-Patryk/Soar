---
id: SOAR-TOOL-V1-FINAL-PREFLIGHT
name: "V1 final preflight runner"
type: validator
status: verified_local
layer: tooling
module: release
feature: release-audit-tooling
risk_level: critical
completion_percent: 100
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validator, tooling, verified_local]
---

# V1 final preflight runner

| Field | Value |
| --- | --- |
| Description | No-secret release preflight runner that validates build-info public smoke protected prerequisite presence and freshness of release evidence. |
| File path | scripts/runV1FinalPreflight.mjs |
| Related files | scripts/runV1FinalPreflight.test.mjs, history/artifacts/v1-preflight-production-no-secret-refresh-2026-05-24.json, history/releases/v1-preflight-production-no-secret-refresh-2026-05-24.md |
| Parent | [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]] |
| Children |  |
| Depends on | [[SOAR-TOOL-REPOSITORY-PATH-RESOLVER]] |
| Used by | [[SOAR-TOOL-V1-RELEASE-GATE]], [[SOAR-TOOL-OPERATOR-UNBLOCK-PACKET-CHECK]] |
| UI related |  |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-RELEASE-AUDIT-TOOLING]] |
| Docs related | [[SOAR-DOC-TESTING]], [[SOAR-DOC-LOCAL-DEVELOPMENT]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Latest no-secret production preflight passes build-info/public smoke and correctly blocks on protected prerequisites and stale/failed release evidence. |

## Relations

- uses -> [[SOAR-TOOL-REPOSITORY-PATH-RESOLVER]] (verified_local)
- verified_by -> [[SOAR-TEST-RELEASE-AUDIT-TOOLING]] (verified_local)
- contains <- [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]] (verified_local)
- uses <- [[SOAR-TOOL-V1-RELEASE-GATE]] (verified_local)
- uses <- [[SOAR-TOOL-OPERATOR-UNBLOCK-PACKET-CHECK]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
