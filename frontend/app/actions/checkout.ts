'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function placeOrder(userId: string) {
  try {
    const supabase = await createClient();
    
    // 1. Fetch current cart
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId);
      
    if (cartError || !cartItems || cartItems.length === 0) {
      return { error: 'Cart is empty or could not be fetched.' };
    }
    
    // 2. Calculate Total
    const totalAmount = cartItems.reduce((acc, item: any) => acc + (item.product.price * item.quantity), 0);
    
    // 3. Insert Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: 'Processing'
      })
      .select()
      .single();
      
    if (orderError) return { error: 'Failed to create order.' };
    
    // 4. Insert Order Items
    const orderItemsData = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.product.price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);
      
    if (itemsError) return { error: 'Failed to create order items.' };
    
    // 5. Clear Cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
      
    // 6. Trigger Supabase Email Template (Masquerading as Order Email)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        // We use Magic Link/OTP because inviteUser throws if user already exists
        await supabase.auth.signInWithOtp({
          email: user.email,
          options: {
            data: {
              orderId: order.id,
              totalAmount: totalAmount
            }
          }
        });
      }
    } catch (e) {
      console.error("Supabase Email Error:", e);
    }
      
    // Revalidate paths so UI responds fresh
    revalidatePath('/', 'layout');
    
    return { success: true, orderId: order.id, totalAmount, items: cartItems };
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred' };
  }
}
