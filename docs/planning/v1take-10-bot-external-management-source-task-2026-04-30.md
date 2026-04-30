# Task

## Header
- ID: V1TAKE-10
- Title: Move LIVE external-position management authority from wallet to bot
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1IMPORT-01, V1OWN-01, V1AUTO-02
- Priority: P0

## Context
Current repository architecture still treats `wallet.manageExternalPositions` as
the canonical takeover-management flag for imported `LIVE` exchange positions.
The approved product decision on 2026-04-30 changes that rule: one bot with one
wallet and one market scope may explicitly opt into external-position
management, and the operator should control that behavior from bot settings via
one checkbox only.

## Goal
Make `bot.manageExternalPositions` the canonical source of truth for imported
`LIVE` ownership and management, remove the editable wallet-level toggle from
operator UX, and preserve current production behavior through deterministic
backfill.

## Scope
- Prisma schema and SQL migration for `Bot.manageExternalPositions`
- Bot create/update/read/runtime ownership contracts
- External position ownership resolver and takeover status truth
- Bot create/edit UI and types
- Wallet create/edit UI cleanup so the toggle exists only in bot settings
- Canonical architecture and planning/context docs

## Success Signal
- User or operator problem: one checkbox in bot settings controls whether a
  `LIVE` bot imports and manages exchange positions in its symbol scope
- Expected product or reliability outcome: no runtime truth depends on
  `wallet.manageExternalPositions`
- How success will be observed: imported `LIVE` ownership tests and bot form
  tests pass with the new contract; wallet form no longer exposes the toggle
- Post-launch learning needed: yes

## Deliverable For This Stage
One vertical implementation slice across schema, API, runtime ownership, web
form UX, tests, and canonical docs.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Acceptance Criteria
- `LIVE` imported-position ownership derives management authority from
  `bot.manageExternalPositions`
- current `LIVE` bots keep working after deploy via deterministic migration
  backfill from linked wallets
- wallet create/edit surfaces no longer show an editable external-management
  toggle
- bot create/edit exposes one external-management checkbox only for `LIVE`
  wallets

## Implementation Plan
1. Update architecture contract and canonical queue/context to reflect bot-level
   takeover management authority.
2. Add `Bot.manageExternalPositions` plus SQL backfill from linked wallet rows.
3. Rewire bot create/update/read and runtime ownership resolution to use the
   bot-level flag.
4. Move the single checkbox into bot settings and remove the wallet UI toggle.
5. Refresh focused API/web regression coverage and run validation pack.

## Definition of Done
- [x] Architecture docs describe bot-level management authority and wallet
      flag deprecation/compatibility status
- [x] Schema, API, runtime, and UI all use one canonical bot-level flag
- [x] Focused tests, typechecks, and guardrails pass with evidence

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts`
  - `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts`
  - `pnpm --filter web exec vitest run src/features/bots/components/BotCreateEditForm.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/wallets/components/WalletsListTable.test.tsx`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks: operator contract reviewed against approved chat decision
- Screenshots/logs: test output captured in task execution notes
- High-risk checks: imported `LIVE` ownership and wallet-to-bot migration parity

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: yes, resolved on 2026-04-30
- Approval reference if architecture changed: user decision: one checkbox in
  bot settings only
- Follow-up architecture doc updates: `docs/architecture/reference/wallet-source-of-truth-contract.md`

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: operator decision in chat
- Canonical visual target: existing shared dashboard form system
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: yes
- Existing shared pattern reused: `ToggleField`, `FormSectionCard`, `FormGrid`
- New shared pattern introduced: no
- Design-memory entry reused: yes
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches: pending implementation
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Input-mode checks: touch | pointer | keyboard
- Accessibility checks: label and disabled-state parity for the new checkbox
- Parity evidence: pending

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: not required for this UI/API contract slice
- Rollback note: revert migration + bot flag usage together only
- Observability or alerting impact: none
- Staged rollout or feature flag: no

## Review Checklist (mandatory)
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- Keep `wallet.manageExternalPositions` as legacy persistence only during this
  slice; runtime and operator write contracts must stop depending on it.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime
  surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB
-> validation -> error handling -> test. Partial implementations, mock-only
paths, placeholders, fake data, and temporary fixes are forbidden.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: operators managing imported `LIVE` exchange positions
- Existing workaround or pain: takeover authority split across wallet and bot
  UX; bot ownership could remain null or misleading
- Smallest useful slice: move one canonical flag and remove duplicate wallet UI
- Success metric or signal: imported position ownership resolves correctly by
  bot symbol scope with one visible control
- Feature flag, staged rollout, or disable path: no
- Post-launch feedback or metric check: protected production verification on
  imported `LIVE` positions

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: imported `LIVE` exchange position adoption into bot
  runtime surfaces and automation
- SLI: owned imported position visibility and takeover classification correctness
- SLO: fail-closed ownership; no silent unmanaged adoption
- Error budget posture: healthy
- Health/readiness check: existing runtime and positions endpoints
- Logs, dashboard, or alert route: bot runtime positions and takeover status
- Smoke command or manual smoke: pending
- Rollback or disable path: revert code + migration as one slice

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: yes
- Error state verified: yes
- Refresh/restart behavior verified: yes
- Regression check performed: yes

## AI Testing Evidence (required for AI features)

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: exchange-position ownership metadata
- Trust boundaries: authenticated bot settings, wallet linkage, imported
  exchange snapshot
- Permission or ownership checks: bot owner and wallet owner match only
- Abuse cases: ambiguous symbol scope, wallet sharing, stale imported rows
- Secret handling: unchanged
- Security tests or scans: focused ownership tests
- Fail-closed behavior: unmanaged by default unless one bot explicitly owns the
  symbol and has management enabled
- Residual risk: production data backfill must be verified after deploy

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: moved imported `LIVE` management authority to one canonical
  `bot.manageExternalPositions` flag, removed wallet-level operator editing,
  and aligned runtime ownership/takeover reads plus bot settings UX with the
  new contract.
- Files changed:
  - `apps/api/prisma/schema.prisma`
  - `apps/api/prisma/migrations/20260430190000_move_external_management_to_bot/migration.sql`
  - bot runtime ownership, bot command/types, wallet command/types, bot+wallet
    web form/types/tests, i18n, architecture docs, planning/context docs
- How tested:
  - focused API ownership/takeover regressions
  - full `bots.e2e` contract
  - focused bot/wallet web form regressions
  - API/web typecheck
  - repository guardrails
- What is incomplete: protected production verification after deploy remains a
  separate runtime evidence slice
- Next steps: monitor imported `LIVE` ownership on production after deploy and
  continue remaining `V1EXCEL` operator evidence tasks
- Decisions made: approved bot-level single-checkbox contract
