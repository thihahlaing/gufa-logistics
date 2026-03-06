'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/AuthProvider';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_price: number;
}

const OrderHistoryPage = () => {
  const { supabase, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('id, created_at, status, total_price')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data as Order[]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user, supabase, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Order History</h1>
          <p className="text-lg text-gray-600 mt-1">Review your past and current orders.</p>
        </header>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map(order => (
                <li key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-blue-600">Order #{order.id.substring(0, 8)}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleDateString()} - {new Date(order.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">{order.total_price?.toLocaleString() || 0} Ks</p>
                      <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}
                      `}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-6 text-center text-gray-500">
                You have no orders yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
