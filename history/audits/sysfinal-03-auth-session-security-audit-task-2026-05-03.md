# Task

## Header
- ID: SYSFINAL-03
- Title: Audit auth session security and permissions
- Task Type: qa
- Current Stage: verification
- Status: DONE
- Owner: Security
- Depends on: SYSFINAL-02
- Priority: P0
- Iteration: 4
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`SYSFINAL-02` proved the full local repository baseline is green. The next
master-plan slice audits auth, session, permissions, API-key handling, admin
boundaries, upload controls, and LIVE entitlement fail-closed behavior before
runtime/trading audits continue.

## Goal
Verify current auth/session/security/permission surfaces and classify any
confirmed discrepancy into a scoped `SYSFIX-*` task.

## Success Signal
- User or operator problem: final system confidence requires proof that
  protected data and money-impacting controls remain fail-closed.
- Expected product or reliability outcome: auth, ownership, admin, API-key,
  upload, and LIVE entitlement checks pass focused verification.
- How success will be observed: focused security/API and web tests plus
  dependency audit pass; no confirmed discrepancy remains unclassified.
- Post-launch learning needed: no.

## Deliverable For This Stage
Security verification artifact with threat model, focused validation evidence,
and discrepancy classification.

## Scope
- Auth registration/login/logout/current-user/session behavior.
- Auth cookies and JWT/session-version behavior.
- `requireAuth` middleware.
- Cross-user data isolation.
- API-key lifecycle masking/encryption/probe behavior.
- Subscription and LIVE bot entitlement fail-closed behavior.
- Admin users/subscription-plan role boundaries.
- Avatar upload auth/MIME/size controls.
- Web login/session/API-key/subscription surfaces.
- Dependency vulnerability audit.

## Implementation Plan
1. Review security lifecycle and relevant auth/API-key module docs.
2. Identify focused test coverage for auth/session/permissions/API keys/admin
   and web touchpoints.
3. Run focused API security pack with explicit API-key test encryption env.
4. Run focused web auth/profile/admin security-adjacent pack.
5. Run `pnpm audit`.
6. Classify failures. If none, close `SYSFINAL-03` and advance queue.

## Acceptance Criteria
- Login/logout/current-user/session tests pass.
- Invalid/expired/deleted-user auth behavior remains fail-closed.
- Cross-user ownership denial tests pass.
- API-key responses stay masked and encrypted paths pass focused tests.
- Admin routes deny non-admin users and pass admin workflows.
- LIVE write entitlement/consent guard coverage passes.
- No dependency vulnerability is reported.

## Constraints
- Do not mutate LIVE production state.
- Do not implement fixes during audit before classification.
- Keep secrets out of docs and command output.
- Use existing security primitives and test suites.

## Definition of Done
- [x] Focused API security pack passes.
- [x] Focused web security-adjacent pack passes.
- [x] Dependency audit passes.
- [x] No `SYSFIX-*` task is needed, or any needed task is explicitly queued.
- [x] Context and planning files are synchronized.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Relying on client-only authorization.
- Exposing API secrets or raw credentials in artifacts.
- Performing LIVE production mutations during audit.
- Treating a command quoting issue as a product failure.

## Lightweight Threat Model
- Assets: user accounts, session tokens/cookies, API keys/secrets, subscription
  entitlements, wallets, bots, orders, positions, audit logs, admin controls.
- Actors: anonymous visitor, authenticated user, non-admin user, admin user,
  attacker with stale/invalid token, user attempting cross-tenant access.
- Trust boundaries: browser, API middleware, database, exchange adapter,
  upload parser, admin/ops network, payment/subscription boundary.
- Entry points: `/auth/*`, `/dashboard/*`, `/admin/*`, `/upload/avatar`,
  profile API-key endpoints, bot LIVE create/update paths.
- Abuse cases: brute-force login, stale token reuse after user deletion,
  cross-user entity access, non-admin admin access, API-key leakage, upload
  abuse, LIVE write without entitlement/consent.
- Required controls: rate limits, server-side auth, role checks, ownership
  checks, masked responses, encrypted storage, upload validation, LIVE
  fail-closed guards.
- Tests or checks: focused API/web security packs and `pnpm audit`.
- Residual risk: production/browser manual auth smoke remains part of later
  final closure; no local automated discrepancy found.

## Validation Evidence
- Tests:
  - `$env:API_KEY_ENCRYPTION_KEYS='v1:test-key-material'; $env:API_KEY_ENCRYPTION_ACTIVE_VERSION='v1'; pnpm --filter api run test -- --run src/modules/auth/auth.e2e.test.ts src/modules/auth/auth.service.test.ts src/modules/auth/auth.cookie.test.ts src/modules/auth/auth.jwt.test.ts src/modules/auth/auth.errors.test.ts src/middleware/requireAuth.test.ts src/modules/isolation/data-isolation.e2e.test.ts src/modules/profile/apiKey/apiKey.e2e.test.ts src/modules/profile/apiKey/binanceApiKeyProbe.service.test.ts src/modules/profile/subscription/subscription.e2e.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts src/modules/admin/users/users.e2e.test.ts src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts src/modules/upload/upload.e2e.test.ts` PASS (`14` files, `75` tests).
  - `pnpm --filter web run test -- --run "src/app/(public)/auth/authPageCacheContract.test.ts" "src/context/AuthContext.test.tsx" "src/features/auth/components/LoginForm.test.tsx" "src/features/auth/hooks/useLoginForm.test.ts" "src/features/profile/components/ApiKeyForm.test.tsx" "src/features/profile/components/ApiKeysList.test.tsx" "src/features/profile/components/Subscription.test.tsx" "src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx"` PASS (`8` files, `28` tests).
  - `pnpm audit` PASS (`No known vulnerabilities found`).
  - `pnpm run quality:guardrails` PASS after docs/context sync.
- Manual checks:
  - Reviewed `docs/security/secure-development-lifecycle.md`.
  - Reviewed `docs/security/api-key-lifecycle-policy.md`.
  - Reviewed `docs/modules/api-auth.md`.
  - Classified one failed web command as PowerShell quoting for
    `src/app/(public)/...`; reran with quoted path and passed.
- Screenshots/logs: terminal command output in this execution session.
- High-risk checks:
  - No LIVE production mutation performed.
  - API-key test encryption env was test-only and did not include secrets.

## Discrepancy Classification
| Finding | Classification | Follow-up |
|---|---|---|
| Initial web test command failed on `src/app/(public)/...` path parsing. | Local command quoting issue in PowerShell, not product/test failure. | Reran with quoted path; PASS. No `SYSFIX-*`. |
| Focused API security pack | PASS. | No `SYSFIX-*`. |
| Focused web security-adjacent pack | PASS. | No `SYSFIX-*`. |
| Dependency audit | PASS. | No `SYSFIX-*`. |

## Architecture Evidence
- Architecture source reviewed:
  - `docs/security/secure-development-lifecycle.md`
  - `docs/security/api-key-lifecycle-policy.md`
  - `docs/modules/api-auth.md`
  - `history/audits/sysfinal-01-current-function-inventory-task-2026-05-03.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## UX/UI Evidence
- Design source type: approved_snapshot.
- Design source reference: current auth/profile/admin surfaces.
- Canonical visual target: current dashboard design system.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: not applicable; this was security
  verification, not visual audit.
- Visual-direction brief reviewed: not applicable.
- Existing shared pattern reused: current auth/profile/admin components.
- New shared pattern introduced: no.
- Design-memory entry reused: not applicable.
- Design-memory update required: no.
- Visual gap audit completed: no, planned in `SYSFINAL-07`.
- Background or decorative asset strategy: not applicable.
- Canonical asset extraction required: no.
- Screenshot comparison pass completed: no.
- Remaining mismatches: none found by tests; visual audit still pending.
- Required states: login/API-key/subscription state coverage verified by
  focused component tests where present.
- Responsive checks: planned in `SYSFINAL-07`.
- Input-mode checks: planned in `SYSFINAL-07`.
- Accessibility checks: covered only by existing tests in this slice; broader
  pass planned in `SYSFINAL-07`.
- Parity evidence: web auth/profile/admin focused tests pass.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: docs-only closure can be reverted.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: security-sensitive surfaces needed focused proof after baseline.
- Gaps: no local automated security gap found; production/manual closure still
  belongs to later smoke tasks.
- Inconsistencies: no architecture mismatch found.
- Architecture constraints: server-side auth/role/ownership remain
  authoritative; LIVE writes fail closed without entitlement/consent.

### 2. Select One Priority Task
- Selected task: `SYSFINAL-03`.
- Priority rationale: it is the next active queue item and protects
  auth/money/secret boundaries before runtime/trading audits.
- Why other candidates were deferred: runtime/trading/config audits depend on
  trusted auth and permission boundaries.

### 3. Plan Implementation
- Files or surfaces to modify: docs/context only after validation.
- Logic: run focused API and web security tests, dependency audit, classify.
- Edge cases: PowerShell path quoting, test-only encryption env, no LIVE
  production mutation.

### 4. Execute Implementation
- Implementation notes: no product implementation changes; executed
  verification commands and documented results.

### 5. Verify and Test
- Validation performed: focused API security pack, focused web security pack,
  dependency audit, guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: relying on the full baseline from `SYSFINAL-02`.
- Technical debt introduced: no.
- Scalability assessment: enough to proceed to runtime audit because core
  auth/permission/secret boundaries are green.
- Refinements made: quoted PowerShell path after initial shell parsing error.

### 7. Update Documentation and Knowledge
- Docs updated: this task artifact, MVP queue, execution plan, master plan.
- Context updated: task board and project state.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
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
The only failed command in this task was a shell quoting mistake caused by the
Next.js route group path `(public)` in PowerShell. The corrected command passed.

## Production-Grade Required Contract

### Goal
Audit auth/session/security/permission boundaries.

### Scope
Security-sensitive API and web tests plus dependency audit.

### Implementation Plan
Review security docs, run focused validation, classify discrepancies, sync
queue/context.

### Acceptance Criteria
All focused security checks pass or confirmed discrepancies are queued as
`SYSFIX-*`. Satisfied: all checks pass.

### Definition Of Done
`DEFINITION_OF_DONE.md` expectations are satisfied for this verification
stage: goal, scope, validation evidence, review, and result report are present.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: represented by API/web focused tests.
- Real API/service path used: automated API e2e/unit tests.
- Endpoint and client contract match: API and web focused tests passed.
- DB schema and migrations verified: indirectly through DB-backed e2e tests.
- Loading state verified: covered where existing web tests assert it.
- Error state verified: auth/API-key/security tests cover failure states.
- Refresh/restart behavior verified: not applicable in this slice.
- Regression check performed: focused API/web security packs and dependency
  audit.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: Patryk/operator and all authenticated users.
- Existing workaround or pain: none; this is final confidence evidence.
- Smallest useful slice: focused security audit before runtime audits.
- Success metric or signal: all security-focused checks pass.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: not applicable.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable to this security verification.
- Critical user journey: authenticated user accesses dashboard without
  cross-tenant or secret leakage.
- SLI: focused security validation pass rate.
- SLO: all focused checks pass.
- Error budget posture: healthy.
- Health/readiness check: covered in previous baseline and later ops smoke.
- Logs, dashboard, or alert route: audit-log read ownership covered by broader
  suite; not changed here.
- Smoke command or manual smoke: not run in this local verification slice.
- Rollback or disable path: revert docs-only changes.

## AI Testing Evidence
Not applicable. This task did not change AI behavior.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes.
- Data classification: credentials, sessions, API keys, subscription
  entitlements, admin data, user trading data.
- Trust boundaries: browser, API auth middleware, role middleware, ownership
  checks, database, exchange API-key probe, upload parser.
- Permission or ownership checks: `requireAuth`, admin e2e, data isolation,
  API-key ownership, subscription entitlement tests passed.
- Abuse cases: invalid session, cross-user access, non-admin admin access,
  upload abuse, API-key leakage, LIVE write without entitlement.
- Secret handling: API-key focused tests and policy review passed; no secrets
  written to docs.
- Security tests or scans: focused API/web packs and `pnpm audit`.
- Fail-closed behavior: auth middleware, deleted/invalid user, ownership,
  admin role, upload validation, and LIVE entitlement checks pass.
- Residual risk: production manual/browser smoke remains in later final closure
  tasks.

## Result Report
- Task summary: audited auth/session/security/permission surfaces and found no
  confirmed discrepancy requiring `SYSFIX-*`.
- Files changed: this artifact plus queue/context docs.
- How tested: focused API security pack (`14` files / `75` tests), focused web
  pack (`8` files / `28` tests), `pnpm audit`, and guardrails all passed.
- What is incomplete: runtime, trading, configuration, product UX, and
  production smoke audits remain queued.
- Next steps: execute `SYSFINAL-04` dashboard and bot runtime truth audit.
- Decisions made: no new product or architecture decisions.
