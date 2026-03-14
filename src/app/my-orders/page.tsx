import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Truck } from 'lucide-react';

export default async function MyOrdersPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('sender_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return <p>Error loading orders: {error.message}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gufa-blue-800 text-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center"><Truck className="mr-3" />My Orders</h1>
          <a href="/dashboard" className="hover:underline">Back to Dashboard</a>
        </nav>
      </header>
      <main className="container mx-auto p-6">
         <div className="bg-white p-8 rounded-xl shadow-lg">
             <h2 className="text-3xl font-bold text-gray-800 mb-6">Order History</h2>
             <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                        <p><strong>Route:</strong> {order.pickup_address} to {order.dropoff_address}</p>
                        <p><strong>Cargo:</strong> {order.cargo_description}</p>
                        <p><strong>Status:</strong> <span className="font-semibold">{order.status}</span></p>
                        {order.status === 'delivered' && <p><strong>Cash Collected:</strong> ${order.cash_collected}</p>}
                    </div>
                ))}
                {orders.length === 0 && <p>You have not created any orders.</p>}
             </div>
         </div>
      </main>
    </div>
  );
}
