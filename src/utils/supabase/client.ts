import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Browser-side Supabase client (Client Components), typed with `Database`. */
export const createClient = () =>
  createBrowserClient<Database>(supabaseUrl!, supabaseKey!);
