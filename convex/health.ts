import { query } from "./_generated/server";

// Exists so the app can prove it is actually talking to Convex, rather than proving
// it compiles. Delete once a real query serves the same purpose.
export const ping = query({
  args: {},
  handler: async () => ({ ok: true as const }),
});
