import { createBrowserClient } from "@supabase/ssr";

/** Cliente Supabase pra uso em componentes client ("use client"). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
