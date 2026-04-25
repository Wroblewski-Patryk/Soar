# Task

## Header
- ID: V1FIX-2026-04-26-B
- Title: Reproduce and close remaining production manual-order and exchange-takeover failures
- Status: IN_PROGRESS
- Owner: Backend Builder
- Depends on: V1FIX-2026-04-26-A
- Priority: P0

## Context
Fresh production feedback says two operator-critical flows still do not work from
the real dashboard experience:
- manual order submission from `/dashboard`
- importing exchange positions for bot takeover/management

The task must verify the failures on the live product with the user's real
account, identify whether the blockers are web, API, data, or environment
specific, and close the gaps without masking architecture drift.

## Goal
Use the real production dashboard flow to reproduce both failures, capture the
true backend/runtime cause, and implement the smallest architecture-aligned fix
set required to make the V1 operator paths work end-to-end.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [ ] Manual order failure is reproduced from the production dashboard and root-caused.
- [ ] Exchange position takeover/import failure is reproduced from the production dashboard and root-caused.
- [ ] Required fixes are implemented, validated, deployed, and rechecked on production.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api test -- --run src/modules/positions/positions.orphan-repair.e2e.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - Production dashboard manual-order reproduction on real account via browser automation
  - Production `GET /dashboard/positions/exchange-snapshot`
  - Production `GET /dashboard/positions/takeover-status`
  - Production `POST /dashboard/orders/open` on paper selected-bot context
- Screenshots/logs:
  - `.tmp-paper-manual-open-events.json`
  - `.tmp-coolify-workers-execution-logs-body.txt`
  - `.tmp-prod-dashboard-auth-body.txt`
- High-risk checks:
  - Verified exchange snapshot can still read authenticated Binance Futures position truth for the affected account.
  - Verified local repair path only rebinds with explicit canonical bot proof and only auto-closes fully detached open rows.

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
- `docs/architecture/architecture-source-of-truth.md`
- `docs/operations/coolify-linux-vps-setup-guide.md`
- Fits approved architecture: yes | no
- Mismatch discovered: yes | no
- Decision required from user: yes | no
- Approval reference if architecture changed:
- Follow-up architecture doc updates:
  - none; explicit repair path stays within current ownership contract

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: production dashboard runtime/manual-order + exchange/takeover operator flows
- Required states: loading | empty | error | success
- Responsive checks: desktop
- Accessibility checks:
- Parity evidence:

## Review Checklist (mandatory)
- [ ] Architecture alignment confirmed.
- [ ] Existing systems were reused where applicable.
- [ ] No workaround paths were introduced.
- [ ] No logic duplication was introduced.
- [ ] Definition of Done evidence is attached.
- [ ] Relevant validations were run.
- [ ] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- Production validation is required here because the reported failures may depend
  on real account data, exchange-linked wallets, or production-only topology.
- Root cause on the real account is confirmed legacy open-position debt rather
  than missing V1 feature code:
  - `exchange-snapshot` proves Binance position truth is readable on prod
  - hidden `OPEN` rows with `botId=null` were blocking both exchange import and
    manual-order symbol reuse
  - execution worker is alive; the blocker is canonical ownership/data repair,
    not missing worker deployment
