import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Please connect to Supabase by clicking the "Connect to Supabase" button in the top right corner.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);