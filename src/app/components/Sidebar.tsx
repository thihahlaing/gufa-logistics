'use client';

import React from 'react';
import Link from 'next/link';
import { Map, Star, Cog } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  profile: any; // Keeping profile for potential future use, e.g., full_name
  handleLogout: () => void;
}

const Sidebar = ({ isOpen, onClose, user, profile, handleLogout }: SidebarProps) => {
  // All inline styles have been removed for a clean slate, as requested.
  // Layout will be controlled by global CSS or a CSS-in-JS solution via classNames.

  return (
    <>
      <div 
        className={`menu-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      ></div>
      <div className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-container">
          <BrandLogo />
          <nav className="sidebar-nav">
            <Link href="/book"><div className="menu-item"><Map size={20} /> Home</div></Link>
            <Link href="/orders"><div className="menu-item"><Star size={20} /> Orders</div></Link>
            <Link href="/history"><div className="menu-item"><Cog size={20} /> History</div></Link>
          </nav>

          <div className="flex-grow"></div>

          {user && (
            <div className="user-profile">
              <img 
                src={user?.user_metadata?.avatar_url || profile?.avatar_url || '/gufa-avatar.png.jpg'} 
                alt="User" 
                className="user-avatar"
              />
              <span className="user-name">{profile?.full_name || user?.email}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
