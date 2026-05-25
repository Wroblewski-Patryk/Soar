---
id: SOAR-DOC-API-PROFILE
name: "API profile module documentation"
type: documentation
status: verified_local
layer: documentation
module: api-profile
feature: profile-api-keys
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, documentation, documentation, verified_local]
---

# API profile module documentation

| Field | Value |
| --- | --- |
| Description | Profile API deep-dive covering basic security API keys subscriptions encryption probes and throttling. |
| File path | docs/modules/api-profile.md |
| Related files | docs/architecture/10_safety-entitlements-and-risk.md |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-DOC-DATA-MODEL]] |
| Used by | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-APIKEY-LIST]], [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-PROFILE-APIKEY-TEST]] |
| Database related | [[SOAR-DB-API-KEY]], [[SOAR-DB-LOG]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEYS-API]], [[SOAR-TEST-PROFILE-API-KEY-PROBE]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Canonical API profile module doc. |

## Relations

- documented_by <- [[SOAR-FEATURE-PROFILE-API-KEYS]] (verified_local)
- documented_by <- [[SOAR-API-PROFILE-BASIC-GET]] (verified_local)
- documented_by <- [[SOAR-API-PROFILE-SECURITY-PASSWORD]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
