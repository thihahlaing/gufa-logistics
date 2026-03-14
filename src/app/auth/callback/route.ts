import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // If Google returns an error parameter, log it and return an error response
  if (error) {
    console.error(`Google Auth Error: ${error} - ${errorDescription}`)
    return new Response(
      `Error during Google authentication: ${error} - ${errorDescription}`,
      { status: 500 }
    )
  }

  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = cookies()
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Authentication Error:', error.message)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    if (data.user) {
        // Check if a profile exists
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

        // If there was an error and it wasn't a "not found" error, log it
        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError)
        }

        // If no profile exists, create one
        if (!profile) {
            const { error: insertError } = await supabase.from('profiles').insert({
                id: data.user.id,
                role: 'merchant', // Default role
            });

            if (insertError) {
                console.error('Error creating profile:', insertError.message);
                // Redirect to an error page, as the user can't proceed without a profile
                return NextResponse.redirect(`${origin}/auth/auth-code-error`);
            }
        }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
