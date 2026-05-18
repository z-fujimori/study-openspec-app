## MODIFIED Requirements

### Requirement: User can mark a task as completed
The system SHALL allow the user to change an existing task between active and completed states. When a user marks an active task as completed, the system MUST keep the task visible in the task list with its completed state reflected. When a user reverses completion for a completed task, the system MUST return the task to the active state and keep it visible in the task list.

#### Scenario: Complete an active task
- **WHEN** the user marks an active task as completed
- **THEN** the system updates the task state to completed and displays it as completed in the task list

#### Scenario: Return a completed task to active
- **WHEN** the user chooses to reverse completion for a completed task
- **THEN** the system updates the task state to active and displays it as active in the task list
