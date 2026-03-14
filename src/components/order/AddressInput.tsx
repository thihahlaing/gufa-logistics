"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

// This is a placeholder for the Google Places Autocomplete functionality.
// To fully implement this, you would use a library like 'react-google-places-autocomplete'
// and provide a Google Maps API key.

export function AddressInput() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="pickup" className="text-sm font-semibold">Pickup Location</Label>
        <div className="relative mt-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input id="pickup" placeholder="Enter a pickup location" className="pl-10" />
        </div>
      </div>
      <div>
        <Label htmlFor="dropoff" className="text-sm font-semibold">Dropoff Location</Label>
        <div className="relative mt-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input id="dropoff" placeholder="Enter a dropoff location" className="pl-10" />
        </div>
      </div>
    </div>
  );
}
