## Purpose

Lets a presenter change which user the application is acting as during a demonstration, so that
targeting behavior can be observed happening rather than described in words.

## ADDED Requirements

### Requirement: The acting user can be switched in one action

The application SHALL provide a way to switch between seeded demo users in a single action, and
subsequent flag resolution SHALL use the newly selected identity.

#### Scenario: Switching changes what the user sees

- **WHEN** a presenter switches from a persona excluded from a flag's rollout to one included in it
- **THEN** the flagged behavior appears, without any change to the flag's configuration

#### Scenario: The current persona is always visible

- **WHEN** any page is displayed
- **THEN** the identity currently being acted as is shown, so nobody watching has to guess whose view
  is on screen

### Requirement: Persona switching is not authentication

Persona switching SHALL NOT be treated as an authentication or authorization mechanism. It SHALL
require no credentials, and it SHALL NOT be used to gate access to anything that would matter outside a
demonstration.

#### Scenario: No credentials are involved

- **WHEN** a presenter switches persona
- **THEN** no password, token, or verification of any kind is requested

#### Scenario: Personas reach only seeded demo data

- **WHEN** any persona is selected
- **THEN** the data reachable is the seeded demonstration data, so switching identity cannot expose
  anything sensitive
