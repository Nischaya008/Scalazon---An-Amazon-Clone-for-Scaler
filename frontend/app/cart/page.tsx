"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Check, Trash2, ChevronDown, Star, MapPin
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/components/ui/CartProvider';
import { useAuth } from '@/components/ui/AuthProvider';
import { placeOrder } from '@/app/actions/checkout';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CartPage() {
  const { cartItems, cartCount, subtotal, removeFromCart, updateQuantity, fetchCart } = useCart();
  const { session } = useAuth();
  const router = useRouter();
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleProceedToBuy = () => {
    if (!session?.user) {
      toast.error('Sign in required', { description: 'Please sign in to place an order.' });
      return router.push('/enter');
    }
    if (cartItems.length === 0) {
       toast.error('Cart is empty');
       return;
    }
    setShowConfirmModal(true);
  };
  
  const confirmAndPlaceOrder = async () => {
    setIsCheckingOut(true);
    const result = await placeOrder(session!.user.id);
    
    if (result?.error) {
       toast.error(result.error);
       setIsCheckingOut(false);
       setShowConfirmModal(false);
       return;
    }
    
    try {
       // Proceed to cleanup UI. The backend checkout.ts handles the Supabase Email Trigger!
       toast.success('Order Placed Successfully!', { 
            description: 'Order details dispatched to your email!',
            duration: 4000
       });
    } catch(err) {
      console.error(err);
      toast.success('Order Placed Successfully!');
    }
    
    await fetchCart(); 
    setShowConfirmModal(false);
    setIsCheckingOut(false);
    router.push('/orders');
  };
  
  // Data mocks based on prompt details


  const savedItems = [
    {
      id: 101,
      title: "Jaspo Ride On 22\" Skateboard for Kids/Boys/Girls",
      image: "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?q=80&w=200&fit=crop",
      price: "899.00",
      stars: 4.0,
      ratings: "2,143",
      inStock: true
    },
    {
      id: 102,
      title: "Minimalist 10% Vitamin C Face Serum",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200&fit=crop",
      price: "664.00",
      stars: 4.5,
      ratings: "34,901",
      inStock: true
    }
  ];

  const renderStars = (rating: number, size = 14) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} size={size} className={i < Math.floor(rating) ? "fill-[#de7921] text-[#de7921]" : "text-gray-300"} />
    ));
  };

  return (
    <div className="min-h-screen bg-[#eaeded] font-[Arial,sans-serif] pb-12 relative">
      {/* Confirmation Modal Overlay */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
              <h2 className="text-xl font-bold text-[#0f1111] mb-2">Confirm Your Order?</h2>
              <p className="text-gray-600 mb-6">
                 Are you sure you want to officially place this order for <strong>₹{subtotal.toLocaleString('en-IN')}.00</strong> completely containing {cartCount} full items?
              </p>
              
              <div className="flex justify-end gap-3 font-medium">
                 <button 
                   onClick={() => setShowConfirmModal(false)}
                   disabled={isCheckingOut}
                   className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors cursor-pointer"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={confirmAndPlaceOrder}
                   disabled={isCheckingOut}
                   className="px-6 py-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                 >
                   {isCheckingOut ? 'Processing...' : 'Place Order'}
                 </button>
              </div>
           </div>
        </div>
      )}

      <Header />
      
      <main className="max-w-[1500px] mx-auto p-3 sm:p-4 lg:p-6 flex flex-col md:flex-row gap-5 items-start">
        
        {/* === LEFT COLUMN === */}
        <div className="flex-1 flex flex-col gap-5 w-full min-w-0">
          
          {/* Shopping Cart Container */}
          <div className="bg-white p-4 sm:p-5 shadow-sm rounded-sm">
             <div className="flex justify-between items-end border-b border-[#D5D9D9] pb-1 sm:pb-2 mb-4">
                <div>
                  <h1 className="text-[24px] sm:text-[28px] font-normal text-[#0f1111] leading-none mb-1">Shopping Cart</h1>
                  <span className="text-[#007185] hover:underline cursor-pointer text-[13px] sm:text-[14px]">
                    {cartCount === 0 ? 'Your Cart is empty.' : 'Deselect all items'}
                  </span>
                </div>
                <div className="hidden sm:block text-[14px] text-[#565959] text-right pb-1">Price</div>
             </div>

             {/* Cart Items List */}
             {cartItems.map((item, idx) => (
               <div key={item.id} className={`flex flex-col sm:flex-row py-4 ${idx !== cartItems.length - 1 ? 'border-b border-[#D5D9D9]' : ''}`}>
                  
                  <div className="flex gap-2 sm:gap-4 flex-1">
                     <div className="pt-1.5">
                        <input type="checkbox" defaultChecked className="w-[18px] h-[18px] shadow-sm accent-[#007185] cursor-pointer" />
                     </div>
                     <div className="flex-shrink-0 cursor-pointer">
                        <img src={item.product.image} className="w-[120px] sm:w-[150px] lg:w-[180px] object-contain mix-blend-multiply" alt={item.product.title} />
                     </div>
                     
                     <div className="flex-1 flex flex-col pt-1">
                        <div className="flex justify-between">
                           <Link href={`/product/${item.product_id}`} className="text-[16px] sm:text-[18px] text-[#007185] hover:text-[#c45500] hover:underline leading-snug line-clamp-2 md:line-clamp-none pr-4">
                              {item.product.title}
                           </Link>
                           {/* Price on md/desktop */}
                           <div className="hidden sm:block w-[100px] text-right font-bold text-[18px] text-[#0f1111]">
                              ₹{item.product.price.toLocaleString('en-IN')}.00
                           </div>
                        </div>

                        {/* Price block mobile */}
                        <div className="sm:hidden font-bold text-[18px] text-[#0f1111] mt-1">₹{item.product.price.toLocaleString('en-IN')}.00</div>
                        
                        {item.product.tag === "Limited time deal" && (
                           <div className="mt-1 flex items-center gap-2 text-[12px]">
                              <span className="bg-[#cc0c39] text-white font-bold px-1.5 py-0.5 rounded-[2px]">Limited time deal</span>
                           </div>
                        )}
                        <div className="text-[12px] mt-1 space-x-1 font-medium">
                           {item.product.discount && <span className="text-[#cc0c39] font-normal">-{item.product.discount}%</span>}
                           <span className="text-[#565959] font-normal line-through">M.R.P.: ₹{item.product.mrp.toLocaleString('en-IN')}.00</span>
                        </div>
                        
                        <div className="text-[12px] sm:text-[13px] mt-1 mb-1">
                           <span className="text-[#0f1111]">FREE delivery <span className="font-bold">{item.product.delivery_date}</span></span>
                        </div>
                        <div className="text-[12px] sm:text-[13px] text-[#007600] font-medium mb-1">
                           In stock
                        </div>

                        <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-[#0f1111] mb-2 sm:mb-4">
                           <input type="checkbox" className="w-3.5 h-3.5 accent-[#007185]" /> This will be a gift
                        </div>

                        {/* Actions Row */}
                        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3 xl:gap-4 mt-auto">
                           
                           {/* Quantity Spinbutton */}
                           <div className="flex bg-[#F0F2F2] border border-[#D5D9D9] rounded-[8px] sm:rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] h-[34px] w-max overflow-hidden items-center text-[13px] sm:text-[14px]">
                              <button onClick={() => removeFromCart(item.id)} className="h-full px-2.5 sm:px-3 flex items-center justify-center border-r border-[#D5D9D9] hover:bg-[#e3e6e6] cursor-pointer text-gray-700">
                                 <Trash2 size={15}/>
                              </button>
                              <div className="h-full px-3 sm:px-4 flex items-center justify-center bg-white font-medium border-r border-[#D5D9D9]">
                                 {item.quantity}
                              </div>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-full px-3 sm:px-4 flex items-center justify-center hover:bg-[#e3e6e6] cursor-pointer text-[#0f1111] font-bold pb-0.5">
                                 +
                              </button>
                           </div>

                           {/* Text Actions */}
                           <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 text-[11px] sm:text-[12px] text-[#007185] mt-2 xl:mt-0 font-medium">
                              <span onClick={() => removeFromCart(item.id)} className="hover:text-[#c45500] hover:underline cursor-pointer">Delete</span>
                              <span className="text-[#D5D9D9]">|</span>
                              <span className="hover:text-[#c45500] hover:underline cursor-pointer">Save for later</span>
                              <span className="text-[#D5D9D9]">|</span>
                              <span className="hover:text-[#c45500] hover:underline cursor-pointer">See more like this</span>
                              <span className="text-[#D5D9D9]">|</span>
                              <span className="hover:text-[#c45500] hover:underline cursor-pointer">Share</span>
                           </div>
                        </div>

                     </div>
                  </div>
               </div>
             ))}

             <div className="border-t border-[#D5D9D9] mt-2 pt-1 flex justify-end">
                <span className="text-[18px] sm:text-[20px] text-[#0f1111]">Subtotal ({cartCount} items): <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}.00</span></span>
             </div>
          </div>


          {/* Your Items / Saved for Later Container */}
          <div className="bg-white px-2 sm:px-4 pt-4 shadow-sm rounded-sm">
             <h2 className="text-[20px] sm:text-[24px] font-medium mb-3 sm:mb-4 px-2 text-[#0f1111]">Your Items</h2>
             
             {/* Tabs Header */}
             <div className="flex border-b border-[#D5D9D9] text-[13px] sm:text-[14px]">
                <div className="px-3 sm:px-4 py-2 border-b-2 border-[#e77600] font-bold text-[#0f1111] cursor-pointer">Saved for later (2 items)</div>
                <div className="px-3 sm:px-4 py-2 text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">Buy it again</div>
             </div>

             <div className="p-2 sm:p-4">
               {/* Categories Sub-filters */}
               <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                  <span className="bg-[#F0F2F2] border border-[#D5D9D9] hover:bg-[#e3e6e6] rounded-[8px] px-3 py-1 cursor-pointer text-[13px] font-medium shadow-sm">Skateboarding skateboards (1)</span>
                  <span className="bg-[#F0F2F2] border border-[#D5D9D9] hover:bg-[#e3e6e6] rounded-[8px] px-3 py-1 cursor-pointer text-[13px] font-medium shadow-sm">Serums (1)</span>
               </div>

               {/* Saved Grid */}
               <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                  {savedItems.map((item) => (
                    <div key={item.id} className="border border-[#D5D9D9] rounded-sm p-3 flex flex-col h-full bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                       <div className="w-full h-[140px] flex items-center justify-center mb-3 p-2">
                          <img src={item.image} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                       </div>
                       <Link href="#" className="text-[13px] sm:text-[14px] text-[#007185] hover:text-[#c45500] hover:underline line-clamp-2 leading-tight mb-1 font-medium">{item.title}</Link>
                       <div className="text-[16px] font-bold text-[#0f1111] mb-1">₹{item.price}</div>
                       
                       <div className="flex items-center gap-1 mb-1.5">
                         <div className="flex text-[#de7921]">{renderStars(item.stars, 12)}</div>
                         <ChevronDown size={10} className="text-gray-500" />
                         <span className="text-[11px] sm:text-[12px] text-[#007185]">{item.ratings}</span>
                       </div>
                       
                       <div className="text-[11px] sm:text-[12px] text-[#007600] mb-3">In stock</div>
                       
                       <div className="mt-auto flex flex-col gap-2 relative">
                         <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full py-1.5 text-[12px] sm:text-[13px] text-[#0f1111] shadow-sm font-medium h-[34px]">Move to cart</button>
                         <div className="flex justify-between text-[11px] sm:text-[12px] text-[#007185] font-medium px-1">
                            <span className="hover:text-[#c45500] hover:underline">Delete</span>
                            <span className="hover:text-[#c45500] hover:underline">Add to list</span>
                         </div>
                       </div>
                    </div>
                  ))}
               </div>
             </div>
          </div>

        </div>

        {/* === RIGHT COLUMN (Buy Box & Recs) === */}
        <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-5">
           
           {/* Buy Box */}
           <div className="bg-white p-4 sm:p-5 shadow-sm rounded-sm">
              
              {/* Green Progress */}
              <div className="flex gap-2 sm:gap-3 items-start mb-4 bg-[#F2Fbf6] border border-[#D5E1D8] p-2.5 rounded text-[13px]">
                 <div className="mt-0.5"><div className="bg-[#007600] rounded-full p-[2px]"><Check className="text-white" size={14} strokeWidth={3}/></div></div>
                 <div className="text-[#0f1111] leading-snug">
                    <span className="text-[#007600] font-bold mr-1">Your order is eligible for FREE Delivery.</span>
                    Choose FREE Delivery option at checkout.
                 </div>
              </div>

              <div className="text-[16px] sm:text-[18px] text-[#0f1111] mb-3 leading-tight text-center sm:text-left">
                 Subtotal ({cartCount} items): <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}.00</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-[13px] sm:text-[14px] text-[#0f1111] mb-5">
                 <input type="checkbox" className="w-[16px] h-[16px] accent-[#007185] shadow-sm rounded-sm" /> This order contains a gift
              </div>

              <button onClick={handleProceedToBuy} className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full py-2 h-[44px] text-[13px] sm:text-[14px] text-[#0f1111] shadow-sm font-medium mb-4 cursor-pointer">
                 Proceed to Buy
              </button>

              <div className="border border-[#D5D9D9] rounded-md text-[13px] sm:text-[14px] text-[#0f1111] font-medium bg-white hover:bg-gray-50 cursor-pointer shadow-sm relative w-full h-[40px] flex items-center justify-between px-3">
                 <span>EMI Available</span> <ChevronDown size={14} className="text-gray-500" />
              </div>
           </div>

           {/* Recommendations Panel */}
           <div className="bg-white p-4 shadow-sm border border-[#D5D9D9] rounded-sm hidden sm:block">
              <h3 className="font-bold text-[16px] mb-3">Customers who bought items in your cart also bought</h3>
              <div className="flex flex-col gap-4">
                 {[0,1,2].map((i) => (
                    <div key={i} className="flex gap-3 group cursor-pointer border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                       <div className="w-[70px] h-[70px] flex items-center justify-center p-1 bg-gray-50 rounded">
                           <img src={`https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=150&fit=crop&sig=${i}`} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                       </div>
                       <div className="flex-1 flex flex-col justify-start">
                          <Link href="#" className="text-[13px] text-[#007185] hover:text-[#c45500] hover:underline line-clamp-2 leading-tight font-medium mb-1">
                             Anycubic Kobra 2 Neo 3D Printer
                          </Link>
                          <div className="flex items-center gap-1 mb-1">
                            <div className="flex text-[#de7921]">{renderStars(4, 12)}</div>
                            <span className="text-[11px] text-[#007185]">623</span>
                          </div>
                          <div className="text-[14px] font-bold text-[#cc0c39] mb-1">₹14,099.00</div>
                          <button className="bg-white border border-[#D5D9D9] shadow-sm rounded-full py-0.5 px-3 text-[11px] font-medium hover:bg-gray-50 w-max h-[28px]">Add to cart</button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
