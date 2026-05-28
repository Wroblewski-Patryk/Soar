# LUC-405 ARB-006 Protected Evidence Window Packet

Date: 2026-05-28  
Issue: `LUC-405 [Soar][ARB-006][Ops]`  
Parent: `LUC-402 [Soar][ARB-006]`  
Status: `BLOCKED_UNTIL_INPUTS_READY`

## Purpose
Provide one executable, no-mutation Ops coordination packet that defines:
- exact window timing,
- required owners/approvals,
- allowed read-only evidence steps,
- fail-closed stop conditions.

## Target Runtime
- Environment: `production` (read-only evidence only)
- Canonical endpoints:
  - `https://api.soar.luckysparrow.ch`
  - `https://soar.luckysparrow.ch`
- Expected SHA: `71b8d503fd6fdfd7378dc67b2fa678799e2430f8`

## Proposed Evidence Window
- Window ID: `ARB6-WIN-2026-05-30-A`
- Start: `2026-05-30 09:00 Europe/Berlin`
- End: `2026-05-30 11:00 Europe/Berlin`
- Max duration: `120 minutes`
- Mode: `read-only verification only`

## Owner Matrix
- Ops Release Lead:
  - Run canonical smoke and packet consistency checks.
  - Enforce stop gates and no-mutation boundary.
- Security/Test permission owner:
  - Approve principal/session class and access boundary.
  - Confirm redaction policy for protected artifacts.
- QA owner:
  - Execute authenticated browser proof steps in approved scope.
  - Capture state coverage (`loading`, `empty`, `error`, `success`).
- Release controller:
  - Confirm expected SHA and final accept/reject of evidence packet use.

## Required Inputs Before Window Start (T-30)
1. Approved read-only principal/session artifact authorized for `GET /workers/ready`.
2. Explicit expected SHA confirmation from release controller.
3. Protected-input families readiness checkpoint rerun for same day/SHA.
4. Security confirmation of allowed artifact storage/redaction.

## Execution Sequence (Fail-Closed)
1. `ops:deploy:smoke` on canonical endpoints for expected SHA.
2. Protected worker readiness probe under approved auth path.
3. `ops:protected-inputs:check` with dated JSON/Markdown outputs.
4. `ops:operator-unblock:check` consistency validation.
5. QA/Security protected evidence tasks for ARB6-EV-001 scope only (if all prior checks pass).

If any step fails, stop immediately and keep status `blocked`.

## No-Mutation Safety Gate
- Forbidden during this window:
  - deploy/restart/rollback,
  - DB writes or config edits,
  - LIVE exchange mutation,
  - account/permission mutation.
- Allowed:
  - read-only API probes,
  - read-only authenticated browser verification,
  - artifact generation in `history/`.

## Current Blockers (First-Class)
1. Auth boundary blocker:
   - Owner: Soar auth credential owner + Security/Test owner
   - Action: provide approved read-only principal/session accepted by API auth and authorized for `GET /workers/ready`.
2. Protected evidence family blocker:
   - Owner: Ops + QA + Security + release controller
   - Action: complete missing protected evidence families (`LIVEIMPORT_READBACK`, `ROLLBACK_GUARD`, `SOAR_PROD`, `PROD_DB_CHECK`/`PRODUCTION_DB_CHECK`, `RC`, `GATE`) for target SHA/date.

## Unblock-Ready Checklist for Parent (`LUC-402`)
- [ ] Window `ARB6-WIN-2026-05-30-A` accepted by Ops/Security/QA/release controller.
- [ ] Approved read-only worker-read principal/session is delivered and verified.
- [ ] Same-day protected-input readiness rerun is attached for expected SHA.
- [ ] No-mutation scope explicitly accepted.
- [ ] Post-window disposition is published as `done` or `blocked` with owner/action.

## Current Disposition
`blocked` until required inputs are present; no live continuation path exists without owner-provided auth artifact and approval confirmations.
