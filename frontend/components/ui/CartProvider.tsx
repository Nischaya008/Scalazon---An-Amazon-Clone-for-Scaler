'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner';

export type CartItem = {
  id: string; // id of the cart_item row
  product_id: string;
  quantity: number;
  product: {
    title: string;
    price: number;
    mrp: number;
    discount: number;
    image: string;
    delivery_date: string;
    tag?: string;
  };
};

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, newQuantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const supabase = createClient();

  // Calculated fields
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const fetchCart = async () => {
    if (!session?.user) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Map the relational data payload
      const formattedData = data.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: {
          title: item.product.title,
          price: item.product.price,
          mrp: item.product.mrp,
          discount: item.product.discount,
          image: item.product.images?.[0], // Get first image
          delivery_date: item.product.delivery_date,
          tag: item.product.tag
        }
      }));
      setCartItems(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!session?.user) {
       toast.error('Sign in required', { description: 'Please sign in to add items to your cart.' });
       return;
    }

    try {
      // Check if product already in cart
      const existingItem = cartItems.find((item) => item.product_id === productId);
      
      if (existingItem) {
        // Update existing item
        const newQuantity = existingItem.quantity + quantity;
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', existingItem.id);
          
        if (error) throw error;
        
        // Optimistic update
        setCartItems(prev => prev.map(item => 
          item.id === existingItem.id ? { ...item, quantity: newQuantity } : item
        ));
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: session.user.id,
            product_id: productId,
            quantity: quantity,
          })
          .select('*, product:products(*)')
          .single();
          
        if (error) throw error;
        
        // Format new item
        const newItem: CartItem = {
           id: data.id,
           product_id: data.product_id,
           quantity: data.quantity,
           product: {
             title: data.product.title,
             price: data.product.price,
             mrp: data.product.mrp,
             discount: data.product.discount,
             image: data.product.images?.[0],
             delivery_date: data.product.delivery_date,
             tag: data.product.tag
           }
        };

        // Optimistic update
        setCartItems(prev => [newItem, ...prev]);
      }
      
      // Open sidebar side effect when adding (we do this regardless of existing or new)
      setIsSidebarOpen(true);
      
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to add to cart', { description: err.message });
      // Re-fetch to sync with truth
      fetchCart();
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      // Optimistic update
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);
        
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to remove item');
      fetchCart(); // rollback
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      // Optimistic update
      setCartItems(prev => prev.map(item => 
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      ));

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId);

      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to update quantity');
      fetchCart(); // rollback
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      subtotal,
      isSidebarOpen,
      setIsSidebarOpen,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
