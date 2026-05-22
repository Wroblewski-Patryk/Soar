# Active Mission Packet

Last updated: 2026-05-23

Use this file as the first operational router for `pracuj dalej`, `rob dalej`,
`kontynuuj`, `next`, and similar continuation nudges. Keep it short enough that
a fresh coordinator can choose the next checkpoint without rereading the whole
repository history.

## Current Mission

- Mission ID: `REPO-SOT-FUNCTION-PARITY-2026-05-23`
- Status: VERIFIED_LOCAL
- Selected objective: remove obsolete competing root template source-of-truth
  folders, then continue architecture-to-backend/frontend parity verification
  for bot runtime functions and production availability after VPS restart.
- Why this mission now: the operator noticed duplicate architecture-looking
  folders and asked the team to coordinate cleanup plus continued proof that
  documented bot functions work across backend, frontend, and integration.
- Release objective or product milestone advanced: reduce agent/operator drift
  from duplicate docs and keep the runtime parity audit moving toward usable
  production proof.
- First/next checkpoint: remove obsolete root `architecture/`, `agents/`,
  `pipelines/`, `tasks/`, `tests/`, `deploy/`, and `src/README.md` template
  files while preserving canonical `docs/architecture/`, `.agents/`,
  `.codex/context`, `docs/pipelines/`, and referenced evidence under
  `outputs/`; integrate read-only subagent findings for backend/frontend parity
  before selecting the next code slice.
- Stop conditions: required production credentials, raw secret access, real
  live-money mutation, destructive production action, architecture mismatch
  requiring product decision, or failing quality gate that cannot be safely
  fixed in this mission.
- Parent validation gate: focused P0 unit regressions, API typecheck,
  repository guardrails, source-of-truth updates, then commit/push when green.

## Source Rows

- Task board: `REPO-SOT-CLEANUP-2026-05-23`
- Planning:
  `docs/planning/repo-source-truth-cleanup-2026-05-23-task.md`
- Delivery map: runtime bot lifecycle, backtest parity, order/fill lifecycle,
  operator-visible bot correctness.
- Requirements: DCA-first close gating, one lifecycle meaning across
  BACKTEST/PAPER/LIVE, fill authority for LIVE, idempotent side-effect paths.
- Quality scenarios: live-trading safety, fail-closed runtime behavior,
  runtime/backtest parity, regression resistance.
- Risks: duplicate LIVE side effects after crash/retry, false LIVE fill
  lifecycle truth, account-update scoping drift, misleading protection read
  models, production deploy unavailable for final proof.
- Module confidence: `SOAR-BOT-RUNTIME-001`, `SOAR-BACKTESTS-001`,
  `SOAR-ORDERS-001`, `SOAR-OPERATIONS-001`
- System health:
  `docs/planning/runtime-architecture-dca-tp-parity-2026-05-22-task.md`
- Architecture / runtime sources:
  `docs/architecture/06_execution-lifecycle.md`,
  `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`,
  `docs/architecture/reference/execution-lifecycle-parity-contract.md`,
  `docs/architecture/reference/live-protection-state-parity-contract.md`,
  `.agents/state/module-confidence-ledger.md`, `.agents/core/quality-gates.md`

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, state, docs | Integration, task closure, source-of-truth updates | Mission packet, task evidence, final acceptance | Parent validation gate | VERIFIED_LOCAL |
| Documentation/Structure | Explorer lane + coordinator cleanup | AGENTS, docs source-of-truth rules | Root template folders and documentation routing | Obsolete source-of-truth cleanup and findings | Guardrails/diff/reference scans | COMPLETE |
| Backend runtime/API parity | Explorer lane | docs/architecture runtime contracts | API/runtime/backtest/order lifecycle | Confirmed drift list or no-drift evidence | File/line evidence and test recommendations | COMPLETE |
| Frontend/integration parity | Explorer lane + coordinator fix | docs/architecture + module docs | Web dashboard/API client/build-info surfaces | Confirmed drift list or no-drift evidence | File/line evidence and focused tests | COMPLETE |
| Runtime lifecycle | Explorer lane | runtime lifecycle reference contracts | Engine and bot runtime read models | P1/P2 findings; DCA gates verified aligned | File/line evidence | COMPLETE |
| Orders/exchange fill authority | Explorer lane + coordinator fix | fill/idempotency contracts | Orders and runtime dedupe | Two P0 findings fixed | Focused tests | CHECKPOINTED |
| Backtest parity | Explorer lane + coordinator fix | Backtest replay/report parity | Backtest/reports code | Closed-candle gateway and settled-report fixes; TSL naming fixed; multi-strategy now fails fast but full merge parity remains open | Focused tests | CHECKPOINTED |
| Ops/deploy reality | Explorer lane + coordinator fix | Production endpoints, deployment docs | Worker readiness/deploy smoke | Deploy smoke, compose, API DB readiness, rollback readiness, durable Redis backtest queue ownership, and Redis heartbeat readiness fixed locally | Focused tests/script/compose checks | CHECKPOINTED |
| Ops/deploy reality | Coordinator serial lane | Production endpoints, deployment docs | Public health/build-info probes | Current production timeout recorded as blocker | HTTP probe output | BLOCKED |
| Documentation/Memory | Coordinator | State files and docs | Source-of-truth updates and residual risks | Task evidence and state updates | Guardrails/diff checks | IN_PROGRESS |

## Delegation Plan

- Lanes kept local: coordinator, P0 fixes, source-of-truth updates, parent
  validation.
- Lanes delegated: runtime lifecycle explorer, orders/exchange explorer,
  backtest/report explorer, ops/deploy explorer.
- Lanes intentionally omitted and why: production deploy/proof is blocked by
  current endpoint timeouts and must not be mixed with local code proof.
- Known overlap risks: live-trading runtime files are high-risk and require
  focused tests before commit/push.
- Forbidden files or surfaces: no live-money mutation, no production data
  mutation, no raw secret capture, no hidden risk-ack or fill-authority bypass.

## Acceptance

- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Parent validation will run after accepted lane integration.
- [x] Missing or unclear ownership will be recorded in `.agents/state/responsibility-learning.md`.
- [x] Process quality will be evaluated in `.agents/state/agent-evals.md` when
      this mission is broad, repeated, partial, or subagent-heavy.

## Checkpoint Log

| Date | Checkpoint | Result | Evidence | Next action |
| --- | --- | --- | --- | --- |
| 2026-05-23 | Source-of-truth duplicate cleanup | VERIFIED_LOCAL: confirmed `docs/architecture/` is canonical and root `architecture/` plus related root template folders are obsolete competing scaffolding from 2026-05-03. Removed only tracked obsolete template files; moved referenced evidence under `docs/operations/`; moved root security report under `docs/security/`; fixed P2 legacy redirects to Dashboard Home runtime tabs. Backend parity lane confirmed one remaining P1 deferred backtest multi-strategy merge gap. | `docs/planning/repo-source-truth-cleanup-2026-05-23-task.md`; subagent reports; focused web tests `7/7`; web typecheck; web build; docs parity; guardrails; diff check | Commit/push, wait for production build-info to expose pushed SHA, then run smoke checks. |
| 2026-05-23 | Web build-info Docker deploy proof | VERIFIED_LOCAL / PROD_REDEPLOY_PENDING: first manual Coolify redeploy of `soar-web` reached commit `b68d3464` in deployment history, but public `/api/build-info` returned `gitSha: null`. Root cause was Web build metadata being written into `.next` before Next cleared that directory, combined with Docker build context excluding `.git`. Fixed Docker build metadata by copying minimal `.git` metadata only into the Web build stage and writing metadata to `.build-meta/BUILD_META.json`; local Docker image now returns the expected SHA from `/api/build-info`. | `docker build -f apps/web/Dockerfile -t soar-web-buildmeta-check .`; `GET http://127.0.0.1:3102/api/build-info` => `b68d3464b373db361153e1885be83e035f55f197`; `web build`; `web typecheck`; `quality:guardrails` | Commit/push build-info metadata fix, redeploy `soar-web`, wait for public build-info freshness, then run deploy smoke. |
| 2026-05-22 | Public web deploy-proof route hardening | VERIFIED locally, BLOCKED in production readback: converted `/auth/login`, `/auth/register`, and `/api/build-info` to static prerendered routes and removed per-request build-info time generation. Commit `1b351a51` is pushed to `main`, but production probes time out and an external reader/proxy reports `ERR_ADDRESS_UNREACHABLE` for the production web and Coolify hostnames. | Targeted auth cache contract `2/2`; `web build` route output shows `/auth/login`, `/auth/register`, and `/api/build-info` as `Static`; `web typecheck`; `quality:guardrails`; `git diff --check`; local production HTTP smoke `200` for all three routes; `docs/operations/deploy-freshness-1b351a51-2026-05-22.md` | Restore VPS/public routing or use an operator Coolify context that can reach Soar resources, then rerun build-info wait and deploy smoke. |
| 2026-05-22 | Architecture-code runtime audit P0/P1 closure | CHECKPOINTED locally: four read-only lanes found remaining architecture/code drift. Fixed two P0 orders/exchange findings plus safe local P1 drifts in imported LIVE dynamic stop display, backtest closed-candle windowing, reports settled-trade aggregation, deploy smoke worker readiness, VPS split-worker compose defaults, API DB readiness, and rollback worker-readiness proof. | `docs/planning/architecture-code-runtime-audit-2026-05-22-task.md`; focused API pack `88/88`; readiness/backtest/report pack `20/20`; script syntax checks; VPS compose config | Run typecheck/guardrails/diff check, commit/push, then continue deeper P1 findings. |
| 2026-05-22 | Runtime architecture DCA/close parity | VERIFIED locally: architecture audit found confirmed runtime/backtest drift where basic `TP` could close while profit-side DCA levels remained pending, and `SL`/`TSL` used an all-DCA gate instead of matching pending loss-side DCA. Fixed runtime core and backtest helper parity so `TP`/`TTP` gate on profit-side DCA and `SL`/`TSL` gate on loss-side DCA; added focused runtime automation, position-management, replay, and portfolio regressions. Production endpoints timed out from this shell and remain an ops blocker, not local code proof. | `docs/planning/runtime-architecture-dca-tp-parity-2026-05-22-task.md`; focused combined pack `104/104`; SL/TSL correction pack `71/71`; API typecheck; repository guardrails; `git diff --check` with line-ending warnings only | Commit/push, then continue broader architecture audit or production availability/deploy proof as the next checkpoint. |
| 2026-05-21 | Standards-based security hardening | VERIFIED locally: coordinated defensive lanes against OWASP/NIST/CISA guidance. Fixed API-key mass assignment, LIVE cancel entitlement fail-closed gap, frontend raw-secret/error exposure hardening, ops secret-argv/env-file policy, and avatar decoded-pixel budget. | `docs/planning/standards-based-security-hardening-2026-05-21-task.md`; Web `151` files / `533` tests; API cancel/API-key DB pack `20` tests; avatar processing `2` tests; script tests `9` tests; API/Web typecheck; production audit; compose config; build; guardrails; `git diff --check`; cleanup checks | External pentest/VPS review, protected `AUD-19`, and explicit LIVE exchange-side mutation proof remain separate gates before commercial security claims. |
| 2026-05-21 | Protected V1 app proof follow-up for deployed `dd1a1faf` | BLOCKED with progress: operator packet validation and build-info passed; protected UI clickthrough passed; rollback proof passed; Gate 4 sign-off is approved. `LIVEIMPORT-03` authenticated and found a RUNNING Binance FUTURES LIVE session, but failed closed because there are no open positions or open orders. Controlled proof preactivation failed safely because the target LIVE bot is already active. Fresh 30-minute production SLO is `FAIL`: `/workers/ready` availability `0%`, API 5xx ratio `16.6667%`, caused by deployed `inline` worker topology (`DEPLOYED_INLINE_MODE`) rather than the canonical split-worker contract. Production DB restore drill still needs VPS/Coolify Docker access. | `docs/planning/v1-protected-app-proof-attempt-dd1a1faf-2026-05-21-task.md`; `docs/operations/prod-ui-module-clickthrough-dd1a1faf-2026-05-21.md`; `docs/operations/v1-rollback-proof-prod-2026-05-21T00-00-00-000Z.md`; `docs/operations/liveimport-03-prod-readback-dd1a1faf-2026-05-21.json`; `docs/operations/v1-slo-observation-2026-05-21T15-28-20-108Z.md`; `docs/operations/v1-rc-signoff-record.md` | Repair/verify production split-worker topology, provide a safe open runtime readback payload path, run production DB restore drill from VPS/Coolify Docker context, then rerun final non-dry-run release gate. |
| 2026-05-21 | Supply-chain SAST ops audit | VERIFIED locally: audited dependency/supply-chain hygiene, Docker/compose, env templates, secrets handling, logging artifacts, CI/scripts, SSRF/egress surfaces, file upload/static assets, and production-readiness gates. Fixed protected ops scripts accepting secret-bearing CLI flags and added env-file/secret-argv guardrails. | `docs/planning/supply-chain-sast-ops-audit-2026-05-21-task.md`; guardrail tests `9/9`; guardrails; production dependency audit; VPS/local compose config; API/Web typecheck; script syntax; manual secret-argv fail-closed checks; diff check with line-ending warnings only | Protected `AUD-19`, external VPS/cloud egress review, and operator rotation/removal of local untracked env secrets remain separate gates. |
| 2026-05-21 | Backend permission and data-isolation review | VERIFIED locally: inspected auth/session middleware, admin guards, API-key ownership, representative user-scoped reads/writes, request DTO allowlists, and denied-access tests. Repaired API-key create DTO allowlist defect by passing parsed payloads and explicit Prisma create fields; updated auth duplicate-cookie test mock to DB-sourced user context. | `docs/planning/backend-permission-isolation-review-2026-05-21-task.md`; API-key e2e `18/18`; auth/admin/API-key pack `34/34`; isolation/reports/wallets pack `28/28`; API typecheck | Protected `AUD-19`, external penetration/VPS configuration review, and explicit LIVE exchange-side mutation proof remain separate gates. |
| 2026-05-21 | Frontend OWASP security/UX sweep | VERIFIED locally: audited Web auth bootstrap, protected data flash prevention, admin gating, CSP/security headers, browser storage, CSRF-sensitive UI call shape, clickjacking/HSTS assumptions, secret/error exposure, and money-action confirmations. Fixed confirmed profile API-key response secret-retention risk and profile/security raw axios error exposure. | `docs/planning/frontend-security-ux-owasp-sweep-2026-05-21-task.md`; focused Web profile/error tests `4` files / `28` tests; broader Web auth/admin/header/money pack `7` files / `23` tests; Web typecheck; `git diff --check` with line-ending warnings only | Keep production header readback, protected `AUD-19`, external pentest/VPS review, backend-owned CSRF/trusted-origin proof, and explicit LIVE mutation proof as separate gates. |
| 2026-05-21 | Money-flow LIVE cancel entitlement audit | VERIFIED locally: confirmed and fixed a P1 fail-closed gap where exchange-backed LIVE order cancel could reach the adapter boundary after subscription downgrade because cancel checked `riskAck` but not current `liveTrading` entitlement. Added entitlement gate before exchange cancel boundary and focused DB-backed tests for allowed/downgraded paths. | `docs/planning/money-flow-security-cancel-entitlement-2026-05-21-task.md`; parent rerun DB-backed cancel/API-key pack `2` files / `20` tests; API typecheck; guardrails; build | Protected `AUD-19` and real LIVE mutation proof remain separate gates. |
| 2026-05-21 | Security hardening continuation | VERIFIED locally: coordinated Frontend Security, Backend Security, and Ops/Security lanes. Closed remaining frontend P2 items, added DB-backed LIVE entitlement downgrade proof, fixed entitlement-denial HTTP mapping, removed stage-rehearsal secret argv/artifact leakage, hardened VPS env template, added non-root runtime Dockerfiles with guardrail, added production HSTS, and bound local compose DB/Redis to localhost. | `docs/planning/security-red-team-hardening-2026-05-21-task.md`; Web `151` files / `530` tests; API entitlement/runtime `17` tests; API orders `38` tests; node script/guardrail `6` tests; API/Web typecheck; i18n audit `0`; build; guardrails; `git diff --check`; cleanup checks | External pentest/VPS review, protected `AUD-19`, and explicit LIVE exchange-side mutation proof remain separate gates before commercial security claims. |
| 2026-05-21 | Security red-team hardening | VERIFIED locally: second-round security agents completed reports and coordinator integrated fixes. Repaired stale admin token authorization, auth IP limiting, production ops-network default, weak secret readiness/deploy defaults, API-key lifecycle audit logs, sensitive logging redaction, runtime close `riskAck` default, execution-time LIVE entitlement checks, Gate.io swap derivative order handling, unknown LIVE status fail-closed behavior, min-notional price fail-closed behavior, production CSP, production UI error redaction, and production dependency vulnerabilities. | `docs/planning/security-red-team-hardening-2026-05-21-task.md`; `pnpm audit --prod`; guardrails; API/Web typecheck; build; focused API/Web security tests | Protected `AUD-19`, external pentest/VPS config review, and explicit LIVE exchange-side mutation proof remain separate gates. |
| 2026-05-21 | Local certainty closure | VERIFIED locally: agents and coordinator closed the remaining executable local queue. Added `Trade.executionMode` snapshot reporting, fixed bot route i18n drift, profile mobile layout, Admin Subscriptions shared states, Wallet reset modal consistency, and Dashboard Home confirmation-aware tests. | `docs/planning/local-certainty-closure-2026-05-21-task.md`; full Web Vitest `149` files / `522` tests; full API Vitest one-worker fork mode; build; lint; go-live smoke `45` API + `18` Web tests; Prisma status/validate | Execute protected `AUD-19` operator packet only after approved protected inputs exist; no further local code blocker found in this sweep. |
| 2026-05-21 | Remaining implementation safety sweep | VERIFIED locally: agents found no P0, but confirmed P1 local defects in Dashboard Home risk acknowledgement, Web service wrapper defaults, API LIVE manual close price fallback, and Admin Users mutation confirmation. Fixed all four. | `docs/planning/rest-implementation-sweep-2026-05-21-task.md`; focused Web `4` files / `14` tests; focused API `4` files / `99` tests; API/Web typecheck | Decide whether next local task is Reports execution-mode snapshot migration or smaller Web polish queue; protected `AUD-19` remains separate. |
| 2026-05-21 | Frontend/engine UX+DCA sweep | VERIFIED: agents found confirmed backtest replay/portfolio TTP-vs-profit-side-DCA drift and frontend runtime UX issues. Fixed backtest DCA-first guard, bot monitoring first-open double-fetch, Dashboard Home auth-bootstrap coverage, and Reports partial failure behavior. | `docs/planning/frontend-engine-ux-dca-sweep-2026-05-21-task.md`; focused API `4` files / `99` tests; focused Web `3` files / `22` tests; API/Web typecheck; guardrails | Design explicit runtime action confirmation UX for current `riskAck: true` Dashboard Home actions; protected `AUD-19` remains separate. |
| 2026-05-21 | Agent-assisted gap hunt for unverified paths | PARTIALLY_VERIFIED: three lanes found no new P0/P1 backend or ops code defect, but confirmed two safe local fixes/proofs: UX production proof now fails closed on runtime/console bad events, and Reports cross-mode route has DB-backed auth/user-scope e2e coverage. Protected production `AUD-19`, LIVE exchange-side mutation, assistant hot-path orchestration, native mobile, and current production authenticated clickthrough remain outside local completion. | `scripts/runProdUxA11yMobileProof.mjs`; `apps/api/src/modules/reports/reports.e2e.test.ts`; `docs/modules/api-reports.md`; `.agents/state/module-confidence-ledger.md` | Provide approved protected inputs for `AUD-19`; do not claim literal current production 100% before protected proof. |
| 2026-05-20 | No-secret V1 preflight and protected-input readiness for deployed `dd1a1faf` | BLOCKED as expected: build-info PASS, public smoke PASS, `0` matching protected input names, required protected evidence stale for 2026-05-20 | `docs/operations/v1-final-preflight-dd1a1faf-2026-05-20.md`; `docs/operations/v1-protected-input-readiness-dd1a1faf-2026-05-20.md` | Provide approved protected auth/context and approver fields, then execute `docs/operations/v1-operator-unblock-packet-dd1a1faf-2026-05-20.md`. |
| 2026-05-20 | Current operator unblock packet published | NO-GO handoff current for the deployed target; command order and stop conditions are dated for 2026-05-20 | `docs/operations/v1-operator-unblock-packet-dd1a1faf-2026-05-20.md`; `docs/operations/v1-operator-unblock-packet-dd1a1faf-2026-05-20.json` | Same as above: protected inputs, current evidence, final non-dry-run release gate. |
| 2026-05-20 | Operator packet validator added | PASS: current packet has required SHA, evidence paths, protected input families, proof steps, forbidden boundaries, and acceptance rule | `corepack pnpm run ops:operator-unblock:check:test`; `corepack pnpm run ops:operator-unblock:check -- --packet docs/operations/v1-operator-unblock-packet-dd1a1faf-2026-05-20.json --expected-sha dd1a1faf79f8ac3581ca0a8c983481a3e30327ac` | Run the packet check before executing protected operator commands. |
| 2026-05-20 | Operator packet validator added to reusable audit tooling index | PASS: reusable tooling index now tracks `21/21` tools and `audit:manifest:verify` runs the operator unblock packet regression test and current packet validation | `corepack pnpm run audit:tooling-index:check:test`; `corepack pnpm run audit:tooling-index:check`; `corepack pnpm run audit:manifest:verify`; `docs/planning/v1-operator-unblock-tooling-index-sync-2026-05-20-task.md` | Same protected-input execution gate remains next. |
| 2026-05-20 | Parallel agent blocker sweep | BLOCKED: Ops/Release and Planning/Queue agents independently confirmed no protected proof step or meaningful non-secret deployment task can proceed without approved protected inputs; rerun still found `0` matching protected input names; production build-info still `dd1a1faf` on `main` | `docs/planning/v1-agent-blocker-sweep-dd1a1faf-2026-05-20-task.md`; `docs/operations/v1-protected-input-readiness-dd1a1faf-2026-05-20-rerun.md` | Stop local prep; provide protected inputs and execute the operator packet. |
| 2026-05-20 | Heartbeat unblock monitor created | BLOCKED unchanged: latest names-only sweep still found `0` matching protected input names; production build-info still `dd1a1faf` on `main`; operator packet validation PASS | `docs/operations/v1-protected-input-readiness-dd1a1faf-2026-05-20-latest.md`; automation `v1-protected-release-unblock-check` | Heartbeat checks every 30 minutes and proceeds only if protected inputs appear. |
