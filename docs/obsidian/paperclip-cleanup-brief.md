# Paperclip Cleanup Brief

Updated: 2026-05-31

## Objective

Make Soar easier for a human owner and autonomous softwarehouse agent to inspect, improve, and prove. The target state is not fewer files at all costs; it is a vault where every current doc has a clear owner, every generated artifact is recognizable, and every feature can be followed from user action to code, data, tests, proof, and operations.

## Cleanup Contract

| Area | Expected result |
| --- | --- |
| Docs navigation | Start at [[obsidian/soar-vault-dashboard.md|Soar Vault Dashboard]] and reach product, architecture, modules, operations, status, and AI briefs in two clicks. |
| Function journeys | Every important route/action maps to chain, API, backend function, data model, tests, docs, and evidence. |
| Canvas maps | High-level maps show how product, architecture, journeys, operations, and agents relate. |
| Current vs history | Current truth remains in `docs`; dated evidence and old task records remain in `history`. |
| AI usefulness | Agents get explicit read order, proof rules, and update contract before making changes. |

## Work Queue

- [ ] Refresh generated graph and journey indexes after the next code/documentation change.
- [ ] Add or repair missing page entrypoint relations for high-value user actions.
- [ ] Tighten protected/money-facing proof rows before claiming production readiness.
- [ ] Review large architecture node sets for orphaned docs, duplicate concepts, and stale generated pages.
- [ ] Add richer canvas maps for top product areas once current graph drift is clean.
- [ ] Consider moving dated one-off docs from `docs/analysis` or `docs/operations` to `history` only after confirming they are not current source of truth.

## Safe Delegation Prompt

Use this when delegating to Paperclip:

> Clean Soar documentation as an Obsidian-first project knowledge vault. Preserve canonical truth. Do not delete or move files unless you can prove the file is historical or duplicate. Start from `docs/obsidian/soar-vault-dashboard.md`, inspect graph indexes, repair navigation and links, then update source-of-truth docs and generated indexes. Keep production, exchange, destructive, and protected proof claims conservative.
