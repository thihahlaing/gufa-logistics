import { createClient } from '@supabase/supabase-js'

// IMPORTANT: This client is intended for server-side use ONLY, in places like
// Server Actions and Route Handlers. It uses the Service Role Key, which has
// admin-level access to your database and should NEVER be exposed on the client.

export const createServiceRoleClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase URL or Service Role Key is not defined in environment variables.')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
