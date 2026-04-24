# Task

## Header
- ID: V1DASH-A
- Title: Harden dashboard operator truth after singular bot migration and manual-order recovery
- Status: READY
- Owner: Frontend Builder + Backend Builder
- Depends on: V1BOT-09
- Priority: P1

## Context
The dashboard is the canonical operator control center and must remain strict,
selected-bot scoped, and truth-based under the approved V1 architecture.

Fresh production and code review on `2026-04-24` show that the dashboard is
much closer to truthful behavior than before, but several operator-facing
drifts still remain after the singular bot migration:

1. `PAPER` wallet/equity calculations in the selected-bot dashboard still rely
   partly on `bot.paperStartBalance` and session-derived delta math in web
   view-model code, instead of treating the runtime capital summary
   (`referenceBalance`, `freeCash`, `capitalSource`, `paperResetAt`) as the
   first authority for displayed runtime capital.
2. Pending actions are still under-expressed. The selected paper bot can have
   `openOrdersCount = 1`, `openCount = 0`, and `symbolsTracked = 11`, but the
   dashboard does not yet elevate “pending order / waiting for fill /
   no opened position yet” as a first-class operator state.
3. Running-but-non-actionable runtime states are still too quiet. A running bot
   with heartbeats and tracked symbols but zero accepted signals/positions can
   look similar to a healthy idle state unless the operator manually infers it
   from tables.
4. Manual-order symbol sourcing and lifecycle truth are already queued under
   `V1BOT-09`; once that slice lands, the surrounding dashboard summaries must
   also stay parity-aligned so the operator does not see contradictory cues.

This packet exists to prevent a second class of drift where backend truth
improves but the dashboard still narrates the wrong thing.

## Goal
Make the dashboard selected-bot runtime surfaces fully operator-usable and
truthful by aligning capital KPIs, pending-action visibility, degraded/running
states, and post-action lifecycle feedback to canonical runtime data.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- preserve the existing dashboard visual language and layout hierarchy
- reuse authoritative aggregate/session/positions data instead of building new
  client-side truth models

## Definition of Done
- [ ] Selected-bot wallet/equity/free-funds KPIs use the runtime capital summary
      as first authority for both `PAPER` and `LIVE`, with fallback only when
      the authoritative fields are truly absent.
- [ ] Dashboard exposes an explicit pending-action operator state when manual or
      runtime orders are open but no position is opened yet.
- [ ] Dashboard exposes an explicit running-but-no-action / degraded-runtime
      state when the bot is running, has tracked symbols or events, but has no
      actionable runtime outputs yet.
- [ ] Manual-order follow-up states stay consistent across sidebar, open-orders
      table, and selected-bot summary after `V1BOT-09` lands.
- [ ] Focused web regressions lock the capital-authority path and the new
      pending/degraded operator states.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- reintroducing bot-owned capital truth as canonical dashboard authority
- inventing synthetic operator states that are not mapped to authoritative API
  data

## Validation Evidence
- Tests: to attach in execution closure
- Manual checks:
  - authenticated production check of selected-bot aggregate vs displayed
    wallet/runtime KPIs
  - selected paper bot with open manual order but no open position
  - selected live bot with running session and zero actionable outputs
- Screenshots/logs:
  - production aggregate on `2026-04-24` for paper bot
    `dec24168-7bba-4c44-aac9-97b3c6c60ce1`:
    - `referenceBalance=1000`
    - `freeCash=1000`
    - `symbolsTracked=11`
    - `openOrdersCount=1`
    - `openCount=0`
  - web code audit:
    - `useRuntimeSelectionViewModel.ts` still derives paper equity from
      `selected.bot.paperStartBalance`
    - `RuntimeSidebarSection.tsx` still seeds paper baseline from
      `selectedData.paperInit` / wallet initial balance before consulting the
      runtime capital summary as first authority
- High-risk checks:
  - paper reset baseline must stay truthful after dashboard KPI alignment
  - live allocation/account-balance semantics must remain unchanged
  - pending-order visibility must not imply a position exists before canonical
    lifecycle truth confirms it

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/06_execution-lifecycle.md`
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed:
  - existing approved V1 singular bot contract
- Follow-up architecture doc updates:
  - `docs/architecture/08_operator-surfaces-and-routing.md` if new explicit
    degraded/pending dashboard states become part of the frozen operator
    contract

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing dashboard selected-bot runtime surfaces
- Required states: loading | empty | degraded | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks:
  - pending/degraded states must be readable without color-only semantics
  - summary warnings must remain visible in compact layouts
- Parity evidence:
  - preserve existing dashboard sections
  - improve only truth labels, KPI authority, and state feedback

## Review Checklist (mandatory)
- [ ] Architecture alignment confirmed.
- [ ] Existing systems were reused where applicable.
- [ ] No workaround paths were introduced.
- [ ] No logic duplication was introduced.
- [ ] Definition of Done evidence is attached.
- [ ] Relevant validations were run.
- [ ] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
Suggested execution order after `V1BOT-09`:

1. `V1DASH-01 web(capital-kpis)`: make paper/live sidebar KPIs prefer
   authoritative runtime capital summary fields.
2. `V1DASH-02 web(pending-state)`: elevate open-order / waiting-for-fill state
   into selected-bot summary and manual-order follow-up feedback.
3. `V1DASH-03 web(degraded-state)`: surface running-but-non-actionable runtime
   states with explicit guidance instead of quiet emptiness.
4. `V1DASH-04 qa(closure)`: focused dashboard truth pack and docs/context sync.
