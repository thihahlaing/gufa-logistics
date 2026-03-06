'use client';

import React from 'react';
import { useAuth } from '@/app/AuthProvider';

const ProfileCard = () => {
  const { user, profile } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-6">
      <img
        src={profile?.avatar_url || user.user_metadata?.avatar_url || '/gufa-avatar.png.jpg'}
        alt="User Avatar"
        className="h-20 w-20 rounded-full border-4 border-gray-200"
      />
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{profile?.full_name || 'Gufa User'}</h2>
        <p className="text-gray-500">{user.email}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
