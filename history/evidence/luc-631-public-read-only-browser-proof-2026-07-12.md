# Public Read-Only Browser Proof

## Status

- Result: **PASS**
- Issue: [LUC-631](/LUC/issues/LUC-631)
- Environment: production
- Evidence date: 2026-07-12
- Generated at (UTC): 2026-07-12T04:27:56.013Z
- Web base URL: `https://soar.luckysparrow.ch`
- Raw JSON: `history\artifacts\luc-631-public-read-only-browser-proof-2026-07-12.json`

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
| SOAR-ACTION-VISIT-PAGE-REGISTER | `/auth/register` | desktop | PASS | 383 | 7 | 12 | 0 | public route rendered in fresh browser without console/network issues or horizontal overflow |
| SOAR-ACTION-VISIT-PAGE-REGISTER | `/auth/register` | mobile | PASS | 383 | 7 | 12 | 0 | public route rendered in fresh browser without console/network issues or horizontal overflow |
| SOAR-ACTION-VISIT-PAGE-TERMS | `/terms` | desktop | PASS | 1050 | 4 | 10 | 0 | public route rendered in fresh browser without console/network issues or horizontal overflow |
| SOAR-ACTION-VISIT-PAGE-TERMS | `/terms` | mobile | PASS | 1050 | 4 | 10 | 0 | public route rendered in fresh browser without console/network issues or horizontal overflow |
| SOAR-ACTION-VISIT-PAGE-PRIVACY | `/privacy` | desktop | PASS | 867 | 4 | 10 | 0 | public route rendered in fresh browser without console/network issues or horizontal overflow |
| SOAR-ACTION-VISIT-PAGE-PRIVACY | `/privacy` | mobile | PASS | 867 | 4 | 10 | 0 | public route rendered in fresh browser without console/network issues or horizontal overflow |
| SOAR-ACTION-VISIT-PAGE-OFFLINE | `/offline` | desktop | PASS | 100 | 1 | 0 | 0 | public route rendered in fresh browser without console/network issues or horizontal overflow |
| SOAR-ACTION-VISIT-PAGE-OFFLINE | `/offline` | mobile | PASS | 100 | 1 | 0 | 0 | public route rendered in fresh browser without console/network issues or horizontal overflow |

## Read-Only UI Action Results

| Action | Route | Result | Type transition | Accessible label changed | Issues | Notes |
| --- | --- | --- | --- | --- | ---: | --- |
| SOAR-ACTION-UI-PASSWORD-VISIBILITY-TOGGLE-LOGIN | `/auth/login` | PASS | password -> text | yes | 0 | password visibility toggle changed input type and accessible label in a fresh browser |
| SOAR-ACTION-UI-PASSWORD-VISIBILITY-TOGGLE-REGISTER | `/auth/register` | PASS | password -> text | yes | 0 | password visibility toggle changed input type and accessible label in a fresh browser |

## Blockers

- none

## Safety Notes

- This proof used a fresh browser profile and unauthenticated production pages.
- No credentials, cookies, tokens, protected routes, account state, forms submit,
  exchange settings, live-trading behavior, deploy, restart, rollback, env, or
  database mutation were used.
- This is public/read-only browser evidence only. It does not replace protected
  authenticated browser proof or production release proof.
