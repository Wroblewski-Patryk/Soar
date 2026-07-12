# LUC-631 Browser Proof Plan And Public Read-Only Proof

## Header
- ID: LUC-631
- Title: Build browser/proof plan for 452 app-completion browser gaps
- Task Type: research
- Current Stage: planning
- Status: REVIEW
- Owner: QA/Test
- Priority: P0
- Mission ID: LUC-631-BROWSER-PROOF-PLAN-2026-07-12
- Mission Status: PARTIALLY_VERIFIED

## Context
`docs/status/app-completion-index.md` reports 452 `needs_browser_review`
items across eight user-flow buckets. `docs/graphs/user-action-index.json`
maps the executable UI proof surface to 41 route/action rows: 6 public/read-only
actions and 35 protected/admin/mutating or destructive actions that require
authenticated local or approved protected proof.

## Goal
Create the route/workflow proof plan and run the smallest safe browser proof
slice that does not require credentials, protected routes, account mutation,
exchange mutation, subscription mutation, deploy, restart, rollback, or DB/env
changes.

## Constraints
- Use existing proof harnesses and generated indexes.
- Do not use real user accounts.
- Do not mutate live trading, exchange, subscription, admin, or account state.
- Do not claim protected production behavior from public/read-only proof.

## Definition of Done
- Produce a proof matrix using statuses: verified, implemented but not verified,
  present in code behavior unknown, missing, or blocked by exact error.
- Record browser evidence when proof is run.
- Identify owner-scoped follow-up lanes instead of broad TODOs.

## Result Report
- Public/read-only proof: verified on production public routes using
  `pnpm exec node scripts/runPublicReadOnlyBrowserProof.mjs --issue LUC-631 --today 2026-07-12`.
- Evidence:
  `history/evidence/luc-631-public-read-only-browser-proof-2026-07-12.md`
  and `history/artifacts/luc-631-public-read-only-browser-proof-2026-07-12.json`.
- Result: PASS for `/`, `/auth/login`, `/auth/register`, `/terms`,
  `/privacy`, `/offline` on desktop and mobile, plus login/register password
  visibility toggle behavior.
- Protected/admin/money/destructive routes remain implemented but not verified
  by this heartbeat and require a local authenticated fixture lane or approved
  protected production lane.

## Validation Evidence
- Tests: not run; this was a browser proof/planning lane.
- Manual checks: app-completion index, user-action index, view-map ownership,
  and package proof scripts inspected.
- Browser/log artifacts: PASS evidence listed above.
- High-risk checks: no credentials, cookies, account state, protected routes,
  forms submit, exchange settings, live-trading behavior, deploy, restart,
  rollback, env, or DB mutation were used.
- Reality status: partially verified.

## Next Owner Path
- QA/Test owns the next protected local fixture proof pass with
  `qa:local-protected-route-actions:proof` when authenticated local fixtures are
  available.
- Frontend owns repair issues for any route render, responsive, accessibility,
  or state defect found by that pass.
- Backend/Integration/Security/Ops own follow-ups for API, exchange,
  credential, permission, protected-production, or live-mutation blockers.
