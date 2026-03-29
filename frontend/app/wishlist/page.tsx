'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWishlist } from '@/components/ui/WishlistProvider';
import { useAuth } from '@/components/ui/AuthProvider';
import { useCart } from '@/components/ui/CartProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Search, Trash2, Share, Move, ChevronDown, Check } from 'lucide-react';

function WishlistContent() {
   const { wishlistItems, activeWishlist, toggleWishlistItem, loading, fetchWishlist } = useWishlist();
   const { session, isLoading: authLoading } = useAuth();
   const { addToCart } = useCart();
   const router = useRouter();
   const [addedItemToCart, setAddedItemToCart] = useState<string | null>(null);

   useEffect(() => {
      if (!authLoading && !session?.user) {
         router.push('/enter');
      }
   }, [session, authLoading, router]);

   const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
      e.preventDefault();
      await addToCart(productId, 1);
      setAddedItemToCart(productId);
      setTimeout(() => setAddedItemToCart(null), 2000);
   };

   const renderStars = (rating: number, size = 16) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
         stars.push(<Star key={i} size={size} className={i <= Math.round(rating) ? "fill-[#de7921] text-[#de7921]" : "text-gray-300"} />);
      }
      return stars;
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-GB', {
         day: 'numeric',
         month: 'long',
         year: 'numeric'
      });
   };

   if (authLoading || loading || !session?.user) {
      return <div className="min-h-screen bg-white"><Header /><div className="p-10 text-center">Loading your lists...</div><Footer /></div>;
   }

   return (
      <div className="min-h-screen bg-white font-[Arial,sans-serif]">
         <Header />

         {/* Top Banner Tabs */}
         <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
            <div className="max-w-[1280px] mx-auto px-4 flex gap-6 text-[15px]">
               <div className="py-3 border-b-[3px] border-[#007185] font-bold text-[#007185] cursor-pointer">Your Lists</div>
               <div className="py-3 text-[#0f1111] hover:text-[#c45500] hover:underline cursor-pointer">Your Friends</div>
               <div className="ml-auto flex items-center">
                  <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer text-sm font-medium">Create a List</span>
               </div>
            </div>
         </div>

         <main className="max-w-[1280px] mx-auto p-4 flex flex-col md:flex-row gap-6 mt-4">

            {/* Left Column (Lists Navigation) */}
            <div className="w-full md:w-[260px] flex-shrink-0">
               <div className="border border-transparent bg-gray-50 flex flex-col rounded-sm">
                  <div className="flex justify-between items-center p-3 cursor-pointer border-l-[4px] border-[#e77600] bg-[#f0f2f2]">
                     <div className="flex flex-col">
                        <span className="font-bold text-[14px] text-[#0f1111]">{activeWishlist?.name || 'Shopping List'}</span>
                        <span className="text-[12px] text-[#565959]">Default List</span>
                     </div>
                     <span className="text-[12px] text-[#565959] bg-gray-200 px-1.5 py-0.5 rounded-sm">{activeWishlist?.visibility || 'Private'}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 border-l-[4px] border-transparent">
                     <span className="font-medium text-[14px] text-[#0f1111]">Other Lists</span>
                     <span className="text-[12px] text-[#565959]">Shared</span>
                  </div>
               </div>
            </div>

            {/* Main Column (List Content) */}
            <div className="flex-1 min-w-0 border border-t-0 sm:border border-gray-200 rounded-sm p-0 sm:p-5">

               {/* Header Block */}
               <div className="flex flex-col gap-2 pb-4 border-b border-gray-200 px-4 sm:px-0 mt-4 sm:mt-0">
                  <div className="flex justify-between items-start">
                     <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-[20px] sm:text-[24px] font-normal text-[#0f1111] leading-tight w-full sm:w-auto">
                           {activeWishlist?.name || 'Shopping List'}
                        </h1>
                        <span className="text-[12px] text-[#565959] bg-[#f0f2f2] px-2 py-0.5 rounded-full">{activeWishlist?.visibility || 'Private'}</span>
                     </div>

                     <div className="hidden sm:flex gap-2">
                        <button className="text-[13px] bg-white border border-[#D5D9D9] hover:bg-gray-50 px-3 py-1 rounded-full shadow-sm font-medium">Add item</button>
                        <button className="text-[13px] bg-white border border-[#D5D9D9] hover:bg-gray-50 p-1.5 rounded-full shadow-sm"><Share size={16} /></button>
                        <button className="text-[13px] bg-white border border-[#D5D9D9] hover:bg-gray-50 p-1.5 rounded-full shadow-sm">...</button>
                     </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                     <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                        👤
                     </div>
                     <button className="flex items-center gap-1 text-[#007185] hover:text-[#c45500] text-[14px]">
                        <span className="text-xl leading-none font-light">+</span> Invite
                     </button>
                  </div>
                  <p className="text-[13px] text-[#565959] italic mt-2">"These are my wishlisted products."</p>
               </div>

               {/* Filters Bar */}
               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-3 bg-white gap-3 px-4 sm:px-0">
                  <div className="flex items-center gap-2 border-b-2 border-[#e77600] pb-1 w-max">
                     <span className="w-4 h-4 bg-gray-800 rounded-sm block"></span>
                     <span className="w-4 h-4 bg-gray-300 rounded-sm block"></span>
                     <span className="w-4 h-4 bg-gray-300 rounded-sm block"></span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[13px]">
                     <div className="flex items-center border border-[#D5D9D9] rounded-md h-[30px] overflow-hidden bg-white shadow-sm w-full lg:w-[200px]">
                        <span className="px-2 text-gray-500"><Search size={14} /></span>
                        <input type="text" placeholder="Search this list" className="w-full h-full outline-none pr-2 text-[13px]" />
                     </div>

                     <div className="border border-[#D5D9D9] bg-[#F0F2F2] hover:bg-[#e3e6e6] rounded-md h-[30px] flex items-center px-3 cursor-pointer shadow-sm w-[48%] lg:w-auto mt-2 lg:mt-0">
                        <span className="truncate">Show: Unpurchased</span> <ChevronDown size={14} className="ml-2 flex-shrink-0" />
                     </div>

                     <div className="border border-[#D5D9D9] bg-[#F0F2F2] hover:bg-[#e3e6e6] rounded-md h-[30px] flex items-center px-3 cursor-pointer shadow-sm w-[48%] lg:w-auto mt-2 lg:mt-0">
                        <span className="truncate">Sort by: Most recently added</span> <ChevronDown size={14} className="ml-2 flex-shrink-0" />
                     </div>
                  </div>
               </div>

               {/* Products List */}
               <div className="flex flex-col border-t border-gray-200">

                  {wishlistItems.length === 0 ? (
                     <div className="py-16 text-center text-[#565959]">
                        <p className="text-[18px] mb-2">There are no items in this list.</p>
                        <Link href="/search" className="text-[#007185] hover:underline text-[14px]">Discover items to add</Link>
                     </div>
                  ) : (
                     wishlistItems.map((item) => (
                        <div key={item.id} className="flex flex-col md:flex-row gap-4 py-6 border-b border-gray-100 last:border-0 px-4 sm:px-0">

                           {/* Item Image */}
                           <div className="w-[120px] md:w-[160px] h-[120px] md:h-[160px] flex-shrink-0 mx-auto md:mx-0 cursor-pointer overflow-hidden p-2 relative mix-blend-multiply">
                              <img src={item.product?.image || item.product?.images?.[0]} alt="Product" className="w-full h-full object-contain" />
                              {item.product?.tag && (
                                 <div className="absolute top-2 left-2 bg-[#cc0c39] text-white text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-sm transform -rotate-12 w-max max-w-full truncate shadow-sm">
                                    {item.product?.tag}
                                 </div>
                              )}
                           </div>

                           {/* Item Details */}
                           <div className="flex-1 flex flex-col mt-2 md:mt-0 relative group">
                              <Link href={`/product/${item.product_id}`} className="text-[15px] sm:text-[16px] text-[#007185] hover:text-[#c45500] hover:underline leading-snug font-medium mb-1 pr-8 line-clamp-3">
                                 {item.product?.title || 'Loading item data...'}
                              </Link>
                              <div className="text-[13px] text-[#0f1111] mb-1">by <span className="text-[#007185] hover:underline cursor-pointer">{item.product?.brand || 'Amazon'}</span> (Unknown Binding)</div>

                              <div className="flex items-center gap-1 mb-1">
                                 <div className="flex">{renderStars(item.product?.rating || 4, 14)}</div>
                                 <ChevronDown size={12} className="text-gray-500" />
                                 <span className="text-[13px] text-[#007185] ml-1">{item.product?.reviews || '4'}</span>
                              </div>

                              <div className="flex items-center gap-2 mb-3">
                                 <span className="text-[18px] sm:text-[20px] font-bold text-[#b12704]">₹{item.product?.price?.toLocaleString('en-IN')}.00</span>
                                 <span className="bg-[#002f36] text-white font-bold text-[10px] sm:text-[11px] px-1 py-0.5 rounded-sm italic ml-1">
                                    <Check size={8} className="inline mr-0.5" strokeWidth={4} />
                                    Fulfilled
                                 </span>
                                 <span className="text-[12px] font-bold">FREE Delivery.</span>
                                 <span className="text-[12px] text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">Details</span>
                              </div>

                              <div className="text-[12px] text-[#565959] mb-4">
                                 Item added {formatDate(item.created_at)}
                              </div>

                              {/* Action Buttons Row */}
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-auto">
                                 <button
                                    onClick={(e) => handleAddToCart(e, item.product_id)}
                                    className={`px-4 sm:px-5 py-1.5 sm:py-2 text-[12px] sm:text-[13px] font-medium rounded-full shadow-sm border flex items-center gap-1 transition-colors w-max 
                              ${addedItemToCart === item.product_id ? 'bg-[#f0f2f2] border-[#D5D9D9]' : 'bg-[#FFD814] hover:bg-[#F7CA00] border-[#FCD200]'}`}
                                 >
                                    {addedItemToCart === item.product_id ? <><Check size={14} /> Added</> : 'Add to Cart'}
                                 </button>

                                 <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white hover:bg-gray-50 border border-[#D5D9D9] rounded-full shadow-sm text-[12px] sm:text-[13px] text-[#0f1111] font-medium">
                                    Add a note
                                 </button>

                                 <button className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#D5D9D9] rounded-full shadow-sm text-[13px] text-[#0f1111] font-medium flex items-center justify-between min-w-[70px]">
                                    Move <ChevronDown size={14} />
                                 </button>

                                 <button className="p-2 sm:p-2 bg-white hover:bg-gray-50 border border-[#D5D9D9] rounded-full shadow-sm min-w-[34px] flex justify-center text-gray-700">
                                    <Share size={16} />
                                 </button>

                                 <button
                                    onClick={() => toggleWishlistItem(item.product_id)}
                                    className="p-2 sm:p-2 bg-white hover:bg-gray-50 border border-[#D5D9D9] rounded-full shadow-sm focus:outline-none min-w-[34px] flex justify-center text-gray-700 hover:text-red-600 transition-colors"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>

                              {/* Drag handler handle mimicking UI */}
                              <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-0 flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-gray-400">
                                 <span className="block w-4 h-1 border-t border-b border-gray-400"></span>
                                 <span className="block w-4 h-1 border-b border-gray-400"></span>
                              </div>
                           </div>

                        </div>
                     ))
                  )}
               </div>
            </div>
         </main>

         <Footer />
      </div>
   );
}

export default function WishlistPage() {
   return (
      <Suspense fallback={<div className="min-h-screen bg-white p-10 text-center text-[#565959]">Loading Wishlist...</div>}>
         <WishlistContent />
      </Suspense>
   );
}
