# Production UX/A11y/Mobile Proof

## Status
- Result: **FAIL**
- Environment: production
- Evidence date: 2026-05-26
- Generated at (UTC): 2026-05-26T01:39:58.536Z
- Expected SHA: `3fedb7a9170097b40accb6ccea1915064f383f11`
- Observed build-info SHA: `3fedb7a9170097b40accb6ccea1915064f383f11`
- Raw JSON: `history\artifacts\prod-ux-a11y-mobile-proof-3fedb7a9-2026-05-26.json`

## Scope

This proof uses authenticated production browser rendering through Chrome/Edge
CDP. It checks desktop and mobile route rendering, basic accessibility
heuristics, keyboard focus, mobile menu interaction, console/exception health,
framework overlay absence, and horizontal overflow. It does not mutate
production data or submit live-money actions.

## Pages
| Page | Viewport | Result | URL | Screenshot | Notes |
| --- | --- | --- | --- | --- | --- |
| dashboard desktop | 1366x900 desktop | FAIL | https://soar.luckysparrow.ch/dashboard | `history\artifacts\prod-ux-a11y-mobile-proof-3fedb7a9-2026-05-26-screenshots\dashboard-desktop.png` | protected route rendered login page; console/runtime event observed: error:Failed to load resource: the server responded with a status of 401 () | error:Failed to load resource: the server responded with a status of 401 () |
| wallets desktop | 1366x900 desktop | FAIL | https://soar.luckysparrow.ch/dashboard/wallets/list | `history\artifacts\prod-ux-a11y-mobile-proof-3fedb7a9-2026-05-26-screenshots\wallets-desktop.png` | protected route rendered login page; console/runtime event observed: error:Failed to load resource: the server responded with a status of 401 () |
| bots desktop | 1366x900 desktop | FAIL | https://soar.luckysparrow.ch/dashboard/bots | `history\artifacts\prod-ux-a11y-mobile-proof-3fedb7a9-2026-05-26-screenshots\bots-desktop.png` | protected route rendered login page; console/runtime event observed: error:Failed to load resource: the server responded with a status of 401 () |
| profile desktop | 1366x900 desktop | FAIL | https://soar.luckysparrow.ch/dashboard/profile | `history\artifacts\prod-ux-a11y-mobile-proof-3fedb7a9-2026-05-26-screenshots\profile-desktop.png` | protected route rendered login page; console/runtime event observed: error:Failed to load resource: the server responded with a status of 401 () |
| dashboard mobile | 390x844 mobile | FAIL | https://soar.luckysparrow.ch/dashboard | `history\artifacts\prod-ux-a11y-mobile-proof-3fedb7a9-2026-05-26-screenshots\dashboard-mobile.png` | protected route rendered login page; console/runtime event observed: error:Failed to load resource: the server responded with a status of 401 (); mobile menu click target missing |

## Blockers
- dashboard auth missing

## Safety Notes
- Auth tokens, passwords, cookies, private headers, and raw protected payloads
  are not written to this artifact.
- Screenshots are static visual evidence only and must not contain secrets.
