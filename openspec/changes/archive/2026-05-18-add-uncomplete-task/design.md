## Context

The current MVP supports a one-way transition from active to completed. This change extends that lifecycle so completion can be reversed without changing the rest of the data model or persistence approach.

## Goals / Non-Goals

**Goals:**
- Allow a completed task to return to the active state through a visible UI action.
- Reuse the existing task model and persistence structure with minimal code changes.
- Keep task list updates immediate after toggling completion state in either direction.

**Non-Goals:**
- Adding a full task history, undo stack, or time-limited rollback flow.
- Changing task ordering, filtering, editing, or deletion semantics.
- Introducing backend synchronization or multi-user conflict handling.

## Decisions

### Replace one-way completion with reversible state toggling
The task domain should support both active and completed states, and the UI should expose actions for moving tasks between them. This keeps the model simple and avoids inventing a separate undo concept when the requirement is just state reversal.

Alternative considered:
- Adding a temporary "Undo" toast after completion. Rejected because it adds extra UI state and timing behavior that the current MVP does not need.

### Keep the same task record structure
The existing fields `id`, `title`, `completed`, and `createdAt` are sufficient. Reverting completion only changes the `completed` flag.

Alternative considered:
- Adding an additional status or audit field. Rejected because it does not add value for this behavior change.

### Show an explicit restore action for completed tasks
Completed tasks should offer a visible control such as `Mark active` or an enabled checkbox so users can clearly reverse the state.

Alternative considered:
- Hiding reversal behind a secondary menu. Rejected because the app is small and direct actions are more appropriate for the MVP.

## Risks / Trade-offs

- [UI controls may become slightly more complex] → Keep the interaction model explicit and limit each task row to direct actions only.
- [Tests written around one-way completion may become stale] → Update service and flow tests to cover both complete and uncomplete transitions.

## Migration Plan

No migration is required. Existing stored tasks already use a boolean `completed` field, so the new behavior can operate on current data without a schema change.

## Open Questions

- None for this change.
