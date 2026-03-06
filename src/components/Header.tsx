'use client';

import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { User as UserIcon, ChevronLeft } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  showBackButton?: boolean;
}

export default function Header({ user, showBackButton = false }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 pointer-events-auto">
      {showBackButton ? (
        <button onClick={() => router.back()} className="p-2">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </button>
      ) : (
        <div className="text-2xl font-bold text-gray-800">
          GUFA
        </div>
      )}

      {/* Profile Avatar */}
      <div className="w-12 h-12 bg-gray-200 rounded-full shadow-lg cursor-pointer flex items-center justify-center overflow-hidden" onClick={() => router.push('/account')}>
        {user?.user_metadata.avatar_url ? (
          <img src={user.user_metadata.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="w-8 h-8 text-gray-500" />
        )}
      </div>
    </header>
  );
}
