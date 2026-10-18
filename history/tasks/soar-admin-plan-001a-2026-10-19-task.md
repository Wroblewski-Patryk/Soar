# Task

## Header
- ID: SOAR-ADMIN-PLAN-001A
- Title: Close self-service plan and role mutation paths
- Task Type: fix
- Current Stage: verification
- Status: REVIEW
- Owner: Backend
- Priority: P0

## Product contract
Registration creates an ordinary account without an active plan. A human
administrator assigns the plan and changes roles in the Soar panel. Until an
assignment exists, plan-gated actions fail closed. The user profile can read
catalog and assignment state, but it cannot start checkout. An external client
using bearer authentication cannot mutate plan or role state.

## Implemented scope
- Removed registration and profile-read default-plan assignment. The owner
  seed still creates its administrator role, but no longer grants a plan.
- Removed the profile checkout-intent route and controller action. Existing
  `PaymentIntent` and subscription history remain stored and readable for a
  separate migration review.
- Required an authenticated administrator cookie session for admin user and
  plan write routes. Existing administrator role checks remain in force.
- Added transactional audit logs for role changes, user plan assignment, and
  subscription-plan edits. Role and assignment logs include old/new values;
  plan-catalog logs record the actor and edited field names.
- Updated API, product, and operator documentation. Tests now grant plans
  explicitly in scenarios that require an entitled user.
- Updated the subscription architecture registry and readable chain/node
  records to mark the checkout route and checkout service as deprecated.

## Acceptance criteria
- New registration has no `UserSubscription`; profile reads never create one.
- Plan-gated bot creation by an unassigned account returns 403 without
  creating a bot or subscription.
- Profile checkout-intent POST has no route and creates no payment intent.
- A regular user and a bearer-only administrator cannot change roles, user
  plans, or plan catalog settings; administrator panel writes are audited.
- Historical payment and subscription rows are not deleted or migrated by
  this task.

## Evidence and boundaries
- Source and focused API tests cover the registration, entitlement, route,
  administrator authority, and audit boundaries. Exact local gate results and
  source SHA are recorded in the handoff after verification.
- No production mutation, deploy, payment-provider call, or LIVE order action
  is authorized or claimed here.
- A cookie session alone cannot prove a person is at the keyboard or prevent
  replay of a compromised administrator cookie. Distinct delegated-client
  credentials, revocation, and independent browser/deployed acceptance remain
  separate release gates.
- Legacy active subscriptions, `CHECKOUT` source rows, and payment intents need
  read-only data inventory before deciding any migration; this task leaves
  them intact.
- The backtest concurrency entitlement is not enforced by this change; that
  route is outside this bounded plan/role mutation fix.
- Full architecture graph regeneration is blocked by five pre-existing missing
  references to `AGENTS.md`, `.agents/core/operating-system.md`, and
  `.codex/agents/ai-red-team-agent.md`. The registry and readable nodes are
  updated; journey indices regenerate successfully, but the overall graph
  JSON still awaits those reference repairs by their owner.

## Local validation
- Full API Vitest rerun: 231 files passed, 3 skipped; 1616 tests passed,
  10 skipped. The initial run exposed seven test files relying on automatic
  plan assignment; explicit test fixtures were added and the complete rerun
  passed.
- Root `pnpm run typecheck`: API and Web passed.
- `pnpm run docs:parity:check`: passed (API 22/22, Web 15/15, Routes 38/38).
- `pnpm run quality:guardrails`: passed, including architecture drift at zero
  missing representative paths.
- `pnpm run architecture:journey:index`: passed with zero critical gaps.
- `git diff --check`: passed.
- `pnpm run architecture:graph:generate`: blocked by the five missing file
  references listed above; no synthetic agent files were created.

## Independent acceptance request
1. With a fresh account, verify profile shows no active plan and a plan-gated
   bot action fails closed.
2. In the administrator browser panel, assign a plan and change a test user's
   role; verify readback and audit entries.
3. Retry the same mutations as a regular user and as a bearer-only admin API
   client; verify 403 and unchanged state.
4. Verify the checkout-intent route is absent and historical payment rows are
   preserved in a non-production fixture.
5. Record the deployed SHA and run an authenticated browser journey before
   declaring production acceptance.

## Independent acceptance result and follow-up
- Independent local acceptance of `f5888ab20c3e95ff97ec37767ecbb7467ef4a232`
  failed with P1 client-boundary reproductions: a legacy admin JWT copied from
  Bearer into Cookie could change a role, and a Bearer user token could create
  an exchange API key. This task is not accepted as a security boundary.
- Bounded remediation and re-verification are tracked in
  `history/tasks/soar-admin-plan-001a-client-boundary-2026-10-19-task.md`.
