# LUC-616 ARB-001 Activation Scope Decision

Last updated: 2026-05-29  
Source issue: `LUC-616 [Soar][ARB-001 Gate] Decide activation scope for assistant hot-path orchestration`  
Status: `product_scope_decided_cto_review_required`

## Decision
For Soar V1 release scope, assistant hot-path orchestration remains **not activated** for runtime decision loops (`BACKTEST`, `PAPER`, `LIVE`).

Allowed now:
- assistant foundation already in production scope: bot assistant configuration, deterministic orchestrator logic, and owner-scoped dry-run diagnostics.
- existing fail-closed guard (`live_mode_disabled_fail_closed`) and trace-field sanitization stay mandatory.

Not allowed now:
- wiring `orchestrateAssistantDecision` into runtime decision-loop hot paths.
- using assistant output as executable trading authority in runtime flow.
- any activation path that weakens current fail-closed LIVE behavior.

## Activation Envelope (post-V1, explicit gate)
Hot-path activation can be reopened only as a separate gated slice with all of:
1. persisted immutable trace storage for runtime assistant cycles,
2. explicit integration points and disable path (feature flag + fail-closed fallback),
3. adversarial AI protocol packet (prompt-injection, data-leak, unauthorized-action),
4. protected evidence proving behavior for BACKTEST and PAPER before any LIVE discussion,
5. separate explicit Product+CTO decision before LIVE-mode activation.

## Owner Routing
- Product Lead: decision taken for V1 scope freeze (this document).
- CTO: approve/reject technical activation envelope and sequencing.
- AI Runtime + Security: implement only after CTO review and child-issue issuance.

## Impact
- Closes ambiguity that kept `ARB-001` in open-ended in-progress state.
- Preserves DEC-AUD-002 truth (foundation/dry-run current; hot-path deferred).
- Prevents accidental rollout pressure from planning/backlog lanes.
