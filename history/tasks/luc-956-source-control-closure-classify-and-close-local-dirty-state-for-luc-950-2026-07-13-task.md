# LUC-956 Source-Control Closure: Classify and Close Local Dirty State for LUC-950

## Header
- ID: LUC-956
- Title: [Soar][Source Control Closure] Classify and close local dirty state for LUC-950
- Task Type: coordination
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Priority: high
- Mission ID: LUC-956-SOURCE-CONTROL-CLOSE-LUC-950-2026-07-13
- Mission Status: VERIFIED

## Context
[LUC-956](/LUC/issues/LUC-956) is the local source-control closure sidecar for
the current [LUC-950](/LUC/issues/LUC-950) doc-link bundle. This heartbeat
stayed inside the local closure lane: inspect the current worktree, classify
the shared docs/generated-state packet, verify it is safe to preserve locally,
and record the commit decision without treating deploy or protected-production
gates as cleared.

## Goal
Classify the current dirty worktree for the linked `LUC-950` documentation
closure bundle, prove whether a local source-control closure commit is safe,
and leave a durable closure packet for board handoff.

## Scope
- `git status --porcelain=v1 -uall`
- `git diff --check`
- Dirty-path category classification
- Explicit issue-reference scan across dirty paths
- Minimal docs/generated-truth verification
- Lightweight redaction scan on dirty files
- Repo-side source-of-truth updates for this closure packet

## Implementation Plan
1. Capture the baseline dirty tree before mutating `LUC-956` artifacts.
2. Group dirty paths into state/control, task/evidence, docs/generated,
   runtime/product, and stale/other.
3. Scan the dirty paths for [LUC-950](/LUC/issues/LUC-950), proof provenance
   from [LUC-902](/LUC/issues/LUC-902), and existing
   [LUC-956](/LUC/issues/LUC-956) routing refs.
4. Re-run the smallest meaningful verification for the preserved
   docs/generated layer.
5. Persist the closure packet and make the local commit decision.

## Acceptance Criteria
- [x] Baseline dirty-tree counts are recorded.
- [x] The linked issue bundle is explicitly attributable in the dirty tree.
- [x] Runtime/product-code risk is classified rather than hand-waved.
- [x] Focused docs/generated verification is recorded.
- [x] Secret-risk readback is recorded without exposing sensitive values.
- [x] A durable repo-side evidence packet exists for
      [LUC-956](/LUC/issues/LUC-956).
- [x] The local source-control decision is explicit and justified.

## Constraints
- Stay inside local source-control closure scope.
- Do not push, deploy, restart, rollback, or mutate credentials/accounts.
- Do not treat protected delivery-gate status as cleared.
- Do not over-claim the closure commit as broader release acceptance.

## Definition of Done
- [x] Dirty-path classification is durable in repo artifacts.
- [x] Focused validation for the docs/generated-truth bundle is recorded.
- [x] Local source-control disposition is explicit with residual risk and next
      owner.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Classification

### Baseline Dirty Tree

- Baseline captured before this `LUC-956` artifact mutation: `27` dirty paths.
- Category counts:

| Category | Count |
| --- | ---: |
| State/control | 2 |
| Task/evidence | 2 |
| Docs/generated state | 23 |
| Runtime/product code | 0 |
| Stale/out-of-scope | 0 |

### Linked Issue Attribution

| Issue | Dirty paths with explicit refs |
| --- | ---: |
| [LUC-950](/LUC/issues/LUC-950) or scoped `listBotRuntimeSessions` entities | 12 |
| [LUC-902](/LUC/issues/LUC-902) proof provenance | 7 |
| [LUC-956](/LUC/issues/LUC-956) baseline follow-up routing | 3 |

- The dirty bundle contains no `apps/*` runtime/product changes.
- The canonical source-of-truth files in scope are:
  - `docs/modules/api-bots.md`
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/architecture/scanner-overrides.json`
- The generated/readback files do not repeat literal issue IDs in every path,
  but they are directly traceable to [LUC-950](/LUC/issues/LUC-950) because the
  diff updates the documentation relations and the downstream
  architecture-awareness/app-completion/project-truth outputs that the issue
  refreshed.
- [LUC-902](/LUC/issues/LUC-902) remains visible in the preserved bundle only
  as proof provenance for the same controller and read-service surfaces; no new
  proof work or runtime mutation was added here.
- Unlike [LUC-947](/LUC/issues/LUC-947), the baseline already carried direct
  [LUC-956](/LUC/issues/LUC-956) references because the durable
  `LUC-950` task/state updates explicitly routed this follow-up issue before
  this sidecar packet existed.

### Safety Readback

- `git diff --check` passed with line-ending normalization warnings only; no
  substantive diff errors were reported.
- Source-truth drift validation passed:
  `pnpm run architecture:graph:drift:strict` (`857/857` covered, `0` missing).
- Targeted docs/status readback confirms `missingDocLink` is `1987`, and the
  first routed Account access docs gap is
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionSymbolStats`.
- Added-line secret-pattern scan on the scoped dirty paths found no raw secret
  values, private-key material, or bearer-style tokens.

## Validation Evidence
- Manual checks:
  - `git status --porcelain=v1 -uall`
  - `git diff --check`
  - explicit per-path scans for [LUC-950](/LUC/issues/LUC-950),
    [LUC-902](/LUC/issues/LUC-902), and
    [LUC-956](/LUC/issues/LUC-956)
  - added-line secret-pattern scan over the dirty paths
  - targeted `rg` readback over `docs/status`
- High-risk checks:
  - `pnpm run architecture:graph:drift:strict`
  - no push/deploy/protected-account activity
- Reality status:
  - verified

## Result Report
- Task summary:
  - classified the current local bundle as a coherent `LUC-950` doc-link plus
    generated source-of-truth packet and proved it is safe to preserve with a
    local commit.
- Files changed:
  - `history/tasks/luc-956-source-control-closure-classify-and-close-local-dirty-state-for-luc-950-2026-07-13-task.md`
  - `history/evidence/luc-956-source-control-closure-2026-07-13.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - baseline dirty-tree readback, diff check, issue-ref scan, added-line secret
    scan, targeted docs/status readback, and architecture drift audit
- What is incomplete:
  - no push or deploy decision is claimed here
- Next steps:
  - preserve the verified local bundle with one scoped commit and report the
    closure evidence back on [LUC-956](/LUC/issues/LUC-956)
- Decisions made:
  - local source-control decision is `commit`
  - push status is held because this sidecar does not own
    deployment-triggering actions from `main`
