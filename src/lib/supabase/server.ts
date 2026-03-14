import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// In testing mode, we'll create a mock Supabase client
// that always returns a hardcoded user.
const MOCK_USER = {
  id: 'test-user-001',
  email: 'test@example.com',
  role: 'merchant',
  // Add any other user properties your application might need
};

export async function createClient() {
  // In a real scenario, you'd use this check to differentiate environments
  if (process.env.TESTING_MODE === 'true') {
    return {
      auth: {
        getUser: async () => {
          return {
            data: {
              user: MOCK_USER,
            },
            error: null,
          };
        },
        // Add any other auth methods you might call
      },
      // Add other Supabase client methods if needed, for example, from()
      from: (table: string) => ({
        // Mock 'from' to allow chaining
        select: () => ({ eq: () => ({ single: () => ({ data: {}, error: null }) }) }),
        insert: () => ({ data: {}, error: null }),
        // Add other chainable methods as needed
      }),
    };
  }

  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `remove` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}