import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if a profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      // If there was an error and it wasn't a "not found" error, redirect to error page
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError)
        return NextResponse.redirect(`${origin}/auth/auth-error`)
      }

      // If no profile exists, create one
      if (!profile) {
        const { error: insertError } = await supabase.from('profiles').insert({
          id: data.user.id,
          role: 'merchant', // Default role
        })

        if (insertError) {
          console.error('Error creating profile:', insertError.message)
          return NextResponse.redirect(`${origin}/auth/auth-error`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  console.error('No code found in URL or session exchange failed');
  // if we have an error or no code, redirect to an error page
  return NextResponse.redirect(`${origin}/auth/auth-error`)
}
