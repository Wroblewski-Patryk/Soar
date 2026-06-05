# Task

## Header
- ID: LUC-2165
- Title: [Soar][Architecture Repair][Docs] Classify second-wave script/tooling relation backlog
- Task Type: documentation
- Current Stage: verification
- Status: DONE
- Owner: Docs Memory Lead
- Depends on: [LUC-2132](/LUC/issues/LUC-2132), [LUC-2155](/LUC/issues/LUC-2155), [LUC-2156](/LUC/issues/LUC-2156)
- Priority: P2
- Module Confidence Rows: documentation / architecture awareness tooling
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation traceability
- Risk Rows: protected production proof boundaries unchanged
- Iteration: Paperclip heartbeat 2026-06-05
- Operation Mode: BUILDER
- Mission ID: LUC-2165-SECOND-WAVE-SCRIPT-TOOLING-RELATION-BACKLOG-2026-06-05
- Mission Status: VERIFIED

## Context
The scoped Paperclip wake for [LUC-2165](/LUC/issues/LUC-2165) had zero pending
comments and `fallbackFetchNeeded=false`. The harness had already claimed the
issue checkout, so checkout was not repeated.

[LUC-2132](/LUC/issues/LUC-2132) classified first-wave script/tooling doc/test
samples, [LUC-2155](/LUC/issues/LUC-2155) verified documentation-link ingestion,
and [LUC-2156](/LUC/issues/LUC-2156) classified script/tooling missing-test
relation rows. The current report generated `2026-06-05T10:06:31.635Z` still
shows second-wave script/tooling rows: fragment-level `CdpClient` entities in
proof runners, `apps/api/scripts/*` tooling, Prisma/data tooling, and broad
audit/build/check/RC/SLO/protected collector rows in missing-test samples.

## Goal
Classify the second-wave script/tooling relation backlog into owner buckets and
repair only the smallest direct documentation-link family needed for current
scanner traceability, without broad docs rewrites, runtime behavior changes, or
protected production proof.

## Constraints
- No deploy, restart, rollback, env edit, database mutation, production smoke,
  protected collector execution, secret readback, exchange mutation, or
  live-trading action.
- Do not rewrite scanner inference or suppress report counts.
- Preserve existing aggregate proof contracts; create focused test work only
  when a concrete regression is isolated.
- Work additively around the existing dirty worktree.

## Definition of Done
- [x] Second-wave script/tooling rows classified by owner bucket.
- [x] Current direct documentation-link gaps repaired for script/tooling sample
  rows.
- [x] Verification run and recorded.
- [x] Protected proof and runtime boundaries explicitly preserved.

## Classification

| Bucket | Sample paths | Current evidence | Action / residual owner |
| --- | --- | --- | --- |
| Fragment-level doc-link gap in already classified proof runners | `scripts/runLocalProtectedRouteActionProof.mjs#CdpClient`; `scripts/runProdAuthSessionBrowserProof.mjs#CdpClient`; `scripts/runProdUxA11yMobileProof.mjs#CdpClient` | Parent script paths already map to testing, post-deploy smoke, or UX/security proof docs. | Added fragment-level documentation links; no protected proof executed. |
| API script/tooling doc-link gap | `apps/api/scripts/assistant-load-benchmark.ts`; `backfillBacktestVenueContext.ts`; `bot-v2-preflight-report.ts`; paper runtime snapshot import/export; `gateioMarketStreamSourceSmoke.ts`; `load-test.mjs`; `start-with-migrate.mjs`; `verifyWalletDbFoundation.ts` | Canonical module/operator docs exist, but direct scanner relations were absent. | Added direct documentation links. Backend/Ops own future behavior changes. |
| Prisma/data tooling doc-link gap | `apps/api/prisma.config.ts`; `apps/api/prisma/seed.ts`; `apps/api/prisma/snapshots/README.md` | Data ownership docs cover schema/data lifecycle. | Added direct documentation links. DB/Migrations owns future schema behavior proof. |
| Missing-test relation backlog from current top tooling rows | `scripts/audit*`; `scripts/build*`; `scripts/check*`; `scripts/deploy*`; `scripts/*rc*`; `scripts/*slo*` | [LUC-2156](/LUC/issues/LUC-2156) classified focused proof, aggregate command proof, and optional helper-level test cases. | No new test task from this docs lane. QA/Test Automation owns future focused regressions. |
| Protected proof collectors | prod auth/session, protected route/action, security exchange, UX/a11y mobile, live/readback collectors | Proof is approval-gated and no-secret. | Not run. Ops/Security/QA own approved production proof under release gates. |
| No-action scanner noise | Parent script rows and aggregate guardrail surfaces still reported because direct per-entity relation inference is conservative. | Architecture graph and guardrail docs carry the aggregate contract. | Leave classified unless a concrete missing owner doc, missing focused proof, or broken command is found. |

## Files Changed
- `docs/architecture/relations/documentation-links.csv`
- `docs/automation/guardrail-commands.md`
- `history/tasks/luc-2165-classify-second-wave-script-tooling-relation-backlog-2026-06-05-task.md`

## Validation Evidence
- Targeted CSV readback:
  - `15` targets checked, `15` linked, `0` missing, `0` duplicate exact
    `entity_path,doc_path` rows.
- Architecture-awareness refresh:
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
    -> PASS; generated `2026-06-05T10:29:09.030Z`, `14269` entities,
    `22200` relations.
  - Actionable missing docs improved from `108` to `74`.
  - Added sample rows each read back with `documents=1`.
- Architecture graph drift:
  - `pnpm run architecture:graph:drift:strict` -> PASS (`822/822`,
    `0` missing).
- Diff hygiene:
  - `git diff --check -- docs/architecture/relations/documentation-links.csv docs/automation/guardrail-commands.md history/tasks/luc-2165-classify-second-wave-script-tooling-relation-backlog-2026-06-05-task.md`
    -> PASS with CRLF warning for `docs/automation/guardrail-commands.md`.

## Result Report
- Task summary: Classified second-wave script/tooling relation rows and added
  direct documentation links for fragment-level proof-runner helpers,
  `apps/api/scripts` tooling, and Prisma/data tooling rows from the current
  architecture-awareness report.
- Deployment impact: none.
- Runtime behavior impact: none.
- Verification status: verified for documentation relation classification.
- Residual risk: report-wide missing-test counts remain a scanner relation
  backlog and QA/Ops protected proof boundary, not closed by this Docs Memory
  classification.
