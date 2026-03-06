
'use client';

import React from 'react';

interface LogoutButtonProps {
  handleLogout: () => void;
}

const LogoutButton = ({ handleLogout }: LogoutButtonProps) => {
  return (
    <button
      onClick={handleLogout}
      className="mt-4 w-full text-left text-red-600 hover:underline"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
