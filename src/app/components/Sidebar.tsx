
'use client';

import React from 'react';
import Link from 'next/link';
import UserProfile from './UserProfile';
import LogoutButton from './LogoutButton';

interface SidebarProps {
  user: any;
  profile: any;
  handleLogout: () => void;
}

const Sidebar = ({ user, profile, handleLogout }: SidebarProps) => {
  return (
    <nav className="flex flex-col h-screen w-64 border-r bg-white shadow-md">
      {/* Top Section: Brand Logo */}
      <div className="p-4 border-b">
        <img src="/gufa-logo.png" alt="Gufa" className="h-10" />
      </div>

      {/* Middle Section: Navigation Links */}
      <div className="flex-grow p-4 space-y-2">
        <Link href="/book" className="block p-2 rounded hover:bg-gray-100 font-medium text-gray-700">Dashboard</Link>
        <Link href="/orders" className="block p-2 rounded hover:bg-gray-100 font-medium text-gray-700">Orders</Link>
      </div>

      {/* Bottom Section: User Profile & Logout */}
      <div className="p-4 border-t">
        <UserProfile user={user} profile={profile} />
        <LogoutButton handleLogout={handleLogout} />
      </div>
    </nav>
  );
};

export default Sidebar;
