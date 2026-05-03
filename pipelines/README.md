# Pipeline System

Every repeatable process is a pipeline. Agents must cite the active pipeline in tasks, commits, and documentation updates.

Canonical AI loop:

analysis -> planning -> implementation -> testing -> fixing -> documentation

Global constraints:

- Maximum 3 iterations per problem before stop and report.
- Every inconsistency becomes a task.
- Architecture is the source of truth over code.
- Documentation is updated inside the same work item.
