---
id: SOAR-FEATURE-PROFILE-API-KEYS
name: "Profile API Keys"
type: feature
status: verified_local
layer: fullstack
module: profile
feature: profile-api-keys
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, fullstack, verified_local]
---

# Profile API Keys

| Field | Value |
| --- | --- |
| Description | Authenticated exchange API-key lifecycle encrypted storage connection probes rotate revoke and wallet LIVE binding support. |
| File path | docs/modules/api-profile.md |
| Related files | docs/modules/web-profile.md |
| Parent |  |
| Children | [[SOAR-PAGE-PROFILE]], [[SOAR-COMP-API-KEYS-LIST]], [[SOAR-COMP-API-KEY-FORM]], [[SOAR-API-PROFILE-APIKEY-LIST]], [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-PROFILE-APIKEY-TEST]] |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]], [[SOAR-DB-API-KEY]], [[SOAR-DB-USER]] |
| Used by | [[SOAR-FEATURE-WALLETS]], [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related | [[SOAR-COMP-API-KEYS-LIST]], [[SOAR-COMP-API-KEY-FORM]] |
| API related | [[SOAR-API-PROFILE-APIKEY-LIST]], [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-PROFILE-APIKEY-UPDATE]], [[SOAR-API-PROFILE-APIKEY-DELETE]], [[SOAR-API-PROFILE-APIKEY-TEST]], [[SOAR-API-PROFILE-APIKEY-STORED-TEST]], [[SOAR-API-PROFILE-APIKEY-ROTATE]], [[SOAR-API-PROFILE-APIKEY-REVOKE]] |
| Database related | [[SOAR-DB-API-KEY]], [[SOAR-DB-LOG]], [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEYS-API]], [[SOAR-TEST-PROFILE-API-KEYS-WEB]], [[SOAR-TEST-PROFILE-API-KEY-PROBE]] |
| Docs related | [[SOAR-DOC-API-PROFILE]], [[SOAR-DOC-WEB-PROFILE]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfilled as the secret-handling and exchange credential chain; no raw credentials belong in graph records. |

## Relations

- has_entrypoint -> [[SOAR-PAGE-PROFILE]] (verified_local)
- enables -> [[SOAR-FEATURE-WALLETS]] (verified_local)
- enables -> [[SOAR-FEATURE-BOT-RUNTIME]] (verified_local)
- verified_by -> [[SOAR-TEST-PROFILE-API-KEYS-API]] (verified_local)
- verified_by -> [[SOAR-TEST-PROFILE-API-KEY-PROBE]] (verified_local)
- verified_by -> [[SOAR-TEST-PROFILE-API-KEYS-WEB]] (verified_local)
- documented_by -> [[SOAR-DOC-API-PROFILE]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-PROFILE]] (verified_local)
- writes -> [[SOAR-DB-LOG]] (verified_local)
- depends_on <- [[SOAR-SERVICE-BOT-ACTIVATION-POLICY]] (verified_local)
- observes <- [[SOAR-FEATURE-LOGS-AUDIT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
