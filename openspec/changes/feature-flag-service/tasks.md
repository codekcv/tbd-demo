## 1. Registry and generated keys

- [ ] 1.1 Define the registry module and the flag definition shape: key, description, owner, expiry date, fail mode defaulting to closed
- [ ] 1.2 Implement registry validation covering required fields, kebab-case keys, and rejection of team or alias owners
- [ ] 1.3 Implement the key generation step that reads the registry and emits a typed key union, and commit its output
- [ ] 1.4 Wire generation and a drift check into the build so a stale generated file fails rather than passing silently
- [ ] 1.5 Unit tests: malformed key rejected, missing owner rejected, missing expiry rejected, valid registry accepted
- [ ] 1.6 Declare one real flag in the registry to build against for the rest of this change

## 2. Convex schema and state

- [ ] 2.1 Add the `flags` state table keyed by registry key, carrying the killed field and nothing that duplicates a registry definition
- [ ] 2.2 Add the `flagRules` table with flagKey, position, kind, value and enabled, indexed by flagKey
- [ ] 2.3 Add a routine that creates a state row for every declared flag and is safe to run repeatedly
- [ ] 2.4 Ignore rules whose flagKey is not declared in the registry, and expose them as a cleanup list rather than failing

## 3. Resolution

- [ ] 3.1 Implement the FNV-1a bucketing helper as a pure synchronous function over flag key and user id
- [ ] 3.2 Unit tests for bucketing: same user is stable across calls, buckets are independent across flags, and widening a percentage never drops an included user
- [ ] 3.3 Implement rule evaluation in position order with first match winning and disabled rules skipped
- [ ] 3.4 Implement fallthrough to off when no rule matches, distinguishable in the reason from a rule that matched
- [ ] 3.5 Implement fail-closed behavior for unknown keys and for errors raised during evaluation, with per-flag opt-in to failing open
- [ ] 3.6 Implement the kill short-circuit so a killed flag resolves off before any rule is consulted
- [ ] 3.7 Expose the resolution query returning value and reason for every declared flag given a user context
- [ ] 3.8 Unit tests covering every scenario in the evaluation spec, including one flag erroring without affecting others in the same resolution

## 4. Delivery to the app

- [ ] 4.1 Preload the resolution during server render so flag values are present in the initial output
- [ ] 4.2 Add the client provider that consumes the preloaded resolution and stays subscribed for updates
- [ ] 4.3 Add the flag reading hook, guaranteeing one consistent value per flag within a single render
- [ ] 4.4 Implement the unreachable-state path so the page still renders with each flag at its declared fail mode
- [ ] 4.5 End-to-end test: an included user never sees the off branch during first paint
- [ ] 4.6 End-to-end test: an open session reflects a flag change within seconds and without a reload

## 5. Administration and kill switch

- [ ] 5.1 Add the admin route listing every declared flag with state, rollout percentage, owner and expiry
- [ ] 5.2 Mark flags past their expiry date as expired in the listing
- [ ] 5.3 Add the mutation that sets a rollout percentage
- [ ] 5.4 Add the mutations that add and remove a rule targeting a specific user
- [ ] 5.5 Add the mutation that enables or disables an existing rule
- [ ] 5.6 Add kill and restore mutations, with restore reinstating prior targeting unchanged
- [ ] 5.7 End-to-end test: a kill overrides an enabled everyone-rule, and restoring brings the previous targeting back

## 6. Personas

- [ ] 6.1 Seed the demo users
- [ ] 6.2 Add the persona switcher, changing the acting user in a single action
- [ ] 6.3 Persist the selected persona across navigation and display it on every page
- [ ] 6.4 Ensure resolution uses the selected persona as the user context
- [ ] 6.5 End-to-end test: switching persona changes flagged behavior with no change to flag configuration

## 7. CI expiry gate

- [ ] 7.1 Write the expiry check so it reads only the registry and runs with no database credentials
- [ ] 7.2 Implement escalation: warn within 14 days of the expiry date, fail 7 days past it
- [ ] 7.3 Verify every flag key referenced in application code exists in the registry
- [ ] 7.4 Add the check to the CI workflow as a required gate
- [ ] 7.5 Test the gate against fixture registries at each stage: healthy, warning, and failing
