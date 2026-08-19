## Purpose

Holds the declared set of feature flags as version-controlled definitions, so creating, owning, and
retiring a flag is a reviewable change rather than an invisible runtime action.

## ADDED Requirements

### Requirement: Flag definitions are version controlled

The system SHALL treat a version-controlled registry as the only source of flag definitions. Runtime
state MAY change which users a flag applies to, but SHALL NOT introduce a flag that the registry does
not declare.

#### Scenario: Creating a flag requires a reviewable change

- **WHEN** an engineer needs a new flag
- **THEN** the flag exists only after a change to the registry is merged, leaving an author, a
  reviewer, and a timestamp in version history

#### Scenario: Runtime state cannot invent a flag

- **WHEN** targeting rules exist for a key that the registry does not declare
- **THEN** resolution ignores those rules and reports the key as unknown

### Requirement: Every flag declares required metadata

Each flag definition SHALL declare a key, a description, an owning person, an expiry date, and a fail
mode. A definition missing any of these SHALL be rejected.

#### Scenario: Incomplete definition is rejected

- **WHEN** a flag is declared without an owner or without an expiry date
- **THEN** validation fails and names the missing field

#### Scenario: Owner is a person

- **WHEN** a flag declares its owner as a team or a shared alias
- **THEN** validation fails, because an unowned flag is the kind that outlives its purpose

### Requirement: Flag keys are type-safe at build time

The system SHALL derive flag identifiers from the registry so that referencing a flag which does not
exist is a build failure rather than a silently negative result.

#### Scenario: Unknown key fails the build

- **WHEN** application code references a flag key absent from the registry
- **THEN** the build fails and identifies the offending reference

#### Scenario: Renaming a key surfaces every call site

- **WHEN** a flag key is renamed in the registry
- **THEN** the build fails at every unmigrated reference rather than resolving them to off

### Requirement: Flag keys follow a naming convention

Flag keys SHALL be kebab-case. Validation SHALL reject keys that are not.

#### Scenario: Malformed key is rejected

- **WHEN** a flag is declared with the key `scoringV2` or `scoring_v2`
- **THEN** validation fails and states the expected form

### Requirement: Flags expire

The system SHALL enforce each flag's expiry date so a flag cannot quietly become permanent. Enforcement
SHALL escalate from warning to failure, and SHALL NOT require access to runtime state.

#### Scenario: Approaching expiry warns

- **WHEN** the current date is within the warning window before a flag's expiry date
- **THEN** validation reports a warning naming the flag and its owner, and does not fail

#### Scenario: Expired flag fails the build

- **WHEN** the current date is past a flag's expiry date plus the grace period
- **THEN** validation fails, and the failure is resolved by removing the flag or by deliberately
  extending its expiry date in the registry

#### Scenario: Enforcement needs no database access

- **WHEN** expiry validation runs in an environment with no credentials for runtime state
- **THEN** it completes successfully, because it reads only version-controlled definitions
