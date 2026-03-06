'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import { updateProfile } from '../actions';
import { User, ShoppingBag, Truck } from 'lucide-react';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'driver' | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName || !phone || !role) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await updateProfile({ fullName, phone, role });
      if (result.error) {
        throw new Error(result.error.message);
      }
      router.push('/account');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Complete Your Profile</h2>

        <div>
          <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-gufa-blue focus:border-gufa-blue"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-gufa-blue focus:border-gufa-blue"
            placeholder="09xxxxxxxxx"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Select Your Role</label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <button
              onClick={() => setRole('customer')}
              className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${
                role === 'customer'
                  ? 'bg-gufa-blue text-white border-gufa-blue'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}>
              <ShoppingBag className="w-8 h-8 mb-2" />
              <span className="font-semibold">Customer</span>
            </button>
            <button
              onClick={() => setRole('driver')}
              className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${
                role === 'driver'
                  ? 'bg-gufa-blue text-white border-gufa-blue'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}>
              <Truck className="w-8 h-8 mb-2" />
              <span className="font-semibold">Driver</span>
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full px-4 py-3 font-bold text-white bg-gufa-blue rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gufa-blue disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Save and Continue'}
        </button>
      </div>
    </div>
  );
}
