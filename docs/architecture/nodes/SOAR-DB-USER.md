---
id: SOAR-DB-USER
name: "User model"
type: database_model
status: verified
layer: data
module: identity
feature: auth-session
risk_level: high
completion_percent: 100
last_verified_at: 2026-05-23
verification_status: verified
tags: [soar-map, database_model, data, verified]
---

# User model

| Field | Value |
| --- | --- |
| Description | Prisma identity model used by auth profile subscriptions and ownership checks. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-DOC-DATA-MODEL]] |
| Used by | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-ME]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-AUTH-SESSION]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Model-level coverage is grouped under data/migration proof. |

## Relations

- reads_writes <- [[SOAR-API-AUTH-LOGIN]] (verified)
- reads <- [[SOAR-API-AUTH-ME]] (verified)
- reads_writes <- [[SOAR-SERVICE-ADMIN-USERS]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-PROFILE-BASIC]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-PROFILE-SECURITY]] (verified_local)
- scoped_by <- [[SOAR-SERVICE-UPLOAD-AVATAR-PROCESSING]] (verified_local)
- reads <- [[SOAR-MIDDLEWARE-REQUIRE-AUTH]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-AUTH]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
