---
id: SOAR-TOOL-V1-RELEASE-GATE
name: "V1 release gate runner"
type: validator
status: verified_local
layer: tooling
module: release
feature: release-audit-tooling
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validator, tooling, verified_local]
---

# V1 release gate runner

| Field | Value |
| --- | --- |
| Description | Final V1 release gate runner that combines production preflight release evidence readiness and go/no-go decision output. |
| File path | scripts/runV1ReleaseGate.mjs |
| Related files | scripts/runV1ReleaseGate.test.mjs, history/releases/v1-operator-unblock-packet-380308d1-2026-05-24.md |
| Parent | [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]] |
| Children |  |
| Depends on | [[SOAR-TOOL-V1-FINAL-PREFLIGHT]], [[SOAR-TOOL-REPOSITORY-PATH-RESOLVER]] |
| Used by | [[SOAR-TOOL-OPERATOR-UNBLOCK-PACKET-CHECK]] |
| UI related |  |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-RELEASE-AUDIT-TOOLING]] |
| Docs related | [[SOAR-DOC-TESTING]], [[SOAR-DOC-LOCAL-DEVELOPMENT]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Release gate remains NO-GO until protected evidence and approval context are current. |

## Relations

- uses -> [[SOAR-TOOL-V1-FINAL-PREFLIGHT]] (verified_local)
- verified_by -> [[SOAR-TEST-RELEASE-AUDIT-TOOLING]] (verified_local)
- contains <- [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
