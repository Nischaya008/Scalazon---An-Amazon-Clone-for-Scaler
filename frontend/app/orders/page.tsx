import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0; // Opt-out of caching for real orders

export default async function OrdersPage() {
   const supabase = await createClient();
   const { data: { session } } = await supabase.auth.getSession();

   if (!session?.user) {
      redirect('/enter');
   }

   // Fetch user orders heavily joined
   const { data: orders, error } = await supabase
      .from('orders')
      .select(`
      *,
      order_items(
        *,
        product:products(*)
      )
    `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

   // Format the date to "27 January 2026"
   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-GB', {
         day: 'numeric',
         month: 'long',
         year: 'numeric'
      });
   };

   // Format simulated delivery date (+4 days)
   const formatDelivery = (dateString: string) => {
      const d = new Date(dateString);
      d.setDate(d.getDate() + 4);
      return d.toLocaleDateString('en-GB', {
         day: 'numeric',
         month: 'long'
      });
   };

   return (
      <div className="min-h-screen bg-white font-[Arial,sans-serif]">
         <Header />

         <main className="max-w-[1000px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col xl:flex-row gap-6 items-start">

            {/* Main Orders Column */}
            <div className="flex-1 w-full min-w-0">

               {/* Breadcrumbs */}
               <div className="text-[14px] text-[#007185] hover:text-[#c45500] hover:underline mb-2 cursor-pointer">
                  Your Account <span className="text-[#565959] no-underline">&rsaquo;</span> <span className="text-[#c45500]">Your Orders</span>
               </div>

               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h1 className="text-[28px] text-[#0f1111] font-normal">Your Orders</h1>

                  <div className="flex items-center w-full sm:w-auto h-[36px]">
                     <div className="flex bg-white h-full border border-[#888C8C] rounded-l-md w-full sm:w-[280px] overflow-hidden items-center focus-within:ring-2 focus-within:ring-[#e77600] focus-within:border-[#e77600]">
                        <div className="pl-3 pr-1.5 flex items-center text-[#555]">
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        <input type="text" placeholder="Search all orders" className="w-full h-full text-[13px] outline-none placeholder-[#888C8C] text-[#0f1111]" />
                     </div>
                     <button className="h-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0f1111] text-[13px] font-medium px-5 rounded-r-md border border-[#FCD200] shadow-sm">
                        Search Orders
                     </button>
                  </div>
               </div>

               {/* Tabs */}
               <div className="flex border-b border-[#D5D9D9] mb-4 text-[14px]">
                  <div className="px-5 py-2 border-b-2 border-[#e77600] font-bold text-[#0f1111] cursor-pointer">Orders</div>
                  <div className="px-5 py-2 text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer hidden sm:block">Buy Again</div>
                  <div className="px-5 py-2 text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer hidden sm:block">Not Yet Shipped</div>
               </div>

               {/* Results count & Dropdown */}
               <div className="flex items-center gap-2 mb-4 text-[14px] font-medium text-[#0f1111]">
                  <span className="font-bold">{orders?.length || 0} orders</span> placed in
                  <select className="border border-[#D5D9D9] hover:bg-gray-50 rounded-md py-1 px-2 text-[13px] shadow-sm outline-none cursor-pointer">
                     <option>past 3 months</option>
                     <option>past 6 months</option>
                     <option>2026</option>
                  </select>
               </div>

               {/* Render Orders */}
               {(!orders || orders.length === 0) ? (
                  <div className="py-10 text-center text-[16px]">You have not placed any orders yet.</div>
               ) : (
                  <div className="flex flex-col gap-6">
                     {orders.map((order) => (
                        <div key={order.id} className="border border-[#D5D9D9] rounded-lg overflow-hidden w-full">

                           {/* Top Gray Bar */}
                           <div className="bg-[#F0F2F2] border-b border-[#D5D9D9] p-3 sm:px-4 sm:py-3 flex flex-wrap sm:flex-nowrap justify-between gap-4 text-[12px] text-[#565959]">
                              <div className="flex gap-6 sm:gap-10 w-full sm:w-auto overflow-hidden">
                                 <div className="flex flex-col">
                                    <span className="uppercase">Order Placed</span>
                                    <span className="text-[#0f1111] font-medium">{formatDate(order.created_at)}</span>
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="uppercase">Total</span>
                                    <span className="text-[#0f1111] font-medium">&#8377;{Number(order.total_amount).toLocaleString('en-IN')}.00</span>
                                 </div>
                                 <div className="flex flex-col hidden sm:flex truncate flex-1">
                                    <span className="uppercase">Ship To</span>
                                    <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer font-medium truncate">{session.user.email?.split('@')[0]}</span>
                                 </div>
                              </div>

                              <div className="flex flex-col items-start sm:items-end w-full sm:w-auto mt-2 sm:mt-0">
                                 <span className="uppercase tracking-wide">Order # {order.id.split('-')[0]}</span>
                                 <div className="flex gap-2 font-medium">
                                    <Link href="#" className="text-[#007185] hover:text-[#c45500] hover:underline">View order details</Link>
                                    <span className="text-[#D5D9D9]">|</span>
                                    <Link href="#" className="text-[#007185] hover:text-[#c45500] hover:underline">Invoice</Link>
                                 </div>
                              </div>
                           </div>

                           {/* Order Items Body */}
                           <div className="bg-white flex flex-col">
                              {order.order_items?.map((item: any, idx: number) => (
                                 <div key={item.id} className={`flex flex-col md:flex-row gap-4 p-4 sm:px-6 sm:py-5 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>

                                    {/* Product Info Left */}
                                    <div className="flex-1">
                                       <h2 className="text-[18px] font-bold text-[#0f1111] leading-tight mb-1">
                                          {order.status === 'Processing' ? 'Arriving ' + formatDelivery(order.created_at) : 'Delivered ' + formatDelivery(order.created_at)}
                                       </h2>
                                       <div className="text-[14px] text-[#0f1111] mb-3">Package was handed to resident</div>

                                       <div className="flex gap-4 items-start pb-2">
                                          <div className="w-[90px] h-[90px] flex-shrink-0 cursor-pointer p-1">
                                             <img src={item.product?.images?.[0] || item.product?.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200&fit=crop"} alt={item.product?.title || 'Product Image'} className="w-full h-full object-contain mix-blend-multiply" />
                                          </div>
                                          <div className="flex flex-col flex-1 pb-1">
                                             <Link href={`/product/${item.product_id}`} className="text-[14px] text-[#007185] hover:text-[#c45500] hover:underline leading-tight mb-2 line-clamp-3">
                                                {item.product?.title || "Unknown Product"}
                                             </Link>
                                             <div className="text-[12px] text-[#565959] mb-3">Return window closed on {formatDelivery(order.created_at)}</div>

                                             <div className="flex flex-wrap gap-2 mt-auto">
                                                <button className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full px-4 py-1 shadow-sm text-[13px] font-medium flex items-center gap-1.5">
                                                   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.22-8.56" /><polyline points="21 3 21 9 15 9" /></svg>
                                                   Buy it again
                                                </button>
                                                <button className="bg-white hover:bg-gray-50 border border-[#D5D9D9] rounded-full px-4 py-1 shadow-sm text-[13px] font-medium">
                                                   View your item
                                                </button>
                                             </div>
                                          </div>
                                       </div>
                                    </div>

                                    {/* Actions Right */}
                                    <div className="w-full md:w-[220px] flex-shrink-0 flex flex-col gap-2 mt-2 md:mt-0">
                                       <button className="w-full h-[32px] bg-white hover:bg-gray-50 border border-[#D5D9D9] shadow-sm rounded-full text-[13px] text-[#0f1111] whitespace-nowrap px-4 py-0 transition-colors">
                                          Get product support
                                       </button>
                                       <button className="w-full h-[32px] bg-white hover:bg-gray-50 border border-[#D5D9D9] shadow-sm rounded-full text-[13px] text-[#0f1111] whitespace-nowrap px-4 py-0 transition-colors">
                                          Leave seller feedback
                                       </button>
                                       <button className="w-full h-[32px] bg-white hover:bg-gray-50 border border-[#D5D9D9] shadow-sm rounded-full text-[13px] text-[#0f1111] whitespace-nowrap px-4 py-0 transition-colors">
                                          Write a product review
                                       </button>
                                    </div>

                                 </div>
                              ))}
                           </div>

                        </div>
                     ))}
                  </div>
               )}

            </div>

            {/* Right Recommended "Buy it again" Column */}
            <div className="w-full xl:w-[260px] flex-shrink-0 border border-[#D5D9D9] rounded-lg p-4 bg-white hidden xl:block self-start mt-[100px]">
               <h3 className="text-[16px] font-bold text-[#0f1111] mb-4">Buy it again</h3>

               <div className="flex flex-col gap-5">
                  {[
                     { img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571', title: 'Lacto Calamine Sunscreen...', p: '159' },
                     { img: 'https://images.pexels.com/photos/6726509/pexels-photo-6726509.jpeg', title: 'USHA Maxx Air Ultra Tab...', p: '1,999' },
                     { img: 'https://images.pexels.com/photos/33950378/pexels-photo-33950378.jpeg', title: 'Yamaha F280 Acoustic...', p: '7,031' },
                     { img: 'https://images.pexels.com/photos/18377451/pexels-photo-18377451.jpeg', title: 'Morphy Richards Kings...', p: '1,698' }
                  ].map((rec, i) => (
                     <div key={i} className="flex flex-col gap-1 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex gap-2 items-center">
                           <div className="w-[80px] h-[80px] p-2 flex-shrink-0">
                              <img src={rec.img} className="w-full h-full object-contain mix-blend-multiply" />
                           </div>
                           <div className="flex flex-col">
                              <Link href="#" className="text-[14px] text-[#007185] hover:text-[#c45500] hover:underline font-medium leading-none mb-1 line-clamp-2">{rec.title}</Link>
                              <div className="flex items-center gap-1 mb-0.5">
                                 <span className="text-[12px] text-[#cc0c39]">-36%</span>
                                 <span className="text-[14px] font-bold text-[#0f1111]">&#8377;{rec.p}</span>
                              </div>
                              <div className="text-[10px] text-[#565959] leading-none mb-1">FREE delivery</div>
                           </div>
                        </div>
                        <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full px-4 py-1.5 shadow-sm text-[12px] font-medium mt-1">
                           Add to cart
                        </button>
                     </div>
                  ))}
               </div>
            </div>

         </main>
         <Footer />
      </div>
   );
}
