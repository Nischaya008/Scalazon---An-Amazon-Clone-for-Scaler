'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner';

type WishlistItem = {
  id: string; // The row ID of the item mapping
  product_id: string;
  wishlist_id: string;
  created_at: string;
  product: any; // The joined product data
};

type WishlistType = {
  id: string;
  name: string;
  is_default: boolean;
  visibility: string;
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  activeWishlist: WishlistType | null;
  isInWishlist: (productId: string) => boolean;
  toggleWishlistItem: (productId: string) => Promise<void>;
  fetchWishlist: () => Promise<void>;
  loading: boolean;
};

const WishlistContext = createContext<WishlistContextType>({
  wishlistItems: [],
  activeWishlist: null,
  isInWishlist: () => false,
  toggleWishlistItem: async () => { },
  fetchWishlist: async () => { },
  loading: true,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [activeWishlist, setActiveWishlist] = useState<WishlistType | null>(null);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const supabase = createClient();

  // Create a default list if none exists
  const getOrCreateWishlist = async () => {
    if (!session?.user) return null;

    // Check for existing
    const { data: existingLists } = await supabase
      .from('wishlists')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true })
      .limit(1);

    if (existingLists && existingLists.length > 0) {
      return existingLists[0];
    }

    // Create new
    const { data: newList, error } = await supabase
      .from('wishlists')
      .insert({
        user_id: session.user.id,
        name: 'Wishlist', // From design requirement defaults!
        is_default: true,
        visibility: 'Public'
      })
      .select()
      .single();

    if (!error) return newList;
    return null;
  };

  const fetchWishlist = async () => {
    if (!session?.user) {
      setWishlistItems([]);
      setActiveWishlist(null);
      setLoading(false);
      return;
    }
    setLoading(true);

    const list = await getOrCreateWishlist();
    if (list) {
      setActiveWishlist(list);
      const { data: items } = await supabase
        .from('wishlist_items')
        .select('*, product:products(*)')
        .eq('wishlist_id', list.id)
        .order('created_at', { ascending: false });

      if (items) setWishlistItems(items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  const toggleWishlistItem = async (productId: string) => {
    if (!session?.user) {
      toast.error('Sign in required', { description: 'Please sign in to add items to your Wishlist.' });
      return;
    }
    if (!activeWishlist) return;

    const existingItem = wishlistItems.find(item => item.product_id === productId);

    if (existingItem) {
      // Optimistic delete
      setWishlistItems(prev => prev.filter(i => i.product_id !== productId));

      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', existingItem.id);

      if (error) {
        toast.error('Failed to remove from wishlist');
        fetchWishlist(); // Revert
      } else {
        toast.success('Removed from List');
      }
    } else {
      // Optimistic add
      // We don't have the full product joined yet, so we just lock it to re-fetch after, 
      // but UI heart updates immediately via optimistic id trick.

      const optimisticItem = {
        id: 'temp-' + productId,
        product_id: productId,
        wishlist_id: activeWishlist.id,
        created_at: new Date().toISOString(),
        product: null // Mocking
      };

      setWishlistItems(prev => [optimisticItem as WishlistItem, ...prev]);

      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          wishlist_id: activeWishlist.id,
          product_id: productId
        });

      if (error) {
        toast.error('Item already in list or network error');
        setWishlistItems(prev => prev.filter(i => i.id !== 'temp-' + productId));
      } else {
        toast.success('Added to List');
        fetchWishlist(); // Real fetch to get joined product mappings
      }
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      activeWishlist,
      isInWishlist,
      toggleWishlistItem,
      fetchWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
