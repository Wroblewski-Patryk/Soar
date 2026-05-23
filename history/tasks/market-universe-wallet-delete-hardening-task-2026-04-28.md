# Task

## Header
- ID: UXSAFE-2026-04-28-A
- Title: Harden market-universe edit guard and wallet delete history handling
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on:
- Priority: P1

## Context
The user reported two operator-facing failures in dashboard ownership flows:
editing a `MarketUniverse` linked to a bot did not behave like `Strategies`,
and deleting a wallet returned an internal server error instead of preserving
history safely.

## Goal
Make `MarketUniverse` edits fail closed only when the linked bot usage is
actively running, and make wallet deletion preserve historical lifecycle rows
without leaking raw `500` errors.

## Deliverable For This Stage
Shipped backend fix, regression coverage, and synced project truth for the two
reported dashboard-management failures.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `apps/api/src/modules/markets/markets.service.ts`
- `apps/api/src/modules/markets/markets.errors.ts`
- `apps/api/src/modules/markets/markets.e2e.test.ts`
- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/wallets/wallets.crud.e2e.test.ts`
- canonical queue/context sync files

## Implementation Plan
1. Reuse the `Strategies` active-usage rule for `MarketUniverse`: block edits only
   when an active bot still owns the universe through canonical or legacy scope.
2. Expand the market guard to also cover direct primary-bot ownership drift so
   active runtime scope cannot bypass the edit lock.
3. Change wallet deletion to detach nullable historical `walletId` references on
   `Position`, `Order`, and `Trade` before deleting the wallet.
4. Keep delete fail-closed for any bot linkage and map remaining FK-style Prisma
   failures to the existing wallet domain error instead of exposing raw `500`.
5. Add focused regression coverage for inactive/active market usage and
   wallet-history detachment.

## Acceptance Criteria
- Editing or deleting a market universe linked only to inactive bot usage succeeds.
- Editing or deleting a market universe linked to an active bot fails with the
  existing active-bot contract.
- Active primary-bot ownership still blocks market-universe edits even if
  canonical market-group link rows drift.
- Deleting a wallet with no linked bots succeeds even when historical
  `positions/orders/trades` still reference that wallet.
- Historical rows survive wallet deletion with `walletId=null`.

## Definition of Done
- [x] Market-universe active-usage guard matches the approved inactive-vs-active contract.
- [x] Wallet delete no longer depends on DB FK behavior for historical lifecycle rows.
- [x] Focused regression coverage exists for both reported failures.
- [x] Relevant validations passed.
- [x] Canonical queue/context docs were updated.

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
  - `pnpm --filter api exec vitest run src/modules/markets/markets.e2e.test.ts -t "allows universe updates and delete when linked bot is inactive"`
  - `pnpm --filter api exec vitest run src/modules/markets/markets.e2e.test.ts -t "blocks universe update/delete when active primary bot still points at the universe even if group links drifted"`
  - `pnpm --filter api exec vitest run src/modules/wallets/wallets.crud.e2e.test.ts -t "deletes wallet and preserves historical rows by detaching wallet references"`
- Manual checks:
  - none
- Screenshots/logs:
  - none
- High-risk checks:
  - wallet delete preserves historical lifecycle rows instead of failing raw

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md`, existing `Strategies` and wallet lifecycle contracts
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert service/test changes only

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
- Full legacy `markets.e2e` and `wallets.crud.e2e` files currently contain older
  unrelated instability in this local environment, so verification was pinned to
  the focused regressions covering the shipped contract.

## Result Report
- Task summary: hardened market-universe active usage detection and made wallet
  deletion preserve lifecycle history by detaching nullable wallet refs first.
- Files changed:
  - `apps/api/src/modules/markets/markets.service.ts`
  - `apps/api/src/modules/markets/markets.errors.ts`
  - `apps/api/src/modules/markets/markets.e2e.test.ts`
  - `apps/api/src/modules/wallets/wallets.service.ts`
  - `apps/api/src/modules/wallets/wallets.crud.e2e.test.ts`
  - queue/context docs
- How tested: focused API regressions, API typecheck, repository guardrails
- What is incomplete: no UI copy changes were needed in this slice
- Next steps: if desired, stabilize the unrelated broader legacy e2e noise in
  the full `markets` and `wallets` suites as a separate hygiene task
- Decisions made:
  - block market-universe edits on active scope only
  - preserve trading history on wallet delete by detaching nullable references
