## Purpose

The operator surface for changing who can see a feature, so releasing, widening, and withdrawing a
feature are all actions that happen without a deployment.

## ADDED Requirements

### Requirement: An operator can see the state of every flag

The system SHALL present every declared flag together with its current state, rollout percentage,
owner, and expiry date.

#### Scenario: The list is complete and current

- **WHEN** an operator opens the flag administration screen
- **THEN** every flag in the registry is listed with its state, rollout percentage, owner, and expiry

#### Scenario: Expired flags are visibly expired

- **WHEN** a flag is past its expiry date
- **THEN** it is marked as expired in the listing, so the screen shows what needs cleaning up

### Requirement: Changing who sees a feature requires no deployment

An operator SHALL be able to change a flag's rollout percentage, target an individual user, and enable
or disable a rule, with each change taking effect without rebuilding or redeploying the application.

#### Scenario: Widening a rollout takes effect immediately

- **WHEN** an operator raises a flag's rollout percentage
- **THEN** the change applies to new and already-open sessions without any deployment occurring

#### Scenario: Targeting one user takes effect immediately

- **WHEN** an operator adds a rule targeting a specific user
- **THEN** that user resolves to on, and users not otherwise matched are unaffected

### Requirement: A kill switch overrides all targeting

Killing a flag SHALL turn it off for every user regardless of any rule that would otherwise match. The
action SHALL be reversible, and reversing it SHALL restore the previous targeting rather than clearing
it.

#### Scenario: A kill beats an enabled everyone-rule

- **WHEN** a flag with an enabled rule matching everyone is killed
- **THEN** every user resolves to off

#### Scenario: Restoring brings back prior targeting

- **WHEN** a killed flag is un-killed
- **THEN** the targeting rules that were in place before the kill apply again, unchanged

#### Scenario: A kill is one action

- **WHEN** an operator needs to stop a misbehaving feature
- **THEN** a single action turns it off, without editing individual rules first
