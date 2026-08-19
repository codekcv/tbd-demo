import { Button } from "@/components/ui/button";
import { ConvexStatus } from "@/components/convex-status";

const TOKENS = [
  { name: "primary", className: "bg-primary" },
  { name: "accent", className: "bg-accent" },
  { name: "success", className: "bg-success" },
  { name: "warning", className: "bg-warning" },
  { name: "destructive", className: "bg-destructive" },
  { name: "muted", className: "bg-muted" },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-3">
        <p className="text-2xs text-muted-foreground font-mono tracking-[0.1em] uppercase">
          tbd-demo
        </p>
        <h1 className="text-4xl font-medium tracking-tight">Concept Scoreboard</h1>
        <ConvexStatus />
        <p className="text-ink max-w-prose">
          Placeholder. The pipeline is what matters right now: if you are reading this on the
          production URL, a commit to <code className="font-mono text-sm">main</code> reached
          production without anyone touching it.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xs text-muted-foreground font-mono tracking-[0.1em] uppercase">
          Design tokens
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TOKENS.map((token) => (
            <div
              key={token.name}
              className="border-border bg-card flex items-center gap-3 rounded-lg border p-3"
            >
              <span className={`size-8 rounded-md ${token.className}`} aria-hidden="true" />
              <span className="text-2xs text-muted-foreground font-mono">{token.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
      </section>
    </main>
  );
}
