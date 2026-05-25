# Function Coverage Ledger Standard

Status: reusable project standard
Owner: QA/Test + Planning

## Purpose

The function coverage ledger is a lightweight source of truth for answering
three questions before a release:

1. What functions does the product claim to have?
2. Is each function implemented, verified locally, and proven in the target
   environment?
3. What exact task should be planned next: feature, fix, evidence, blocker, or
   scope decision?

This standard is intentionally project-portable. Soar's V1 matrix is one
instance of the model; future projects should reuse the column contract and
classification rules rather than inventing a new audit shape.

## When To Use It

Use this ledger when a project has enough surface area that ad-hoc testing no
longer answers release confidence questions. Typical triggers:

- V1/V2 release readiness.
- Safety, money, security, AI, healthcare, legal, or data-sensitive workflows.
- A project with many modules where repeated "test everything again" loops are
  wasting time.
- A handoff between planning, implementation, QA, ops, or product agents.
- A production incident where you need to know which adjacent functions are
  already covered.

Do not use it as a replacement for tests, architecture docs, or product scope.
It is an index that points to those proofs.

## Canonical Files

Each project should keep these artifacts:

- `docs/operations/<release>-function-coverage-matrix-<date>.csv`
  - Canonical, repository-tracked source of truth.
- `docs/operations/<release>-function-coverage-audit-<date>.md`
  - Human-readable summary of scope, counts, and operating rules.
- `docs/operations/<release>-function-implementation-readiness-audit-<date>.md`
  - Classification of rows into release planning buckets.
- Optional generated workbook:
  - `outputs/<release>-function-coverage-audit-<date>/<name>.xlsx`
  - Operator-friendly filter/sort artifact. It is not the canonical source
    unless the project explicitly says so.

## Column Contract

The standard ledger columns are:

| Column | Required | Meaning |
| --- | --- | --- |
| `ID` | yes | Stable row identifier. Use a module-prefixed code such as `AUTH-LOGIN-001`. |
| `Module` | yes | Canonical module or product area. Must match the project's module map when one exists. |
| `Submodule` | yes | Smaller owned area inside the module. |
| `Mode` | yes | Runtime mode, user type, environment, or scope, such as `LIVE`, `PAPER`, `ADMIN`, `production`, `mobile`. |
| `Layer` | yes | Implementation layer touched by the function: UI, API, DB, worker, integration, ops, etc. |
| `Capability` | yes | Parent function or user/business capability. |
| `Scenario / child function` | yes | Concrete behavior, edge case, or child function. |
| `Expected behavior` | yes | What must be true when the function works. |
| `Local status` | yes | Local/test evidence state. |
| `Local evidence` | yes | Test file, task, commit, document, or reason. |
| `Target status` | optional alias | Portable name for deployment/environment proof. Use this if the project is not production-oriented. |
| `Production status` | yes for Soar | Target-environment evidence state. In non-production projects, rename to `Target status`. |
| `Production evidence` | yes for Soar | Target proof or blocker. In non-production projects, rename to `Target evidence`. |
| `Confidence` | yes | `High`, `Medium`, or `Low` based on proof quality, not optimism. |
| `Risk` | yes | Why the row matters. |
| `Priority` | yes | Release priority, usually `P0`, `P1`, `P2`. |
| `Owner` | yes | Team, role, or module owner for follow-up. |
| `Next verification` | yes | The next smallest proof or task needed. |
| `Last verified` | yes | ISO date of latest meaningful evidence. |
| `Notes` | no | Context, caveats, or links. |

For Soar, keep the existing `Production status` and `Production evidence`
columns. For other projects, the same model may use `Target status` and
`Target evidence` if the target is stage, beta, enterprise tenant, app store, or
another release environment.

## Status Vocabulary

Use one controlled vocabulary. Do not invent synonyms per row.

| Status | Use when |
| --- | --- |
| `PASS` | Current evidence proves the behavior in that layer/environment. |
| `COVERED_LOCAL` | Local evidence exists, but it is older, indirect, or not a dedicated current pass. |
| `PARTIAL` | Some proof exists, but at least one relevant scenario or environment proof is missing. |
| `NEEDS_TARGET_SAMPLE` | A real target-environment event/sample is still needed. |
| `NEEDS_TARGET_UI_CHECK` | A UI/browser/device proof is still needed. |
| `NOT_VERIFIED` | No explicit current verification was found. |
| `NOT_APPLICABLE` | The environment/layer does not apply to this row. |
| `BLOCKED` | Verification cannot proceed until a dependency, access, environment, or decision is resolved. |
| `FAIL` | Fresh verification was attempted and failed. |

Soar's current matrix uses `NEEDS_PROD_SAMPLE` and `NEEDS_PROD_UI_CHECK`. Other
projects may prefer the neutral `NEEDS_TARGET_*` names, but should not mix both
families in the same ledger.

## Readiness Classification

After filling the ledger, classify every row into one planning bucket.

| Bucket | Rule | Planning action |
| --- | --- | --- |
| `READY` | Local evidence is acceptable and target status is `PASS` or `NOT_APPLICABLE`. | Keep regression coverage; do not plan new work unless regression appears. |
| `IMPLEMENTED_NEEDS_EVIDENCE` | Local implementation appears present, but target status is `PARTIAL`, `NEEDS_TARGET_SAMPLE`, or `NEEDS_TARGET_UI_CHECK`. | Plan an evidence task, not a feature. If evidence fails, create a narrow fix. |
| `IMPLEMENTED_NOT_VERIFIED` | Local implementation appears present, but target status is `NOT_VERIFIED`. | Decide launch scope, then verify or defer. |
| `V1_BLOCKER` | Status is `FAIL` or `BLOCKED` for a release-critical row. | Resolve, explicitly waive, or stop release. |
| `REQUIRES_IMPLEMENTATION_REVIEW` | No credible local implementation proof exists. | Inspect code and plan feature/fix work before evidence work. |
| `DEFERRED` | Product/release owner explicitly excludes the row from this release. | Record the decision and target release. |

## Priority Rules

Use priority for release impact, not engineering difficulty.

- `P0`: release blocker if broken, unproven, or unsafe.
- `P1`: important for a credible release but not necessarily a hard GO blocker.
- `P2`: useful or launch-adjacent; can often be deferred with a recorded
  decision.

High-risk products should be stricter: money movement, security, AI authority,
privacy, healthcare, legal, or destructive operations usually start as `P0`
until proven otherwise.

## Row Granularity

A good row is small enough to become one focused verification or fix task.

Prefer:

- `Strategy close / Basic TP threshold`.
- `Manual order / current selected bot and symbol context`.
- `API key / stored key connection test`.

Avoid:

- `Strategies work`.
- `Orders are done`.
- `Dashboard is OK`.

If a row requires more than one independent proof, split it.

## Planning Workflow

Use this loop:

1. Build a module inventory from route maps, screens, services, tests, and
   product docs.
2. Add one row per meaningful function or child scenario.
3. Fill local and target evidence honestly.
4. Classify readiness buckets.
5. Plan work in this order:
   - `V1_BLOCKER`
   - `REQUIRES_IMPLEMENTATION_REVIEW`
   - `IMPLEMENTED_NEEDS_EVIDENCE` for `P0`
   - `IMPLEMENTED_NOT_VERIFIED` for `P0/P1`
   - `P1/P2` scope decisions
6. Update the ledger after every task.

Do not turn every `PARTIAL` row into a feature. Most `PARTIAL` rows should
become proof tasks first. Fixes come after a proof fails or code inspection
finds a concrete defect.

## Task Derivation Rules

| Ledger state | Create this task type |
| --- | --- |
| `FAIL` on `P0` | Fix or incident task. |
| `BLOCKED` on `P0` | Ops/access/decision unblocker. |
| `REQUIRES_IMPLEMENTATION_REVIEW` | Code audit, then feature/fix. |
| `IMPLEMENTED_NEEDS_EVIDENCE` | Verification task with exact commands/manual steps. |
| `IMPLEMENTED_NOT_VERIFIED` | Scope decision, then verification or defer. |
| `READY` | No task unless regression, refactor risk, or release rerun requires it. |

Every derived task should list the exact row IDs it closes.

## Evidence Quality

Evidence is stronger when it is:

- Current for the candidate being released.
- Reproducible by command, test name, screenshot, or artifact path.
- Tied to a row ID.
- Secret-safe and user-data-safe.
- Specific enough that another operator can rerun it.

Evidence is weak when it is:

- "It worked before."
- Inferred from adjacent behavior.
- Based on stale deployment SHAs.
- Not connected to a module/row.
- Hidden in chat without a repository artifact.

## Release Gate Rule

A release may be called ready only when:

- all `P0` rows are `READY`, `DEFERRED` by explicit owner decision, or have a
  documented release waiver;
- all `V1_BLOCKER` rows are resolved or waived;
- `REQUIRES_IMPLEMENTATION_REVIEW` rows are zero for release-critical scope;
- every waiver has an owner, reason, risk, and follow-up date.

## Maintenance Rule

The ledger is not a one-time spreadsheet. It must be updated when:

- a feature ships;
- a bugfix changes behavior;
- a production incident reveals a gap;
- a release gate is rerun;
- a module is deferred or removed from launch scope;
- a test or smoke proof becomes stale.

Rows should be changed in the smallest truthful way. Do not rewrite the whole
matrix to hide uncertainty.
