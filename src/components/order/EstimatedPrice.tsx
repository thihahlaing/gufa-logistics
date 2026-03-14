"use client";

import { Button } from "@/components/ui/button";

export function EstimatedPrice() {
  // In a real application, this would be calculated based on the address inputs.
  const estimatedPrice = "5,000 MMK";

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">Estimated Price</p>
        <p className="text-2xl font-bold">{estimatedPrice}</p>
      </div>
      <Button className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold">
        Place Order
      </Button>
    </div>
  );
}
