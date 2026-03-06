'use client';

import { useState } from 'react';
import { ShoppingBag, Truck } from 'lucide-react';

// Placeholder for the Google Maps component
function MapPlaceholder() {
  return (
    <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Google Map will be here</p>
    </div>
  );
}

import GoogleMapsProvider from '../../components/GoogleMapsProvider';

export default function DashboardPage() {
  return (
    <GoogleMapsProvider>
      <Dashboard />
    </GoogleMapsProvider>
  );
}

function Dashboard() {
  const [userRole, setUserRole] = useState<'shipper' | 'driver' | null>(null);

  const handleRoleSelection = (role: 'shipper' | 'driver') => {
    setUserRole(role);
    // Send notification to Slack
    fetch('/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: `User selected role: ${role}` }),
    });
    console.log(`User selected role: ${role}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gufa-blue text-center mb-8">Gufa Logistics Dashboard</h1>

        {!userRole ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              onClick={() => handleRoleSelection('shipper')}
              className="group flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-4 border-transparent hover:border-gufa-blue"
            >
              <ShoppingBag className="w-20 h-20 text-gufa-blue mb-4 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-2xl font-semibold text-gray-800">I want to Ship</span>
            </button>
            <button
              onClick={() => handleRoleSelection('driver')}
              className="group flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-4 border-transparent hover:border-gufa-blue"
            >
              <Truck className="w-20 h-20 text-gufa-blue mb-4 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-2xl font-semibold text-gray-800">I want to Drive</span>
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
              Welcome, {userRole === 'shipper' ? 'Shipper' : 'Driver'}!
            </h2>
            <MapPlaceholder />
            {/* Future components for Shipper/Driver will go here */}
          </div>
        )}
      </div>
    </div>
  );
}