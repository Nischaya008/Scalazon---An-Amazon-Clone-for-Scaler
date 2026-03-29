"use client";

import React from 'react';
import { useCart } from './ui/CartProvider';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const { cartItems, subtotal, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  return (
    <aside className="w-full h-full bg-white border border-gray-200 shadow-sm flex flex-col flex-shrink-0 rounded-sm overflow-hidden">
      
      {/* Header Section */}
      <div className="bg-white p-4 border-b border-gray-200 flex flex-col gap-3">
        <div className="text-center mt-2">
          <h2 className="text-[15px] sm:text-[17px] text-[#0f1111]">
            Subtotal
          </h2>
          <div className="text-[18px] sm:text-[20px] font-bold text-[#b12704] leading-tight">
            ₹{subtotal.toLocaleString('en-IN')}.00
          </div>
        </div>
        
        {cartItems.length > 0 && (
          <div className="text-[12px] sm:text-[13px] text-center leading-snug px-2">
             <span className="text-[#007600] font-bold">Your order is eligible for FREE Delivery.</span> Select this option at checkout.
             <br/>
             <Link href="#" className="text-[#007185] hover:text-[#c45500] hover:underline">Details</Link>
          </div>
        )}

        <button 
          onClick={() => router.push('/cart')}
          className="w-full bg-white hover:bg-gray-50 border border-[#D5D9D9] shadow-sm rounded-full py-1.5 text-[13px] sm:text-[14px] text-[#0f1111] font-medium transition-colors cursor-pointer"
        >
           Go to Cart
        </button>
      </div>

      {/* Scrollable Items List */}
      <div className="flex-1 overflow-y-auto bg-white p-3 flex flex-col gap-5 max-h-[calc(100vh-280px)]">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 my-8 text-sm">Your cart is empty.</div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex flex-col border-b border-gray-100 pb-5 last:border-0 last:pb-0">
               <div className="flex justify-center mb-2 px-2 h-[100px] sm:h-[120px]">
                 <img src={item.product.image} alt={item.product.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
               </div>
               
               {item.product.tag === "Limited time deal" && (
                 <div className="flex justify-center mb-2">
                   <span className="bg-[#cc0c39] text-white text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-sm">
                     Limited time deal
                   </span>
                 </div>
               )}
               
               <div className="text-center font-bold text-[16px] sm:text-[18px] text-[#0f1111] mb-2 sm:mb-3">
                 ₹{item.product.price.toLocaleString('en-IN')}.00
               </div>
               
               <div className="flex justify-center">
                  <div className="flex bg-white border border-[#D5D9D9] hover:border-[#888c8c] rounded-full shadow-sm h-[28px] sm:h-[32px] w-max overflow-hidden items-center group transition-colors">
                     <button 
                       onClick={() => removeFromCart(item.id)}
                       className="h-full px-2.5 sm:px-3 flex items-center justify-center hover:bg-[#e3e6e6] cursor-pointer text-gray-700 transition-colors"
                     >
                        <Trash2 size={14}/>
                     </button>
                     <div className="h-full px-3 sm:px-4 flex items-center justify-center bg-white font-medium text-[13px] sm:text-[14px] border-l border-r border-[#D5D9D9]">
                        {item.quantity}
                     </div>
                     <button 
                       onClick={() => updateQuantity(item.id, item.quantity + 1)}
                       className="h-full px-3 flex items-center justify-center hover:bg-[#e3e6e6] cursor-pointer text-[#0f1111] font-bold text-[16px] sm:text-[18px] pb-0.5 transition-colors"
                     >
                        +
                     </button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
