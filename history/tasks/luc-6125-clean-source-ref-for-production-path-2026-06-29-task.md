# Task

## Header
- ID: LUC-6125
- Title: Clean source ref for LUC-6122 production path
- Task Type: release-source-control
- Current Stage: verification
- Status: DONE / CLEAN_LOCAL_RC_REF_CREATED / PUSH_NOT_PERFORMED
- Owner: CTO
- Depends on: [LUC-6122](/LUC/issues/LUC-6122), [LUC-6121](/LUC/issues/LUC-6121)
- Priority: P0
- Module Confidence Rows: Auth session, release source provenance
- Requirement Rows: Production logout/session proof repair on clean source path
- Risk Rows: Dirty divergent shared checkout, production redeploy trigger
- Iteration: 2026-06-29
- Operation Mode: BUILDER
- Mission ID: LUC-6125-CLEAN-SOURCE-REF-FOR-PRODUCTION-PATH-2026-06-29
- Mission Status: VERIFIED_LOCAL_SOURCE_REF

## Context
[LUC-6121](/LUC/issues/LUC-6121) produced local repair commit
`5f7aea86f76e9b79bb087be72f6b0bc770b232bf`, but the shared project checkout
was dirty and divergent from `origin/main`.

## Goal
Produce a clean release-candidate source state for [LUC-6122](/LUC/issues/LUC-6122)
without reverting unrelated work, force-pushing, deploying, or mutating
production.

## Scope
- Source-control classification in `C:/Personal/Projekty/Aplikacje/Soar`.
- Isolated clean worktree creation at
  `C:/Personal/Projekty/Aplikacje/Soar-luc6125-clean-ref`.
- Cherry-pick of the [LUC-6121](/LUC/issues/LUC-6121) repair commit onto
  current `origin/main`.

## Implementation Plan
1. Read issue context and current repo source-control state.
2. Fetch `origin/main` read-only.
3. Create an isolated clean worktree from `origin/main`.
4. Cherry-pick only the logout proof repair commit.
5. Verify branch ancestry, dirty status, diff, and focused proof-helper test.
6. Record push/deploy eligibility and residual validation caveats.

## Acceptance Criteria
- [x] Existing dirty/untracked shared checkout classified without reverting work.
- [x] `origin/main` reconciled safely by using a new branch/worktree; no force push.
- [x] Logout proof repair preserved as descendant commit.
- [x] Final branch, SHA, dirty status, checks, push eligibility, and deploy impact recorded.
- [x] No push or deploy performed from dirty/divergent shared `main`.

## Validation Evidence
- Shared checkout before isolation:
  - branch: `main...origin/main [ahead 18, behind 2]`
  - dirty porcelain rows: `242`
  - classification: `state-context=8`, `docs-architecture-modules=4`,
    `generated-docs=12`, `ops-generated=4`, `history-generated=214`.
- Clean RC worktree:
  - path: `C:/Personal/Projekty/Aplikacje/Soar-luc6125-clean-ref`
  - branch: `luc-6125-clean-source-ref`
  - base: `origin/main` `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
  - head: `c357d957741f56835f27a1fc3a948dad43a91036`
  - merge-base with `origin/main`: `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
  - status: `luc-6125-clean-source-ref...origin/main [ahead 1]`, clean.
- Diff scope from `origin/main..HEAD`:
  - `apps/api/src/modules/auth/auth.e2e.test.ts`
  - `scripts/runProdAuthSessionBrowserProof.mjs`
  - `scripts/runProdAuthSessionBrowserProof.test.mjs`
  - `history/evidence/luc-6121-production-logout-session-invalidation-repair-2026-06-29.md`
  - `history/tasks/luc-6121-production-logout-session-invalidation-repair-2026-06-29-task.md`
- Checks:
  - `git diff --check origin/main..HEAD`: PASS.
  - `pnpm exec node --test scripts/runProdAuthSessionBrowserProof.test.mjs`:
    PASS (`5/5`).
  - `pnpm --filter api exec vitest run src/modules/auth/auth.e2e.test.ts src/middleware/requireTrustedOrigin.test.ts src/middleware/rateLimit.test.ts --reporter=verbose`:
    NOT PASSED in the isolated worktree because dependencies were not linked
    there (`redis`/`supertest` import failures) and local PostgreSQL was closed
    (`127.0.0.1:5432` TCP false). The same focused DB-backed proof passed on
    the original [LUC-6121](/LUC/issues/LUC-6121) run after infra restoration.
  - `pnpm install --frozen-lockfile`: BLOCKED by existing repo
    `pnpm.overrides` / lockfile config mismatch; lockfile was not rewritten in
    this release-source lane.

## Deployment / Ops Evidence
- Push performed: no.
- Deploy performed: no.
- Push eligibility: source ref is locally clean and linear on `origin/main`, but
  push remains production-impacting because Coolify may redeploy from the pushed
  source path. Ops/Delivery must explicitly own the push/redeploy step.
- Expected production follow-up after push: DRE verifies Coolify redeploy/build
  provenance for `c357d957741f56835f27a1fc3a948dad43a91036`; QVE reruns the
  [LUC-6109](/LUC/issues/LUC-6109) auth-session browser proof and acceptance
  sweep.
- Rollback path: do not push the branch; if pushed and redeployed, revert
  `c357d957741f56835f27a1fc3a948dad43a91036` or redeploy the previous known
  production SHA after Ops approval.

## Result Report
- Task summary: created a clean local release-candidate branch/worktree that
  contains only the production auth logout proof repair on top of current
  `origin/main`.
- Files changed in production candidate ref: scoped auth proof/test/evidence
  files from [LUC-6121](/LUC/issues/LUC-6121).
- Files changed in shared checkout by this task: this task record only.
- What is incomplete: no push, deploy, production smoke, or protected auth
  proof rerun was performed in this CTO source-control lane.
- Next owner: Delivery/Ops owns the explicit push/redeploy decision for
  `luc-6125-clean-source-ref`; DRE/QVE own post-redeploy provenance and
  protected auth proof.
