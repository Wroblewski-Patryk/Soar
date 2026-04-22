# REVIEW-D Live Opt-In and Ownership Safety Audit (2026-04-22)

Status: Active findings  
Scope: post-`SAFEV1-A` production-readiness review

## Review Target

Review the remaining production-risk surfaces around:

- `LIVE` opt-in truth in runtime topology and automation,
- fail-closed handling of orphan bot-managed positions,
- deterministic takeover/rebind ownership,
- release-readiness truth for API-key encryption material.

## Findings

### P0. Runtime topology still includes active `LIVE` bots even when `liveOptIn` is false

Severity: Critical

Files:

- `apps/api/src/modules/engine/runtimeSignalLoop.repository.ts:7`

Evidence:

- runtime topology selection currently filters only `isActive=true` and
  `mode in ['PAPER', 'LIVE']`,
- there is no `liveOptIn=true` gate at the topology source before the signal
  loop starts routing candles to `LIVE` bots.

Why this matters:

- a `LIVE` bot can remain inside runtime evaluation flow even when the operator
  has not completed the explicit live-consent contract,
- later write paths may still fail closed, but the runtime can create signals,
  run pre-trade checks, and produce misleading operational activity for a bot
  that should be completely inactive on the live path,
- V1 safety should freeze `liveOptIn` as a hard runtime admission boundary, not
  only a write-time guard.

Required remediation:

- runtime topology must exclude `LIVE` bots without `liveOptIn=true`,
- regression tests must lock signal-loop admission on `liveOptIn`,
- the same boundary must be honored by runtime automation candidate selection.

### P0. Runtime automation can still operate orphan `BOT` positions through env-default fallback context

Severity: Critical

Files:

- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts:165`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts:170`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts:476`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts:795`

Evidence:

- automation candidate selection still includes `botId: null` positions in the
  open-position query,
- the guard only skips orphan exchange-synced positions (`origin='EXCHANGE_SYNC'`)
  and does not skip orphan `origin='BOT'` positions,
- missing bot context then falls back to env defaults
  (`RUNTIME_MANUAL_POSITION_MODE`, `RUNTIME_MANUAL_POSITION_EXCHANGE`,
  `RUNTIME_MANUAL_POSITION_MARKET_TYPE`).

Why this matters:

- a bot-origin position that lost canonical bot ownership can still be
  evaluated, DCA-extended, or close-managed as if it were a generic manual
  runtime position,
- that is the opposite of fail-closed behavior for a money-impacting path,
- the environment becomes an implicit owner of orphan bot state, which is not a
  truthful V1 contract.

Required remediation:

- bot-origin orphan positions must stay unresolved until canonical bot context
  is restored,
- runtime automation must not apply manual env-default context to positions
  whose origin is `BOT`,
- regression tests must lock no-op behavior for orphan bot-origin positions.

### P1. External takeover rebind can assign orphan `BOT` positions to an arbitrary eligible live bot

Severity: High

Files:

- `apps/api/src/modules/positions/positions.service.ts:582`
- `apps/api/src/modules/positions/positions.service.ts:661`

Evidence:

- takeover rebind scans open `BOT_MANAGED` positions from both
  `origin='EXCHANGE_SYNC'` and `origin='BOT'`,
- for `origin='BOT'`, ownership candidates are built from all eligible live
  bots with managed wallets, without symbol, api-key, or canonical route scope,
- when only one eligible bot exists, the orphan `BOT` position is rebound to
  that bot even though no canonical ownership proof exists.

Why this matters:

- a bot-origin orphan position can be rebound to the wrong bot simply because
  only one eligible candidate exists at the account level,
- that corrupts runtime monitoring, manual close ownership, and later lifecycle
  recovery,
- the operator-facing takeover endpoint becomes unsafe exactly when it should be
  most conservative.

Required remediation:

- `origin='BOT'` rebind must require canonical ownership proof or remain
  unresolved,
- exchange-synced rebind may continue to use api-key truth, but bot-origin
  positions need stricter provenance,
- regression tests must lock the fail-closed branch for orphan bot-origin
  takeover.

### P2. Release readiness still accepts legacy `API_KEY_ENCRYPTION` fallback as sufficient key material

Severity: Medium

Files:

- `apps/api/src/utils/crypto.ts:28`
- `apps/api/src/utils/crypto.ts:60`
- `apps/api/src/config/criticalSecretsReadiness.ts:85`
- `apps/api/src/config/criticalSecretsReadiness.ts:96`

Evidence:

- crypto bootstrapping still promotes plain `API_KEY_ENCRYPTION` into the
  active keyring when `API_KEY_ENCRYPTION_KEYS` is absent,
- readiness also reports encryption material as acceptable when only the legacy
  fallback exists.

Why this matters:

- production readiness can look green without the versioned keyring contract
  that the rest of the repo now assumes,
- rotation, rollback, and multi-key migration become operationally ambiguous,
- a V1 release gate should treat legacy material as migration compatibility, not
  as the preferred ready-state contract.

Required remediation:

- readiness must require versioned keyring material for canonical release
  health,
- legacy decrypt support may remain for migration reads, but should be explicit
  compatibility-only behavior,
- focused tests must lock the distinction between compatibility support and
  readiness truth.

## Review Result

`SAFEV1-A` closed major safety debt, but runtime admission and ownership truth
still have three live-path holes plus one release-readiness drift:

- `LIVE` opt-in is not yet a hard runtime admission boundary,
- orphan bot-origin positions can still receive automation under env defaults,
- takeover rebind is still too permissive for bot-origin orphan state,
- encryption readiness still overstates production truth.

## Recommended Follow-Up Wave

- `REVIEW-D` as a dedicated executor-ready remediation family:
  - enforce `liveOptIn` at runtime topology and automation boundaries,
  - keep orphan bot-origin positions fail closed until canonical owner truth
    exists,
  - canonicalize takeover rebind for orphan positions,
  - separate legacy crypto compatibility from canonical readiness truth.
