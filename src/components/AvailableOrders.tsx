'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  status: string;
  price: number;
}

export default function AvailableOrders() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error(`Error fetching orders: ${error.message}`);
      } else {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();

    const channel = supabase.channel('realtime-orders')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'orders', filter: 'status=eq.pending' }, 
        (payload) => {
          toast.success('A new order is available!');
          setOrders(currentOrders => [payload.new as Order, ...currentOrders]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAcceptOrder = async (orderId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to accept an order.');
      return;
    }

    const { error } = await supabase
      .from('orders')
      .update({ status: 'accepted', driver_id: user.id })
      .eq('id', orderId);

    if (error) {
      toast.error(`Error accepting order: ${error.message}`);
    } else {
      toast.success('Order accepted!');
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  if (loading) {
    return (
      <div className="p-4 border rounded-lg mt-4 animate-pulse">
        <h2 className="text-lg font-semibold mb-2">Available Orders</h2>
        <p className="text-gray-400">Loading available orders...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg mt-4">
      <h2 className="text-lg font-semibold mb-2">Available Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-400">No available orders at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="p-4 border rounded-md flex justify-between items-center">
              <div>
                <p><strong>From:</strong> {order.pickup_location}</p>
                <p><strong>To:</strong> {order.dropoff_location}</p>
                <p className="font-bold text-green-400">Price: ${order.price.toFixed(2)}</p>
              </div>
              <button 
                onClick={() => handleAcceptOrder(order.id)}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
