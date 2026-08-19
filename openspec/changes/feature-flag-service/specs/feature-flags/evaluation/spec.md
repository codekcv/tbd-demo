## Purpose

Decides whether a feature is on for a given user, in a way that is deterministic across sessions,
explainable after the fact, and safe when something goes wrong.

## ADDED Requirements

### Requirement: Rules evaluate in order and the first match wins

Each flag SHALL hold an ordered list of targeting rules. Evaluation SHALL consider them in order and
return the result of the first rule that matches. Disabled rules SHALL be skipped without being
considered a match.

#### Scenario: An earlier rule takes precedence

- **WHEN** a user matches both a rule at position 1 and a rule at position 2
- **THEN** the result comes from the rule at position 1

#### Scenario: A disabled rule is passed over

- **WHEN** the first matching rule is disabled
- **THEN** evaluation continues to the next rule as though the disabled one were absent

### Requirement: Absence of a match yields off

When no rule matches, the flag SHALL resolve to off. A flag with no rules SHALL resolve to off for
every user.

#### Scenario: A newly declared flag is off

- **WHEN** a flag has just been added to the registry and has no targeting rules
- **THEN** it resolves to off for every user, including the person who created it

### Requirement: Percent rollouts are stable per user and per flag

A percent rule SHALL place a user in the same bucket on every evaluation, so a partial rollout does not
move people in and out between page loads or sessions. Bucketing SHALL be independent per flag.

#### Scenario: The same user gets the same answer

- **WHEN** a user is resolved against a flag at 10 percent, repeatedly, across separate sessions
- **THEN** every evaluation returns the same result for that user

#### Scenario: Flags bucket independently

- **WHEN** a user falls inside the first 10 percent for one flag
- **THEN** that tells us nothing about whether they fall inside the first 10 percent for another flag

#### Scenario: Widening a rollout never removes anyone

- **WHEN** a percent rule is raised from 10 percent to 25 percent
- **THEN** every user who was already included remains included, so a wider rollout is never a partial
  rollback for someone

### Requirement: Resolution fails closed

Evaluation SHALL return off when it cannot determine an answer, including when the key is unknown or an
error occurs during evaluation. A flag MAY opt in to failing on instead, and that choice SHALL be
declared in its definition rather than decided at the call site.

#### Scenario: Unknown key resolves to off

- **WHEN** a flag key is not present in the registry
- **THEN** resolution returns off

#### Scenario: An error during evaluation resolves to off

- **WHEN** evaluating a flag raises an error
- **THEN** resolution returns off for that flag, and other flags in the same request still resolve
  normally

#### Scenario: A flag may opt in to failing on

- **WHEN** a flag declares a fail mode of open and an error occurs during its evaluation
- **THEN** resolution returns on for that flag

### Requirement: Every result explains itself

Each resolved flag SHALL carry a reason describing how the value was reached, sufficient to distinguish
a matched rule from a default and to identify which rule matched.

#### Scenario: A matched rule is named

- **WHEN** a user is included by a percent rule
- **THEN** the result reports that a percent rule matched and at what percentage

#### Scenario: A default is distinguishable from a match

- **WHEN** no rule matches
- **THEN** the result reports that it fell through to the default, not that a rule returned off
