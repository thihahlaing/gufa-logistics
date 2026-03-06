'use client';

import React from 'react';
import Link from 'next/link';

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

interface MenuCardProps {
  title: string;
  items: MenuItem[];
}

const MenuCard = ({ title, items }: MenuCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <Link href={item.href} key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="mr-4 bg-gray-100 p-2 rounded-lg">
              {item.icon}
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-gray-700">{item.title}</p>
              <p className="text-sm text-gray-500">{item.subtitle}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuCard;
