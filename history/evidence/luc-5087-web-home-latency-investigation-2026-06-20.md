# LUC-5087 Web Home Latency Investigation - 2026-06-20

## Status

- Result: `DONE_WITH_DRE_FOLLOW_UP / PARTIALLY_VERIFIED / NO_CODE_FIX_IDENTIFIED`
- Owner lane: CTO architecture/runtime triage
- Source incident: [LUC-5085](/LUC/issues/LUC-5085)
- Environment: production
- Evidence date: 2026-06-20

## Wake Context

- Wake reason: `issue_assigned`
- Issue: [LUC-5087](/LUC/issues/LUC-5087) `[Soar][Perf] Investigate production Web home latency spikes found by LUC-5085`
- Pending comments: `0/0`
- Fallback fetch needed: `false`
- Checkout: already claimed by the harness; no checkout API call was repeated.

## Prior Incident Signal

[LUC-5085](/LUC/issues/LUC-5085) found a production Web `/` latency spike while
adjacent public routes were healthy:

| Target | Prior max ms |
| --- | ---: |
| Web `/` | `10512` |
| Focused Web `/` recheck | `21953` |
| Web `/auth/login` | `117` |
| Web `/api/build-info` | `65` |
| API `/health` | `136` |
| API `/ready` | `73` |

Focused Web `/` samples from [LUC-5085](/LUC/issues/LUC-5085): `14701`,
`634`, `266`, `6293`, and `21953 ms`; average `8769.4 ms`.

## Current Public Timing Recheck

Command shape:

```powershell
curl.exe -L -s -o NUL -w '%{http_code} %{time_namelookup} %{time_connect} %{time_appconnect} %{time_starttransfer} %{time_total} %{size_download} %{url_effective}\n' --max-time 30 <url>
```

Eight samples per target:

| Target | Statuses | Total ms range | TTFB ms range | Bytes |
| --- | --- | ---: | ---: | ---: |
| Web `/` | `200 x8` | `125-169` | `95-137` | `41211` |
| Web `/auth/login` | `200 x8` | `116-134` | `98-115` | `34261` |
| Web `/api/build-info` | `200 x8` | `87-110` | `87-110` | `222` |
| Web `/hero-sky.webp` | `200 x8` | `120-148` | `87-108` | `68520` |

Current recheck did not reproduce the multi-second spike.

## Header And Cache Evidence

`curl.exe -I -L -s --max-time 30` returned matching static cache behavior for
Web `/` and `/auth/login`:

| Route | Status | Cache headers |
| --- | ---: | --- |
| `/` | `200` | `Cache-Control: s-maxage=31536000`; `X-Nextjs-Cache: HIT`; `X-Nextjs-Prerender: 1`; `Content-Length: 41211` |
| `/auth/login` | `200` | `Cache-Control: s-maxage=31536000`; `X-Nextjs-Cache: HIT`; `X-Nextjs-Prerender: 1`; `Content-Length: 34261` |

Local build manifest readback from `apps/web/.next/prerender-manifest.json`
also lists both `/` and `/auth/login` as prerendered static routes with
`initialRevalidateSeconds=false`.

## Code/Route Findings

- Web home route: `apps/web/src/app/(public)/page.tsx`.
- Login route: `apps/web/src/app/(public)/auth/login/page.tsx`.
- Home route is a client-rendered public landing page using i18n copy, static
  icons, and local public assets.
- No home-page upstream API/data fetch was found.
- Hero asset check: `apps/web/public/hero-sky.webp` is `68520` bytes and
  served in `120-148 ms` during the recheck; `hero-sky.png` exists as fallback
  but current WebP path is small enough that it does not explain a 10-22 second
  TTFB spike.

## Root-Cause Hypothesis

The current evidence does not support a Web code bottleneck or upstream API
fetch bottleneck for `/`. The strongest hypothesis is intermittent production
delivery/runtime behavior outside the route implementation: container pressure,
Coolify routing/proxy variance, host/network pressure, or cold/blocked
Next.js response serving. Full confirmation requires read-only Coolify/VPS
resource/log/status bindings, which remain outside this CTO runner and are
separately blocked in the current release lane by [LUC-4811](/LUC/issues/LUC-4811).

## Follow-Up Routed

Created DRE child issue for exact owner follow-up:

- [LUC-5088](/LUC/issues/LUC-5088) `[Soar][Ops][Perf] Correlate intermittent Web / latency spike with Coolify/VPS runtime signals`

Expected DRE proof:

- read-only `soar-web` Coolify status/resource/log projection around the
  [LUC-5085](/LUC/issues/LUC-5085) spike window;
- host/container CPU, memory, restart, proxy, and request timing correlation;
- repeat public timing sample from a DRE runner with approved read-only
  bindings;
- no deploy, restart, rollback, env edit, secret/account readback, database or
  Redis mutation, raw sensitive log capture, exchange action, payment action,
  or live-trading action.

## Safety

No code change, deploy, push, restart, rollback, env edit, secret/account
readback, database/Redis mutation, raw log capture, screenshot, browser
automation, exchange action, order, position, payment/subscription mutation, or
live-trading action occurred.
