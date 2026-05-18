## Why

Users can currently mark tasks as completed, but they cannot recover from accidental completion. The MVP needs a simple way to reverse that action so task state remains editable during normal use.

## What Changes

- Add a user-visible control that lets completed tasks be returned to the active state.
- Update the task completion behavior so completion is reversible instead of one-way.
- Preserve the existing create, list, and delete task flows without changing their scope.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `task-management`: Change task completion behavior so users can undo completion and move a completed task back to the active state.

## Impact

- Modifies the existing `task-management` spec and implementation.
- Affects task state transitions in the service layer and task action controls in the UI.
- Requires updated tests for reversible completion behavior.
