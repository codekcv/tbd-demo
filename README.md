# tbd-demo

A demonstration of **trunk-based development**: one branch that matters, branches that live hours
rather than days, and feature flags so unfinished work can ship to production switched off.

The application itself is deliberately small. The workflow is the subject.

## The rules being demonstrated

| Rule                       | The limit               |
| -------------------------- | ----------------------- |
| One long-lived branch      | `main`                  |
| Short-lived branches       | under 24 hours          |
| Integrate daily            | at least one merge each |
| Small changes              | under 400 lines         |
| Fast review                | under 2 hours           |
| Fast pipeline              | under 10 minutes        |
| Trunk is always releasable | green, always           |

If work will not fit in a day, it is merged unfinished behind a flag that is off, not held on a
branch.

## Stack

Next.js 16 (App Router, React 19), Convex for database and server functions, Tailwind v4 with
shadcn/ui, Vitest and Playwright, GitHub Actions and Vercel.

One repository on purpose. A separate backend would mean two trunks and cross-repo pull request
pairs, which is the coordination pressure that pushes teams back toward long-lived branches.

The palette is the project's own, in `app/globals.css`. "Trunk" is a railway and telecom term, so
the identity follows: a petrol trunk line, and amber, red, and green as signals for a partial
rollout, a kill, and a full release.

## Getting started

```bash
npm install
npx convex dev      # one time: log in and provision a deployment
npm run dev
```

`npx convex dev` writes `CONVEX_DEPLOYMENT` into `.env.local` and prints the deployment URL. Copy
that URL into `NEXT_PUBLIC_CONVEX_URL`; see `.env.example`.

## Scripts

| Command             | What it does                           |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Development server                     |
| `npm run build`     | Production build                       |
| `npm run typecheck` | Generate route types, then check them  |
| `npm run lint`      | ESLint                                 |
| `npm run format`    | Prettier, writing changes              |
| `npm test`          | Vitest, pure logic only                |
| `npm run test:e2e`  | Playwright, against a production build |

## Planning

Substantial work is planned as an OpenSpec change before it is implemented, under
`openspec/changes/<name>/`. Run the CLI with a pinned `npx` rather than adding it as a dependency:

```bash
npx @fission-ai/openspec@1.8.0 list
npx @fission-ai/openspec@1.8.0 validate
```

Small or mechanical work skips the ceremony. The scaffold you are reading did.
