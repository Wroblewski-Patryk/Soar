# LUC-48 Autonomous Map Inventory and UI Polish Readiness Gate (Full Cross-Layer Matrix)

Date: 2026-05-25
Issue: `LUC-48 [Soar] Autonomous map inventory and UI polish readiness gate`
Owner lane: `Docs Memory Lead`

## Scope lock
- Produce a single cross-layer map for readiness before broad UI polish handoff.
- Include Product, Architecture, Frontend/View, Backend/API, Data, Integrations/Trading, AI Runtime, QA/Test, Security, Ops/Deploy, UX/UI, Docs/Memory.
- Classify each map as `current`, `stale`, `missing`, `blocked`, or `verified` with evidence links.
- Convert each actionable gap into existing owner-lane issues when they already exist.

## Gate rule for this issue
UI polish readiness is **not clear for launch** because protected/auth-money journeys still depend on fresh browser/protected proof and repeatable proof artifacts are not yet fully attached for all slices.

### Layer inventory and readiness map

| Layer | Map source(s) | Status | Readiness signal | Key evidence | Owner/next lane | Why this status |
| --- | --- | --- | --- | --- | --- | --- |
| Product | `docs/product/product.md`, `docs/product/overview.md`, `docs/analysis/documentation-drift.md` | `current` | `verified` for scope text; `blocked` for polish readiness | `docs/product/product.md`; `docs/product/overview.md` | `LUC-45-E` (docs/state lane) | Scope and value boundaries are documented, but polish readiness needs protected-route proof owned by execution lanes. |
| Architecture | `docs/architecture/architecture-documentation.md`, `docs/architecture/codebase-map.md`, `docs/architecture/traceability-matrix.md`, `docs/architecture/architecture-source-of-truth.md` | `verified` | structural mapping is current; release confidence blocked by runtime/API proof | `docs/architecture/codebase-map.md`; `docs/architecture/traceability-matrix.md`; `docs/architecture/architecture-source-of-truth.md` | `LUC-45-E` + `LUC-46` | Structural map is complete, but `verified_local_only` journey/API gaps remain in generated proofs. |
| Frontend/View | `docs/status/view-map-browser-workflow-ownership.md`, `docs/analysis/luc-48-autonomous-map-inventory-and-ui-polish-readiness-gate-2026-05-25.md`, `apps/web/src/app/**/page.tsx` inventory | `current` | `implemented` map, `blocked` for auth/protected polish states | `docs/status/view-map-browser-workflow-ownership.md`; `docs/status/function-journey-index.md`; `docs/status/user-action-index.md`; `apps/web/src/app` | `LUC-43` (QA) and `LUC-48-A/browser-proof` (formerly `LUC-49`) for protected/browser-polish slices | 82 routes are mapped, but many high-risk actions are still `verified_local_only`. |
| Backend/API | `docs/architecture/codebase-map.md`, `history/plans/luc-39-backend-api-service-boundary-known-state-2026-05-25.md`, `docs/status/function-journey-index.md`, `docs/status/user-action-index.md` | `blocked` | `partially_verified_local`; critical API blocker unresolved | `history/evidence/luc-45-v1-evidence-ledger-2026-05-25.md`; `function-journey-index.md` (28 high); `user-action-index.md` (37 high) | `LUC-46` (`LUC-45-A`) owns runtime/backtests blocker; `LUC-40` covers data continuity context | Backtests API critical path remains blocked (`expected >0` assertion + timeout), preventing polished acceptance of many protected journeys. |
| Data | `apps/api/prisma/schema.prisma`, `apps/api/prisma/migrations`, `docs/architecture/03_domain-model.md`, `history/tasks/luc-40-data-persistence-known-state-2026-05-25-task.md` | `current` | `implemented` for integrity checks; `blocked` for end-to-end runtime/API coupling | `apps/api/prisma/schema.prisma`; `apps/api/prisma/migrations`; `history/tasks/luc-40-data-persistence-known-state-2026-05-25-task.md` | `LUC-40`, `LUC-46` | Migrations/schema/state checks passed, but data-API runtime coupling is blocked by API/backtests stability. |
| Integrations/Trading | `docs/architecture/09_integrations-deployment-and-runtime-services.md`, `docs/architecture/reference/exchange-access-ownership-matrix.md`, `docs/architecture/codebase-map.md` | `current` | `partially_verified` on external exchange readback/protected mutation evidence | `docs/architecture/09_integrations-deployment-and-runtime-services.md`; `docs/architecture/reference/exchange-access-ownership-matrix.md`; `history/plans/luc-39-backend-api-service-boundary-known-state-2026-05-25.md` ; `docs/status/function-journey-index.md` | `LUC-46` (backend), `LUC-45-D` (security boundaries), `LUC-47` (deploy dependencies) | Contracts exist, but journey/action rows still report missing fresh production-readback proof for protected/exchange paths. |
| AI Runtime | `docs/architecture/11_assistant-runtime.md`, `docs/architecture/reference/assistant-runtime-contract.md`, `docs/analysis/documentation-drift.md` | `stale` for parity claims | `verified` for dry-run boundary only; hot-path remains deferred | `docs/architecture/11_assistant-runtime.md`; `docs/architecture/reference/assistant-runtime-contract.md`; `docs/analysis/documentation-drift.md` | `LUC-45-D` for security boundary follow-up; AI runtime implementer per issue creation | DEC-AUD boundary notes require explicit hot-path execution slice before runtime trading claims. |
| QA/Test | `docs/engineering/testing.md`, `scripts/runQaRepeatableSmokeE2e.mjs`, `history/tasks/luc-43-repeatable-smoke-e2e-checks-2026-05-25-task.md`, `history/evidence/luc-45-v1-evidence-ledger-2026-05-25.md` | `blocked` | `partially_verified` (`web` slice has local PASS, `api/backtests` not complete) | `scripts/runQaRepeatableSmokeE2e.mjs`; `history/tasks/luc-43-repeatable-smoke-e2e-checks-2026-05-25-task.md`; `history/evidence/luc-45-v1-evidence-ledger-2026-05-25.md` | `LUC-45-C` | `--checks web` passed local; full `web,api,backtests` matrix is still missing. |
| Security | `docs/security/security-and-risk.md`, `docs/security/security-documentation.md`, `docs/security/secure-development-lifecycle.md`, `history/evidence/luc-45-v1-evidence-ledger-2026-05-25.md` | `blocked` | `partially_verified` local and partial protected proof | `docs/security/security-and-risk.md`; `docs/security/v1-secrets-inventory.md`; `history/evidence/luc-45-v1-evidence-ledger-2026-05-25.md` | `LUC-45-D` | Auth/session/exchange read-only readback proof is not fully attached for all money-facing flows. |
| Ops/Deploy | `docs/operations/coolify-linux-vps-setup-guide.md`, `docs/operations/post-deploy-smoke-checklist.md`, `docs/operations/deployment-rollback-playbook.md`, `history/evidence/luc-45-v1-evidence-ledger-2026-05-25.md` | `blocked` | `partially_verified` local gates only | `LUC-47` task packet; `COOLIFY-SERVICE-STACK-MIGRATION-2026-05-25`; `history/evidence/luc-45-v1-evidence-ledger-2026-05-25.md` | `LUC-47` | Local config/env smoke gates passed, but temp-domain one-stack deploy/worker smoke proof is still pending. |
| UX/UI | `docs/ux/dashboard-design-system.md`, `docs/ux/screen-quality-checklist.md`, `docs/ux/background-and-decorative-asset-strategy.md`, `docs/ux/view-generation-prompt-pack.md` | `current` | `implemented` for component contracts; `blocked` for full polish verification | `docs/ux/dashboard-design-system.md`; `docs/ux/screen-quality-checklist.md`; `docs/ux/ux-ui-mcp-collaboration.md` | Frontend UI owners + `LUC-45-C/D` for protected slices | UX contracts exist, but protected journey proof still blocks polished readiness. |
| Docs/Memory | `docs/documentation-overview.md`, `docs/analysis/analysis-documentation.md`, `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`, `docs/documentation-map.md`, `docs/analysis/analysis-documentation.md` | `verified` | `implemented` plus partial verification updates | `docs/analysis/analysis-documentation.md`; `history/tasks/luc-48-autonomous-map-inventory-and-ui-polish-readiness-gate-2026-05-25-task.md` ; this artifact | `LUC-48`, `LUC-45-E` | Source-of-truth references exist; this artifact closes the previous readiness-gap in LUC-48 scope. |

## Readiness gate synthesis

### `verified`
- Structural maps exist for architecture, module coverage, route map, and journey/action evidence.
- Route inventory has measured `37` web route files and mapped `82` workflow rows.

### `implemented`
- Cross-layer readiness matrix is now documented with owner mapping.
- Repeatable smoke harness exists (`scripts/runQaRepeatableSmokeE2e.mjs`) and local `web` pass was recorded.

### `blocked`
- Protected/auth actions are mostly `verified_local_only` and need browser/protected proof before polish clearance.
- Runtime/backtests API reliability still blocks many high-risk flows.
- Coolify one-stack external deploy evidence remains blocked on temp-domain rollout context.

## Deficiency register and owners

| Gap | Severity | Effect on UI polish gate | Evidence | Owner (existing issue) |
| --- | --- | --- | --- | --- |
| Protected/auth journey proof absent for most dashboard/admin actions | high | Cannot certify high-risk polish readiness | `docs/status/user-action-index.md` (37 high action gaps); `docs/status/function-journey-index.md` (28 high gaps) | `LUC-45-C` (proof) + `LUC-45-D` (protected boundary) + `LUC-48-A/browser-proof` (formerly `LUC-49`) |
| Backtests/API critical path runtime timeout/assertion failures | critical | Blocks runtime-heavy and protected journey confidence | `history/evidence/luc-45-v1-evidence-ledger-2026-05-25.md`; `history/tasks/luc-18-qa-regression-smoke-baseline-2026-05-25.md` | `LUC-46` (`LUC-45-A`) |
| Coolify temp-domain one-stack evidence missing | critical | Prevents safe cutover recommendation and readiness sign-off | `COOLIFY-SERVICE-STACK-MIGRATION-2026-05-25`; `history/tasks/luc-45-b-ops-stack-rollout-and-smoke-2026-05-25-task.md` | `LUC-47` |
| Repeatable full web/api/backtests smoke incomplete | high | Prevents deterministic polish proof | `scripts/runQaRepeatableSmokeE2e.mjs`; `history/tasks/luc-43-repeatable-smoke-e2e-checks-2026-05-25-task.md` | `LUC-45-C` |
| AI runtime hot-path parity conflated with dry-run boundary | medium | Blocks any full AI runtime polish claim | `docs/architecture/11_assistant-runtime.md`; `docs/status/function-journey-index.md` (CHAIN-AI-ASSISTANT-FOUNDATION) | `LUC-45-D` |
| Source-of-truth parity drift after lane closeout | medium | Readiness artifact can become stale | `.codex/context/TASK_BOARD.md`; `.codex/context/PROJECT_STATE.md` | `LUC-45-E` |

## Evidence-to-owner action path

1. Frontend owner `LUC-48-A/browser-proof` executes protected/auth-sensitive browser/e2e proof slices for major dashboard/admin routes and updates matrix statuses.
2. Backend/runtime owner `LUC-46` clears API runtime/backtests blockers and re-runs `test:go-live:api` targeted packs.
3. Ops owner `LUC-47` attaches temp-domain deploy/worker-sanity evidence for one-stack candidate cutover.
4. QA owner `LUC-45-C` attaches full `qa:smoke-e2e:repeatable --checks web,api,backtests` artifacts.
5. Security owner `LUC-45-D` closes protected auth/session/exchange boundary read-only proof.
6. Docs/state owner `LUC-45-E` updates project board/context and risk/model confidence after each lane closes.

## Readiness decision for this issue

- **Current gate state:** `implemented` for cross-layer map + ownership matrix, `partially verified` for UI polish evidence, `blocked` for release-style readiness clearance.
- **Next condition to clear `ready_for_ui_polish`:** steps 1–5 above completed with fresh artifacts from `LUC-48-A/browser-proof`
  (including authenticated/protected UI proof), and then a source-of-truth parity pass.
- **Drift guard while blocked:** keep the map/index parity refresh path active after every child-issue update (`analysis-documentation.md` + `TASK_BOARD.md` + `PROJECT_STATE.md`) until protected/auth browser proof is attached.
