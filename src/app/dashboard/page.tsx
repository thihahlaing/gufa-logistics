import { CargoSelection } from "@/components/order/CargoSelection";
import { AddressInput } from "@/components/order/AddressInput";
import { EstimatedPrice } from "@/components/order/EstimatedPrice";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 h-screen bg-gray-50">
      {/* Left Panel: Order Details */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full">
          <h2 className="text-2xl font-bold mb-6">Create a New Order</h2>
          
          <div className="space-y-6 flex-grow">
            <AddressInput />
            <CargoSelection />
          </div>

          <div className="mt-6">
            <EstimatedPrice />
          </div>
        </div>
      </div>

      {/* Right Panel: Interactive Map */}
      <div className="lg:col-span-2 bg-gray-200 rounded-xl shadow-lg flex items-center justify-center h-full">
        <p className="text-gray-500">Map will be displayed here.</p>
      </div>
    </div>
  );
}