'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Booking() {
  const supabase = createClient();
  const router = useRouter();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('You must be logged in to book.');
      setLoading(false);
      return;
    }

    // For now, we use placeholder lat/lng. A map integration would provide real data.
    const newOrder = {
      customer_id: user.id,
      pickup_location: pickup,
      dropoff_location: dropoff,
      price: parseFloat(price),
      pickup_lat: 34.0522,
      pickup_lng: -118.2437,
      dropoff_lat: 36.1699,
      dropoff_lng: -115.1398,
    };

    const { error } = await supabase.from('orders').insert(newOrder);

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('Order created successfully!');
      router.push('/'); // Redirect to dashboard on success
    }
  };

  return (
    <div className="p-4 border rounded-lg mt-4">
      <h2 className="text-lg font-semibold mb-2">Create a New Order</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder="Pickup Location (e.g., Union Station)"
          className="rounded-md px-4 py-2 bg-inherit border"
          required
        />
        <input
          type="text"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          placeholder="Dropoff Location (e.g., Las Vegas Strip)"
          className="rounded-md px-4 py-2 bg-inherit border"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Proposed Price ($"
          className="rounded-md px-4 py-2 bg-inherit border"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-500"
        >
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}
