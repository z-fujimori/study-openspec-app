## 1. Task State Logic

- [x] 1.1 Update the task-management service to support reversing a completed task back to active
- [x] 1.2 Ensure the persistence layer stores and reloads the reverted completion state correctly
- [x] 1.3 Adjust any task state helper logic so active and completed transitions are both supported

## 2. User Interface

- [x] 2.1 Add a visible control for reverting a completed task to active
- [x] 2.2 Update task row rendering so completed tasks expose the new reversal action
- [x] 2.3 Ensure the task list refreshes immediately after reversing completion

## 3. Verification

- [x] 3.1 Add or update tests for reversing a completed task to active
- [x] 3.2 Update end-to-end flow coverage so a task can move active → completed → active
