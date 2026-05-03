# API Contracts

## Contract Registry

Document public APIs, internal service contracts, events, commands, and integration boundaries.

| Contract | Type | Provider | Consumers | Input | Output | Auth/Trust | Version | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Example | HTTP/Event/Internal | Module | Module or external actor | Schema/link | Schema/link | Required boundary | v1 | Contract/integration test |

## Rules

- No implementation may expose behavior that is absent from this file or supporting architecture docs.
- Breaking changes require a task, migration note, test update, and documentation update.
- Internal contracts must be documented when more than one module depends on them.
- Validation, error shapes, auth assumptions, and rate limits belong with the contract.

## API Change Checklist

- Contract added or updated.
- Data flow updated.
- Module dependencies updated.
- Tests added or updated.
- Deployment or monitoring impact considered.
