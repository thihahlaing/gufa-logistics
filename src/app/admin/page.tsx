import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from 'next/link';

export default async function AdminPage({ searchParams }: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Debug log as requested
    console.log('Current User Role:', user?.app_metadata?.role);

    if (user?.app_metadata?.role !== 'admin') {
        return redirect('/');
    }

    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (searchParams.status) {
        query = query.eq('status', searchParams.status);
    }

    const { data: orders, error } = await query;

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-gray-800 text-white shadow-md">
                 <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <span>{user.email}</span>
                </nav>
            </header>
            <main className="container mx-auto p-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">All Orders</h2>
                    <div className="flex space-x-2 mb-4">
                        <Link href="/admin" className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300">All</Link>
                        <Link href="/admin?status=pending" className="px-3 py-1 rounded-md bg-yellow-200 hover:bg-yellow-300">Pending</Link>
                        <Link href="/admin?status=assigned" className="px-3 py-1 rounded-md bg-blue-200 hover:bg-blue-300">Assigned</Link>
                        <Link href="/admin?status=delivered" className="px-3 py-1 rounded-md bg-green-200 hover:bg-green-300">Delivered</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Route</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Cash Collected</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders?.map((order: any) => (
                                    <tr key={order.id}>
                                        <td className="px-4 py-2">{order.id}</td>
                                        <td className="px-4 py-2">{order.pickup_address} to {order.dropoff_address}</td>
                                        <td className="px-4 py-2">{order.status}</td>
                                        <td className="px-4 py-2">{order.cash_collected ? `$${order.cash_collected}` : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
