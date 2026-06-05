# Task

## Header
- ID: LUC-2255
- Title: Fresh browser proof for public/read-only web actions
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Priority: P1
- Module Confidence Rows: Web public/auth surfaces
- Requirement Rows: User-action public/read-only proof rows
- Quality Scenario Rows: Browser reachability, responsive public surfaces
- Risk Rows: Public route proof freshness; deploy-dependent production parity
- Operation Mode: BUILDER
- Mission ID: LUC-2255-FRESH-BROWSER-PROOF-PUBLIC-READ-ONLY-WEB-ACTIONS-2026-06-05
- Mission Status: VERIFIED

## Context
Wake payload assigned [LUC-2255](/LUC/issues/LUC-2255) to Frontend Engineer for a fresh browser proof of public/read-only Web actions. The current generated user-action index marks public home, register, offline, and auth-adjacent read-only UI actions as local-only or missing fresh browser proof.

## Goal
Produce fresh browser evidence for public/read-only Web actions and fix small Frontend-owned defects discovered by that proof without touching protected auth, production accounts, exchange state, deployment, or backend behavior.

## Scope
- `scripts/runPublicReadOnlyBrowserProof.mjs`
- `apps/web/src/app/(public)/terms/page.tsx`
- `apps/web/src/app/(public)/privacy/page.tsx`
- Evidence artifacts:
  - `history/artifacts/luc-2255-public-read-only-browser-proof-2026-06-05.json`
  - `history/evidence/luc-2255-public-read-only-browser-proof-2026-06-05.md`
  - `history/artifacts/luc-2255-local-public-read-only-browser-proof-2026-06-05.json`
  - `history/evidence/luc-2255-local-public-read-only-browser-proof-2026-06-05.md`

## Implementation Plan
1. Add a reusable fresh-browser proof runner for unauthenticated public/read-only Web actions.
2. Run the proof against production to establish current truth.
3. Fix Frontend-owned public route defects discovered by the proof.
4. Run focused Web tests and typecheck.
5. Attempt local rendered proof against the current checkout.
6. Record exact blockers and residual risk without claiming protected or production readiness.

## Acceptance Criteria
- Fresh browser proof artifact exists and records route/action results.
- Public/read-only proof does not use credentials, protected routes, form submits, account mutation, exchange mutation, deploy, or database writes.
- Focused Web tests and typecheck pass for touched surfaces.
- Any failure to produce final rendered proof is recorded with exact blocker and cleanup evidence.

## Definition of Done
- [x] Browser proof runner added.
- [x] Production proof executed and recorded.
- [x] Missing public legal-link targets fixed locally.
- [x] Focused Web tests passed.
- [x] Web typecheck passed.
- [x] Final local rendered browser proof passed.
- [ ] Production proof passed after deploy.

## Validation Evidence
- `node --check scripts/runPublicReadOnlyBrowserProof.mjs` -> PASS.
- Production browser proof:
  `node scripts\runPublicReadOnlyBrowserProof.mjs --issue LUC-2255 --today 2026-06-05 --web-base-url https://soar.luckysparrow.ch`
  -> FAIL, artifact generated. Passing rows: public home desktop/mobile, login desktop/mobile, offline desktop/mobile. Failing rows: register desktop/mobile due production 404 prefetch for `/terms` and `/privacy`; password toggle rows failed in the first runner revision.
- Focused Web tests:
  `pnpm --filter web exec vitest run src/context/AuthContext.test.tsx src/ui/layout/public/Header.test.tsx`
  -> PASS (`2` files / `7` tests).
- Web typecheck:
  `pnpm --filter web run typecheck` -> PASS.
- Build/local rendered proof blocker:
  `pnpm --filter web run build` -> FAIL during Next prerender with existing `/404` error:
  `<Html> should not be imported outside of pages/_document`; no matching `next/document` or `<Html>` import was found in `apps/web` by `rg`.
- Local dev/start blocker:
  `pnpm --filter web run dev`, `pnpm --dir apps/web run dev`, and `pnpm --filter web exec next start -p 3002` did not produce a usable local rendered target in this runner. The incomplete `.next` also prevented `next start` because `prerender-manifest.json` was absent.
- Blocker resolution:
  [LUC-2261](/LUC/issues/LUC-2261) repaired local Web build/start by routing Web build/start through `scripts/runWebNextProductionCommand.mjs`. Fresh validation for the resumed [LUC-2255](/LUC/issues/LUC-2255) heartbeat: `node --check scripts/runPublicReadOnlyBrowserProof.mjs` -> PASS, `node --check scripts/runWebNextProductionCommand.mjs` -> PASS, and `pnpm --filter web run typecheck` -> PASS.
- Final local browser proof:
  `node scripts\runPublicReadOnlyBrowserProof.mjs --issue LUC-2255 --today 2026-06-05 --web-base-url http://127.0.0.1:3101 --output-json history\artifacts\luc-2255-local-public-read-only-browser-proof-2026-06-05.json --output-md history\evidence\luc-2255-local-public-read-only-browser-proof-2026-06-05.md --cdp-port 9365`
  -> PASS. Covered desktop/mobile public home, login, register, terms, privacy, offline, and login/register password visibility toggles. All rows passed with `0` recorded browser issues.
- Cleanup:
  dev server process trees started for this task were terminated with `taskkill /T /F`; final port `3002` check returned no listener. CDP proof port `9355` returned no active TCP listener. A stale WMI process row for an earlier Edge PID was observed without an active port owner.
  Resumed heartbeat cleanup stopped the local Web server process tree for `3101`; final readback found no listeners on `3101` or `9365`. Windows still reported one proof-owned orphan `msedge.exe` PID `40008` with `--remote-debugging-port=9365` in its command line but no active TCP listener; `taskkill`, `Stop-Process`, and `wmic terminate` could not remove it in this runner. The cleanup pitfall is recorded in `.codex/context/LEARNING_JOURNAL.md`.

## Architecture Evidence
- Architecture source reviewed: `docs/status/user-action-index.md`, `docs/status/function-journey-index.md`, `.agents/core/project-memory-index.md`, `.agents/core/mission-control.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no architecture mismatch; proof surfaced public route defects and existing local Next build/start blocker.
- Decision required from user: no.
- Follow-up architecture doc updates: none; no architecture behavior changed.

## UX/UI Evidence
- Design source type: not applicable; this was route/action proof and missing public target closure.
- Required states: public success/read-only route render; auth forms hydrated enough for read-only password visibility toggle.
- Responsive checks: production proof covered desktop and mobile viewports for public routes; final local proof covered desktop and mobile for public home, login, register, terms, privacy, and offline.
- Accessibility checks: final local proof verifies login/register password visibility toggles change input type and accessible label.
- Parity evidence: production artifact records current deployed truth; local production-server proof verifies the current checkout.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: remove the two public pages and proof runner if needed; no backend/data migration involved.
- Staged rollout or feature flag: not applicable.

## Security / Privacy Evidence
- Data classification: public pages and route metadata only.
- Trust boundaries: unauthenticated public Web; no protected auth/session evidence claimed.
- Abuse cases: substituting public proof for protected release proof; storing secrets in evidence; submitting auth forms. All were avoided.
- Secret handling: no credentials, cookies, tokens, or private response bodies were used or stored.
- Fail-closed behavior: unauthenticated `/auth/me` 401 during public pages is filtered as expected auth probe noise, not accepted as protected proof.
- Residual risk: production remains on the old deployed bundle until a release/deploy lane ships the local changes and reruns production proof. Local proof does not replace protected/authenticated production proof.

## Result Report
- Task summary: Added a reusable public/read-only browser proof runner, captured current production failure evidence, fixed missing public `/terms` and `/privacy` targets locally, and corrected the runner's password-toggle locator to use the password input sibling button.
- Files changed:
  - `scripts/runPublicReadOnlyBrowserProof.mjs`
  - `apps/web/src/app/(public)/terms/page.tsx`
  - `apps/web/src/app/(public)/privacy/page.tsx`
  - `history/artifacts/luc-2255-public-read-only-browser-proof-2026-06-05.json`
  - `history/evidence/luc-2255-public-read-only-browser-proof-2026-06-05.md`
  - `history/artifacts/luc-2255-local-public-read-only-browser-proof-2026-06-05.json`
  - `history/evidence/luc-2255-local-public-read-only-browser-proof-2026-06-05.md`
- How tested: node syntax checks, production fresh-browser proof, focused Web tests, Web typecheck, local production-server fresh browser proof PASS.
- What is incomplete: production PASS proof remains deploy-dependent; protected/authenticated proof remains explicitly out of scope.
- Next steps: after deploy, rerun `scripts/runPublicReadOnlyBrowserProof.mjs` against production and keep it separate from protected/authenticated release proof.
- Decisions made: public proof remains separate from protected/authenticated proof and does not advance release readiness by itself.
