'use client';

import { useState, useEffect } from 'react';
import { OrderFlashCard } from '@/components/driver/OrderFlashCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const MOCK_ORDERS = [
  { id: 101, pickup_address: 'Thilawa Port', dropoff_address: 'Hledan Center', price: 8500 },
  { id: 102, pickup_address: 'Yangon Airport', dropoff_address: 'Junction City', price: 6000 },
  { id: 103, pickup_address: 'MICT Park', dropoff_address: 'Time City', price: 4500 },
];

export default function DriverDashboard() {
  const [newOrders, setNewOrders] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);

  useEffect(() => {
    // Simulate new orders arriving
    const initialOrder = MOCK_ORDERS[0];
    setNewOrders([initialOrder]);

    const timer = setTimeout(() => {
        setNewOrders(prev => [...prev, MOCK_ORDERS[1]]);
    }, 5000); // Second order arrives after 5s

    return () => clearTimeout(timer);
  }, []);

  const handleOrderAccepted = (orderId: number) => {
    const acceptedOrder = newOrders.find(o => o.id === orderId);
    if (acceptedOrder) {
        setActiveOrders(prev => [acceptedOrder, ...prev]);
        setNewOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  return (
    <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Driver Dashboard</h1>
        <Tabs defaultValue="live-feed">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="live-feed">Live Feed</TabsTrigger>
                <TabsTrigger value="active-orders">Active Orders ({activeOrders.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="live-feed">
                <div className="space-y-4 pt-4">
                    {newOrders.length > 0 ? (
                        newOrders.map(order => 
                            <OrderFlashCard key={order.id} order={order} onAccept={handleOrderAccepted} />
                        )
                    ) : (
                        <p className="text-gray-500 text-center py-10">No new orders at the moment. We'll notify you!</p>
                    )}
                </div>
            </TabsContent>
            <TabsContent value="active-orders">
                 <div className="space-y-4 pt-4">
                    {activeOrders.length > 0 ? (
                        activeOrders.map(order => (
                            <div key={order.id} className="border rounded-lg p-4 shadow-sm">
                                <p className="font-bold">Order #{order.id}</p>
                                <p>{order.pickup_address} → {order.dropoff_address}</p>
                                <p className="text-green-600">Fare: {order.price.toLocaleString()} MMK</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-10">You have no active orders.</p>
                    )}
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}