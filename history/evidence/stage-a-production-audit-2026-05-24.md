# Stage A Production Audit - 2026-05-24

Status: PARTIAL (blocked by external reachability from current workstation)  
Scope: read-only production audit for Binance + Gate.io runtime surfaces

## 1. Audit objective

Build a hard PASS/FAIL matrix for critical production functions before further
runtime fixes.

## 2. Measured environment fact (blocker)

At `2026-05-24` (current run), direct production probes from this workstation
timed out for all three public checks:

- `https://api.soar.luckysparrow.ch/health`
- `https://api.soar.luckysparrow.ch/ready`
- `https://soar.luckysparrow.ch/api/build-info`

Probe command shape used:

```powershell
Invoke-RestMethod <url> -TimeoutSec 6
```

Observed result:

- each call timed out at ~`6000ms`
- no HTTP payload was returned

This blocks full Stage A production PASS/FAIL completion in this execution
window.

## 3. Last known observed production behavior before reachability drop

From earlier same-day checks in this mission window (before timeouts):

- Authenticated readbacks succeeded for:
  - `/auth/me`
  - `/dashboard/bots`
  - `/dashboard/positions`
  - `/dashboard/orders`
- Runtime aggregate for active Binance LIVE bot returned payload including:
  - `sessionsCount=1`
  - non-empty `openItems`
  - non-null `marginUsed` values with max observed around `4.077852` USDT
  - dynamic TTP present on eligible row (`BNBUSDT`)
- Gate.io LIVE bot aggregate route responded, but reported `runtimeOpenCount=0`
  at the sampled moment.
- Intermittent 502/401 behavior had been observed on aggregate sequences in
  prior probing.

## 4. Applied hardening already shipped in this mission

- Commit `c4534cdf`:
  runtime aggregate now serves stale snapshot on refresh failure
  (`stale-while-revalidate` behavior), reducing dashboard blanking risk during
  transient backend failure.
- Commit `52be8b61`:
  removed obsolete web route surfaces (`/dashboard/exchanges`, legacy routing
  behavior for `/dashboard/orders` and `/dashboard/positions`) and aligned docs.

## 5. Stage A matrix snapshot (provisional)

| Function | Status | Evidence |
|---|---|---|
| Production public reachability (`health/ready/build-info`) | FAIL (current run) | timed out for all 3 probes |
| Authenticated API read path | PASS (last known) | successful `/auth/me` and dashboard reads before timeout window |
| Binance runtime aggregate payload integrity | PASS (last known) | non-empty aggregate with live positions and margin truth |
| Gate.io runtime aggregate availability | PARTIAL (last known) | endpoint responded; sample had zero open runtime rows |
| Aggregate stability under repetition | FAIL/PARTIAL | prior intermittent 502 observed; hardening shipped but not yet re-verified due timeout blocker |

## 6. Immediate next actions

1. Re-run Stage A probe matrix as soon as production endpoints are reachable
   from this host (or run same probes from an alternate reachable runner).
2. Confirm post-`c4534cdf` aggregate stability with repeated authenticated
   sampling.
3. Lock top P0/P1 failing rows from the matrix and start closure loop:
   failing test -> fix -> local regression -> deploy -> production recheck.

## 7. Constraints

- No live-money mutation executed in this stage.
- No architecture bypass accepted.
