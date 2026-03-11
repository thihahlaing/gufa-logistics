'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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
        .update({ role: role })
        .eq('id', user.id);

      if (error) {
        toast.error(`Failed to set role: ${error.message}`);
        setLoading(false);
      } else {
        toast.success(`Role set to ${role}!`);
        // Force a reload to ensure middleware re-evaluates
        window.location.href = '/';
      }
    } else {
        toast.error('User not found. Please log in again.');
        setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Select Your Role</h1>
        <p className="text-gray-400 mb-8">Choose how you want to use the platform.</p>
        <div className="flex justify-center gap-6">
          <button 
            onClick={() => handleSelectRole('customer')}
            disabled={loading}
            className="w-48 bg-blue-600 text-white text-center font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-500"
          >
            I am a Customer
          </button>
          <button 
            onClick={() => handleSelectRole('driver')}
            disabled={loading}
            className="w-48 bg-green-600 text-white text-center font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-500"
          >
            I am a Driver
          </button>
        </div>
      </div>
    </main>
  );
}
