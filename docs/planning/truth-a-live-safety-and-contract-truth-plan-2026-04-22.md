# Live Safety and Contract Truth Plan (2026-04-22)

Status: Active
Wave: `TRUTH-A`

## Objective

Remove the remaining false-safety and false-contract patterns in Soar so future
feature work and future agents can extend one honest system:

- LIVE orders must never execute on an implicitly selected foreign API key
- exchange account-read routes must never claim wider support than they really
  implement
- UI copy guardrails must catch the literal patterns that operators actually
  see, not only a narrow subset

This wave is intentionally structural. It is not new product scope.

## Why This Wave Exists

The current repository is much healthier after `CQLT`, `L10NQ-E`, and `SCALE`,
but the latest review still found three high-cost drift loops:

- LIVE execution safety still has a forbidden fallback path
- authenticated exchange read flows still mix generic route contracts with
  Binance-only runtime behavior
- guardrails can report green while JSX/presenter string literals still bypass
  detection

If these are left as-is, V2 work will keep rebuilding hidden risk under a clean
surface.

## Governing Contract

This wave is governed by:

- `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`
- `docs/architecture/reference/scalability-anti-drift-delivery-contract.md`
- `docs/architecture/reference/exchange-access-ownership-matrix.md`

## Frozen Workstreams

### TRUTH-A1 LIVE Order Safety

Purpose:

- make API-key ownership deterministic and fail-closed for every LIVE order
  path in scope

### TRUTH-A2 Exchange Capability and Authenticated Read Truth

Purpose:

- align route contracts, capability declarations, read services, and source
  labels so no generic API path secretly behaves as Binance-only

### TRUTH-A3 Web Copy Guardrail Truth

Purpose:

- make repository protection catch real JSX/presenter literal debt and close the
  remaining known runtime/dashboard drift

### TRUTH-A4 Closure and Future-Agent Rules

Purpose:

- leave one evidence pack and one extension rule set so future agents do not
  recreate the same failure modes

## Task Packets

### TRUTH-01 docs(contract): freeze fail-closed LIVE credential ownership and exchange-truth remediation rules

Reason:

- the repo needs one canonical contract for these fixes before code changes
  start

Primary files:

- `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`
- canonical queue/context activation files

Predecessors:

- none

Non-goals:

- no production-code changes

Acceptance:

- one active contract defines fail-closed LIVE ownership, explicit exchange
  capability truth, and broader JSX/presenter guardrail scope
- `TRUTH-A` is promoted into canonical planning and context as the next queued
  structural wave

Validation:

- docs-only sanity review

Required sync outputs:

- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

### TRUTH-02 audit(api-live-safety): map every LIVE credential resolution path and forbidden fallback

Reason:

- we need a complete before-state for risky money-impacting ownership logic

Primary scope:

- `apps/api/src/modules/orders/orders.service.ts`
- any adjacent live-order helper or wallet-context resolver touched by the same
  path

Must capture explicitly:

- current canonical owner of bot-bound API key
- current fallback path(s)
- where wallet ownership is enforced
- where it is only implied
- exact error shape that should replace fallback behavior

Predecessors:

- `TRUTH-01`

Non-goals:

- no behavior change yet

Acceptance:

- audit identifies every branch where LIVE execution can proceed without a
  canonically resolved bot or wallet API key
- each branch is classified as:
  - canonical and safe
  - temporary bridge
  - forbidden and must be removed

Validation:

- docs-only sanity review

Required sync outputs:

- wave plan section updates if audit splits scope further

### TRUTH-03 fix(api-live-safety): remove cross-key fallback and require canonical key parity for LIVE orders

Reason:

- money-impacting execution must never select another exchange key by recency

Primary files:

- `apps/api/src/modules/orders/orders.service.ts`
- adjacent shared ownership helper module if extraction is needed
- `apps/api/src/modules/orders/orders.errors.ts` if new explicit errors are
  required

Implementation target:

- resolve LIVE credential from canonical bot or wallet ownership only
- if canonical ownership cannot be resolved, fail with explicit domain error
- preserve existing paper/backtest paths unchanged

Predecessors:

- `TRUTH-02`

Non-goals:

- no broader rewrite of the full orders domain
- no expansion of exchange support

Acceptance:

- no code path remains that falls back from missing/mismatched `bot.apiKeyId` to
  "latest user key for exchange"
- error contract is explicit and fail-closed
- audit logging still works after the change

Validation:

- focused orders API tests
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

Required sync outputs:

- module docs if the LIVE ownership contract changed materially

### TRUTH-04 test(api-live-safety): add regression locks for LIVE key ownership failure modes

Reason:

- this safety rule must never regress silently

Primary files:

- orders service/e2e test files in `apps/api/src/modules/orders/`

Must validate:

- bot-bound key works
- missing bot-bound key fails closed
- mismatched exchange key fails closed
- no fallback to unrelated recent key occurs

Predecessors:

- `TRUTH-03`

Non-goals:

- no new product behavior beyond locked safety semantics

Acceptance:

- focused regression pack fails on old fallback behavior and passes on new
  fail-closed behavior

Validation:

- `pnpm --filter api run test -- --run <focused orders pack>`
- `pnpm --filter api run typecheck`

Required sync outputs:

- none beyond standard wave tracking

### TRUTH-05 docs(contract): freeze explicit exchange capability matrix for authenticated account reads

Reason:

- generic input contracts must stop implying support that runtime does not yet
  have

Primary files:

- `docs/architecture/reference/exchange-access-ownership-matrix.md`
- module docs for wallets/positions if needed

Must define explicitly:

- which exchanges support authenticated balance preview
- which exchanges support authenticated positions snapshot
- which exchanges support authenticated open-orders snapshot
- whether unsupported exchanges are rejected or narrowed out of the route
  contract
- how `source` labels are derived

Predecessors:

- `TRUTH-01`

Non-goals:

- no code changes yet

Acceptance:

- one written matrix exists for authenticated account-read capability truth
- future tasks can implement unsupported behavior as explicit fail-closed, not
  silent Binance fallback

Validation:

- docs-only sanity review

Required sync outputs:

- module docs linkage where capability truth is user-facing

### TRUTH-06 audit(api-auth-reads): inventory every authenticated exchange read consumer versus real exchange support

Reason:

- we need an exact map of where generic exchange contracts still hide
  Binance-only logic

Primary scope:

- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/positions/positions.service.ts`
- shared exchange read services
- any route/service returning `source` labels for exchange reads

Must classify each consumer as:

- truthful and canonical
- truthful but Binance-only by design
- generic contract with Binance-only implementation
- bridge that should delegate to a new shared account-read contract

Predecessors:

- `TRUTH-05`

Non-goals:

- no production behavior change yet

Acceptance:

- every authenticated account-read entrypoint has an explicit truthfulness
  classification and target closure action

Validation:

- docs-only sanity review

Required sync outputs:

- plan section refresh if audit reveals additional consumer modules

### TRUTH-07 refactor(api-auth-read-contract): introduce one canonical authenticated account-read boundary

Reason:

- balance, positions, and open-orders reads should share one explicit support
  contract and lifecycle

Primary files:

- shared exchange authenticated read layer under `apps/api/src/modules/exchange/`
- immediate calling modules from `TRUTH-06`

Implementation target:

- one shared boundary for authenticated account reads with explicit:
  - exchange
  - market type
  - supported operation family
  - fail-closed unsupported behavior
- shared client lifecycle and source derivation

Predecessors:

- `TRUTH-06`

Non-goals:

- no broad rewrite of unrelated exchange-order placement logic

Acceptance:

- authenticated account-read entrypoints delegate to one canonical boundary
- unsupported exchange/operation combinations return explicit domain errors
- no caller must hardcode `BINANCE` when request scope claims broader exchange
  support

Validation:

- focused exchange API tests
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

Required sync outputs:

- exchange/module docs updated to reflect new boundary

### TRUTH-08 fix(api-wallet-preview): make wallet balance preview contract truthful by exchange and source

Reason:

- wallet preview currently accepts generic exchange input while still executing
  Binance-only behavior

Primary files:

- `apps/api/src/modules/wallets/wallets.service.ts`
- shared exchange authenticated read contract from `TRUTH-07`
- wallet error contract/tests as needed

Implementation target:

- preview path uses requested exchange truthfully through the shared boundary or
  rejects unsupported exchange/capability explicitly
- returned `source` label matches real runtime behavior

Predecessors:

- `TRUTH-07`

Non-goals:

- no UI redesign of wallet forms

Acceptance:

- no `fetchBinance...` path remains behind a generic wallet preview contract
- no hardcoded `source: 'BINANCE'` remains in generic preview success response
- capability errors are explicit and deterministic

Validation:

- focused wallet preview tests
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

Required sync outputs:

- wallet module docs if user-visible error semantics change

### TRUTH-09 fix(api-positions-snapshots): make positions/open-orders snapshot contract truthful by exchange and scope

Reason:

- snapshot reads currently carry multiple Binance-only assumptions while looking
  more generic than they really are

Primary files:

- `apps/api/src/modules/positions/positions.service.ts`
- shared exchange authenticated read contract from `TRUTH-07`

Implementation target:

- positions and open-orders snapshot routes either:
  - become explicitly Binance-only in contract, or
  - delegate to truthful exchange-aware support handling with fail-closed
    unsupported responses

Predecessors:

- `TRUTH-07`

Non-goals:

- no redesign of takeover/rebind business logic beyond truthful exchange scope

Acceptance:

- no silent hardcoded Binance behavior remains behind a broader route contract
- `source` and lookup semantics are honest
- any unsupported exchange state fails explicitly

Validation:

- focused positions/open-orders snapshot tests
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

Required sync outputs:

- positions module docs if route contract is narrowed or hardened

### TRUTH-10 audit(web-guardrails): inventory residual JSX/presenter literal debt and current guardrail blind spots

Reason:

- we need a complete map of what the guardrail still cannot see

Primary scope:

- `scripts/repoGuardrails.mjs`
- focused runtime/dashboard surfaces
- current i18n/guardrail tests

Must capture explicitly:

- literals still visible to operators
- whether they sit in JSX, presenter props, section config, or fallback labels
- whether each one should move to i18n, a presenter helper, or a canonical enum
  label mapper

Predecessors:

- `TRUTH-01`

Non-goals:

- no code changes yet

Acceptance:

- blind spots are categorized by pattern, not just by file
- first implementation slice is frozen from real findings, not guesswork

Validation:

- docs-only sanity review

Required sync outputs:

- plan refinement if blind spots need split tasks

### TRUTH-11 refactor(web-guardrails): harden hardcoded-UI detection for JSX and presenter literals

Reason:

- repo protection must catch real regression shapes before more widgets land

Primary files:

- `scripts/repoGuardrails.mjs`
- `apps/web/src/i18n/guardrails.test.ts`
- any focused guardrail regression tests

Implementation target:

- detect more than `toast/confirm/title/placeholder`
- cover literal labels passed through JSX props and presenter inputs where
  practical without producing unusable noise

Predecessors:

- `TRUTH-10`

Non-goals:

- no broad repo-wide copy migration in the same commit

Acceptance:

- guardrail blocks the known blind-spot patterns identified in the audit
- false-positive rate remains manageable and documented
- exception policy stays narrow and current

Validation:

- `pnpm run quality:guardrails`
- focused i18n/guardrail tests

Required sync outputs:

- `docs/governance/code-quality-guardrails.md` if enforcement surface changes

### TRUTH-12 fix(web-runtime-copy): remove remaining runtime/dashboard literal drift behind canonical presenter or i18n ownership

Reason:

- known literal debt must be closed in code, not only detected in tooling

Primary files:

- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- adjacent presenter/helper files under `home-live-widgets/`
- relevant i18n namespaces

Known starter examples:

- `dcaActionLabel="DCA"`
- raw operator-facing fallback `origin ?? "BOT"`
- raw `strategyId` shown where human-readable presenter or safe placeholder is
  expected

Predecessors:

- `TRUTH-11`

Non-goals:

- no unrelated dashboard redesign
- no expansion of runtime feature scope

Acceptance:

- known literals found in `TRUTH-10` are moved behind canonical i18n or
  presenter mapping
- runtime/dashboard route remains parity-safe

Validation:

- focused dashboard tests
- focused i18n/guardrail tests
- `pnpm --filter web run build`

Required sync outputs:

- i18n/module docs only if ownership materially changes

### TRUTH-13 qa(closure): run focused safety, exchange-truth, and guardrail closure pack

Reason:

- this wave must prove both safety and truthfulness, not just compile

Must validate:

- LIVE orders fail closed on missing/mismatched canonical key
- wallet preview and positions/open-orders snapshot paths are truthful by
  exchange support
- guardrails now catch the newly locked literal patterns
- dashboard runtime surfaces still render correctly after copy cleanup

Validation:

- focused API test pack
- focused web test pack
- `pnpm run quality:guardrails`
- `pnpm run typecheck`
- `pnpm run build`

Required sync outputs:

- validation evidence under `docs/operations/`

### TRUTH-14 docs(sync): publish closure evidence and freeze future-agent extension rules

Reason:

- the wave only pays off if future agents inherit one explicit standard

Primary outputs:

- closure evidence doc under `docs/operations/`
- synchronized queue/context/docs
- explicit future-agent rules for:
  - no LIVE key fallback
  - no generic exchange claim without matching support
  - no JSX/presenter literal debt outside documented exceptions

Predecessors:

- `TRUTH-13`

Acceptance:

- canonical queue/context/docs all agree on what was closed
- future agents can extend the system without rediscovering hidden rules from
  git history

Validation:

- closure doc sanity review
- confirm queue/context parity across canonical files

## Recommended Execution Order

1. `TRUTH-01..TRUTH-04`
2. `TRUTH-05..TRUTH-09`
3. `TRUTH-10..TRUTH-12`
4. `TRUTH-13..TRUTH-14`

## Definition of Done

- no LIVE order path can fall back to a non-canonical user API key
- authenticated account-read routes are honest about exchange support and
  source labels
- wallet preview and positions/open-orders snapshots are either truly
  exchange-aware or explicitly fail-closed for unsupported exchanges
- hardcoded UI guardrails catch the real JSX/presenter literal patterns used in
  the repo
- canonical queue/context/docs/evidence all agree on the post-wave state
