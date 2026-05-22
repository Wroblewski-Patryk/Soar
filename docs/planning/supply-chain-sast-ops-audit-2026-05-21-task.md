# SUPPLY-CHAIN-SAST-OPS-AUDIT-2026-05-21

Last updated: 2026-05-21

## Header

- ID: `SUPPLY-CHAIN-SAST-OPS-AUDIT-2026-05-21`
- Title: Supply-chain, ops, and SAST hardening audit
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release + Security
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`, `SOAR-SECURITY-PRIVACY-001`
- Requirement Rows: `REQ-SEC-041`
- Risk Rows: `RISK-038`
- Operation Mode: BUILDER
- Mission ID: `SUPPLY-CHAIN-SAST-OPS-AUDIT-2026-05-21`
- Mission Status: VERIFIED

## Process Self-Audit

- [x] Analyze current state.
- [x] Select one bounded mission objective.
- [x] Plan implementation.
- [x] Execute confirmed local repairs only.
- [x] Verify and test.
- [x] Self-review against architecture, reuse, workaround, and duplication rules.
- [x] Update documentation and knowledge.

## Context

The operator requested an Ops/Supply-Chain/SAST review against NIST SSDF,
CISA Secure by Design, and OWASP cheat-sheet expectations. The worktree already
contained broad security-hardening changes from other agents, so this task
preserved those changes and only repaired newly confirmed local defects.

## Goal

Check dependency and supply-chain hygiene, Docker/compose, env templates,
secret handling, logging artifacts, CI/scripts, SSRF/egress surfaces, file
upload/static assets, and production-readiness gates without using production
secrets or mutating production.

## Scope

- `package.json`, workspace manifests, `pnpm-lock.yaml`, and production audit.
- `docker-compose.yml`, `docker-compose.vps.yml`, API/Web Dockerfiles, and env
  templates.
- Ops scripts under `scripts/` that handle protected auth or evidence.
- Request logging, central logger, avatar upload/static serving, CSP/security
  headers, and public egress base URL call sites.
- Repository guardrails and focused guardrail tests.

## Constraints

- No real secret use, capture, or reproduction.
- No production calls requiring protected inputs.
- No LIVE exchange-side mutation.
- Preserve unrelated dirty worktree changes.
- Reuse existing guardrail and ops-script patterns.

## Definition of Done

- [x] Audited requested surfaces with source-backed criteria.
- [x] Fixed confirmed local defect(s) and added guardrail/test coverage.
- [x] Ran relevant validation commands.
- [x] Recorded residual risks and source-of-truth state.

## Forbidden

- Printing, copying, or storing real secret values.
- Replacing existing release gates with a parallel framework.
- Treating local/public checks as protected production `AUD-19` proof.
- Running production mutation or LIVE exchange-side mutation.

## Findings And Results

| ID | Severity | Area | Finding | Result |
| --- | --- | --- | --- | --- |
| SCSAST-2026-05-21-01 | P1 | CI/scripts / secrets | Several ops scripts accepted secret-bearing CLI flags for auth tokens, auth passwords, private OPS header values, or basic-auth passwords. This can leak through shell history, process argv, crash output, or generated command artifacts. | Fixed. `checkPostDeployRuntimeFreshness`, `evaluateRollbackGuard`, `collectSloEvidence`, `runLocalExternalGatesPipeline`, `runRollbackProofEvidence`, and `runV1ReleaseGate` now reject those flags and require env vars. Repository guardrail blocks reintroduction. |
| SCSAST-2026-05-21-02 | P2 | Env templates / local secrets | Local untracked env files exist in this workstation. They were not read into docs and are not tracked, but the root ignore policy did not globally document/block env-file tracking across the monorepo. | Fixed. Root `.gitignore` now ignores `.env*` files across the repo while allowing redacted `.env*.example` templates. Guardrail rejects tracked runtime env files. |
| SCSAST-2026-05-21-03 | Info | Dependencies | Production dependency audit reported no known vulnerabilities after current overrides. | No repair needed. |
| SCSAST-2026-05-21-04 | Info | Docker/compose | VPS compose requires explicit DB/Redis/JWT/API-key secrets, Redis auth, localhost-bound infra ports, non-root runtime Dockerfiles, and health checks. Local compose has expected development-only Postgres password and localhost-bound ports. | No additional repair in this task. Docker compose config validated; local compose emitted only the obsolete `version` warning. |
| SCSAST-2026-05-21-05 | Info | Logging artifacts | Central logger and request logger redact sensitive metadata and query values; tests already exist in current hardening scope. | No new repair needed. |
| SCSAST-2026-05-21-06 | Info | SSRF / egress | Production runtime egress is limited to configured exchange/CoinGecko/public proof targets; user-controlled egress was not confirmed in API routes. Ops proof scripts accept operator-controlled base URLs by design and now avoid secret argv. | Residual risk: production egress allowlisting/network policy remains VPS/cloud review scope. |
| SCSAST-2026-05-21-07 | Info | File upload/static assets | Avatar upload requires auth, rate limits, MIME allowlist, 2MB limit, Sharp re-encoding to JPG, randomized filename, temp cleanup, and URL origin independent of forwarded headers. Static avatar directory is gitignored except `default.png`. | No new repair needed. |

## Validation Evidence

- `node --test scripts/repoGuardrails.test.mjs scripts/runV1StageRehearsal.test.mjs` -> `9/9` pass.
- `corepack pnpm run quality:guardrails` -> pass, including env-file and secret-argv policies.
- `corepack pnpm audit --prod` -> no known vulnerabilities.
- `docker compose --env-file .env.vps.example -f docker-compose.vps.yml config --quiet` -> pass.
- `docker compose -f docker-compose.yml config --quiet` -> pass with obsolete `version` warning only.
- `corepack pnpm --filter api run typecheck` -> pass.
- `corepack pnpm --filter web run typecheck` -> pass.
- `node --check` for modified ops/guardrail scripts -> pass.
- Manual fail-closed checks confirmed secret-bearing CLI flags are rejected for modified ops scripts.
- `git diff --check` -> pass with line-ending warnings only.

## Security / Privacy Evidence

- Data classification: protected auth tokens, passwords, OPS headers, API keys,
  DB/Redis credentials, and local env files.
- Trust boundaries: developer shell, CI/ops scripts, Docker runtime, VPS
  compose, API protected routes, and public file/static surfaces.
- Abuse cases: secret exposure through process argv or shell history, tracked
  runtime env files, dependency vulnerability drift, unsafe default container
  runtime, user-driven SSRF, and upload of executable/untrusted content.
- Secret handling: secret-bearing script inputs now require env vars; tracked
  env files are guardrailed; docs and reports avoid secret values.
- Fail-closed behavior: affected scripts reject secret-bearing argv before
  execution.

## Deployment / Ops Evidence

- Deploy impact: low; operator command behavior changed for secret-bearing CLI
  flags only.
- Env or secret changes: secret values must be passed via existing env var
  families instead of argv.
- Health-check impact: none.
- Smoke steps updated: none.
- Rollback note: revert the script parser/guardrail changes if an emergency
  operator run depends on argv secrets, but that would knowingly reintroduce
  the leak path.

## Residual Risk

- Protected production `AUD-19` remains blocked on approved protected inputs
  and same-date evidence.
- External penetration test and VPS/cloud/network egress review are still
  needed before commercial security claims.
- Local untracked env files should be rotated/removed by the operator if they
  contain live credentials; this task did not copy or use their values.
- Local compose keeps a development-only Postgres password by design; it is now
  localhost-bound and separate from VPS compose.

## Result Report

- Task summary: fixed secret-bearing CLI handling in ops scripts, strengthened
  env-file ignore/guardrail policy, and completed the requested local
  supply-chain/SAST/ops audit sweep.
- Files changed: `.gitignore`, six ops scripts, `scripts/repoGuardrails.mjs`,
  `scripts/repoGuardrails.test.mjs`, and source-of-truth state files.
- How tested: see Validation Evidence.
- What is incomplete: external/protected production proof, VPS/cloud review,
  and LIVE exchange-side mutation proof.
- Decisions made: secrets for protected ops scripts must enter via existing
  environment-variable families, not command-line flags.
