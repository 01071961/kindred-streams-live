// External Supabase client - connects to user's own Supabase project
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for external Supabase
const EXTERNAL_SUPABASE_URL = import.meta.env.VITE_EXTERNAL_SUPABASE_URL || '';
const EXTERNAL_SUPABASE_ANON_KEY = import.meta.env.VITE_EXTERNAL_SUPABASE_ANON_KEY || '';

// Fallback to Cloud values if external not configured
const SUPABASE_URL = EXTERNAL_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = EXTERNAL_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Create external client without strict typing (for external DB)
export const externalSupabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Check if external Supabase is configured
export const isExternalSupabaseConfigured = (): boolean => {
  return Boolean(EXTERNAL_SUPABASE_URL && EXTERNAL_SUPABASE_ANON_KEY);
};

// Export URL for edge function calls
export const getExternalSupabaseUrl = (): string => SUPABASE_URL;
