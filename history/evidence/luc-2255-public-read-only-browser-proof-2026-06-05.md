# Public Read-Only Browser Proof

## Status

- Result: **FAIL**
- Issue: [LUC-2255](/LUC/issues/LUC-2255)
- Environment: production
- Evidence date: 2026-06-05
- Generated at (UTC): 2026-06-05T18:04:53.778Z
- Web base URL: `https://soar.luckysparrow.ch`
- Raw JSON: `history\artifacts\luc-2255-public-read-only-browser-proof-2026-06-05.json`

## Scope

Fresh headless browser proof for public/read-only web actions only:

- visit public home
- visit login
- visit register
- visit offline page
- use password visibility toggle on public auth forms

## Route Results

| Action | Route | Viewport | Result | Text length | Links | Buttons | Issues | Notes |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| SOAR-ACTION-VISIT-PAGE-PUBLIC-HOME | `/` | desktop | PASS | 1995 | 5 | 10 | 0 | public route rendered in fresh browser without console/network issues or horizontal overflow |
| SOAR-ACTION-VISIT-PAGE-PUBLIC-HOME | `/` | mobile | PASS | 1995 | 5 | 10 | 0 | public route rendered in fresh browser without console/network issues or horizontal overflow |
| SOAR-ACTION-VISIT-PAGE-LOGIN | `/auth/login` | desktop | PASS | 331 | 5 | 12 | 0 | public route rendered in fresh browser without console/network issues or horizontal overflow |
| SOAR-ACTION-VISIT-PAGE-LOGIN | `/auth/login` | mobile | PASS | 331 | 5 | 12 | 0 | public route rendered in fresh browser without console/network issues or horizontal overflow |
| SOAR-ACTION-VISIT-PAGE-REGISTER | `/auth/register` | desktop | FAIL | 383 | 7 | 12 | 2 | public route failed one or more browser proof checks |
| SOAR-ACTION-VISIT-PAGE-REGISTER | `/auth/register` | mobile | FAIL | 383 | 7 | 12 | 2 | public route failed one or more browser proof checks |
| SOAR-ACTION-VISIT-PAGE-OFFLINE | `/offline` | desktop | PASS | 100 | 1 | 0 | 0 | public route rendered in fresh browser without console/network issues or horizontal overflow |
| SOAR-ACTION-VISIT-PAGE-OFFLINE | `/offline` | mobile | PASS | 100 | 1 | 0 | 0 | public route rendered in fresh browser without console/network issues or horizontal overflow |

## Read-Only UI Action Results

| Action | Route | Result | Type transition | Accessible label changed | Issues | Notes |
| --- | --- | --- | --- | --- | ---: | --- |
| SOAR-ACTION-UI-PASSWORD-VISIBILITY-TOGGLE-LOGIN | `/auth/login` | FAIL | password -> password | no | 0 | toggle proof failed |
| SOAR-ACTION-UI-PASSWORD-VISIBILITY-TOGGLE-REGISTER | `/auth/register` | FAIL | password -> password | no | 2 | toggle proof failed |

## Blockers

- SOAR-ACTION-VISIT-PAGE-REGISTER /auth/register failed
- SOAR-ACTION-VISIT-PAGE-REGISTER /auth/register failed
- SOAR-ACTION-UI-PASSWORD-VISIBILITY-TOGGLE-LOGIN /auth/login failed
- SOAR-ACTION-UI-PASSWORD-VISIBILITY-TOGGLE-REGISTER /auth/register failed

## Safety Notes

- This proof used a fresh browser profile and unauthenticated production pages.
- No credentials, cookies, tokens, protected routes, account state, forms submit,
  exchange settings, live-trading behavior, deploy, restart, rollback, env, or
  database mutation were used.
- This is public/read-only browser evidence only. It does not replace protected
  authenticated browser proof or production release proof.
