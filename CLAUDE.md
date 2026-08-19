@AGENTS.md

# tbd-demo

A demonstration of trunk-based development. The workflow is the product, so how work lands here
matters more than usual.

## How work lands

`main` is the only long-lived branch. There is no `dev`, no `staging`, no release branch, and adding
one defeats the point of the repository.

```bash
git switch main && git pull --rebase      # always start from current trunk
git switch -c feat/<ticket>-<topic>       # scope it to one day
# commit often, in small coherent pieces
git fetch origin && git rebase origin/main   # rebase, never merge, at least once mid-work
git push -u origin HEAD && gh pr create --fill
gh pr merge --squash --delete-branch
```

Rebase rather than merge, so history stays linear. Delete the branch as part of merging. If work
will not fit in a day, merge it unfinished behind a flag that is off rather than keeping the branch
open.

Branch prefixes: `feat/`, `fix/`, `chore/`. Keep pull requests under 400 lines.

## Framework specifics that differ from training data

**This is Next.js 16, not 15.** `AGENTS.md` says the same thing and it is not boilerplate. Read
`node_modules/next/dist/docs/` before writing framework code. The differences that have already
caught us:

- **Request APIs are async.** `cookies()`, `headers()`, `params`, and `searchParams` must be
  awaited. This will matter for the persona switcher, which reads a cookie.
- **`middleware.ts` is now `proxy.ts`.** The old filename is not picked up.
- **Turbopack is the default** for both `dev` and `build`.
- **Route types are generated.** `LayoutProps` and friends live in `.next/types`, so a bare
  `tsc --noEmit` fails on a clean checkout. Always `next typegen` first, which is what
  `npm run typecheck` does.

**Tailwind is v4.** There is no `tailwind.config.js`. Theme configuration is CSS-first in
`app/globals.css` under `@theme inline`. Do not create a JS config file.

**shadcn/ui here builds on `@base-ui/react`, not Radix.** Check the installed component source
before assuming a Radix API.

## Design tokens

Palette values in `app/globals.css` are ported from `myb-ui` so the demo looks like a product the
team recognises. Token names are shadcn's so its components inherit the look.

- Reach for a semantic token (`bg-primary`, `text-muted-foreground`), not a raw colour.
- The smallest permitted UI text is 11px, which is `text-2xs`. Nothing smaller ships.
- Both themes are maintained. Check contrast in each independently; a light-theme fix does not
  imply the dark one is fine.

## Conventions

- **`convex/_generated/` is committed.** CI has no Convex credentials, so typecheck depends on those
  files being in the tree. The same reasoning applies to any other generated output here.
- **Vitest is for pure logic**, node environment, colocated `*.test.ts`. Browser behaviour belongs to
  Playwright, which runs against a production build rather than the dev server.
- **Substantial work is planned as an OpenSpec change first**, under `openspec/changes/<name>/`. Run
  the CLI with a pinned `npx @fission-ai/openspec@1.8.0`, never as a dependency. Skip the ceremony
  for mechanical work.
