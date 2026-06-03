---
id: SOAR-DOC-MOBILE-MODULE-INDEX
name: "Mobile module documentation index"
type: documentation
status: verified_local
layer: documentation
module: mobile
feature: mobile-bootstrap
risk_level: low
completion_percent: 80
last_verified_at: 2026-06-03
verification_status: verified_local
tags: [soar-map, documentation, documentation, verified_local]
---

# Mobile module documentation index

| Field | Value |
| --- | --- |
| Description | Scaffold-only mobile module documentation index for future activation tracking. |
| File path | docs/modules/mobile-module-index.md |
| Related files | docs/modules/mobile-bootstrap.md |
| Parent | [[SOAR-DOC-MODULE-GOVERNANCE-INDEX]] |
| Children |  |
| Depends on | [[SOAR-DOC-MODULE-GOVERNANCE-INDEX]] |
| Used by | [[SOAR-DOC-MOBILE-BOOTSTRAP]] |
| UI related |  |
| API related |  |
| Database related |  |
| Tests related |  |
| Docs related | [[SOAR-DOC-MODULE-GOVERNANCE-INDEX]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Registry repair for mobile documentation relation integrity; mobile remains scaffold-only. |

## Relations

- documents -> [[SOAR-DOC-MOBILE-BOOTSTRAP]] (verified_local)
- documents <- [[SOAR-DOC-MODULE-GOVERNANCE-INDEX]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
