# Reusable Audit Rerun Playbook - 2026-05-19

## Purpose

Use this playbook when rerunning the full reusable audit set after meaningful
project work. It keeps the next audit comparable with the 2026-05-19 baseline
instead of creating a fresh checklist from scratch.

Baseline manifest:

- `docs/operations/reusable-audit-artifact-manifest-2026-05-19.json`

Baseline rollup:

- `docs/operations/full-reusable-audit-rollup-2026-05-19.md`

Machine-readable pair:

- `docs/operations/reusable-audit-rerun-playbook-2026-05-19.json`

Validate the playbook JSON with:

```powershell
corepack pnpm run audit:rerun-playbook:check
corepack pnpm run audit:rerun-playbook:check:test
```

## Preconditions

- Read `docs/analysis/reusable-audit-registry.md`.
- Read the latest `.agents/state/next-steps.md` and `.codex/context/TASK_BOARD.md`.
- Keep the production/LIVE safety boundary explicit before running checks.
- Do not run production data mutation, LIVE order submit/cancel/close, or
  exchange-side mutation without explicit approval.
- Run generated project index and static scan sequentially.
- Keep shared local DB-backed audit packs sequential, reset, or isolated.

## Rerun Order

1. Refresh `AUD-00` project index and static scan.
2. Refresh `AUD-01`, `AUD-02`, and `AUD-23` architecture conformance,
   requirements alignment, documentation, and traceability before deeper
   module audits.
3. Refresh P0 safety families:
   `AUD-06`, `AUD-07`, `AUD-08`, `AUD-09`, `AUD-10`, `AUD-11`, `AUD-12`,
   `AUD-13`, `AUD-19`, and `AUD-20`.
4. Refresh product workflow families:
   `AUD-03`, `AUD-04`, `AUD-05`, `AUD-14`, `AUD-15`, `AUD-16`, `AUD-17`,
   and `AUD-18`.
5. Refresh scope/deferred families: `AUD-21` and `AUD-22`.
6. Produce a new rollup, handoff, and manifest with the new date.
7. Run manifest verification and compare the new manifest to the 2026-05-19
   baseline.

## Required Manifest Checks

For the current 2026-05-19 manifest:

```powershell
corepack pnpm run audit:manifest:verify
```

For a future manifest, first validate the new target manifest:

```powershell
corepack pnpm run audit:manifest:check -- --manifest docs/operations/reusable-audit-artifact-manifest-YYYY-MM-DD.json
```

Then compare it with this baseline:

```powershell
corepack pnpm run audit:manifest:compare -- --base docs/operations/reusable-audit-artifact-manifest-2026-05-19.json --target docs/operations/reusable-audit-artifact-manifest-YYYY-MM-DD.json
```

Use JSON output when a downstream report or dashboard needs structured deltas:

```powershell
corepack pnpm run audit:manifest:compare -- --base docs/operations/reusable-audit-artifact-manifest-2026-05-19.json --target docs/operations/reusable-audit-artifact-manifest-YYYY-MM-DD.json --json
```

## Required Result Shape

Every rerun must produce:

- a dated baseline or rollup report;
- a dated manifest JSON and Markdown pair;
- task records for changed audit families;
- explicit safety-boundary fields;
- open decisions with packet and playbook links;
- improvement and regression notes per affected `AUD-*` ID;
- updated `.codex/context/TASK_BOARD.md`;
- updated `.agents/state/next-steps.md` when priorities change;
- updated project memory index when new canonical artifacts are added.

## Regression Rules

Treat these as regressions until proven otherwise:

- any missing `AUD-00` through `AUD-23` row;
- any duplicate audit ID;
- any missing manifest path;
- any open decision without a packet or playbook;
- any new open decision ID;
- any audit status moving from current to deferred, partial, or failed;
- any increase in `partial`, `deferred`, or `failedDecisionRequired`;
- any safety-boundary field changing from `false` to `true`.

Treat these as improvements only when evidence is named:

- failed or partial audit becomes current;
- open decision is resolved and source-of-truth docs are updated;
- local proof is replaced by fresh production-safe proof;
- endpoint, route, i18n, or docs parity gap count decreases;
- security, exchange, data, or AI red-team coverage expands with evidence.

## Stop Conditions

Stop and report instead of continuing if:

- an architecture/code mismatch requires `DEC-AUD-001` or `DEC-AUD-002`;
- production proof is required but credentials, operator scope, or approval is
  missing;
- LIVE or exchange-side mutation would be needed;
- shared DB state makes DB-backed packs unreliable without reset/isolation;
- a manifest comparison reports a regression that is not explained by an
  accepted scope change.

## Closure Checks

Before closing a rerun:

```powershell
corepack pnpm run audit:manifest:verify
corepack pnpm run audit:remediation-plan:check
corepack pnpm run docs:parity:check
corepack pnpm run quality:guardrails
git diff --check
```

After browser or DB-backed validation, also verify no local validation
processes were left behind:

```powershell
Get-Process chrome-headless-shell -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5432,6379 -ErrorAction SilentlyContinue
docker compose ps
```
