# Task

## Header
- ID: LUC-117
- Title: [Soar][LUC-103-P5E] LUC-47 release smoke blocker evidence closure
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops Release Lead
- Depends on: LUC-47
- Priority: critical

## Context
`LUC-47` remains the first-class release blocker because required temp-domain parallel-stack smoke/readiness evidence is still missing.

## Goal
Close the blocker-evidence gap with fresh, truthful ops proof and explicit unblock ownership/action.

## Constraints
- No production deploy mutation in this checkpoint.
- No secret/token disclosure.
- Keep scope narrow to `LUC-47` blocker evidence closure.

## Definition of Done
- Fresh no-secret runtime proof is attached for current public SHA.
- Operator packet validity is confirmed for the same SHA.
- Remaining blocker is explicit with owner and concrete unblock action.

## Forbidden
- Marking lane done without temp-domain packet.
- Broad cross-lane changes or unrelated cleanup.

## Actions Executed (2026-05-26)
1. Public build-info readback:
   - `curl https://soar.luckysparrow.ch/api/build-info`
   - result: `gitSha=3fedb7a9170097b40accb6ccea1915064f383f11`, `gitRef=main`, `metadataSource=github-branch`
2. Public smoke refresh:
   - `GET https://api.soar.luckysparrow.ch/health` -> `200`
   - `GET https://api.soar.luckysparrow.ch/ready` -> `200`
   - `GET https://soar.luckysparrow.ch/` -> `200`
   - `GET https://api.soar.luckysparrow.ch/workers/ready` -> `401` (expected auth-gated behavior without ops auth context)
3. SHA-bound packet verification:
   - `corepack pnpm run ops:operator-unblock:check -- --packet history/artifacts/v1-operator-unblock-packet-3fedb7a9-2026-05-26.json --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --json`
   - result: `PASS`

## Evidence Classification
- `implemented and verified`:
  - public runtime reachability (`/health`, `/ready`, web root),
  - current deployed SHA readback,
  - SHA-bound operator packet validity.
- `blocked`:
  - temp-domain parallel-stack evidence packet remains missing.

## Remaining Blocker (LUC-47 Acceptance Gap)
- Missing artifacts:
  - `temp-api /health`
  - `temp-api /ready`
  - `temp-web /`
  - `temp-web /api/build-info` (must match expected SHA)
  - worker readiness packet for `market-data`, `market-stream`, `backtest`, `execution`
  - rollback/cutover note bound to the same candidate SHA

## Final Disposition
- `blocked`

## Unblock Owner And Action
- Owner: scheduled Coolify operator + local-board release controller.
- Action:
  1. create/expose temp-domain parallel-stack resource in Coolify,
  2. deploy expected SHA `3fedb7a9170097b40accb6ccea1915064f383f11`,
  3. attach full temp-domain smoke/readiness packet (`temp-api`, `temp-web`, four workers),
  4. attach rollback posture and cutover recommendation.

## Source-Control Closure
- Files changed: this task packet + task board update.
- Verification commands/results:
  - build-info readback: PASS
  - public smoke endpoints: PASS (`200/200/200`, worker readiness unauth `401` expected)
  - operator packet check: PASS
- Commit SHA: not committed
- Push status: not needed
- Deploy impact: none

## Finish-Successful-Run Handoff Delta (2026-05-26)
- Evidence bundle provenance/syntax recheck completed for `LUC-47` docs:
  - `luc-47-blocker-reconciliation-2026-05-26.md`
  - `luc-47-scheduled-release-smoke-checklist-2026-05-26.md`
  - `luc-47-successful-run-handoff-2026-05-26.md`
  - `luc-47-temp-domain-blocker-resnapshot-2026-05-26T03-15Z.md`
  - `luc-47-temp-domain-blocker-snapshot-2026-05-26.md`
- Each file has valid top-level markdown heading (`# ...`) and no credential/token value exposure was found in this bundle scan.
- Commit decision: `no-commit` in this heartbeat.
  - Reason: repository state is mixed/dirty across many unrelated lanes, and this run cannot prove safe single-owner commit boundaries for all touched source-of-truth files in scope.
- Final lane disposition for this delta: `blocked`.
- Additional unblock owner/action (source-control boundary):
  - Owner: Engineering Delivery Lead + lane owners for mixed dirty scope.
  - Action: isolate a clean owner-scoped commit boundary (or dedicated clean worktree) for `LUC-117` closure commit, then perform commit/push according to release policy.

## Source-Scoped Recovery Action Delta (2026-05-26)
- Re-ran targeted secret-pattern scan for the five required `LUC-47` evidence files:
  - regex family: `AKIA`, `ghp_`, `github_pat_`, `xox*`, `AIza`, private-key headers, and bearer token-like strings.
  - result: no matches.
- Re-ran top-level markdown heading check for the same five files.
  - result: all files start with valid `# ` heading.
- Scope decision: no additional files were staged; no commit created in this heartbeat.
- Final disposition remains `blocked` until temp-domain acceptance packet is attached and clean owner-scoped commit boundary is available.
