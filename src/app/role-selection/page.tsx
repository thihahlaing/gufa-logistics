'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function RoleSelectionPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSelectRole = async (role: 'customer' | 'driver') => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating role:', error);
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Choose Your Role</h1>
      <div className="flex gap-4">
        <button
          onClick={() => handleSelectRole('customer')}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-500 disabled:bg-gray-400"
        >
          I'm a Customer
        </button>
        <button
          onClick={() => handleSelectRole('driver')}
          disabled={loading}
          className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-500 disabled:bg-gray-400"
        >
          I'm a Driver
        </button>
      </div>
    </div>
  );
}
