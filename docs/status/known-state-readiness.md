# Known-State Readiness

Last updated: 2026-06-07

Status: **ACTIVE REPAIR/VERIFICATION / PROTECTED GATE HOLD**

Soar has the project-knowledge backbone needed for autonomous agent work, but it
is not in monitoring-only mode. Current generated architecture evidence is
fresh, while the remaining work is represented as owned Paperclip repair,
verification, and protected/operator gate lanes. Local evidence does not bypass
protected browser, worker readiness, SLO/release, Coolify access, owner-login,
exchange, account, or live-trading gates.

## Current Evidence

- Architecture awareness generated at `2026-06-07T06:46:35.755Z` with
  `14832` entities, `23869` relations, `0` ownerless entities, and
  `0` disconnected entities.
- Actionable inferred-link state: `433` actionable implementation entities
  without inferred tests and `0` actionable implementation entities without
  inferred docs.
- Recent local relation repairs verified release/RC/SLO evidence helpers, V1
  scorecard and master ledger helpers, route/docs/graph helper scripts, Web
  shared UI/PWA helpers, and Coolify stack environment checker traceability.
- Paperclip queue readback for Soar on 2026-06-07 under
  [LUC-2665](/LUC/issues/LUC-2665) returned `95` non-terminal issues:
  `92` blocked, `1` in_progress, `2` in_review, and `0` todo.
- Main live/in-review owner paths are
  [LUC-2665](/LUC/issues/LUC-2665) this docs/memory sweep,
  [LUC-2558](/LUC/issues/LUC-2558) Coolify read-only production status access
  binding, and [LUC-1397](/LUC/issues/LUC-1397) owner-login verification path.
- Protected gate families remain fail-closed through
  [LUC-2505](/LUC/issues/LUC-2505),
  [LUC-241](/LUC/issues/LUC-241),
  [LUC-2372](/LUC/issues/LUC-2372), and related downstream QA/Ops/Integration
  proof lanes.
- Tooling drift remains: `pnpm softwarehouse:control-tick` is named by
  Paperclip issue contracts but is not exposed in this checkout, and
  `scripts/run-live-run-janitor.mjs` is absent.

## Canonical Refresh Command

Use:

```powershell
pnpm run ops:project:known-state
```

Do not run project index, static scan, ledger, and scorecard in parallel. They
are dependent steps.

## Current Blockers

| ID | Status | Owner lane | Evidence | Next action |
| --- | --- | --- | --- | --- |
| KS-QUEUE-001 | active-gate-held | Project Manager / TSA / Docs Memory | [LUC-2714](/LUC/issues/LUC-2714); Paperclip issue readback for this refresh showed `96` non-terminal Soar issues | Do not create duplicate children while owner lanes exist; route next motion through existing blocked or in-review owner paths. |
| KS-PROOF-001 | blocked | QA / Frontend / Backend / Security / Ops | `docs/status/function-journey-index.md`, `docs/status/user-action-index.md`; [LUC-2581](/LUC/issues/LUC-2581); [LUC-2582](/LUC/issues/LUC-2582) | Execute protected proof only after [LUC-2505](/LUC/issues/LUC-2505) and [LUC-241](/LUC/issues/LUC-241) unblock. |
| KS-RELEASE-001 | blocked | Ops / Security / Paperclip | [LUC-2372](/LUC/issues/LUC-2372); [LUC-2366](/LUC/issues/LUC-2366); [LUC-2361](/LUC/issues/LUC-2361); [LUC-2378](/LUC/issues/LUC-2378) | Keep release/protected runtime proof fail-closed until required protected inputs and approval facts exist. |
| KS-ACCESS-001 | in_review | Local board / Ops | [LUC-2558](/LUC/issues/LUC-2558); [LUC-1397](/LUC/issues/LUC-1397) | Resolve Coolify read-only status access and owner-login verification paths without exposing secrets. |
| KS-TOOLING-001 | missing | Softwarehouse control loop owner | [LUC-2665](/LUC/issues/LUC-2665) | Either expose `softwarehouse:control-tick`/janitor in this checkout or update issue contracts to the available project-native equivalents. |

## Definition Of Known Enough

The project can be considered operationally known when:

1. `pnpm run ops:project:known-state` passes.
2. Static scan has no unclassified P0/P1 queue/status findings.
3. V1 master ledger has populated module/action rows.
4. High proof gaps are either proven, converted into owned blocked work, or
   explicitly deferred with owner and reason.
5. Release/prod blockers are represented as first-class Paperclip gates.
