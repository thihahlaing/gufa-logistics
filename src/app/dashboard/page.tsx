import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DriverDashboard from "@/components/DriverDashboard";
import MerchantDashboard from "@/components/MerchantDashboard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/"); // Redirect to home to login
  }

  const role = data.user.app_metadata?.role;

  if (role === 'driver') {
    console.log('Driver ID being queried:', data.user.id);
    let { data: profile } = await supabase.from('profiles').select('*, orders(*)').eq('id', data.user.id).single();
    
    if (!profile) {
        console.log('Profile not found in DB, injecting dummy profile for UI testing.');
        profile = {
            id: data.user.id,
            balance: 0,
            status: 'active',
            orders: [] 
        };
    }

    const assignedOrders = profile.orders.filter((o: any) => o.status === 'assigned') || [];
    const { data: availableOrders } = await supabase.from('orders').select('*').eq('status', 'pending');

    return <DriverDashboard user={data.user} profile={profile} initialAssignedOrders={assignedOrders} initialAvailableOrders={availableOrders || []} />
  }

  if (role === 'merchant') {
      return <MerchantDashboard user={data.user} />;
  }

  // Fallback for no role or unknown role
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">Role not found or is invalid. Please log in again.</p>
    </div>
  );
}
