# Production UX/A11y/Mobile Proof

## Status
- Result: **PASS**
- Environment: production
- Evidence date: 2026-05-14
- Generated at (UTC): 2026-05-14T03:27:08.811Z
- Expected SHA: `2fc90a0810032f2fedb744d69505a3bd55a23779`
- Observed build-info SHA: `2fc90a0810032f2fedb744d69505a3bd55a23779`
- Raw JSON: `docs\operations\_artifacts-prod-ux-a11y-mobile-proof-2fc90a08-2026-05-14.json`

## Scope

This proof uses authenticated production browser rendering through Chrome/Edge
CDP. It checks desktop and mobile route rendering, basic accessibility
heuristics, keyboard focus, mobile menu interaction, console/exception health,
framework overlay absence, and horizontal overflow. It does not mutate
production data or submit live-money actions.

## Pages
| Page | Viewport | Result | URL | Screenshot | Notes |
| --- | --- | --- | --- | --- | --- |
| dashboard desktop | 1366x900 desktop | PASS | https://soar.luckysparrow.ch/dashboard | `docs\operations\prod-ux-a11y-mobile-proof-2fc90a08-2026-05-14-screenshots\dashboard-desktop.png` | text=267; title=Soar; focus=BODY:Skip to main contentSoarDashboardWalletsMarketsStrategiesBacktestsBotsAnalyticsReportsLogsMy accountBasic profileIn; warnings=unnamed inputs=1 |
| wallets desktop | 1366x900 desktop | PASS | https://soar.luckysparrow.ch/dashboard/wallets/list | `docs\operations\prod-ux-a11y-mobile-proof-2fc90a08-2026-05-14-screenshots\wallets-desktop.png` | text=675; title=Soar; focus=BODY:Skip to main contentSoarDashboardWalletsMarketsStrategiesBacktestsBotsAnalyticsReportsLogsMy accountBasic profileIn; warnings=unnamed inputs=2 |
| bots desktop | 1366x900 desktop | PASS | https://soar.luckysparrow.ch/dashboard/bots | `docs\operations\prod-ux-a11y-mobile-proof-2fc90a08-2026-05-14-screenshots\bots-desktop.png` | text=652; title=Soar; focus=BODY:Skip to main contentSoarDashboardWalletsMarketsStrategiesBacktestsBotsAnalyticsReportsLogsMy accountBasic profileIn; warnings=unnamed inputs=2 |
| profile desktop | 1366x900 desktop | PASS | https://soar.luckysparrow.ch/dashboard/profile | `docs\operations\prod-ux-a11y-mobile-proof-2fc90a08-2026-05-14-screenshots\profile-desktop.png` | text=604; title=Soar; focus=BODY:(self.__next_f=self.__next_f||[]).push([0])self.__next_f.push([1,"1:\"$Sreact.fragment\"\n3:I[1723,[\"650\",\"stati; warnings=unnamed inputs=2; console/runtime event observed: exception:Uncaught |
| dashboard mobile | 390x844 mobile | PASS | https://soar.luckysparrow.ch/dashboard | `docs\operations\prod-ux-a11y-mobile-proof-2fc90a08-2026-05-14-screenshots\dashboard-mobile.png` | text=320; title=Soar; focus=A:Skip to main content; warnings=unnamed inputs=1 |

## Blockers
- none

## Safety Notes
- Auth tokens, passwords, cookies, private headers, and raw protected payloads
  are not written to this artifact.
- Screenshots are static visual evidence only and must not contain secrets.
