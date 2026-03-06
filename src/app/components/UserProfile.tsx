
'use client';

import React from 'react';

interface UserProfileProps {
  user: any;
  profile: any;
}

const UserProfile = ({ user, profile }: UserProfileProps) => {
  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={user?.user_metadata?.avatar_url || profile?.avatar_url || '/gufa-avatar.png.jpg'}
        alt="User Avatar"
        className="h-10 w-10 rounded-full"
      />
      <div>
        <p className="font-semibold">{profile?.full_name || 'Gufa User'}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>
    </div>
  );
};

export default UserProfile;
