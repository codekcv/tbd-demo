## Purpose

Governs how the running application obtains flag values, so the first thing a user sees is already
correct and later changes reach them without a reload.

## ADDED Requirements

### Requirement: The first paint is already correct

A page SHALL render its initial output with flags already resolved. The user SHALL NOT observe the off
branch of a flag before the on branch replaces it.

#### Scenario: No flash of the wrong branch

- **WHEN** a user included in a flag's rollout loads a page that branches on it
- **THEN** the initial rendered output contains the on branch, and at no point during load is the off
  branch visible

#### Scenario: Resolution is consistent within a page

- **WHEN** several components on the same page read the same flag during one render
- **THEN** they all observe the same value, so the page cannot render two halves of two different
  states

### Requirement: Open sessions receive changes without reloading

A session already open in a browser SHALL observe a change to a flag's state without the user
navigating or refreshing. Propagation SHALL complete within seconds, because the purpose is incident
response.

#### Scenario: A live session picks up a kill

- **WHEN** a flag is turned off while a user has the affected page open
- **THEN** that page stops showing the flagged behavior within seconds and without a reload

#### Scenario: A live session picks up a widened rollout

- **WHEN** a rollout percentage is raised such that an already-open session now qualifies
- **THEN** that session begins showing the flagged behavior without a reload

### Requirement: Delivery failure is safe

When flag state cannot be reached, the application SHALL continue to function and SHALL apply each
flag's declared fail mode rather than breaking the page.

#### Scenario: Unreachable flag state does not break the page

- **WHEN** flag state cannot be retrieved
- **THEN** the page still renders, with every flag resolved according to its declared fail mode
