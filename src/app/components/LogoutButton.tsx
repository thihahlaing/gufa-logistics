
'use client';

import React from 'react';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  handleLogout: () => void;
}

const LogoutButton = ({ handleLogout }: LogoutButtonProps) => {
  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-center w-full mt-4 p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span className="text-sm font-medium">Logout</span>
    </button>
  );
};

export default LogoutButton;
