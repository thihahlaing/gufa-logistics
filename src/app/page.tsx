import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (data.user) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }

  return null
}
