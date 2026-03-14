'use client'

import { useState, useEffect, useTransition, useMemo } from 'react';
import { createClient } from "@/lib/supabase/client";
import { acceptOrder, completeOrder } from "@/app/actions";
import { Truck, Package, CheckCircle, X, DollarSign, MapPin, PackageOpen, Navigation, AlertTriangle, Phone, Clock, Box, MoreVertical, Map } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

// --- Types --- //
type Order = {
    id: number;
    pickup_address: string;
    dropoff_address: string;
    cargo_description: string;
    status: string;
    price: number;
    delivery_window: string;
    customer_phone: string;
    pickup_lat: number;
    pickup_lng: number;
    dropoff_lat: number;
    dropoff_lng: number;
};

type OrderWithDistance = Order & { distance: number };

type Profile = {
    balance: number;
    status: string;
}

interface DriverDashboardProps {
  user: User;
  profile: Profile;
  initialAssignedOrders: Order[];
  initialAvailableOrders: Order[];
}

// --- Helper Functions --- //
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

const MOCK_DRIVER_LOCATION = { lat: 16.85, lng: 96.15 }; // Central Yangon

// --- Main Component --- //
export default function DriverDashboard({ user, profile: initialProfile, initialAssignedOrders, initialAvailableOrders }: DriverDashboardProps) {
    const supabase = createClient();
    const [profile, setProfile] = useState<Profile>(initialProfile);
    const [assignedOrders, setAssignedOrders] = useState<Order[]>(initialAssignedOrders);
    const [availableOrders, setAvailableOrders] = useState<OrderWithDistance[]>([]);
    const [isPending, startTransition] = useTransition();
    const [completingOrder, setCompletingOrder] = useState<Order | null>(null);
    const [showSettleModal, setShowSettleModal] = useState(false);

    const isSuspended = profile.status === 'suspended';

    // Sort initial available orders by distance
    useEffect(() => {
        const sortedInitial = initialAvailableOrders
            .map(order => ({
                ...order,
                distance: haversineDistance(MOCK_DRIVER_LOCATION.lat, MOCK_DRIVER_LOCATION.lng, order.pickup_lat, order.pickup_lng)
            }))
            .sort((a, b) => a.distance - b.distance);
        setAvailableOrders(sortedInitial);
    }, [initialAvailableOrders]);

    // Real-time subscriptions
    useEffect(() => {
        const handleNewOrder = (newOrder: Order) => {
            const orderWithDistance = {
                ...newOrder,
                distance: haversineDistance(MOCK_DRIVER_LOCATION.lat, MOCK_DRIVER_LOCATION.lng, newOrder.pickup_lat, newOrder.pickup_lng)
            };
            setAvailableOrders(prev => [...prev, orderWithDistance].sort((a, b) => a.distance - b.distance));
        };

        const handleAcceptedOrder = (updatedOrder: Order) => {
            // Remove from my available list
            setAvailableOrders(prev => prev.filter(o => o.id !== updatedOrder.id));
            // If I am the one who accepted it, add to my assigned list
            // @ts-ignore
            if (updatedOrder.driver_id === user.id) {
                setAssignedOrders(prev => [updatedOrder, ...prev]);
            }
        };

        const orderChannel = supabase
            .channel('realtime-orders')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
                handleNewOrder(payload.new as Order);
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `status=eq.assigned` }, (payload) => {
                handleAcceptedOrder(payload.new as Order);
            })
            .subscribe();
        
        // ... (profile and other subscriptions)

        return () => {
            supabase.removeChannel(orderChannel);
        };
    }, [supabase, user.id]);

    const handleAccept = (orderId: number) => {
        if (isSuspended) return;
        startTransition(() => { acceptOrder(orderId); });
    };
    
    // --- Render --- //
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-20">
                 <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <Truck className="text-gray-800 h-7 w-7 mr-2" />
                        <h1 className="text-xl font-bold text-gray-800">Driver Dashboard</h1>
                    </div>
                    <div className={`p-2 rounded-lg text-center ${profile.balance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <div className="font-bold text-lg">{new Intl.NumberFormat().format(profile.balance)} MMK</div>
                        <div className="text-xs font-medium">CURRENT BALANCE</div>
                    </div>
                </div>
            </header>

            {/* Suspension Banner */}
            {isSuspended && (
                <div className="bg-red-600 text-white text-center p-3 font-semibold flex items-center justify-center sticky top-[68px] z-10">
                    <AlertTriangle className="mr-2" />
                    Account Suspended. Settle balance to continue.
                    <button onClick={() => setShowSettleModal(true)} className="ml-3 bg-white text-red-600 font-bold py-1 px-3 rounded-md text-sm">Pay Now</button>
                </div>
            )}

            <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Orders */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Available Orders</h2>
                    <div className="space-y-4">
                        {availableOrders.map(order => <LogisticsCard key={order.id} order={order} onAccept={handleAccept} isSuspended={isSuspended} />)}
                        {availableOrders.length === 0 && (
                            <div className="text-center py-16 px-4">
                                <div className="relative w-24 h-24 mx-auto text-gufa-blue-200">
                                    <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping"></div>
                                    <div className="absolute inset-2 rounded-full bg-current opacity-40 animate-ping delay-150"></div>
                                    <MapPin className="relative w-full h-full" />
                                </div>
                                <p className="mt-6 text-lg font-medium text-gray-600">Searching for nearby deliveries...</p>
                                <p className="text-sm text-gray-400">You will be notified when a new order is available.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* My Active Orders */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">My Active Orders</h2>
                    <div className="space-y-4">
                         {assignedOrders.map(order => <AssignedOrderCard key={order.id} order={order} onCompleteClick={setCompletingOrder} />)}
                         {assignedOrders.length === 0 && <p className="text-gray-500 text-center py-10">You have no active orders.</p>}
                    </div>
                </section>
            </main>

            {/* Modals will go here */}
        </div>
    );
}

// --- Child Components --- //
const LogisticsCard = ({ order, onAccept, isSuspended }: { order: OrderWithDistance, onAccept: (id: number) => void, isSuspended: boolean }) => {
    const hasCoords = order.pickup_lat && order.pickup_lng && order.dropoff_lat && order.dropoff_lng;

    return (
        <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ${isSuspended ? 'opacity-50' : ''}`}>
            {/* Header with Price */}
            <div className="p-4 bg-gray-50/50 border-b border-gray-200 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Trip Fare</span>
                    <span className="font-bold text-2xl text-gray-800">{new Intl.NumberFormat().format(order.price)} MMK</span>
                </div>
                <div className="text-right">
                    <div className="font-bold text-lg text-gufa-blue-600">{order.distance.toFixed(1)} km</div>
                    <span className="text-sm text-gray-500">Pickup distance</span>
                </div>
            </div>

            {/* Body with Addresses */}
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                        <MapPin className="text-blue-500 h-6 w-6" />
                        <MoreVertical className="text-gray-300 h-8 w-8 -my-2" />
                        <MapPin className="text-red-500 h-6 w-6" />
                    </div>
                    <div className="flex-grow space-y-3">
                        <div className="-mt-1">
                            <p className="text-gray-500 text-sm">Pickup</p>
                            <p className="font-semibold text-gray-800 leading-tight">{order.pickup_address}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Dropoff</p>
                            <p className="font-semibold text-gray-800 leading-tight">{order.dropoff_address}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                    <div className="flex items-center text-gray-600">
                        <Box size={16} className="mr-2 flex-shrink-0 text-gray-400" />
                        <span>{order.cargo_description}</span>
                    </div>
                    {hasCoords && (
                        <a 
                            href={`https://www.google.com/maps/dir/${order.pickup_lat},${order.pickup_lng}/${order.dropoff_lat},${order.dropoff_lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                        >
                            <Map size={16} className="mr-1.5" />
                            View on Map
                        </a>
                    )}
                </div>
            </div>

            {/* Footer with Accept Button */}
            <div className="p-3 bg-gray-50">
                <button 
                    onClick={() => onAccept(order.id)} 
                    disabled={isSuspended}
                    className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg text-center text-lg flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                    ACCEPT ORDER
                </button>
            </div>
        </div>
    );
};

const AssignedOrderCard = ({ order, onCompleteClick }: { order: Order, onCompleteClick: (order: Order) => void }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gufa-blue-300 overflow-hidden">
        <div className="p-4">
             <div className="font-bold text-xl text-gray-800">{order.pickup_address} to {order.dropoff_address}</div>
             <div className="flex items-center text-gray-600 mt-2">
                <Box size={16} className="mr-2 flex-shrink-0" /> <span>{order.cargo_description}</span>
            </div>
        </div>
        <div className="p-2 bg-gray-50 grid grid-cols-3 gap-2">
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${order.pickup_lat},${order.pickup_lng}`} target="_blank" className="flex items-center justify-center bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 text-sm font-semibold"><Navigation size={16} className="mr-1"/> Pickup</a>
            <a href={`tel:${order.customer_phone}`} className="flex items-center justify-center bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 text-sm font-semibold"><Phone size={16} className="mr-1"/> Call</a>
            <button onClick={() => onCompleteClick(order)} className="flex items-center justify-center bg-gufa-blue-600 text-white py-2 rounded-md hover:bg-gufa-blue-700 text-sm font-semibold"><DollarSign size={16} className="mr-1"/> Deliver</button>
        </div>
    </div>
);
