import { redirect } from 'next/navigation'

export default function Home() {
  // Bypass authentication and redirect directly to the merchant dashboard
  redirect('/dashboard')
}
