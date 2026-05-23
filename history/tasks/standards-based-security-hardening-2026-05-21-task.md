# Task

## Header
- ID: STANDARDS-SECURITY-HARDENING-2026-05-21
- Title: Standards-based security hardening continuation
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Security
- Priority: P1
- Module Confidence Rows: SOAR-SECURITY-PRIVACY-001, SOAR-AUTH-001, SOAR-PROFILE-API-KEYS-001, SOAR-MANUAL-ORDERS-001, SOAR-OPERATIONS-001
- Requirement Rows: REQ-SEC-039 and continuation rows created by this task if needed
- Quality Scenario Rows: QA-026 and continuation rows created by this task if needed
- Risk Rows: security hardening residuals in `.agents/state/risk-register.md`
- Iteration: 2026-05-21 security continuation
- Operation Mode: TESTER
- Mission ID: STANDARDS-SECURITY-HARDENING-2026-05-21
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the risk profile of a security continuation.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through current mission startup context.
- [x] `.agents/core/mission-control.md` was reviewed through current mission startup context.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: apply current defensive security standards to Soar, verify gaps with subagents, and repair confirmed local defects.
- Release objective advanced: commercial-readiness security confidence for auth, money flows, frontend, ops, and supply chain.
- Included slices: OWASP Top 10/API Top 10 mapping, NIST SSDF/CISA secure-by-design review, agent-assisted code review, defensive fixes, focused tests, source-of-truth updates.
- Explicit exclusions: no production mutation, no real LIVE exchange mutation, no credential discovery, no offensive exploit instructions.
- Checkpoint cadence: after lane reports, after implementation, after validation.
- Stop conditions: protected inputs required, real production access required, architecture mismatch requiring user decision, or failing gate that cannot be fixed safely.
- Handoff expectation: report evidence-backed status, residual risks, and next protected/external gates.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, state files, OWASP/NIST/CISA sources | Mission, integration, source-of-truth updates | Final acceptance | Parent validation gate | VERIFIED |
| Backend permission/data isolation | Defensive subagent | OWASP API Top 10 2023, auth docs | API auth/admin/API-key/user-scoped routes | DTO allowlist fix and DB proof | Focused API tests/typecheck | VERIFIED |
| Trading money-flow safety | Defensive subagent | Secure-by-design, runtime architecture | Runtime/order/exchange flows | LIVE cancel entitlement guard | Focused API runtime/order tests | VERIFIED |
| Frontend security/UX | Defensive subagent | OWASP Top 10/cheat sheets, UX docs | Web auth/admin/error/header/risk flows | Secret/error redaction hardening | Focused Web tests/typecheck | VERIFIED |
| Ops/supply-chain | Defensive subagent | NIST SSDF, CISA, ops docs | Docker/compose/scripts/dependencies/env | Secret argv and env-file guardrails | Guardrails/audit/script tests | VERIFIED |
| Upload resource safety | Coordinator | OWASP File Upload guidance | Avatar processing | Pixel-budget transform regression | API unit test | VERIFIED |
| Documentation/Memory | Coordinator | State files | Task, active mission, risks, next steps | Durable record | Guardrails | VERIFIED |

## Context
The previous `SECURITY-RED-TEAM-HARDENING-2026-05-21` mission closed local P1/P2 defects. This continuation uses external defensive standards to avoid blind spots.

## Goal
Increase security confidence by mapping the current app to widely accepted defensive controls and fixing any confirmed local defects.

## Success Signal
- User or operator problem: the app handles autonomous capital-management behavior and must be safer before selling access.
- Expected product or reliability outcome: fewer auth, secret, money-flow, ops, and frontend security regressions.
- How success will be observed: lane reports, focused tests, guardrails, audit, build/typecheck as relevant.
- Post-launch learning needed: yes.

## Constraints
- Use existing systems and approved mechanisms.
- Do not introduce new security frameworks without approval.
- Do not implement workarounds.
- Do not duplicate logic.
- Keep communication in Polish and repository artifacts in English.

## Definition of Done
- [x] External defensive standards are mapped to local review lanes.
- [x] Subagent reports are received or explicitly replaced if blocked.
- [x] Confirmed local defects are fixed with tests.
- [x] Parent validation passes or residual risk is recorded.
- [x] Source-of-truth files are updated.

## Forbidden
- Offensive exploit guidance.
- Production mutation or live-money mutation.
- Secret discovery, raw secret capture, or credential exposure.
- Client-only authorization fixes.
- Temporary bypasses.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes.
- Data classification: sessions, user data, exchange API keys, trading state, deploy secrets.
- Trust boundaries: browser/API, API/DB, API/exchange, API/cache, CI/ops scripts.
- Permission or ownership checks: delegated backend lane.
- Abuse cases: unauthorized data access, stale role/session use, unsafe live trading, secret leakage, misconfigured runtime, supply-chain compromise.
- Secret handling: delegated ops lane.
- Security tests or scans: production dependency audit, guardrails, focused API/Web regressions, full Web test pack, DB-backed API regressions, script tests, compose config checks, typecheck, and build.
- Fail-closed behavior: required for money-impacting and auth-sensitive paths.
- Residual risk: external pentest, protected production evidence, and explicit LIVE mutation proof remain outside this local mission.

## External Defensive References
- OWASP Top 10 2021: access control, crypto failures, injection, insecure design, misconfiguration, vulnerable components, auth failures, integrity, logging/monitoring, SSRF.
- OWASP API Security Top 10 2023: object/function/property authorization, authentication, resource consumption, sensitive business flows, SSRF, misconfiguration, inventory, third-party API consumption.
- OWASP Cheat Sheet Series: authorization, authentication, CSRF, CSP, Docker, logging, secrets, REST, SSRF, WebSocket, dependency management.
- NIST SSDF SP 800-218: secure SDLC practices to reduce vulnerabilities, mitigate impact, and address root causes.
- CISA Secure by Design: secure defaults, transparency, least privilege, and reducing customer security burden.

## Result Report
- Task summary: Four defensive subagents and the coordinator applied OWASP/NIST/CISA-informed review lanes. Confirmed local defects were fixed: API-key create no longer accepts raw body fields/mass assignment; exchange-backed LIVE cancel now checks current live-trading entitlement before the adapter; Web API-key state rejects raw credential display and production profile errors are redacted; ops scripts reject secret-bearing CLI args; tracked env-file policy is guarded; avatar processing now enforces a decoded pixel budget; public avatar static serving explicitly denies dotfiles and directory index fallback while setting `nosniff` and immutable public cache headers.
- Files changed: API-key controller/service/tests, order cancel service/test, Web profile API-key/security components/services/tests, ops guardrails and release scripts, `.gitignore`, avatar upload processing/tests, and source-of-truth task/state files.
- How tested:
  - `corepack pnpm --filter api run typecheck` -> passed.
  - `corepack pnpm --filter web run typecheck` -> passed.
  - `corepack pnpm --filter web run test -- src/features/profile/services/apiKeys.service.test.ts src/features/profile/components/ApiKeyForm.test.tsx src/features/profile/components/Security.test.tsx src/lib/errorResolver.test.ts --run` -> Vitest ran the full Web pack, `151` files / `533` tests passed.
  - `corepack pnpm --dir apps/api exec vitest run src/modules/orders/orders.liveCancelBoundary.service.test.ts src/modules/profile/apiKey/apiKey.e2e.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000` -> `2` files / `20` tests passed.
  - `corepack pnpm --dir apps/api exec vitest run src/router/security-headers.test.ts src/modules/upload/upload.processing.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000` -> `2` files / `5` tests passed.
  - `node --test scripts/repoGuardrails.test.mjs scripts/runV1StageRehearsal.test.mjs` -> `9` tests passed.
  - `corepack pnpm audit --prod` -> no known vulnerabilities.
  - `docker compose --env-file .env.vps.example -f docker-compose.vps.yml config --quiet` -> passed.
  - `docker compose config --quiet` -> passed with only the existing obsolete `version` warning.
  - `corepack pnpm run quality:guardrails` -> passed.
  - `corepack pnpm run build` -> passed.
  - `git diff --check` -> passed with LF/CRLF warnings only.
- What is incomplete: no external penetration test, no protected production `AUD-19`, no VPS/cloud configuration review, and no real LIVE exchange-side mutation proof were executed in this local mission.
- Next steps: run external pentest/VPS review and protected production evidence gates before making commercial security-readiness claims.

## Cleanup Evidence
- Docker Postgres/Redis were started for DB-backed API tests and stopped with `docker compose down`.
- Follow-up `docker ps --filter name=soar --format "{{.Names}}"` returned no rows.
- Follow-up `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` returned no rows.
- Root env-file check listed only `.env.vps.example`.
