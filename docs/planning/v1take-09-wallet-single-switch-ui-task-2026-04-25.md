# Task

## Header
- ID: V1TAKE-09
- Title: Remove API-key takeover toggles and keep wallet as the single editable management switch
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1TAKE-08
- Priority: P1

## Context
`V1TAKE-A` closed with the approved wallet-first takeover contract:
`wallet.manageExternalPositions` is the only management source of truth for
exchange-position takeover. The current web UI still exposes two legacy
API-key-level toggles (`syncExternalPositions` and
`manageExternalPositions`) in addition to the wallet-level switch, which makes
the ownership contract look scattered and can mislead operators about where
takeover control really lives.

## Goal
Keep exactly one editable takeover-management switch in the wallet UI and
remove the legacy API-key takeover controls from the web form, while
preserving compatibility-safe API-key submission behavior.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [ ] API key form no longer renders editable takeover/import toggles.
- [ ] Wallet form remains the only editable UI surface for takeover management.
- [ ] Focused web tests and relevant validations pass.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter web exec vitest run src/features/profile/components/ApiKeyForm.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/wallets/components/WalletsListTable.test.tsx`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - Confirmed the API key form no longer renders editable takeover/import toggles.
  - Confirmed the wallet form still owns the single editable `manageExternalPositions` switch for `LIVE` wallets.
- Screenshots/logs:
  - n/a
- High-risk checks:
  - API key form submit still sends compatibility-safe `syncExternalPositions=true` and `manageExternalPositions=false` while the editable takeover switch remains wallet-only.

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/planning/v1take-exchange-takeover-manual-order-closure-plan-2026-04-25.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: none expected

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: user-approved option `1` on 2026-04-25
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: toggle removal keeps label order and form actions accessible
- Parity evidence: wallet form remains the only editable takeover-management control

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- API-key payload compatibility may still send hidden defaults so older backend
  contracts stay stable while the UI exposes only wallet-level management.
