'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useState, type CSSProperties } from 'react';

import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<'google' | 'facebook' | 'apple' | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(provider);
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const buttonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    fontSize: '16px',
    margin: '10px 0',
    width: '250px',
    height: '48px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <button onClick={() => handleSignIn('google')} style={{...buttonStyle, backgroundColor: '#4285F4', color: 'white'}} disabled={!!isLoading}>
        {isLoading === 'google' ? <LoadingSpinner /> : 'Sign in with Google'}
      </button>
      <button onClick={() => handleSignIn('facebook')} style={{...buttonStyle, backgroundColor: '#1877F2', color: 'white'}} disabled={!!isLoading}>
        {isLoading === 'facebook' ? <LoadingSpinner /> : 'Sign in with Facebook'}
      </button>
      <button onClick={() => handleSignIn('apple')} style={{...buttonStyle, backgroundColor: '#000000', color: 'white'}} disabled={!!isLoading}>
        {isLoading === 'apple' ? <LoadingSpinner /> : 'Sign in with Apple'}
      </button>
    </div>
  );
}
