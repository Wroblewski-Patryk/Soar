# V1EXCEL-A - Full V1 Excellence And Production Confidence Plan

Status: Active
Owner: Codex Planning Agent
Stage: planning
Last Updated: 2026-04-29

## Context

The repository now records `V1` engineering scope as implemented and the final
`V1TRUTH-A` money-path hardening wave as closed. Architecture is currently
stable:

- no unresolved architecture decisions are open,
- the singular bot contract remains canonical:
  `1 bot = 1 wallet + 1 symbol-group + 1 strategy`,
- deferred post-`V1` architecture work (`BOTMULTI-A`) is already separated.

However, the project rules define `DONE` and `production activation` more
strictly than "tests are green":

- `DEFINITION_OF_DONE.md` requires manual verification through the real
  affected UI/API/operator surfaces,
- `INTEGRATION_CHECKLIST.md` requires vertical-slice and restart/reload
  validation,
- `DEPLOYMENT_GATE.md` and the
  `docs/architecture/reference/v1-production-activation-contract.md`
  require fresh release-gate, smoke, rollback, restore-drill, and sign-off
  evidence.

The strongest remaining gap is therefore no longer repository architecture or
known code drift. It is confidence closure:

1. fresh end-to-end manual and production evidence for the newest `LIVE`
   money-path fixes is still missing;
2. local umbrella `test:go-live:smoke` is still workstation-blocked by known
   migration debt (`P3009` on local migration history), even though narrower
   go-live packs already pass;
3. current activation/runbook artifacts proving production readiness are older
   than the latest `V1SAFE/V1GUARD/V1MARK/V1TRUTH` runtime hardening slices,
   so by contract they must be refreshed before claiming excellent
   production-grade confidence;
4. if any real-account verification reveals a new money-path bug, it must open
   a new narrow hardening packet instead of being hidden under a generic
   "V1 is done" claim.

## Goal

Close every remaining non-deferred gap between:

- "the repository implementation is green",
- and
- "Soar V1 LIVE bot behavior can be claimed as fully excellent,
  operator-trustworthy, and production-activation-ready under the repository's
  own rules".

## Scope

- production-activation evidence refresh
- local/stage/prod go-live confidence path
- manual UI/API/operator verification for `LIVE` and `PAPER` critical flows
- worker/runtime observability and restart confidence refresh
- release/sign-off artifact refresh on the latest candidate
- documentation and source-of-truth sync for the final `GO / NO-GO` answer

## Non-Goals

- no `BOTMULTI-A` implementation
- no new architecture change unless a fresh mismatch is discovered
- no exchange-family expansion
- no speculative product feature work outside confidence closure

## Architecture Alignment

Reviewed authorities:

- `docs/architecture/architecture-source-of-truth.md`
- `docs/architecture/reference/v1-production-activation-contract.md`
- `docs/architecture/reference/live-protection-state-parity-contract.md`
- `docs/architecture/reference/position-lifecycle-parity-matrix.md`
- `docs/architecture/06_execution-lifecycle.md`

Confirmed current architecture truth:

- singular bot model remains canonical through `V1`
- one shared lifecycle kernel remains authority across `BACKTEST`, `PAPER`,
  and `LIVE`
- `LIVE` remains exchange-authoritative and fail-closed
- production activation requires fresh evidence, not stale historical green
  artifacts

No architecture mismatch is currently confirmed. This packet is therefore a
confidence-and-evidence wave, not an architecture rewrite.

## What Is Already Closed

These are not open gaps anymore and must not be re-planned as if unfinished:

- futures manual-order leverage/margin parity (`V1TRUTH-02`)
- exchange-backed app-driven `LIVE` manual close (`V1TRUTH-03/04`)
- pending external/manual exchange order versus open-position truth
  (`V1TRUTH-05/06`)
- final `DCA/TTP/TSL` nuance (`V1TRUTH-07/08`)
- imported/recovered `LIVE` protection-state parity (`V1SAFE-A`)
- mark-price truth for `LIVE FUTURES` (`V1MARK-A`)
- broad regression harness stabilization (`V1COVER-A`)
- restart continuity contract and recovery truth (`V1RESTART-A`)
- close attribution truth (`V1CLOSE-A`)

## Remaining Gap Categories

### 1. Fresh manual real-flow verification is missing

Repository rules still require manual validation of the real affected path.
The latest `LIVE` money-path fixes are covered by focused automated packs, but
they still need a canonical manual verification matrix on actual UI/API
surfaces:

- `PAPER` manual order open / close
- `LIVE` manual order open / close
- pending exchange order stays in `orders` until fill
- same-symbol DCA progression on managed position
- `TTP` / `TSL` / `SL` behavior after DCA
- manual exchange-side intervention and subsequent dashboard truth
- restart / recovery / re-opened dashboard truth

### 2. Fresh production activation evidence is stale versus latest hardening

The activation contract requires current-day evidence families for the
candidate release:

- release gate
- backup/restore drill
- rollback proof
- post-deploy smoke
- runtime freshness / worker health
- RC status / sign-off / checklist

Historical artifacts exist, but they predate the newest `LIVE` hardening
waves. They are therefore useful references, not sufficient final proof for
"fully excellent V1" today.

### 3. Local umbrella go-live confidence is still not fully trustworthy

`test:go-live:api` and `test:go-live:web` are green, but the umbrella local
`test:go-live:smoke` still exposes known local migration-history debt. That
does not prove a product defect, but it still leaves one reproducibility gap
for another engineer or agent trying to run the full local confidence path.

### 4. Real-account and operational confidence still need one explicit GO/NO-GO decision

The repository has closure evidence for engineering waves, but it does not yet
contain one final post-`V1TRUTH` operator packet that says:

- current candidate SHA,
- stage/prod evidence freshness,
- exact real-account/manual scenarios executed,
- residual risks,
- final `GO` or `NO-GO` for trusting `LIVE` with real money.

## Execution Plan

1. `V1EXCEL-00 planning(queue): publish full V1 excellence packet`
   - Publish this packet and sync queue/context.

2. `V1EXCEL-01 audit(v1-gap-map): freeze the exact remaining gap map against DoD, integration, deployment, and activation contracts`
   - Produce one canonical map:
     - closed in code
     - missing manual evidence
     - missing local reproducibility evidence
     - missing fresh stage/prod evidence
     - explicitly deferred post-`V1`

3. `V1EXCEL-02 qa(local-infra): restore fully reproducible local confidence path or classify the exact external blocker`
   - Resolve or strictly classify the remaining local `test:go-live:smoke`
     blocker around migration-history debt.
   - Goal is not "fake green"; goal is one honest reproducible local path.

4. `V1EXCEL-03 qa(manual-matrix): execute the full critical manual UI/API/operator matrix`
   - Run and record manual verification for the latest `LIVE` and `PAPER`
     money paths.
   - Include exchange-side intervention scenarios where feasible.

5. `V1EXCEL-04 ops(stage-refresh): rerun the latest authenticated stage release gate and smoke on the current candidate`
   - Refresh stage confidence artifacts against the newest repository state.

6. `V1EXCEL-05 ops(prod-refresh): rerun fresh production release-gate evidence families on the current candidate`
   - Refresh:
     - prod release gate,
     - prod smoke,
     - prod rollback proof,
     - prod restore-drill proof,
     - worker/runtime freshness visibility.

7. `V1EXCEL-06 ops(runtime-observability): verify active LIVE worker/runtime diagnostics under current production truth`
   - Confirm worker health, runtime freshness, event visibility, and operator
     diagnostics after the newest `LIVE` hardening slices.

8. `V1EXCEL-07 release(go-no-go): rebuild RC status/sign-off/checklist and publish final V1 excellence decision`
   - Produce one final operator-facing answer:
     - `GO`
     - or `NO-GO` with exact blockers.

9. `V1EXCEL-08 docs(closure): sync canonical queue/context and freeze the final post-V1 handoff`
   - If `GO`, close the wave and point future work to `BOTMULTI-A`.
   - If `NO-GO`, open only the smallest missing fix packet(s).

## Acceptance Criteria

- The repository has one explicit gap map separating:
  - closed implementation,
  - missing evidence,
  - deferred post-`V1` work.
- The critical `LIVE` and `PAPER` operator flows are manually verified with
  recorded results.
- Stage and production activation evidence is refreshed on the latest
  candidate, not inherited from older artifacts.
- The full confidence path has an honest local status:
  - green, or
  - explicitly blocked by a documented external/local debt item.
- A final `GO / NO-GO` packet exists for the current candidate.

## Risks

- real-account verification can still reveal a new narrow bug even when all
  repository tests are green
- stale production evidence could create a false sense of readiness if not
  refreshed after the newest hardening waves
- local migration-history drift can keep reproducibility weaker than the code
  quality itself unless classified or repaired explicitly
- this packet must not quietly absorb new product bugs; any discovered defect
  should open a dedicated narrow follow-up wave

## Validation Plan

- `pnpm run quality:guardrails`
- canonical release gate commands from
  `docs/operations/v1-release-gate-runbook.md`
- manual matrix evidence recorded in `docs/operations/`
- fresh stage/prod activation artifacts recorded in `docs/operations/`

## Result Report

- Task summary: pending implementation
- Files changed: planning packet only
- How tested: `pnpm run quality:guardrails`
- What is incomplete: audit, manual matrix, local confidence repair/classification,
  fresh stage/prod evidence, final go/no-go
- Next steps: `V1EXCEL-01..08`
