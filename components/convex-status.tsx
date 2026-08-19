"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// A live subscription, not a one-off fetch. It is the smallest possible version of the
// mechanism the flag service depends on: the server pushes, the open page reacts.
export function ConvexStatus() {
  const health = useQuery(api.health.ping);
  const connected = health?.ok === true;

  return (
    <div
      className="border-border bg-card flex items-center gap-2.5 rounded-lg border px-3 py-2"
      aria-live="polite"
    >
      <span
        className={`size-2 rounded-full ${connected ? "bg-success" : "bg-muted-foreground"}`}
        aria-hidden="true"
      />
      <span className="text-2xs text-muted-foreground font-mono">
        {connected ? "convex connected" : "connecting to convex"}
      </span>
    </div>
  );
}
