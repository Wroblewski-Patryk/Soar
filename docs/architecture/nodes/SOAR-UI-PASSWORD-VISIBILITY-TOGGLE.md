---
id: SOAR-UI-PASSWORD-VISIBILITY-TOGGLE
name: "PasswordVisibilityToggle"
type: ui_element
status: verified_local
layer: frontend
module: web-auth
feature: auth-session
risk_level: medium
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, ui_element, frontend, verified_local]
---

# PasswordVisibilityToggle

| Field | Value |
| --- | --- |
| Description | Reusable password visibility control used by auth forms. |
| File path | apps/web/src/features/auth/components/PasswordVisibilityToggle.tsx |
| Related files |  |
| Parent | [[SOAR-COMP-LOGIN-FORM]] |
| Children |  |
| Depends on | [[SOAR-COMP-LOGIN-FORM]], [[SOAR-COMP-REGISTER-FORM]] |
| Used by | [[SOAR-COMP-LOGIN-FORM]], [[SOAR-COMP-REGISTER-FORM]] |
| UI related | [[SOAR-COMP-LOGIN-FORM]], [[SOAR-COMP-REGISTER-FORM]] |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-WEB-AUTH-FORMS]] |
| Docs related | [[SOAR-DOC-WEB-AUTH]] |
| Agent related |  |
| Notes | Auth UI control. |

## Relations

- uses <- [[SOAR-COMP-LOGIN-FORM]] (verified_local)
- uses <- [[SOAR-COMP-REGISTER-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
