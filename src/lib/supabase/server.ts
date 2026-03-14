import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// In testing mode, we'll create a mock Supabase client
// that always returns a hardcoded user.
const MOCK_USER = {
  id: 'test-user-001',
  email: 'test@example.com',
  app_metadata: { role: 'merchant' },
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
      from: (table: string) => {
        const mockChain: any = {
          select: () => mockChain,
          insert: () => mockChain,
          update: () => mockChain,
          order: () => mockChain,
          eq: () => mockChain,
          single: () => ({ data: { balance: 100 }, error: null }),
          then: (resolve: any) => resolve({ data: [{id: 1, pickup_address: 'A', dropoff_address: 'B', status: 'pending', cash_collected: 0}], error: null }),
        };
        return mockChain;
      },
    };
  }

  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieJar = await cookieStore;
          return cookieJar.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          const cookieJar = await cookieStore;
          try {
            cookieJar.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        async remove(name: string, options: CookieOptions) {
          const cookieJar = await cookieStore;
          try {
            cookieJar.set({ name, value: '', ...options });
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