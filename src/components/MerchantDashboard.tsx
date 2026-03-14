'use client'

import { useState, useTransition } from 'react';
import { createOrder } from '@/app/actions';
import { Truck, X, PlusCircle } from 'lucide-react';
import AddressInput from './AddressInput'; // Import the new component
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('./MapPicker'), { ssr: false });

type Position = { lat: number; lng: number; };

export default function MerchantDashboard({ user }: { user: any }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [mapState, setMapState] = useState<{ isOpen: boolean; target: 'pickup' | 'dropoff' | null }>({ isOpen: false, target: null });

    const [pickupLocation, setPickupLocation] = useState<{ address: string; position: Position | null }>({ address: '', position: null });
    const [dropoffLocation, setDropoffLocation] = useState<{ address: string; position: Position | null }>({ address: '', position: null });

    // This component is now fully client-side for the modal interaction.
    // We will trigger a server action to create the order.

    const handleMapSelect = (position: Position, address: string) => {
        if (mapState.target === 'pickup') {
            setPickupLocation({ address, position });
        } else if (mapState.target === 'dropoff') {
            setDropoffLocation({ address, position });
        }
        setMapState({ isOpen: false, target: null });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-gufa-blue-800 text-white shadow-md">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold flex items-center"><Truck className="mr-3" />Merchant Dashboard</h1>
                    <span>{user.email}</span>
                </nav>
            </header>

            <main className="container mx-auto p-6">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Merchant Dashboard</h2>
                        <a href="/my-orders" className="text-gufa-blue-600 hover:underline">View My Orders</a>
                    </div>
                    <div className="flex justify-between items-center mb-6 pt-4">
                        <h3 className="text-xl font-bold text-gray-700">Create a New Order</h3>
                        <button onClick={() => setIsModalOpen(true)} className="bg-gufa-blue-600 hover:bg-gufa-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"><PlusCircle size={20} className="mr-2" />New Order</button>
                    </div>
                    <p className="text-gray-600">Click the button to open the form and create a new delivery order. The order will then be available for drivers to accept.</p>
                </div>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4"><X size={24} /></button>
                        <h3 className="text-2xl font-bold mb-6">New Delivery Details</h3>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setErrorMessage(null);
                                    const formData = new FormData(e.currentTarget);
                                    // Manually append location data
                                    formData.append('pickup_address', pickupLocation.address);
                                    formData.append('dropoff_address', dropoffLocation.address);
                                    if (pickupLocation.position) {
                                        formData.append('pickup_lat', pickupLocation.position.lat.toString());
                                        formData.append('pickup_lng', pickupLocation.position.lng.toString());
                                    }
                                    if (dropoffLocation.position) {
                                        formData.append('dropoff_lat', dropoffLocation.position.lat.toString());
                                        formData.append('dropoff_lng', dropoffLocation.position.lng.toString());
                                    }

                                    startTransition(async () => {
                                        const result = await createOrder(formData);
                                        if (result?.error?.message) {
                                            setErrorMessage(result.error.message);
                                        } else {
                                            setIsModalOpen(false);
                                        }
                                    });
                                }}
                            >
                            {errorMessage && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-md">
                                    <p>{errorMessage}</p>
                                </div>
                            )}
                           <div className="grid grid-cols-1 gap-6">
                                <AddressInput 
                                    label="Pickup Address"
                                    value={pickupLocation.address}
                                    onMapOpen={() => setMapState({ isOpen: true, target: 'pickup' })}
                                />
                                <AddressInput 
                                    label="Dropoff Address"
                                    value={dropoffLocation.address}
                                    onMapOpen={() => setMapState({ isOpen: true, target: 'dropoff' })}
                                />
                                <div>
                                    <label className="block text-sm font-medium">Cargo Description</label>
                                    <input type="text" name="cargo_description" placeholder="e.g., 2 boxes of documents" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gufa-blue-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                <div>
                                    <label className="block text-sm font-medium">Price (MMK)</label>
                                    <input type="number" name="price" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gufa-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Delivery Window</label>
                                    <input type="text" name="delivery_window" placeholder="e.g., 2-4 PM" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gufa-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Customer Phone</label>
                                    <input type="tel" name="customer_phone" placeholder="09..." required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gufa-blue-500" />
                                </div>
                            </div>



                            <div className="mt-8 flex justify-end">
                                <button type="submit" disabled={isPending} className="bg-gufa-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {isPending ? 'Creating...' : 'Create Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {mapState.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-medium">Select {mapState.target} Location</h3>
                             <button onClick={() => setMapState({ isOpen: false, target: null })}><X size={24} /></button>
                        </div>
                        <div className="flex-grow">
                           <MapPicker onSelect={handleMapSelect} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
