'use client';

import React from 'react';
import Link from 'next/link';
import { Wallet, ClipboardList, MapPin, Cog } from 'lucide-react';
import UserProfile from './UserProfile';
import LogoutButton from './LogoutButton';

interface SidebarProps {
  user: any;
  profile: any;
  handleLogout: () => void;
}

const Sidebar = ({ user, profile, handleLogout }: SidebarProps) => {
  return (
    <div className="flex flex-col h-full w-64 bg-white text-gray-800 shadow-2xl">
      {/* Top Area: User Profile */}
      <div className="p-4 border-b border-gray-200">
        <UserProfile user={user} profile={profile} />
        <Link href="/account" className="text-sm text-center block mt-2 text-blue-600 hover:underline">View Profile</Link>
      </div>

      {/* Middle Area: Navigation */}
      <nav className="flex-grow p-4 space-y-2">
        <Link href="/wallet" className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
          <Wallet className="h-5 w-5 mr-3 text-gray-600" />
          <span>Wallet</span>
        </Link>
        <Link href="/orders" className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
          <ClipboardList className="h-5 w-5 mr-3 text-gray-600" />
          <span>My Orders</span>
        </Link>
        <Link href="/places" className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
          <MapPin className="h-5 w-5 mr-3 text-gray-600" />
          <span>Saved Places</span>
        </Link>
      </nav>

      {/* Bottom Area: Settings & Logout */}
      <div className="p-4 border-t border-gray-200">
        <Link href="/settings" className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
          <Cog className="h-5 w-5 mr-3 text-gray-600" />
          <span>Settings</span>
        </Link>
        <LogoutButton handleLogout={handleLogout} />
      </div>
    </div>
  );
};

export default Sidebar;
