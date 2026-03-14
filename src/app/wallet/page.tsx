import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const MerchantWallet = () => (
    <Card>
        <CardHeader>
            <CardTitle>Merchant Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-2xl font-bold">Balance: 150,000 MMK</p>
            <Button className="w-full">Deposit Funds</Button>
        </CardContent>
    </Card>
);

const DriverWallet = () => (
    <Card>
        <CardHeader>
            <CardTitle>Driver Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 bg-green-100 rounded-lg">
                <p className="text-sm text-green-800">Total Earned Today</p>
                <p className="text-3xl font-bold text-green-900">25,500 MMK</p>
            </div>
            <Button className="w-full">Withdraw Earnings</Button>
        </CardContent>
    </Card>
);

export default async function WalletPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/');
    }

    const role = user.app_metadata?.role;

    return (
        <div className="container mx-auto p-4 max-w-md">
             <h1 className="text-3xl font-bold mb-6 text-center">My Wallet</h1>
            {role === 'merchant' && <MerchantWallet />}
            {role === 'driver' && <DriverWallet />}
            {role !== 'merchant' && role !== 'driver' && (
                <p>No wallet information available for your user role.</p>
            )}
        </div>
    );
}