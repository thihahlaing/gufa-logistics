'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { acceptOrder } from '@/app/actions';
import { useToast } from '@/components/ui/use-toast';

interface Order {
  id: number;
  pickup_address: string;
  dropoff_address: string;
  price: number;
}

export function OrderFlashCard({ order, onAccept }: { order: Order, onAccept: (orderId: number) => void }) {
  const [timeLeft, setTimeLeft] = useState(60);
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAccept = async () => {
    const result = await acceptOrder(order.id);
    if (result.error) {
        toast({
            title: 'Error Accepting Order',
            description: result.error.message,
            variant: 'destructive',
        });
    } else {
        toast({
            title: 'Order Accepted!',
            description: `Commission of ${result.commission} MMK deducted.`,
        });
        onAccept(order.id);
    }
  };

  return (
    <Card className="animate-pulse-slow border-green-500">
      <CardHeader>
        <CardTitle>New Order Available!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <p className="font-bold">Route:</p>
            <p>{order.pickup_address} → {order.dropoff_address}</p>
        </div>
        <div>
            <p className="font-bold">Fare:</p>
            <p className="text-xl text-green-600">{order.price.toLocaleString()} MMK</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-yellow-600">
            <Clock className="w-5 h-5" />
            <span>{timeLeft}s remaining</span>
        </div>
        <Button onClick={handleAccept} disabled={timeLeft === 0} className="bg-green-600 hover:bg-green-700">
          One-Click Accept
        </Button>
      </CardFooter>
    </Card>
  );
}