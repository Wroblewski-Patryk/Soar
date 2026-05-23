# Agent Process Evals

Last updated: 2026-05-23

Use this ledger to improve how Codex agents work together. It evaluates the
process, not only the code.

| ID | Date | Mission/task | Coordinator score | Lane split score | Brief clarity score | Proof score | Memory score | Main failure mode | Improvement for next mission | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AEV-000 | YYYY-MM-DD | Example mission | 0-5 | 0-5 | 0-5 | 0-5 | 0-5 | Replace sample row. | Replace sample row. | open |
| AEV-001 | 2026-05-20 | `V1-PROTECTED-PREFLIGHT-DD1A1FAF-2026-05-20` | 4 | 4 | 4 | 4 | 4 | Validation stayed blocked because required protected inputs and current-day evidence are absent, not because of lane confusion. | Start the next protected release mission from `.agents/state/active-mission.md` and the operator unblock packet; keep implementation lanes omitted until protected proof exposes a code/runtime defect. | open |
| AEV-002 | 2026-05-20 | `V1-OPERATOR-UNBLOCK-PACKET-DD1A1FAF-2026-05-20` | 4 | 4 | 4 | 3 | 4 | Work could only produce a handoff because protected inputs remained absent; final proof is intentionally blocked. | When protected inputs appear, switch immediately from documentation lane to Ops/Release execution lane and run the packet in order before doing more local prep. | open |
| AEV-003 | 2026-05-20 | `V1-OPERATOR-UNBLOCK-TOOLING-INDEX-SYNC-2026-05-20` | 4 | 4 | 4 | 5 | 4 | The lane was correctly local and tooling-only; the remaining blocker is external protected input availability. | Avoid adding more preparatory tooling once the operator packet and manifest bundle pass; the next meaningful progress requires protected execution. | open |
| AEV-004 | 2026-05-20 | `V1-AGENT-BLOCKER-SWEEP-DD1A1FAF-2026-05-20` | 5 | 5 | 5 | 5 | 4 | Parallel agents confirmed the same blocker; continuing local prep would create churn rather than deployment progress. | On the next user nudge, do not spawn more scouts unless protected inputs changed; go straight to operator packet execution or report the protected blocker. | open |
| AEV-005 | 2026-05-20 | `V1-FUNCTION-ARCHITECTURE-VERIFICATION-2026-05-20` | 4 | 5 | 5 | 5 | 5 | Coordinator initially ran two DB-backed validation gates in parallel, reproducing the known shared-DB interference pitfall; sequential reruns passed, and the full API suite passed only after switching to one-worker fork execution. | For broad "check everything" missions, split read-only analysis lanes freely, but keep DB-backed API validation in one explicit sequential lane with reset boundaries and `--pool=forks --maxWorkers=1 --minWorkers=1` for full-suite proof. | open |
| AEV-006 | 2026-05-21 | `FRONTEND-ENGINE-UX-DCA-SWEEP-2026-05-21` | 5 | 5 | 5 | 5 | 5 | The initial frontend concern mixed fixable UX performance defects with a LIVE-sensitive risk-confirmation product decision. | Keep the repair lane scoped to confirmed local defects, and split LIVE-sensitive `riskAck` confirmation design into a dedicated Product/UX/Security lane before implementation. | open |
| AEV-007 | 2026-05-21 | `REST-IMPLEMENTATION-SWEEP-2026-05-21` | 5 | 4 | 5 | 5 | 5 | Three delegated lanes found actionable defects, but the fourth architecture/docs lane could not be spawned because the runtime hit the agent-thread limit and had to be handled locally by the coordinator. | For "use all agents" requests, reserve one local coordinator lane for architecture/docs/state when thread capacity is limited, and keep delegated write scopes read-only unless a bounded patch is assigned. | open |
| AEV-008 | 2026-05-21 | `LOCAL-CERTAINTY-CLOSURE-2026-05-21` | 5 | 4 | 5 | 5 | 5 | Two write-capable lanes and the coordinator briefly overlapped on Reports migration work, producing a duplicate migration that had to be removed before validation. | For schema/data lanes, assign one migration owner only; other agents may inspect/report but must not create migrations unless explicitly handed that write lock. | open |
| AEV-009 | 2026-05-21 | `SECURITY-RED-TEAM-HARDENING-2026-05-21` | 4 | 5 | 5 | 5 | 5 | The first background security agents were closed before their reports were integrated, so the coordinator had to rerun the agent set to preserve full evidence. The second-round agents completed reports before closure and drove the final fixes. | For security/compliance missions, wait for each delegated lane to reach a completed status and capture its report into the task record before closing the agent; if capacity cleanup happens early, rerun that lane and mark the first result as non-evidence. | open |
| AEV-010 | 2026-05-21 | `SECURITY-RED-TEAM-HARDENING-2026-05-21-continuation` | 5 | 5 | 5 | 5 | 5 | The API focused batch initially used the wrong timeout flag and produced a shared-DB cleanup artifact after one long test timed out; rerunning with `--test-timeout 30000` passed. | For Vitest v3 API DB-backed focused packs, use `--test-timeout 30000` and keep long order-service tests isolated from other DB packs when timing-sensitive. | open |
| AEV-011 | 2026-05-22 | `ARCH-CODE-RUNTIME-AUDIT-2026-05-22` | 5 | 5 | 5 | 4 | 5 | Initial DB-backed proof was falsely blocked by assuming Laragon implied Postgres readiness; after checking processes, repo Postgres/Redis had to be started explicitly. Durable worker queue and cross-container heartbeat remain too deep for the safe local patch batch. | For architecture-code audits, run read-only lanes in parallel, then close safe local fixes in batches, but verify workstation services explicitly: Laragon/MySQL and repo Postgres are separate readiness facts. | open |
| AEV-012 | 2026-05-22 | `ARCH-CODE-RUNTIME-AUDIT-2026-05-22-deep-continuation` | 5 | 5 | 5 | 5 | 5 | The deeper continuation split cleanly into money-path, backtest parity, and ops/worker lanes, but coordinator review still caught one production-liveness issue: worker heartbeat timers must keep standalone worker containers alive. | Keep delegated lanes focused, then do an integration pass specifically for process lifecycle semantics, not only TypeScript/tests. For worker/container changes, review timer refs and shutdown behavior before accepting a lane. | open |
| AEV-013 | 2026-05-23 | `ARCH-RUNTIME-P1-006-BACKTEST-MULTI-STRATEGY-MERGE` | 5 | 4 | 5 | 4 | 5 | The architecture and code agents correctly identified the backtest multi-strategy gap, but the coordinator's attempted full API suite proof timed out without output and left Vitest child processes alive until cleaned up. | Keep full API proof as a deliberate sequential validation lane with a known one-worker/timeout pattern; after any shell timeout, inspect and clean workspace-owned `pnpm`/`vitest`/`tinypool` processes before continuing. | open |
| AEV-014 | 2026-05-23 | `LIVE-EXCHANGE-EXECUTION-PARITY-2026-05-23` | 5 | 5 | 5 | 4 | 5 | Read-only manual and bot lanes isolated the real Gate.io symbol/rules defect quickly, and public deploy proof reached `9d1a8387`; the remaining proof gap is protected app/manual/bot readback plus any explicitly approved minimum-size live mutation. | For live-trading parity work, keep mutation proof behind a separate deploy-and-approval checkpoint; use read-only connector probes to compute the minimum executable size before asking for live order approval, and do not treat public build-info/smoke as protected app readback. | open |
| AEV-015 | 2026-05-23 | `LIVE-EXCHANGE-EXECUTION-PARITY-2026-05-23-contract-size-proof` | 5 | 5 | 5 | 5 | 5 | The coordinator kept the critical test patch local while using two explorers for route-mocking feasibility and source-of-truth updates. Initial DB-backed proof failed only because local Postgres was down; `pnpm run go-live:infra:up` restored the expected repo DB/Redis services and focused proof passed. | For future route-level proofs behind test-only default stubs, prefer a Vitest-only wrapper around the lower service boundary rather than production DI churn, and start repo Postgres/Redis before DB-backed API tests even if Laragon is running. | open |

## Scoring

- `0`: missing or harmful.
- `1`: present but unclear.
- `2`: usable with major gaps.
- `3`: acceptable.
- `4`: strong.
- `5`: excellent and reusable.

## Required Eval Triggers

- broad mission with subagents
- failed or partial validation
- architecture or UX direction choice
- repeated task churn
- user says work is going in circles
- coordinator discovers a missing lane, bad split, or weak proof

## Closure Rule

Close an eval row only after the next mission brief, hierarchy, lane catalog,
task template, test strategy, or project memory has been updated.
