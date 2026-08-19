## Why

The demo exists to teach trunk-based development, whose central rule is that every developer
integrates to `main` at least daily even when their work is unfinished. That is only safe if
unfinished work can be merged in a state where users cannot reach it. Without a flag service there is
no way to demonstrate the three moments the demo is built around: shipping code that is deliberately
invisible, releasing it without a deploy, and switching it off in seconds when it misbehaves.

This change builds that machinery. It is deliberately small. The point is not to build a
production-grade flag platform, it is to make the mechanism legible on a projector while still being
correct enough that an engineer in the room cannot poke a hole in it.

## What Changes

- **Flag definitions become a checked-in registry.** Key, description, owner, expiry date, and fail
  mode live in a TypeScript file under version control. Adding a flag is a reviewed pull request
  rather than a dashboard action, which is itself demo material.
- **Flag keys are generated from that registry.** Referencing a flag that does not exist becomes a
  compile error instead of a silently false value.
- **Runtime state lives in Convex.** Two tables hold targeting rules and their enabled state, so
  changing who sees a feature never requires a deploy.
- **Resolution is ordered and explainable.** Rules evaluate in `position` order, first match wins, and
  every result carries the reason it resolved that way.
- **Percent rollouts are stable per user.** A user hashed into the first 10% stays there across
  sessions and page loads, so a partial rollout does not flicker people in and out.
- **Resolution fails closed.** An unknown key, or an error during evaluation, yields off. Failing open
  is opt-in per flag and has to be declared in the registry.
- **The app reads flags without flicker.** Server components preload the resolution so the correct UI
  is in the first byte, and client components stay subscribed so changes arrive without a reload.
- **A kill switch turns a flag off in one action**, and open browser sessions recover on their own.
- **Flags expire.** CI warns as `archiveAt` approaches and fails the build after a grace period, so a
  flag cannot quietly become permanent.
- **An admin screen drives all of it**, listing every flag with its state, rollout percentage, owner,
  and expiry.
- **Seeded personas can be switched in one click**, so targeting rules can be shown working rather
  than described. This is deliberately not authentication.

Flags are boolean only. Percent and per-user rules decide who gets the on state. Multivariate flags
returning strings, numbers, or JSON are out of scope and can be added later without changing existing
call sites.

## Capabilities

### New Capabilities

- `feature-flags/registry`: flag definitions as a checked-in source of truth, generated type-safe
  keys, and the expiry rules that keep flags from becoming permanent.
- `feature-flags/evaluation`: how a flag resolves for a given user. Rule ordering, stable percent
  bucketing, fail-closed behavior, and the reason attached to every result.
- `feature-flags/delivery`: how the application consumes a resolution. Server-side preload for a
  correct first paint, client subscription for live updates, and the propagation guarantee that makes
  a kill switch usable.
- `feature-flags/administration`: the operator surface. Viewing flag state, setting a rollout
  percentage, targeting a user, and killing a flag outright.
- `demo-personas`: switching the acting user at runtime so targeting behavior is observable, with the
  explicit constraint that this is a demo affordance and not an authentication system.

### Modified Capabilities

None. This is the first capability set in the project.

## Impact

- **New code**: `flags/registry.ts` and its generated output, `convex/schema.ts` tables `flags` and
  `flagRules`, `convex/flags.ts` queries and mutations, a flag provider and hooks under `lib/flags/`,
  an `/admin/flags` route, and a persona switcher component.
- **New CI step**: a registry check that validates key naming, verifies every referenced key exists,
  and enforces `archiveAt`. It reads the registry file directly and needs no database credentials.
- **Dependency**: assumes the project scaffold is already in place, specifically Next.js with the App
  Router, a provisioned Convex deployment, and a green pipeline. That work is a separate change and
  must land first.
- **Not touched**: the Concept Scoreboard screens, and the `scoring-v2` feature that will later be
  built behind one of these flags. Both are separate changes.
