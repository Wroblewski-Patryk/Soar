# V1SAFE-A - LIVE DCA/TTP/TSL Parity Closure

Date: 2026-04-29
Status: implemented

## Scope Closed

Closed the `V1SAFE-A` parity wave for the reported `LIVE` protection symptom
class where:

- imported or recovered `LIVE` positions could appear to have active dynamic
  trailing protection,
- while runtime execution truth did not yet have the same canonical state,
- especially for `TTP` and operator-facing `TSL` display.

## What Changed

### 1. Architecture now freezes protection-state parity explicitly

Canonical references now require that:

- runtime protection state is the only execution truth for dynamic `TTP` /
  `TSL`
- imported or recovered `LIVE` positions must not retroactively invent unseen
  trailing history
- prospective protection from the adoption point onward is allowed
- read models must not imply a stronger dynamic stop than runtime can execute

Primary artifact:

- `docs/architecture/reference/live-protection-state-parity-contract.md`

### 2. Runtime imported-position `TTP` is now covered as a canonical forward path

Focused runtime coverage now proves that:

- an imported `LIVE` position can arm `TTP` prospectively from the adoption
  point
- the first qualifying tick hydrates trailing runtime state
- a later retrace can close through canonical `trailing_take_profit`

### 3. API/read-model dynamic stop truth no longer relies on display-only fallback

`resolveRuntimePositionDynamicStops()` now:

- derives `TTP` display only from canonical runtime trailing state
- derives `TSL` display from canonical runtime trailing anchor / active level
- no longer invents stronger dynamic stop truth when runtime state is absent

This removes the class of mismatch where operator surfaces could show a
protected threshold that runtime itself was not using.

### 4. Dashboard and monitoring surfaces no longer overlay sticky fallback TTP truth

Web runtime surfaces now stop re-inflating dynamic `TTP` through local
sticky-favorable-move fallback logic on top of API data.

The result is simpler and more honest:

- if runtime has a canonical dynamic stop, UI shows it
- if runtime does not have that state yet, UI shows no dynamic stop

## Acceptance Evidence

- imported `LIVE` positions no longer silently pretend to have an armed
  dynamic `TTP` / `TSL` when runtime state is missing
- prospective `TTP` hydration for imported `LIVE` positions is covered and
  closes on later retrace
- dynamic `TSL` display now follows canonical runtime anchor truth instead of
  display-only fallback
- dashboard and monitoring views stop overstating dynamic trailing protection

## Validation

- `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/bots/runtimePositionSerialization.service.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm --filter web run typecheck`
- `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.test.tsx`
- `pnpm run quality:guardrails`

## Remaining Notes

- This wave intentionally fixed the `LIVE` parity and operator-honesty gap
  without expanding scope into a separate exchange-native protective-order
  system.
- The unrelated local CRLF/noise file
  `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx`
  remained untouched.
