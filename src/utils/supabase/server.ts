import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/** Cliente Supabase pra uso em Server Components, Route Handlers e Server Actions. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Chamado a partir de um Server Component (sem acesso de escrita
            // a cookies) — inofensivo se o middleware já cuida do refresh.
          }
        },
      },
    }
  );
}
