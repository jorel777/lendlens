import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Log environment variables for debugging
console.log('Supabase URL:', supabaseUrl ? 'Available' : 'Missing');
console.log('Supabase Key:', supabaseAnonKey ? 'Available' : 'Missing');

// Create a mock client if environment variables are missing
let supabase;
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables, using mock client');
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null }, error: new Error('Mock auth error') }),
      signOut: async () => ({ error: null })
    },
    from: () => ({
      select: () => ({
        limit: () => ({ data: [], error: new Error('Mock query error') })
      }),
      insert: () => ({ data: null, error: new Error('Mock insert error') }),
      update: () => ({ data: null, error: new Error('Mock update error') })
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: { path: 'mock-path' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'https://via.placeholder.com/300' } })
      })
    }
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase }; 