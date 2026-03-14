import { CargoSelection } from "@/components/order/CargoSelection";
import { AddressInput } from "@/components/order/AddressInput";
import { EstimatedPrice } from "@/components/order/EstimatedPrice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-gray-100 p-4">
      {/* Map placeholder */}
      <div className="absolute inset-0 bg-gray-300 z-0"></div>

      <div className="relative z-10 flex justify-center items-start pt-10">
        <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Create a New Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <AddressInput label="Pickup Location" />
              <AddressInput label="Dropoff Location" />
              <CargoSelection />
              <EstimatedPrice />
              <Button type="submit" className="w-full text-lg py-6">Confirm Order</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}