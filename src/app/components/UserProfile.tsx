
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
    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
      <img
        src={user?.user_metadata?.avatar_url || profile?.avatar_url || '/gufa-avatar.png.jpg'}
        alt="User Avatar"
        className="h-10 w-10 rounded-full mr-3"
      />
      <div className="flex-grow">
        <p className="font-semibold text-sm text-gray-800 truncate">{profile?.full_name || 'Gufa User'}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
      </div>
    </div>
  );
};

export default UserProfile;
