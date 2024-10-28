import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_supabaseUrl ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_supabaseAnonKey ?? "";



export const supabase = createClient(supabaseUrl, supabaseAnonKey);
