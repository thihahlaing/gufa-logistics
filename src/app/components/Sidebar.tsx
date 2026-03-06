
'use client';

import React from 'react';
import Link from 'next/link';
import UserProfile from './UserProfile';
import LogoutButton from './LogoutButton';
import { LayoutDashboard, Package } from 'lucide-react';

interface SidebarProps {
  user: any;
  profile: any;
  handleLogout: () => void;
}

const Sidebar = ({ user, profile, handleLogout }: SidebarProps) => {
  return (
    <div className="flex flex-col h-full w-64 bg-white shadow-xl">
      {/* Top Section: Brand Logo */}
      <div className="p-4 border-b border-gray-200">
        <img src="/gufa-logo.png" alt="Gufa Logistics" className="h-10 mx-auto" />
      </div>

      {/* Middle Section: Navigation Links */}
      <nav className="flex-grow p-4 space-y-2">
        <Link href="/book" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
          <LayoutDashboard className="mr-3 h-5 w-5" />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link href="/orders" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
          <Package className="mr-3 h-5 w-5" />
          <span className="font-medium">Orders</span>
        </Link>
      </nav>

      {/* Bottom Section: User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        <UserProfile user={user} profile={profile} />
        <LogoutButton handleLogout={handleLogout} />
      </div>
    </div>
  );
};

export default Sidebar;
