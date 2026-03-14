"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Motorbike, Car, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

const cargoTypes = [
  { name: 'Bike', icon: Motorbike },
  { name: 'Car', icon: Car },
  { name: 'Truck', icon: Truck },
];

export function CargoSelection() {
  const [selectedVehicle, setSelectedVehicle] = useState('Motorbike');

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Select Vehicle</h3>
      <div className="grid grid-cols-3 gap-4">
        {cargoTypes.map((vehicle) => {
          const Icon = vehicle.icon;
          return (
            <Card
              key={vehicle.name}
              onClick={() => setSelectedVehicle(vehicle.name)}
              className={cn(
                'cursor-pointer transition-all',
                selectedVehicle === vehicle.name
                  ? 'ring-2 ring-primary shadow-lg'
                  : 'hover:shadow-md'
              )}
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Icon className="w-12 h-12 mb-2" />
                <span className="font-semibold">{vehicle.name}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}