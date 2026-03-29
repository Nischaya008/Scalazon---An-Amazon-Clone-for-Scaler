"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import { ChevronDown, Star, Info, StarHalf, Filter, X, Check, Heart } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/ui/AuthProvider';
import { useCart } from '@/components/ui/CartProvider';
import { useWishlist } from '@/components/ui/WishlistProvider';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';

function SearchResultsContent() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || 'Logitech MX Master 4';
  const { session } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlistItem } = useWishlist();
  const router = useRouter();
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    if (!session) {
      toast.error('Sign in first', {
        description: 'You need to be signed in to add items to your cart.',
        action: { label: 'Sign in', onClick: () => router.push('/enter') }
      });
      return;
    }
    await addToCart(productId, 1);
    setAddedItem(productId);
    setTimeout(() => setAddedItem(null), 2000);
  }

  // Filter States
  const [sortBy, setSortBy] = useState('Featured');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [deliveryFilter, setDeliveryFilter] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number, max: number }>({ min: 0, max: 18000 });
  const [discountFilter, setDiscountFilter] = useState<number | null>(null);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const [products, setProducts] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: pData } = await supabase.from('products').select('*');
      if (pData) {
        setProducts(pData.map(p => ({
          id: p.id,
          sponsored: p.sponsored,
          brand: p.brand_name || p.brand,
          title: p.title,
          rating: p.rating,
          reviews: p.reviews_count,
          price: p.price.toLocaleString('en-IN'),
          priceNum: p.price,
          mrp: p.mrp.toLocaleString('en-IN'),
          discount: p.discount,
          discountNum: p.discount,
          deliveryDate: p.delivery_date,
          image: p.images?.[0],
          tag: p.tag,
          stock: p.stock > 0 && p.stock < 10 ? `Only ${p.stock} left in stock.` : null
        })));
      }
      const { data: promoData } = await supabase.from('search_promos').select('*').order('order_index');
      if (promoData) setPromos(promoData.map(p => ({
        title: p.title,
        rating: p.rating,
        reviews: p.reviews,
        img: p.image
      })));
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    let output = products.filter(p => {
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
      if (deliveryFilter === 'Tomorrow' && p.deliveryDate !== 'Tomorrow') return false;
      if (p.priceNum < priceRange.min || p.priceNum > priceRange.max) return false;
      if (discountFilter !== null && p.discountNum < discountFilter) return false;
      return true;
    });

    if (sortBy === 'Price: Low to High') {
      output.sort((a, b) => a.priceNum - b.priceNum);
    } else if (sortBy === 'Price: High to Low') {
      output.sort((a, b) => b.priceNum - a.priceNum);
    } else if (sortBy === 'Avg. Customer Review') {
      output.sort((a, b) => b.rating - a.rating);
    }

    return output;
  }, [selectedBrands, deliveryFilter, priceRange, discountFilter, sortBy, products]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={16} className="fill-[#de7921] text-[#de7921]" />);
      } else if (i === fullStars && hasHalf) {
        stars.push(<StarHalf key={i} size={16} className="fill-[#de7921] text-[#de7921]" />);
      } else {
        stars.push(<Star key={i} size={16} className="text-[#de7921]" />);
      }
    }
    return stars;
  };

  const SidebarContent = () => (
    <div className="text-sm">
      <div className="mb-4">
        <h3 className="font-bold mb-2">Popular Shopping Ideas</h3>
        <ul className="space-y-2 lg:space-y-1.5 text-[#0f1111]">
          <li className="cursor-pointer hover:text-[#c45500]">Wireless Mice</li>
          <li className="cursor-pointer hover:text-[#c45500]">Gaming Mice</li>
          <li className="cursor-pointer hover:text-[#c45500]">Ergonomic Mice</li>
          <li className="cursor-pointer hover:text-[#c45500]">Bluetooth Mice</li>
          <li className="flex items-center text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer mt-1">
            <ChevronDown size={14} className="mr-1" /> See more
          </li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Delivery Day</h3>
        <div className="space-y-2 lg:space-y-1">
          <label className="flex items-center gap-2 cursor-pointer hover:text-[#c45500]">
            <input
              type="checkbox"
              checked={deliveryFilter === 'Tomorrow'}
              onChange={() => setDeliveryFilter(deliveryFilter === 'Tomorrow' ? null : 'Tomorrow')}
              className="w-5 h-5 lg:w-4 lg:h-4 accent-[#007185]"
            /> Get It by Tomorrow
          </label>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Eligible for Free Delivery</h3>
        <label className="flex items-center gap-2 cursor-pointer hover:text-[#c45500]">
          <input type="checkbox" className="w-5 h-5 lg:w-4 lg:h-4 accent-[#007185]" /> Free Shipping
        </label>
        <p className="text-sm mt-1">Get FREE Shipping on eligible orders shipped by Amazon</p>
      </div>

      <div className="mb-6 mt-2 relative">
        <h3 className="font-bold mb-2">Price</h3>
        <div className="text-[13px] text-[#0f1111] font-bold mb-3">
          ₹{Intl.NumberFormat('en-IN').format(priceRange.min)} - ₹{Intl.NumberFormat('en-IN').format(priceRange.max)}
        </div>
        
        <div className="relative w-[90%] lg:w-full h-[30px] flex items-center mb-1 group px-2">
          {/* Track background */}
          <div className="absolute w-[calc(100%-16px)] left-[8px] h-[5px] bg-[#d5d9d9] top-1/2 -mt-[2px] z-0"></div>
          {/* Active track highlight */}
          <div 
            className="absolute h-[5px] bg-[#235882] top-1/2 -mt-[2px] z-0" 
            style={{ 
              left: `calc(8px + ${(priceRange.min / 18000) * (100 - 16)}%)`, 
              right: `calc(8px + ${100 - (priceRange.max / 18000) * (100 - 16)}%)` 
            }}
          ></div>
          
          <input 
            type="range" min="0" max="18000" step="50"
            value={priceRange.min} 
            onChange={(e) => setPriceRange(p => ({ ...p, min: Math.min(Number(e.target.value), p.max) }))}
            className="absolute w-full left-0 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[24px] [&::-webkit-slider-thumb]:h-[24px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[7px] [&::-webkit-slider-thumb]:border-[#235882] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_#d5d9d9,0_1px_4px_rgba(0,0,0,0.3)] cursor-pointer z-10"
          />
          <input 
            type="range" min="0" max="18000" step="50"
            value={priceRange.max} 
            onChange={(e) => setPriceRange(p => ({ ...p, max: Math.max(Number(e.target.value), p.min) }))}
            className="absolute w-full left-0 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[24px] [&::-webkit-slider-thumb]:h-[24px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[7px] [&::-webkit-slider-thumb]:border-[#235882] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_#d5d9d9,0_1px_4px_rgba(0,0,0,0.3)] cursor-pointer z-20"
          />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Brands</h3>
        <div className="space-y-2 lg:space-y-1">
          {['Logitech', 'Razer', 'Corsair', 'SteelSeries'].map((brand, idx) => (
            <label key={idx} className="flex items-center gap-2 cursor-pointer hover:text-[#c45500]">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-5 h-5 lg:w-4 lg:h-4 accent-[#007185]"
              /> {brand}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Colour</h3>
        <div className="flex flex-wrap gap-[3px]">
          {['#1C1C1C', '#1E3E6A', '#D9C874', '#7D7D7D', 'multi', '#FF9A34', '#BA1010', '#EAEAEA', '#FFFFFF'].map((c, i) => (
             <div key={i} className="w-[26px] h-[26px] rounded-[3px] border border-gray-300 hover:border-[#e77600] hover:shadow-sm cursor-pointer overflow-hidden p-[1px] shadow-sm">
               {c === 'multi' ? (
                 <div className="w-full h-full grid grid-cols-2 grid-rows-2 rounded-[1px] overflow-hidden">
                   <div className="bg-[#7896A6]"></div><div className="bg-[#A26D57]"></div>
                   <div className="bg-[#7E996C]"></div><div className="bg-[#8CA2A8]"></div>
                 </div>
               ) : c === '#EAEAEA' ? (
                 <div className="w-full h-full rounded-[1px]" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #c8c8c8 100%)' }}></div>
               ) : (
                 <div className="w-full h-full rounded-[1px]" style={{ backgroundColor: c }}></div>
               )}
             </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Discount</h3>
        <ul className="space-y-2 lg:space-y-1.5 text-[#0f1111]">
          {[10, 25, 35, 50].map((d) => (
            <li key={d} className={`cursor-pointer hover:text-[#c45500] ${discountFilter === d ? 'font-bold' : ''}`} onClick={() => setDiscountFilter(discountFilter === d ? null : d)}>{d}% Off or more</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Customer Reviews</h3>
        <div className="flex items-center cursor-pointer hover:text-[#c45500] py-1">
          <div className="flex text-[#de7921] mr-1">
            <Star size={16} className="fill-current" />
            <Star size={16} className="fill-current" />
            <Star size={16} className="fill-current" />
            <Star size={16} className="fill-current" />
            <Star size={16} className="text-gray-300" />
          </div>
          <span className="text-[#0f1111]">& Up</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Condition</h3>
        <ul className="space-y-2 lg:space-y-1.5 text-[#0f1111] text-sm">
          <li className="cursor-pointer hover:text-[#c45500]">New</li>
          <li className="cursor-pointer hover:text-[#c45500]">Used</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Availability</h3>
        <label className="flex items-center gap-2 cursor-pointer hover:text-[#c45500]">
          <input type="checkbox" className="w-5 h-5 lg:w-4 lg:h-4 accent-[#007185]" /> Include Out of Stock
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-[#0f1111]">
      <Header />

      {/* Subheader with results count and filter controls */}
      <div className="border-b border-gray-200 bg-white shadow-sm px-4 py-2 lg:py-2 text-sm flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-gray-600 gap-3 sm:gap-0 relative z-20">
        <div className="w-full sm:w-auto flex flex-col sm:block">
          <span className="font-bold sm:font-normal text-black sm:text-gray-600 text-base sm:text-sm">Results</span>
          <div className="hidden sm:block">
            <span>1-{filteredProducts.length} of over 1,000 results for </span>
            <span className="text-[#c45500] font-bold">"{query}"</span>
          </div>
        </div>

        {/* Mobile query text */}
        <div className="w-full sm:hidden text-xs text-gray-500 mb-1">
          1-{filteredProducts.length} of over 1,000 results for <span className="text-[#c45500] font-bold text-[13px]">"{query}"</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-1.5 border border-gray-300 rounded-lg sm:rounded-md px-4 py-2 sm:py-1 bg-white hover:bg-gray-50 shadow-sm text-sm sm:text-[13px] text-[#0f1111] font-medium"
          >
            Filters <Filter size={16} className="text-gray-500" />
          </button>

          {/* Sorting Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
              className="w-full flex items-center justify-between sm:justify-center gap-1.5 border border-gray-300 rounded-lg sm:rounded-md px-4 sm:px-3 py-2 sm:py-1 bg-[#f0f2f2] hover:bg-[#e3e6e6] shadow-sm text-sm sm:text-[13px] text-[#0f1111]"
            >
              <span>Sort by: <span className="font-medium sm:font-normal">{sortBy}</span></span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-1 w-[200px] bg-white border border-gray-300 shadow-lg z-50 rounded-sm">
                {['Featured', 'Price: Low to High', 'Price: High to Low', 'Avg. Customer Review'].map(s => (
                  <div key={s} className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setSortBy(s); setIsSortOpen(false); }}>{s}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex max-w-[1920px] mx-auto p-0 sm:p-4 gap-0 sm:gap-6 relative">

        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-56 xl:w-64 flex-shrink-0 text-sm overflow-hidden">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay (Drawer) */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsFilterOpen(false)}
            ></div>
            <div className="relative flex-1 flex flex-col max-w-[300px] w-full bg-white h-full overflow-y-auto z-10 shadow-xl transition-transform transform translate-x-0">
              <div className="sticky top-0 bg-white z-20 flex items-center justify-between p-4 border-b border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full"
                  aria-label="Close filters"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-4 pb-12">
                <SidebarContent />
              </div>
              <div className="sticky bottom-0 bg-white border-t p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-[#FFD814] hover:bg-[#F7CA00] py-3 rounded-xl font-medium shadow-sm"
                >
                  Show Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-grow min-w-0 w-full px-2 sm:px-0 mt-4 sm:mt-0">

          {/* Top Promotional Carousel Banner - Adapts by breakpoint */}
          <div className="border border-gray-200 rounded-md sm:rounded-sm mb-4 sm:mb-6 flex overflow-hidden flex-col md:flex-row shadow-sm sm:shadow-none">

            {/* Promo Brand Info - Hidden on mobile, visible on tablet+ */}
            <div className="w-full md:w-[150px] xl:w-[180px] bg-white hidden md:flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-100 flex-shrink-0">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2 shadow-sm rounded-full bg-gray-100">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg" alt="Logitech" className="w-10 h-10 object-contain" />
              </div>
              <h3 className="font-medium text-center text-sm">MX Master Series</h3>
              <Link href="#" className="text-[#007185] text-xs mt-1 hover:underline hover:text-[#c45500]">Shop Logitech...</Link>
            </div>

            {/* Main Video/Hero Img - Full width mobile, flex-grow desktop */}
            <div className="flex-grow bg-black relative h-[250px] sm:h-[300px] w-full">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/PyB191uRES8?autoplay=1&controls=1&mute=1"
                title="Logitech MX Master 3S Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Promo Cards - 2 on Tablet, 3 on Desktop, Hidden on Mobile */}
            <div className="hidden md:flex flex-1 xl:w-[480px] bg-white border-l border-gray-100 flex-shrink-0 divide-x divide-gray-100">
              {promos.map((promo, idx) => (
                <Link href="/product" key={idx} className={`flex-1 p-3 flex-col items-center hover:bg-gray-50 cursor-pointer ${idx === 2 ? 'hidden xl:flex' : 'flex'}`}>
                  <div className="w-[100px] h-[100px] xl:w-[120px] xl:h-[120px] mx-auto mb-2 xl:mb-3">
                    <img src={promo.img} alt={promo.title} className="w-full h-full object-cover rounded-md drop-shadow-sm mix-blend-multiply" />
                  </div>
                  <p className="text-[11px] xl:text-xs text-[#0f1111] line-clamp-2 mb-1 px-1 text-center">{promo.title}</p>
                  <div className="flex items-center justify-center text-[10px] xl:text-xs">
                    <span className="text-[#007185] mr-1">{promo.rating}</span>
                    <div className="flex text-[#de7921]">
                      <Star size={10} className="fill-current xl:w-3 xl:h-3" />
                      <Star size={10} className="fill-current xl:w-3 xl:h-3" />
                      <Star size={10} className="fill-current xl:w-3 xl:h-3" />
                      <Star size={10} className="fill-current xl:w-3 xl:h-3" />
                      <Star size={10} className="text-[#de7921] xl:w-3 xl:h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mb-2 sm:mb-4 px-1 sm:px-0">
            <h2 className="hidden sm:block text-xl font-bold">Results</h2>
            <span className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer ml-auto">Sponsored <Info size={12} /></span>
          </div>
          <p className="hidden sm:block text-sm text-gray-500 mb-4 -mt-3">Check each product page for other buying options.</p>

          {/* Grid Layout: 1 col (mobile), 2 cols (tablet), 3 cols (desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-y-6 sm:gap-y-8 gap-x-0 sm:gap-x-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex flex-col group border-b border-gray-200 sm:border sm:border-transparent sm:hover:border-gray-200 sm:hover:shadow-sm sm:rounded p-2 sm:p-2 transition-all pb-4 sm:pb-2 bg-white">

                {/* Product Image Area */}
                <div className="relative w-full aspect-square bg-[#f8f8f8] mb-3 flex items-center justify-center overflow-hidden rounded-md sm:rounded-sm mx-auto group/img">
                  <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
                    <img src={product.image} alt={product.title} className="w-full h-full p-4 sm:p-6 object-cover mix-blend-multiply transition-transform group-hover/img:scale-105 duration-300" />
                  </Link>
                  
                  {/* Heart Wishlist Toggle */}
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlistItem(product.id); }}
                    className="absolute top-2 right-2 z-10 p-1.5 bg-white/70 hover:bg-white rounded-full shadow-sm backdrop-blur-sm transition-all focus:outline-none"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={20} className={`transition-colors duration-300 ${isInWishlist(product.id) ? 'fill-[#c45500] text-[#c45500]' : 'text-gray-500 hover:text-[#c45500]'}`} />
                  </button>

                  {product.tag === "Best seller" && (
                    <div className="absolute top-0 left-0 bg-[#e67a00] text-white text-[11px] font-bold px-2 py-0.5 rounded-br-sm shadow-sm select-none z-10 pointer-events-none">
                      Best seller
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-grow px-1 sm:px-0">
                  {product.sponsored && (
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      Sponsored <Info size={12} className="ml-1 opacity-70" />
                    </div>
                  )}

                  <Link href={`/product/${product.id}`} className="hover:underline">
                    <h2 className="text-[15px] sm:text-sm md:text-[15px] leading-snug text-[#0f1111] font-medium line-clamp-3 mb-1 group-hover:text-[#c45500]">
                      {product.title}
                    </h2>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center text-sm md:text-sm mt-1 mb-1">
                    <span className="text-[#007185] mr-1">{product.rating.toFixed(1)}</span>
                    <div className="flex mr-1 items-center">
                      {renderStars(product.rating)}
                    </div>
                    <Link href="#" className="text-[#007185] hover:text-[#c45500] hover:underline">({product.reviews})</Link>
                  </div>

                  {product.tag === "Limited time deal" && (
                    <div className="inline-block bg-[#cc0c39] text-white text-[11px] sm:text-xs font-bold px-2 py-1 rounded-sm w-max mb-1 mt-1">
                      Limited time deal
                    </div>
                  )}

                  {/* Price Area */}
                  <div className="flex flex-wrap items-baseline mt-1 mb-1 gap-1">
                    <span className="text-2xl sm:text-xl font-medium text-[#0f1111] mr-1">₹{product.price}</span>
                    <span className="text-[13px] text-gray-500 align-text-bottom">
                      M.R.P: <span className="line-through">₹{product.mrp}</span>
                    </span>
                    <span className="text-[13px] text-gray-500 align-text-bottom">
                      ({product.discount}% off)
                    </span>
                  </div>

                  {/* Prime / Delivery */}
                  <div className="text-sm md:text-sm text-[#0f1111] mt-1 space-y-0.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="bg-[#002f36] text-white font-bold text-[10px] sm:text-[11px] px-1 py-0.5 rounded-sm italic">
                        <svg className="w-3 h-3 inline-block mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Fulfilled
                      </span>
                    </div>
                    <div className="leading-snug">
                      FREE delivery <span className="font-bold">{product.deliveryDate}</span>
                    </div>
                  </div>

                  {product.stock && (
                    <div className="text-[#B12704] text-sm mt-1.5 mb-0.5 font-medium">
                      {product.stock}
                    </div>
                  )}

                  {/* Add to Cart button */}
                  <div className="mt-4 sm:mt-auto pt-2">
                    <button 
                      onClick={(e) => handleAddToCart(e, product.id)} 
                      className={`w-full border rounded-full sm:rounded-full py-2.5 sm:py-1.5 text-sm sm:text-sm font-medium shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${addedItem === product.id ? 'bg-[#f0f2f2] border-[#D5D9D9] hover:bg-[#e3e6e6]' : 'bg-[#FFD814] hover:bg-[#F7CA00] border-[#FCD200] hover:border-[#F2C200]'}`}
                    >
                      {addedItem === product.id ? (
                        <><Check size={16} className="text-[#007600]"/> Added</>
                      ) : (
                        'Add to cart'
                      )}
                    </button>
                  </div>

                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-10 text-center text-gray-500 flex flex-col items-center">
                  <span className="text-lg font-bold text-gray-700">{loading ? "Searching results..." : "No results for the selected filters."}</span>
                  {!loading && (
                    <button onClick={() => { setPriceRange({ min: 0, max: 18000 }); setSelectedBrands([]); setDiscountFilter(null); setDeliveryFilter(null); }} className="text-[#007185] hover:underline mt-2">
                      Clear all filters
                    </button>
                  )}
                </div>
            )}
          </div>

          {/* Pagination Placeholder */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center my-8">
              <div className="flex border border-gray-300 rounded-md shadow-sm overflow-hidden bg-white">
                <button className="px-4 py-2 border-r border-gray-300 font-bold bg-gray-100 text-[#0f1111]">1</button>
                <button className="px-4 py-2 border-r border-gray-300 text-gray-700 hover:bg-gray-50">2</button>
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center">Next &gt;</button>
              </div>
            </div>
          )}

        </main>
        
        {/* Cart Sidebar structurally inline */}
        <div className="hidden lg:block relative z-10 w-[140px] xl:w-[160px] flex-shrink-0 sticky top-[80px] h-[calc(100vh-100px)] self-start">
           <CartSidebar />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white text-[#0f1111] font-sans p-6 text-center">Loading Search Results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
