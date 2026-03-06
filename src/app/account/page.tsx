'use client';

import React from 'react';
import ProfileCard from '@/app/components/ProfileCard';
import MenuCard from '@/app/components/MenuCard';
import { Wallet, ClipboardList, MapPin, LifeBuoy } from 'lucide-react';

import LogoutButton from '@/app/components/LogoutButton';
import { useAuth } from '@/app/AuthProvider';

const AccountPage = () => {
  const { supabase } = useAuth();

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.location.href = '/login';
  };

  const menuItems = {
    wallet: [
      { href: '/wallet', icon: <Wallet className="h-6 w-6 text-blue-600" />, title: 'Gufa Wallet', subtitle: 'Manage your payment methods' },
    ],
    activity: [
      { href: '/orders/history', icon: <ClipboardList className="h-6 w-6 text-green-600" />, title: 'Order History', subtitle: 'View your past and current orders' },
    ],
    places: [
      { href: '/places', icon: <MapPin className="h-6 w-6 text-purple-600" />, title: 'Saved Places', subtitle: 'Home, Work, and other locations' },
    ],
    support: [
      { href: '/help', icon: <LifeBuoy className="h-6 w-6 text-red-600" />, title: 'Help Center', subtitle: 'Get help and support' },
    ]
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Business Hub</h1>
          <p className="text-lg text-gray-600 mt-1">Manage your profile, payments, and more.</p>
        </header>
        
        <div className="space-y-8">
          <ProfileCard />
          <MenuCard title="My Wallet" items={menuItems.wallet} />
          <MenuCard title="Activity" items={menuItems.activity} />
          <MenuCard title="Places" items={menuItems.places} />
          <MenuCard title="Help & Support" items={menuItems.support} />

          <div className="mt-8">
            <LogoutButton handleLogout={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
