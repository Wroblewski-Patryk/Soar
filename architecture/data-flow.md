# Data Flow

## Data Lifecycle

Describe how data enters, moves through, persists in, and exits the system.

| Flow | Source | Processing modules | Storage | Output | Trust boundary | Observability |
| --- | --- | --- | --- | --- | --- | --- |
| Example | User/API/Event | Module chain | Database/cache/file | Response/event/report | Public/Internal | Logs, metrics, traces |

## Required Coverage

- Input validation and normalization.
- State transitions and ownership.
- Persistence and retention.
- Error handling and retries.
- Security, privacy, and trust boundaries.
- Monitoring signals for critical flows.

## Synchronization Rule

If a code change changes data shape, ownership, storage, or movement, this file and `architecture/api.md` must be updated in the same task.
