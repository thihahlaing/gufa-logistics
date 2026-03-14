'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function acceptOrder(orderId: number) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not found, cannot accept order.");
    }
    
    // In a real app, you would fetch the order price and calculate commission
    const MOCK_COMMISSION = 500; // Mock commission

    // Mock updating the order status
    console.log(`Order ${orderId} accepted by ${user.id}. Commission: ${MOCK_COMMISSION}`);
    
    // Mock updating driver's balance
    console.log(`Deducting ${MOCK_COMMISSION} from ${user.id}'s balance.`);

    revalidatePath('/driver/dashboard');

    return { error: null, commission: MOCK_COMMISSION };
}

export async function createOrder(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: { message: 'Authentication required' } };
    }

    try {
        const price = parseFloat(formData.get('price') as string);
        if (isNaN(price)) {
            throw new Error("Price must be a valid number.")
        }

        const orderData = {
            sender_id: user.id,
            pickup_address: formData.get('pickup_address') as string,
            dropoff_address: formData.get('dropoff_address') as string,
            cargo_description: formData.get('cargo_description') as string,
            price: price,
            delivery_window: formData.get('delivery_window') as string,
            customer_phone: formData.get('customer_phone') as string,
            pickup_lat: parseFloat(formData.get('pickup_lat') as string) || 16.8409, 
            pickup_lng: parseFloat(formData.get('pickup_lng') as string) || 96.1735,
            dropoff_lat: parseFloat(formData.get('dropoff_lat') as string) || 16.7968,
            dropoff_lng: parseFloat(formData.get('dropoff_lng') as string) || 96.1629,
        };

        const { error } = await supabase.from('orders').insert(orderData);

        if (error) {
            throw new Error(error.message);
        }

        revalidatePath('/dashboard');
        revalidatePath('/my-orders');
        return { error: null };

    } catch (error: any) {
        console.error('Error creating order:', error);
        return { error: { message: error.message } };
    }
}

export async function completeOrder(orderId: number, cashCollected: number) {
    'use server';
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not found.");

    const commission = cashCollected * 0.15;
    const debtThreshold = -30000;

    // Update the order itself
    const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'delivered', cash_collected: cashCollected, order_commission: commission })
        .eq('id', orderId);

    if (orderError) throw new Error(orderError.message);

    // Get driver's current balance
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();

    if (profileError) throw new Error(profileError.message);

    const newBalance = (profile.balance || 0) - commission;
    const newStatus = newBalance < debtThreshold ? 'suspended' : 'active';

    // Update driver's balance and status
    const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ balance: newBalance, status: newStatus })
        .eq('id', user.id);

    if (updateProfileError) throw new Error(updateProfileError.message);

    revalidatePath('/dashboard');
}

export async function acceptOrder(orderId: number) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not found, cannot accept order.");
    }

    const { error } = await supabase
        .from('orders')
        .update({ status: 'assigned', driver_id: user.id })
        .eq('id', orderId);

    if (error) {
        console.error('Error accepting order:', error);
        throw new Error(error.message);
    }

    revalidatePath('/dashboard');
}
