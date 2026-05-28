# LUC-402 Parent Unblock Comment Packet (from LUC-405)

Date: 2026-05-28  
Source issue: `LUC-405`  
Target issue: `LUC-402`  
Window ID: `ARB6-WIN-2026-05-30-A`

## Ready-To-Post Comment Draft

`[ARB-006][Ops] Protected evidence window is prepared and remains BLOCKED pending named dependencies.`

- Proposed read-only execution window: `2026-05-30 09:00-11:00 Europe/Berlin`.
- Runtime targets: `https://api.soar.luckysparrow.ch`, `https://soar.luckysparrow.ch`.
- Expected SHA: `71b8d503fd6fdfd7378dc67b2fa678799e2430f8`.
- Safety gate: `NO-MUTATION` (no deploy/restart/rollback/DB writes/config/account changes).

Current verification posture:
- `ops:operator-unblock:check` => `PASS` (`NO-GO: yes`, packet consistency intact).
- `ops:protected-inputs:check` => `PARTIAL` (missing protected families remain).

First-class blockers to clear before window execution:
1. Owner: Soar auth credential owner + Security/Test owner  
   Action: provide approved read-only principal/session authorized for `GET /workers/ready`.
2. Owner: Ops Release Lead + QA + Security + release controller  
   Action: close missing protected evidence families (`LIVEIMPORT_READBACK`, `ROLLBACK_GUARD`, `SOAR_PROD`, `PROD_DB_CHECK`/`PRODUCTION_DB_CHECK`, `RC`, `GATE`) for the same date/SHA.

Approval gate required:
- Security approval of principal/session class and redaction policy.
- QA approval of protected evidence step scope.
- Release controller approval of expected SHA and window use.

Parent issue disposition recommendation now: `blocked` until both blocker groups are cleared; once cleared, execute `ARB6-WIN-2026-05-30-A` and publish post-window `done`/`blocked` with evidence paths.
