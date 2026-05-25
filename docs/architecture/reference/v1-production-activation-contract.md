# V1 Production Activation Contract

Status: Active  
Last updated: 2026-04-22

## Purpose

Freeze the rules for turning the hardened V1 codebase into an operator-ready,
production-activatable release candidate.

## Canonical Activation Rules

1. V1 activation is not only code-correctness.
   It requires fresh, reproducible operational evidence for:
   - readiness,
   - release gate,
   - backup/restore viability,
   - post-deploy smoke,
   - rollback path,
   - worker/runtime heartbeat visibility.

2. No release decision may rely on stale or implicit evidence.
   If an artifact or probe is outdated, missing, or ambiguous, activation stays
   blocked.

3. Stage and production truth must stay explicit.
   A successful local or stage-only check cannot be reported as production
   readiness.

4. Release readiness must remain fail-closed.
   Missing secrets, stale evidence, unhealthy workers, or incomplete rollback
   data must keep the release state `not_ready`.

5. Operator-facing evidence must be human-reviewable.
   The final V1 pack must point to concrete docs and artifacts, not only script
   exit codes.

## Required Evidence Families

- release gate output,
- readiness diagnostics,
- backup/restore drill evidence pack,
- post-deploy smoke,
- rollback rehearsal or rollback proof pack,
- worker/runtime health visibility,
- sign-off summary.

## Proof Truth Rules

- Production activation must treat backup/restore drill and rollback proof as
  explicit, dated evidence families, not implied runbook references.
- A stale or missing prod proof artifact is equivalent to a failed gate.
- Operator-facing output must link to the exact proof artifact generated for
  the candidate day.

## Non-Goals

- no V2 scope,
- no new product features,
- no exchange rollout expansion,
- no speculative cleanup outside release activation paths.

## Future-Agent Rules

- Do not mark V1 activation done from unit/integration tests alone.
- Do not collapse stage and prod evidence into one generic success claim.
- Do not treat legacy compatibility envs or local-only passes as production
  sign-off.
- Do not treat public prod smoke or internal prod diagnostics as a substitute
  for fresh prod restore-drill proof, fresh prod rollback proof, and named
  human sign-offs.
