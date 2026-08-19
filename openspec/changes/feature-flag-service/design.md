## Context

Greenfield. Nothing exists yet beyond the repository itself, so there is no legacy behavior to
preserve and no migration to sequence. See proposal.md for motivation.

Three constraints shape everything below:

- **The mechanism is the product.** This service exists to be watched on a projector. When a simpler
  design and a more capable design are close, the simpler one wins, because someone has to read it
  aloud in under a minute.
- **Definitions and state are governed differently.** Who owns a flag and when it expires belongs in
  version control. Who currently sees it must be changeable without a deployment. That split is the
  central design decision and most of the others follow from it.
- **Single repository, two deploy targets.** Backend functions deploy during the frontend build, so
  the backend can be briefly ahead of the UI. Every schema change must be backward compatible with the
  UI already in production.

## Goals / Non-Goals

**Goals:**

- Resolution that is deterministic, explainable, and correct under error.
- A kill switch that reaches an already-open browser in seconds.
- Governance that cannot be skipped: no untracked flags, no unowned flags, no immortal flags.
- Small enough to read end to end during a demonstration.

**Non-Goals:**

- Multivariate flags. Boolean only, as recorded in the proposal.
- Real authentication. Personas are a presentation affordance.
- Audit history, approval workflows, or scheduled rollouts.
- Horizontal scale. Correctness under one presenter and a handful of seeded users is the bar.

## Decisions

### Definitions live in the registry, state lives in Convex

The registry file declares key, description, owner, expiry, and fail mode. Convex holds one state row
per key plus an ordered list of targeting rules.

_Why:_ it puts each fact where its governance belongs. Creating a flag becomes a reviewed pull request
with an author and a date. Changing a rollout stays a runtime action needing no deployment. It also
means the expiry check reads a file and needs no database credentials, which keeps that gate fast and
usable on a fork.

_Alternative considered:_ Convex as sole source of truth. Rejected because flags would appear with no
paper trail and the CI gate would need a deploy key.

_Cost:_ the two can drift. Mitigated below.

### Bucketing hashes the user and key, never the percentage

A percent rule includes a user when the hash of the flag key joined with the user id, taken modulo 100,
falls below the percentage.

_Why this exact shape:_ hashing the key alongside the user makes buckets independent per flag, so
being in the first decile of one flag says nothing about another. Excluding the percentage from the
hash is what makes rollouts monotonic: the bucket is a fixed property of the pair, so raising 10 to 25
can only add people. Hashing the percentage in would reshuffle everyone on every widening, which is a
partial rollback disguised as a rollout.

_Why FNV-1a:_ small, synchronous, dependency-free, and identical in any language, so the test suite can
assert exact bucket numbers rather than statistical properties. Cryptographic strength is irrelevant
here; nothing is being protected.

### Fail mode is declared, never decided at the call site

Closed is the default. A flag may declare open, and that declaration lives in the registry.

_Why:_ fail-open is a real decision with a blast radius, and it should be reviewable rather than
something a developer types at one of several call sites. It also means every call site reads
identically, which matters when the code is on screen.

### The kill switch is its own field, not a rule edit

Killing sets a field on the state row that short-circuits evaluation before rules are consulted.

_Why:_ the spec requires that un-killing restores the previous targeting unchanged. If killing worked
by disabling rules, restoring would mean remembering which rules had been deliberately disabled
beforehand. A separate field makes the operation trivially reversible and makes the precedence obvious
when reading evaluation code top to bottom.

### One resolution per user, not one subscription per flag

A single query resolves every declared flag for the acting user and returns a map of value and reason.
The server preloads it during render and the client stays subscribed to the same query.

_Why:_ it satisfies both halves of the delivery spec at once. The preload puts correct values in the
first paint, and the live subscription is what carries a kill to an open session. One query rather than
one per flag keeps components from observing different states mid-render, which is the consistency
requirement, and keeps subscription count flat as flags are added.

_Alternative considered:_ client-side fetch on mount. Rejected: it guarantees the flash of the off
branch that the spec forbids.

### Generated keys, checked in

A build step reads the registry and emits a typed key union. The generated file is committed.

_Why commit it:_ a reviewer sees the effect of adding a flag in the same diff, and a fresh clone type
checks before anything is generated. CI regenerates and fails if the result differs, so the committed
copy cannot go stale.

### Expiry escalates on a fixed schedule

Warn 14 days before the expiry date. Fail 7 days after it.

_Why these numbers:_ the warning has to arrive with enough time to schedule removal, and the grace
period has to be short enough that ignoring it is uncomfortable. Extending the date is a legitimate
response, and it is a registry edit, so it leaves a record of who extended it and when.

## Risks / Trade-offs

- **Registry and state drift.** A rule can outlive the flag it targets. Resolution ignores rules for
  undeclared keys, the admin screen lists only declared flags, and orphaned rules are surfaced as a
  cleanup prompt rather than failing anything.
- **The backend deploys ahead of the UI.** A failed frontend build leaves new functions live against
  the previous interface. Schema changes are additive only: add fields as optional, never rename or
  drop in the same change that starts using them. This is the same expand-and-contract discipline the
  demo teaches, which makes it worth showing rather than hiding.
- **The kill switch depends on the client being connected.** An offline session keeps its last value.
  Accepted. The failure mode is bounded by the flag's fail mode and by the session eventually
  reconnecting, and no design short of blocking render on every check avoids it.
- **Committed generated output causes merge conflicts.** Two flags added the same day collide. The
  conflict is trivial and mechanical, and CI regenerates. Preferable to a clone that does not type
  check.
- **FNV-1a distributes imperfectly at small sample sizes.** A 10 percent rollout across a dozen seeded
  users may not land on exactly one. Irrelevant at demonstration scale, and the spec requires
  determinism rather than uniformity. Worth stating aloud if anyone asks.

## Migration Plan

Greenfield, so this is a build order rather than a migration.

1. Registry file, its validation, and the key generation step. Nothing consumes it yet.
2. Convex schema and the resolution query, with tests covering ordering, bucketing, and fail modes.
3. Delivery: server preload and client subscription, proven by a component that branches on a flag.
4. Administration screen and the kill switch.
5. Persona switching.
6. The CI expiry gate, added last so it cannot block the work that creates the first flags.

Each step is independently shippable to trunk behind incomplete UI, which is deliberate: this change is
also the first real exercise of the workflow the demo teaches.

**Rollback:** entirely additive. Removing the feature means deleting the registry entries and the
tables. No data outside this change depends on it.

## Open Questions

- Whether the administration screen should record who changed what. The specs do not require it and
  nothing else depends on it, so it can be added later without disturbing the data model.
- How many seeded personas the demo needs. Two is enough to show targeting; more may help Act 5 read
  clearly. Decidable while building the scoreboard screens.
