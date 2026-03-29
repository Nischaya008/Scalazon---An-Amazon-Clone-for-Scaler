'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Menu, ChevronDown, X, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/ui/AuthProvider';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useCart } from '@/components/ui/CartProvider';

const INITIAL_HISTORY = [
  { text: "creality 3d printer" },
  { text: "steam controller" },
  { text: "8bitdo controller" }
];

const MOCK_RECOMMENDATIONS = [
  // Smartphones & Electronics
  "iphone 15 pro max",
  "iphone 14 refurbished",
  "samsung galaxy s24 ultra",
  "oneplus 12 5g",
  "budget android phone under 20000",
  "best camera phone 2025",

  // Laptops & Computing
  "macbook pro m3",
  "macbook air m2 lightweight",
  "dell xps 15",
  "hp pavilion gaming laptop",
  "asus rog strix g16",
  "lenovo legion 5 pro",
  "laptop under 50000 for students",

  // Accessories
  "mechanical keyboard rgb",
  "wireless mouse logitech",
  "bluetooth speaker portable",
  "usb c hub multiport",
  "external ssd 1tb",

  // Audio
  "airpods pro 2",
  "sony wh-1000xm5",
  "boat rockerz 550",
  "noise cancelling headphones under 10000",
  "true wireless earbuds under 3000",

  // Gaming
  "playstation 5 console",
  "xbox series x",
  "nintendo switch oled",
  "gaming chair ergonomic",
  "gaming monitor 144hz",
  "gaming mouse lightweight",

  // Fashion - Shoes
  "nike air max",
  "adidas ultraboost",
  "puma rs-x",
  "formal shoes for men leather",
  "running shoes for women",

  // Fashion - Clothing
  "men oversized t shirt",
  "women summer dress floral",
  "hoodie unisex black",
  "jeans slim fit stretch",
  "winter jacket waterproof",

  // Home & Furniture
  "standing desk adjustable",
  "ergonomic office chair",
  "sofa set 3 seater",
  "queen size bed with storage",
  "bookshelf wooden",

  // Kitchen & Appliances
  "air fryer 5 liter",
  "microwave oven convection",
  "induction cooktop",
  "mixer grinder 750 watt",
  "refrigerator double door",

  // Beauty & Personal Care
  "face wash for oily skin",
  "vitamin c serum",
  "hair dryer professional",
  "trimmer for men cordless",
  "sunscreen spf 50",

  // Fitness
  "dumbbells set 10kg",
  "yoga mat anti slip",
  "treadmill for home",
  "protein powder whey",
  "fitness band waterproof",

  // Books & Education
  "atomic habits book",
  "data structures and algorithms book",
  "machine learning beginner guide",
  "upsc preparation books",

  // Toys & Kids
  "lego technic car",
  "remote control car",
  "baby stroller foldable",
  "kids learning tablet",

  // Automotive
  "car phone holder",
  "bike helmet full face",
  "car vacuum cleaner",
  "dash cam front and rear",

  // Groceries
  "basmati rice 5kg",
  "olive oil extra virgin",
  "protein bars healthy",
  "instant noodles pack",

  // Misspellings / Fuzzy Cases
  "iphne 15 pro",
  "samsng s24 ultra",
  "mackbook m3",
  "wirless mouse",
  "hedphones sony",

  // Intent-based Queries
  "best laptop for coding",
  "best gaming phone under 30000",
  "cheap bluetooth headphones",
  "top rated air fryer",
  "office chair for back pain"
];

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { session } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isIndia = searchParams.get('region') === 'in';
  const queryFromUrl = searchParams.get('q');

  const [searchQuery, setSearchQuery] = useState(
    queryFromUrl ? `${queryFromUrl} (These results are just a placeholder for functionality evaluation)` : ''
  );
  const [searchHistory, setSearchHistory] = useState<{ text: string, category?: string }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('amazon_search_history');
    if (stored) {
      try {
        setSearchHistory(JSON.parse(stored));
      } catch (e) {
        setSearchHistory(INITIAL_HISTORY);
      }
    } else {
      setSearchHistory(INITIAL_HISTORY);
      localStorage.setItem('amazon_search_history', JSON.stringify(INITIAL_HISTORY));
    }
  }, []);

  const removeHistoryItem = (index: number) => {
    const newHistory = searchHistory.filter((_, i) => i !== index);
    setSearchHistory(newHistory);
    localStorage.setItem('amazon_search_history', JSON.stringify(newHistory));
  };

  const addHistoryItem = (item: { text: string, category?: string }) => {
    const filtered = searchHistory.filter(h => h.text !== item.text);
    const newHistory = [item, ...filtered].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('amazon_search_history', JSON.stringify(newHistory));
  };

  const handleSearchSubmit = (query: string) => {
    const cleanQuery = query.replace(" (These results are just a placeholder for functionality evaluation)", "").trim();
    if (!cleanQuery) return;
    addHistoryItem({ text: cleanQuery });
    setIsSearchFocused(false);
    setSearchQuery(`${cleanQuery} (These results are just a placeholder for functionality evaluation)`);
    router.push(`/search?q=${encodeURIComponent(cleanQuery)}`);
  };

  const filteredRecommendations = MOCK_RECOMMENDATIONS.filter(item =>
    item.toLowerCase().includes(searchQuery.replace(" (These results are just a placeholder for functionality evaluation)", "").toLowerCase())
  ).slice(0, 10);

  const enforceAuth = (e: React.MouseEvent, path: string) => {
    if (!session) {
      e.preventDefault();
      toast.error('Sign in first.');
    } else {
      router.push(path);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setActiveDropdown(null);
    toast.success('Signed out successfully');
    router.refresh();
  };

  const categories = [
    "All Departments", "Arts & Crafts", "Automotive", "Baby", "Beauty & Personal Care",
    "Books", "Boys' Fashion", "Computers", "Deals", "Digital Music", "Electronics",
    "Girls' Fashion", "Health & Household", "Home & Kitchen", "Industrial & Scientific",
    "Kindle Store", "Luggage", "Men's Fashion", "Movies & TV", "Music, CDs & Vinyl"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === "All Departments" ? "All" : category);
    setActiveDropdown(null);
    searchInputRef.current?.focus();
  };

  return (
    <>
      {/* Overlay for Search Focus */}
      {isSearchFocused && (
        <div className="fixed inset-0 bg-black/50 z-40 pointer-events-none" />
      )}

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[60]"
          onClick={() => setIsSidebarOpen(false)}
        >
          <button
            className="absolute top-4 left-[380px] text-white hover:text-gray-300"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-[365px] bg-white z-[70] transform transition-transform duration-300 ease-in-out overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="bg-[#232f3e] text-white p-4 flex items-center text-xl font-bold cursor-pointer" onClick={() => !session && router.push('/enter')}>
          <User className="w-8 h-8 mr-2 bg-white text-[#232f3e] rounded-full p-1" />
          {session ? `Hello, ${session.user?.user_metadata?.user_name || 'User'}` : 'Hello, sign in'}
        </div>

        <div className="py-2">
          <div className="font-bold text-lg px-8 py-3">Digital Content & Devices</div>
          <div className="flex items-center justify-between px-8 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
            Prime Video <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-between px-8 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
            Amazon Music <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-between px-8 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
            Kindle E-readers & Books <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-between px-8 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
            Amazon Appstore <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="border-b border-gray-300 my-2"></div>

          <div className="font-bold text-lg px-8 py-3">Shop by Department</div>
          <div className="flex items-center justify-between px-8 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
            Electronics <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-between px-8 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
            Computers <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-between px-8 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
            Smart Home <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-between px-8 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
            Arts & Crafts <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center px-8 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
            See all <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
          </div>

          <div className="border-b border-gray-300 my-2"></div>

          <div className="font-bold text-lg px-8 py-3">Programs & Features</div>
          <div className="flex items-center justify-between px-8 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
            Gift Cards <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-between px-8 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
            Shop By Interest <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <header ref={headerRef} className="bg-[#131921] text-white flex flex-col relative z-50">
        <div className="flex items-center h-[60px] px-2 md:px-4 gap-2 md:gap-4">
          {/* Hamburger Menu (Mobile/Tablet) */}
          <div
            className="flex items-center justify-center w-10 h-10 border border-transparent hover:border-white rounded-sm cursor-pointer lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center border border-transparent hover:border-white rounded-sm p-1 cursor-pointer mt-2">
            <div
              className="w-[97px] h-[30px]"
              style={{
                backgroundImage: 'url(https://m.media-amazon.com/images/G/31/gno/sprites/nav-sprite-global-1x-reorg-privacy._CB546381437_.png)',
                backgroundPosition: '-10px -51px',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <span className="text-sm mt-1 ml-0.5 hidden sm:inline">.{isIndia ? 'in' : 'com'}</span>
          </Link>

          {/* Location */}
          <div className="hidden lg:flex items-center border border-transparent hover:border-white rounded-sm p-1 cursor-pointer">
            <MapPin className="w-[18px] h-[18px] mt-3 mr-1" />
            <div className="flex flex-col">
              <span className="text-[#cccccc] text-xs leading-3">Deliver to</span>
              <span className="text-white text-sm font-bold leading-4">{isIndia ? 'India' : 'US'}</span>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 h-10 rounded-md focus-within:ring-2 focus-within:ring-[#f90] bg-white relative">
            <div
              className="bg-[#f3f3f3] hover:bg-[#dadada] text-[#555] text-xs flex items-center px-2 border-r border-[#cdcdcd] cursor-pointer rounded-l-md"
              onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
            >
              {selectedCategory} <ChevronDown className="w-3 h-3 ml-1" />
            </div>

            {/* Category Dropdown */}
            {activeDropdown === 'category' && (
              <div className="absolute top-full left-0 mt-1 w-[250px] bg-white border border-gray-300 shadow-lg rounded-sm z-50 max-h-[400px] overflow-y-auto text-black">
                {categories.map((category) => (
                  <div
                    key={category}
                    className={`px-3 py-1 text-sm cursor-pointer hover:bg-[#1e90ff] hover:text-white ${selectedCategory === category || (selectedCategory === 'All' && category === 'All Departments') ? 'bg-[#1e90ff] text-white' : ''}`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}

            <input
              ref={searchInputRef}
              type="text"
              className={`flex-1 px-2 outline-none bg-white font-medium ${searchQuery.includes('(These results are just a placeholder') ? 'text-gray-500' : 'text-black'}`}
              placeholder="Search Amazon"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit(searchQuery);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsSearchFocused(false), 200);
              }}
            />

            {/* Search History Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-0 bg-white border border-gray-300 shadow-lg z-50 text-black">
                <div className="flex flex-col">
                  {searchQuery.replace(" (These results are just a placeholder for functionality evaluation)", "").trim() ? (
                    filteredRecommendations.length > 0 ? (
                      filteredRecommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSearchSubmit(rec)}>
                          <Search className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-black font-semibold text-sm">{rec}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm italic">No recommendations found.</div>
                    )
                  ) : (
                    searchHistory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer group" onClick={() => handleSearchSubmit(item.text)}>
                        <div className="flex items-center text-[#800080] font-bold text-sm">
                          {item.text}
                          {item.category && (
                            <span className="text-gray-500 font-normal ml-1">in {item.category}</span>
                          )}
                        </div>
                        <X
                          className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-black hover:bg-gray-200 rounded-sm p-0.5 transition-all z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeHistoryItem(index);
                          }}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="bg-[#febd69] hover:bg-[#f3a847] w-11 flex items-center justify-center cursor-pointer rounded-r-md" onClick={() => handleSearchSubmit(searchQuery)}>
              <Search className="w-5 h-5 text-[#333]" />
            </div>
          </div>

          {/* Language */}
          <div
            className="hidden sm:flex items-center border border-transparent hover:border-white rounded-sm p-1 cursor-pointer font-bold text-sm mt-2 relative"
            onClick={() => setActiveDropdown(activeDropdown === 'language' ? null : 'language')}
          >
            <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="EN" className="w-5 h-3.5 mr-1 object-cover" />
            EN <ChevronDown className="w-3 h-3 ml-1 text-gray-400" />

            {/* Language Dropdown */}
            {activeDropdown === 'language' && (
              <div className="absolute top-full right-0 mt-2 w-[240px] bg-white border border-gray-300 shadow-lg rounded-sm z-50 text-black p-4 cursor-default" onClick={(e) => e.stopPropagation()}>
                <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-gray-300 transform rotate-45"></div>
                <div className="text-sm text-gray-600 mb-2">Change language</div>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center text-sm cursor-pointer">
                    <input type="radio" name="lang" className="mr-2 accent-[#e47911]" defaultChecked /> English - EN
                  </label>
                  <div className="border-t border-gray-200 my-1"></div>
                  <label className="flex items-center text-sm cursor-pointer">
                    <input type="radio" name="lang" className="mr-2 accent-[#e47911]" /> español - ES
                  </label>
                  <label className="flex items-center text-sm cursor-pointer">
                    <input type="radio" name="lang" className="mr-2 accent-[#e47911]" /> العربية - AR
                  </label>
                  <label className="flex items-center text-sm cursor-pointer">
                    <input type="radio" name="lang" className="mr-2 accent-[#e47911]" /> Deutsch - DE
                  </label>
                  <label className="flex items-center text-sm cursor-pointer">
                    <input type="radio" name="lang" className="mr-2 accent-[#e47911]" /> עברית - HE
                  </label>
                  <label className="flex items-center text-sm cursor-pointer">
                    <input type="radio" name="lang" className="mr-2 accent-[#e47911]" /> 한국어 - KO
                  </label>
                  <label className="flex items-center text-sm cursor-pointer">
                    <input type="radio" name="lang" className="mr-2 accent-[#e47911]" /> português - PT
                  </label>
                  <label className="flex items-center text-sm cursor-pointer">
                    <input type="radio" name="lang" className="mr-2 accent-[#e47911]" /> 中文 (简体) - ZH
                  </label>
                  <label className="flex items-center text-sm cursor-pointer">
                    <input type="radio" name="lang" className="mr-2 accent-[#e47911]" /> 中文 (繁體) - ZH
                  </label>
                </div>

                <div className="border-t border-gray-200 my-2"></div>

                <div className="text-sm text-gray-600 mb-2">Change currency</div>
                <div className="space-y-2 mb-2">
                  <label className="flex items-center text-sm cursor-pointer">
                    <input type="radio" name="curr" className="mr-2 accent-[#e47911]" defaultChecked /> ₹ - INR - Indian Rupee
                  </label>
                  <label className="flex items-center text-sm cursor-pointer">
                    <input type="radio" name="curr" className="mr-2 accent-[#e47911]" /> $ - USD - US Dollar
                  </label>
                </div>
                <a href="#" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">See all</a>

                <div className="border-t border-gray-200 my-3"></div>

                <div className="flex items-center text-sm mb-2">
                  <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="US" className="w-5 h-3.5 mr-2 object-cover" />
                  You are shopping on Amazon.com
                </div>
                <div className="text-center mt-4">
                  <a href="#" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">Change country/region.</a>
                </div>
              </div>
            )}
          </div>

          {/* Account */}
          <div
            className="flex flex-col border border-transparent hover:border-white rounded-sm p-1 cursor-pointer relative ml-auto md:ml-0"
            onClick={() => !session ? router.push('/enter') : setActiveDropdown(activeDropdown === 'account' ? null : 'account')}
          >
            <span className="text-xs leading-3 hidden sm:block">
              {session ? `Hello, ${session.user?.user_metadata?.user_name || 'User'}` : 'Hello, sign in'}
            </span>
            <span className="text-sm font-bold leading-4 flex items-center">
              <span className="hidden sm:inline">Account & Lists</span>
              <span className="sm:hidden">{session ? 'Account' : 'Sign in'}</span>
              <ChevronDown className="w-3 h-3 ml-1 text-gray-400 hidden sm:block" />
            </span>

            {/* Account Dropdown */}
            {activeDropdown === 'account' && session && (
              <div className="absolute top-full right-0 sm:right-[-60px] mt-2 w-[300px] sm:w-[450px] bg-white border border-gray-300 shadow-lg rounded-sm z-50 text-black p-4 cursor-default" onClick={(e) => e.stopPropagation()}>
                <div className="absolute -top-2 right-4 sm:right-[80px] w-4 h-4 bg-white border-t border-l border-gray-300 transform rotate-45"></div>

                <div className="flex flex-col items-center justify-center mb-4 border-b border-gray-200 pb-4">
                  <button onClick={handleSignOut} className="bg-[#ffd814] hover:bg-[#f7ca00] text-black text-sm font-semibold py-2 px-16 rounded-md shadow-sm border border-[#fcd200]">
                    Sign out
                  </button>
                  <div className="text-xs mt-2">
                    Not {session.user?.user_metadata?.user_name || 'you'}? <a href="#" onClick={(e) => { e.preventDefault(); handleSignOut(); }} className="text-[#007185] hover:text-[#c45500] hover:underline">Sign out.</a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/2 sm:pr-4 sm:border-r border-gray-200 mb-4 sm:mb-0">
                    <h3 className="font-bold text-lg mb-2">Your Lists</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li><Link href="/wishlist" className="hover:text-[#c45500] hover:underline" onClick={() => setActiveDropdown(null)}>Your Wishlist</Link></li>
                      <li><a href="#" className="hover:text-[#c45500] hover:underline">Create a List</a></li>
                      <li><a href="#" className="hover:text-[#c45500] hover:underline">Find a List or Registry</a></li>
                    </ul>
                  </div>
                  <div className="w-full sm:w-1/2 sm:pl-4">
                    <h3 className="font-bold text-lg mb-2">Your Account</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li><a href="#" className="hover:text-[#c45500] hover:underline">Account</a></li>
                      <li><a href="#" className="hover:text-[#c45500] hover:underline">Orders</a></li>
                      <li><a href="#" className="hover:text-[#c45500] hover:underline">Recommendations</a></li>
                      <li><a href="#" className="hover:text-[#c45500] hover:underline">Browsing History</a></li>
                      <li><a href="#" className="hover:text-[#c45500] hover:underline">Your Shopping preferences</a></li>
                      <li><a href="#" className="hover:text-[#c45500] hover:underline">Watchlist</a></li>
                      <li><a href="#" className="hover:text-[#c45500] hover:underline">Video Purchases & Rentals</a></li>
                      <li><a href="#" className="hover:text-[#c45500] hover:underline">Kindle Unlimited</a></li>
                      <li><a href="#" className="hover:text-[#c45500] hover:underline">Content & Devices</a></li>
                      <li><a href="#" className="hover:text-[#c45500] hover:underline">Subscribe & Save Items</a></li>
                      <li><a href="#" className="hover:text-[#c45500] hover:underline">Memberships & Subscriptions</a></li>
                      <li><a href="#" className="hover:text-[#c45500] hover:underline">Music Library</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Orders */}
          <div className="hidden lg:flex flex-col border border-transparent hover:border-white rounded-sm p-1 cursor-pointer" onClick={(e) => enforceAuth(e, '/orders')}>
            <span className="text-xs leading-3">Returns</span>
            <span className="text-sm font-bold leading-4">& Orders</span>
          </div>

          {/* Cart */}
          <div className="flex items-center border border-transparent hover:border-white rounded-sm p-1 cursor-pointer relative" onClick={(e) => enforceAuth(e, '/cart')}>
            <div className="relative flex items-center">
              <div
                className="w-[38px] h-[26px]"
                style={{
                  backgroundImage: 'url(https://m.media-amazon.com/images/G/31/gno/sprites/nav-sprite-global-1x-reorg-privacy._CB546381437_.png)',
                  backgroundPosition: '-10px -340px',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              <span className="absolute top-[-6px] left-[14px] text-[#f08804] font-bold text-[16px] leading-none">{cartCount}</span>
            </div>
            <span className="text-sm font-bold mt-3 hidden sm:inline">Cart</span>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-2 pb-2">
          <div className="flex h-10 rounded-md focus-within:ring-2 focus-within:ring-[#f90] bg-white relative">
            <input
              type="text"
              className={`flex-1 px-3 outline-none bg-white rounded-l-md ${searchQuery.includes('(These results are just a placeholder') ? 'text-gray-500' : 'text-black'}`}
              placeholder="Search Amazon"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit(searchQuery);
              }}
            />
            <div className="bg-[#febd69] hover:bg-[#f3a847] w-11 flex items-center justify-center cursor-pointer rounded-r-md" onClick={() => handleSearchSubmit(searchQuery)}>
              <Search className="w-5 h-5 text-[#333]" />
            </div>
          </div>
        </div>

        {/* Sub Header */}
        <div className="bg-[#232f3e] h-[39px] flex items-center px-2 md:px-4 gap-2 md:gap-4 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div
            className="hidden lg:flex items-center font-bold border border-transparent hover:border-white rounded-sm p-1 cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 mr-1" /> All
          </div>
          <div className="border border-transparent hover:border-white rounded-sm p-1 cursor-pointer">Today&apos;s Deals</div>
          <div className="border border-transparent hover:border-white rounded-sm p-1 cursor-pointer">Gift Cards</div>
          <div className="border border-transparent hover:border-white rounded-sm p-1 cursor-pointer">Sell</div>
          <div className="border border-transparent hover:border-white rounded-sm p-1 cursor-pointer">Registry</div>
          <div className="border border-transparent hover:border-white rounded-sm p-1 cursor-pointer">Prime Video</div>
          <div className="border border-transparent hover:border-white rounded-sm p-1 cursor-pointer">Customer Service</div>
        </div>
      </header>
    </>
  );
}
