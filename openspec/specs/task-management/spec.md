## ADDED Requirements

### Requirement: User can create a task
The system SHALL allow the user to create a new task by providing a title. The system MUST create a task with a stable identifier, store it in the task collection, and show it in the task list as not completed.

#### Scenario: Create a task with a valid title
- **WHEN** the user submits a new task with a non-empty title
- **THEN** the system creates the task and displays it in the task list as an active task

#### Scenario: Reject an empty task title
- **WHEN** the user attempts to submit a task with an empty title
- **THEN** the system MUST reject the submission and MUST NOT create a task

### Requirement: User can view the task list
The system SHALL display the current collection of tasks in a list that makes each task's title and completion state visible to the user.

#### Scenario: View multiple tasks
- **WHEN** the system has one or more stored tasks
- **THEN** the system displays each task in the task list with its title and whether it is completed

#### Scenario: View an empty task list
- **WHEN** the system has no stored tasks
- **THEN** the system displays an empty-state task list with no task items

### Requirement: User can mark a task as completed
The system SHALL allow the user to change an existing task between active and completed states. When a user marks an active task as completed, the system MUST keep the task visible in the task list with its completed state reflected. When a user reverses completion for a completed task, the system MUST return the task to the active state and keep it visible in the task list.

#### Scenario: Complete an active task
- **WHEN** the user marks an active task as completed
- **THEN** the system updates the task state to completed and displays it as completed in the task list

#### Scenario: Return a completed task to active
- **WHEN** the user chooses to reverse completion for a completed task
- **THEN** the system updates the task state to active and displays it as active in the task list

### Requirement: User can delete a task
The system SHALL allow the user to delete any existing task, regardless of whether it is active or completed. Deleted tasks MUST be removed from the task collection and MUST no longer appear in the task list.

#### Scenario: Delete an active task
- **WHEN** the user deletes an active task
- **THEN** the system removes the task and it no longer appears in the task list

#### Scenario: Delete a completed task
- **WHEN** the user deletes a completed task
- **THEN** the system removes the task and it no longer appears in the task list
