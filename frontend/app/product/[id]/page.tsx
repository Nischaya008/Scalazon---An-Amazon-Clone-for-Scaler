"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Star, ChevronDown, ChevronRight, Share,
  MapPin, Lock, RefreshCcw, Truck, ShieldCheck,
  Search, PlayCircle, Menu, ShoppingCart, Info, Check, User
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/ui/AuthProvider';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ProductPage() {
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const { session } = useAuth();

  useEffect(() => {
    async function load() {
      if (!id) return;
      const supabase = createClient();
      const { data: pData } = await supabase.from('products').select('*').eq('id', id).single();
      const { data: revData } = await supabase.from('product_reviews').select('*').eq('product_id', id);
      if (pData) setProduct(pData);
      if (revData) setReviews(revData);
      setLoading(false);
    }
    load();
  }, [id]);

  const enforceAuth = (e: React.MouseEvent, successMsg: string) => {
    if (!session) {
      e.preventDefault();
      toast.error('Sign in first.');
    } else {
      toast.success(successMsg);
    }
  };

  const LOGITECH_GALLERY = [
    { type: 'image', src: "https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/gallery/mx-master-4-graphite-top-angle-gallery-1.png" },
    { type: 'image', src: "https://resource.logitech.com/w_544,h_544,ar_1,c_fill,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/gallery/mx-master-4-graphite-lifestyle-gallery-2-new2.png" },
    { type: 'image', src: "https://resource.logitech.com/w_544,h_544,ar_1,c_fill,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/gallery/mx-master-4-graphite-offer-lifestyle-gallery-3.png" },
    { type: 'image', src: "https://resource.logitech.com/w_544,h_544,ar_1,c_fill,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/gallery/mx-master-4-graphite-lifestyle-gallery-4-new.png" },
    { type: 'image', src: "https://resource.logitech.com/w_544,h_544,ar_1,c_fill,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/gallery/mx-master-4-graphite-lifestyle-gallery-5-new2.png" },
    { type: 'video', src: "https://www.youtube.com/embed/PyB191uRES8", thumb: "https://resource.logitech.com/w_776,h_437,ar_16:9,c_fill,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/mx-master-4-magspeed-scroll-wheel.gif" },
  ];

  const LENS_SIZE = 160;
  const ZOOM_FACTOR = 2.5;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensX = Math.max(LENS_SIZE / 2, Math.min(x, rect.width - LENS_SIZE / 2));
    const lensY = Math.max(LENS_SIZE / 2, Math.min(y, rect.height - LENS_SIZE / 2));

    setLensPosition({ x: lensX, y: lensY });

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setZoomPosition({ x: percentX, y: percentY });
  }, []);

  const handleMouseEnter = useCallback(() => setShowZoom(true), []);
  const handleMouseLeave = useCallback(() => setShowZoom(false), []);

  const renderStars = (rating: number, size = 16) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} size={size} className={i < Math.floor(rating) ? "fill-[#de7921] text-[#de7921]" : "text-gray-300"} />
    ));
  };

  const DEFAULT_SPECS = { "Brand": "Logitech G", "Colour": "Black", "Connectivity Technology": "USB", "Special Feature": "Programmable Buttons", "Movement Detection Technology": "Optical" };
  const DEFAULT_ABOUT = [
    "HERO Sensor: Next generation HERO sensor delivers precision tracking up to 25,600 DPI with zero smoothing, filtering, or acceleration.",
    "11 Programmable Buttons: 11 programmable buttons and dual-mode hyper-fast scroll wheel give you fully customisable control over your gameplay.",
    "Connect up to 3 Computers: Seamlessly transition between devices with Easy-Switch technology.",
    "Haptic Sense Panel: Experience custom haptic feedback for actions like scrolling, zooming, and switching apps.",
    "Quickly Charges: Powered down? Get back on track with a fast charge — 1 minute gives you 3 hours of use."
  ];

  if (loading) return <div className="min-h-screen bg-white text-center pt-20">Loading...</div>;
  if (!product) return <div className="min-h-screen bg-white text-center pt-20">Product not found</div>;

  // Compute robust values for Template matching
  const mediaItems = [...LOGITECH_GALLERY];
  if (product.images?.[0]) {
    mediaItems[0] = { type: 'image', src: product.images[0] };
  }
  const isVideo = mediaItems[selectedImage]?.type === 'video';

  const specs = (product.specs && Object.keys(product.specs).length > 0) ? product.specs : DEFAULT_SPECS;
  const aboutItem = (product.about_item && product.about_item.length > 0) ? product.about_item : DEFAULT_ABOUT;
  const effectiveReviews = reviews.length > 0 ? reviews : [
    { id: 'r1', user_name: 'Yash n.', rating: 5, title: 'Comfortable, precise and highly customisable.', date_text: 'Reviewed in India on 21 December 2025', style_name: 'WIRED', verified: true, content: 'Excellent quality and performance. The best I have used.', helpful_count: 3 },
    { id: 'r2', user_name: 'Arun K.', rating: 5, title: 'Highly Recommended', date_text: 'Reviewed in India on 6 January 2026', style_name: 'WIRELESS', verified: true, content: 'Completely immersive and worth the price.', helpful_count: 7 }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0f1111] font-[Arial,sans-serif] pb-[90px] md:pb-0">
      <Header />

      {/* Breadcrumbs */}
      <div className="px-3 md:px-5 py-2 text-[12px] text-[#007185] w-full line-clamp-1 border-b border-gray-200 lg:border-none">
        <Link href="#" className="hover:underline hover:text-[#c45500]">Computers & Accessories</Link>
        <span className="mx-1 text-gray-400">›</span>
        <Link href="#" className="hover:underline hover:text-[#c45500]">Accessories & Peripherals</Link>
        <span className="mx-1 text-gray-400">›</span>
        <Link href="#" className="hover:underline hover:text-[#c45500]">PC Gaming Peripherals</Link>
        <span className="mx-1 text-gray-400">›</span>
        <span className="text-[#565959]">Gaming Mice</span>
      </div>

      <main className="w-full flex justify-center mt-0">
        <div className="flex-1 px-4 pb-8 max-w-[1500px] w-full">

          {/* ====== 3-Column Layout: Thumbnails | Main Image + Product Info | Buy Box ====== */}
          <div className="flex flex-col lg:flex-row gap-0 w-full items-start mt-2">

            {/* ===== LEFT SECTION: Thumbnails + Main Image ===== */}
            <div className="w-full lg:w-[42%] flex flex-row gap-3 flex-shrink-0 relative">

              {/* Vertical Thumbnails */}
              <div className="hidden sm:flex flex-col gap-1.5 w-[54px] flex-shrink-0 pt-1">
                {mediaItems.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setSelectedImage(idx)}
                    className={`w-[44px] h-[44px] p-0.5 rounded-[3px] overflow-hidden cursor-pointer flex items-center justify-center bg-white transition-all relative ${selectedImage === idx
                      ? 'border-2 border-[#e77600] shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]'
                      : 'border border-[#d5d9d9] hover:border-[#e77600] hover:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]'
                      }`}
                  >
                    {item.type === 'video' ? (
                      <>
                        <img src={item.thumb} className="w-full h-full object-contain mix-blend-multiply opacity-60" alt="" />
                        <PlayCircle size={20} className="text-gray-700 absolute" />
                      </>
                    ) : (
                      <img src={item.src} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                    )}
                  </div>
                ))}
              </div>

              {/* Main Image with Zoom Lens */}
              <div className="flex-1 flex flex-col items-center relative">
                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-sm border border-[#D5D9D9] text-gray-600 hover:bg-gray-50 z-20 cursor-pointer">
                  <Share size={18} />
                </div>
                {isVideo ? (
                  <div className="w-full h-[360px] sm:h-[420px] lg:h-[480px] flex items-center justify-center bg-black rounded">
                    <iframe
                      src={mediaItems[selectedImage].src}
                      className="w-full h-full rounded"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Product video"
                    />
                  </div>
                ) : (
                  <>
                    <div
                      ref={imageContainerRef}
                      className="w-full h-[360px] sm:h-[420px] lg:h-[480px] flex items-center justify-center p-4 relative cursor-crosshair"
                      onMouseMove={handleMouseMove}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img
                        src={mediaItems[selectedImage].src}
                        alt="Logitech MX Master 4"
                        className="max-w-[90%] max-h-[90%] object-contain select-none pointer-events-none"
                        draggable={false}
                      />

                      {/* Zoom Lens Overlay */}
                      {showZoom && (
                        <div
                          className="absolute border-2 border-[#e77600] bg-[rgba(255,200,0,0.15)] pointer-events-none z-30"
                          style={{
                            width: `${LENS_SIZE}px`,
                            height: `${LENS_SIZE}px`,
                            left: `${lensPosition.x - LENS_SIZE / 2}px`,
                            top: `${lensPosition.y - LENS_SIZE / 2}px`,
                          }}
                        />
                      )}
                    </div>
                    <div className="text-[13px] text-[#565959] mt-1 font-medium flex items-center gap-2">
                      <span className="cursor-pointer hover:underline text-[#007185]">Click to see full view</span>
                    </div>
                  </>
                )}
              </div>

              {/* Zoomed Image Panel - floats over the product info column */}
              {showZoom && !isVideo && (
                <div
                  className="hidden lg:block absolute left-[calc(100%+8px)] top-0 z-50 border border-[#d5d9d9] bg-white shadow-lg"
                  style={{
                    width: '480px',
                    height: '480px',
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${mediaItems[selectedImage].src})`,
                      backgroundSize: `${ZOOM_FACTOR * 100}%`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                </div>
              )}
            </div>

            {/* ===== MIDDLE SECTION: Product Information ===== */}
            <div className="w-full lg:w-[35%] lg:px-4 pt-2 lg:pt-0 flex-shrink-0">

              <h1 className="text-[18px] lg:text-[24px] leading-[1.35] font-normal text-[#0f1111] mb-1 font-[Arial,sans-serif]">
                {product.title}
              </h1>

              <Link href="#" className="text-[#007185] hover:text-[#c45500] hover:underline text-[14px] mb-1 block">
                Visit the {product.brand_name || product.brand} Store
              </Link>

              <div className="flex items-center text-[14px] gap-1.5 mb-1 mt-1">
                <span className="font-medium text-[#0f1111] pt-0.5">{product.rating.toFixed(1)}</span>
                <div className="flex text-[#de7921]">{renderStars(product.rating, 16)}</div>
                <ChevronDown size={13} className="text-[#565959] cursor-pointer" />
                <Link href="#" className="text-[#007185] hover:text-[#c45500] hover:underline ml-1 pt-0.5">({product.reviews_count?.toLocaleString('en-IN')})</Link>
                <span className="text-[#565959] mx-1">|</span>
                <Link href="#" className="text-[#007185] hover:text-[#c45500] hover:underline text-[14px]">Search this page</Link>
              </div>

              {/* Tag badge */}
              {product.tag && (
                <div className="mb-2">
                  {product.tag === "Amazon's Choice" ? (
                    <span className="bg-[#232f3e] text-white text-[12px] font-bold px-2 py-[3px] rounded-sm inline-flex items-center gap-1">
                      Amazon&apos;s <span className="text-[#f08804]">Choice</span>
                    </span>
                  ) : product.tag === "Best seller" ? (
                    <span className="bg-[#e67a00] text-white text-[12px] font-bold px-2 py-[3px] rounded-sm inline-flex items-center gap-1">
                      Best seller
                    </span>
                  ) : (
                    <span className="bg-[#cc0c39] text-white text-[12px] font-bold px-2.5 py-1 rounded-sm">
                      {product.tag}
                    </span>
                  )}
                </div>
              )}

              <div className="text-[14px] text-[#565959] mb-3">400+ bought in past month</div>

              {/* Price */}
              <div className="mb-1">
                <div className="flex items-baseline gap-2">
                  {product.discount > 0 && <span className="text-[#cc0c39] text-[14px]">-{product.discount}%</span>}
                  <span className="text-[28px] font-normal text-[#0f1111] leading-none">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[14px] text-[#565959] mt-1">
                  M.R.P.: <span className="line-through">₹{product.mrp.toLocaleString('en-IN')}</span> {product.discount > 0 && <span className="text-[#565959]">({product.discount}% off)</span>}
                </div>
              </div>

              {/* Fulfilled badge */}
              <div className="flex items-center gap-1 my-2">
                <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 6.5l-4 4a.5.5 0 0 1-.7 0l-2-2a.5.5 0 0 1 .7-.7L7.1 9.4l3.6-3.6a.5.5 0 0 1 .7.7z" fill="#007185" /></svg>
                <span className="text-[#007185] text-[12px] font-medium">Fulfilled</span>
              </div>

              <div className="text-[14px] text-[#0f1111] mb-1">
                <span className="text-[#007185] font-bold">FREE delivery</span> <span className="font-bold">{product.delivery_date}</span>
              </div>

              <div className="text-[14px] text-[#0f1111] mb-3">Inclusive of all taxes</div>

              {/* Offers Section */}
              <div className="border-t border-[#D5D9D9] pt-3 mb-3">
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#0f1111] mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f1111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg> Offers
                </div>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {product.offers?.map((offer: any, i: number) => (
                    <div key={i} className="min-w-[150px] max-w-[165px] border border-[#d5d9d9] rounded-lg p-3 text-[13px] flex-shrink-0 cursor-pointer hover:bg-gray-50">
                      <div className="font-bold text-[#0f1111] mb-1">{offer.title}</div>
                      <div className="text-[#0f1111] text-[12px] leading-snug mb-1.5">{offer.desc}</div>
                      <div className="text-[#007185] text-[12px] font-medium">{offer.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Badges Row */}
              <div className="border-t border-[#D5D9D9] pt-3 pb-3 mb-3">
                <div className="flex justify-between items-start text-center text-[11px] text-[#0f1111] gap-1">
                  {/* 10 days Service Centre Replacement */}
                  <div className="flex flex-col items-center gap-1.5 w-[65px] cursor-pointer">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5e7585" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /><path d="M7 10l3 3 7-7" stroke="#e47911" strokeWidth="2" /></svg>
                    <span className="whitespace-pre-line leading-tight text-[#007185]">10 days Service{"\n"}Centre{"\n"}Replacement</span>
                  </div>
                  {/* Free Delivery */}
                  <div className="flex flex-col items-center gap-1.5 w-[55px] cursor-pointer">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5e7585" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" fill="#e47911" stroke="#e47911" /><circle cx="18.5" cy="18.5" r="2.5" fill="#e47911" stroke="#e47911" /></svg>
                    <span className="whitespace-pre-line leading-tight text-[#007185]">Free Delivery</span>
                  </div>
                  {/* 1 Year Warranty */}
                  <div className="flex flex-col items-center gap-1.5 w-[55px] cursor-pointer">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5e7585" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" stroke="#e47911" strokeWidth="2" /></svg>
                    <span className="whitespace-pre-line leading-tight text-[#007185]">1 Year{"\n"}Warranty</span>
                  </div>
                  {/* Top Brand */}
                  <div className="flex flex-col items-center gap-1.5 w-[55px] cursor-pointer">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5e7585" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#e47911" stroke="#e47911" /></svg>
                    <span className="whitespace-pre-line leading-tight text-[#007185]">Top Brand</span>
                  </div>
                  {/* Amazon Delivered */}
                  <div className="flex flex-col items-center gap-1.5 w-[55px] cursor-pointer">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5e7585" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="#e47911" strokeWidth="1.5" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                    <span className="whitespace-pre-line leading-tight text-[#007185]">Amazon{"\n"}Delivered</span>
                  </div>
                  <div className="flex items-center text-gray-400 cursor-pointer">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>

              {/* Style Name Selector */}
              {product.styles && product.styles.length > 0 && (
                <div className="border-t border-[#D5D9D9] pt-3 mb-4">
                  <div className="text-[14px] text-[#0f1111] mb-2">
                    Style Name: <span className="font-bold">{product.styles.find((s: any) => s.selected)?.name || product.styles[0].name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.styles.map((style: any, idx: number) => (
                      <button key={idx} className={`${style.selected ? 'border-2 border-[#e77600] bg-[#FCF5EE]' : 'border border-[#d5d9d9] hover:border-[#e77600]'} rounded px-4 py-2 text-[13px] text-[#0f1111] shadow-sm`}>
                        <div className="font-bold">{style.name}</div>
                        <div className={style.selected ? "text-[#B12704]" : ""}>₹{style.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specs Table */}
              <div className="border-t border-[#D5D9D9] pt-3 mb-4">
                <div className="grid grid-cols-[140px_1fr] gap-y-2 text-[14px]">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="contents">
                      <span className="font-bold text-[#0f1111]">{key}</span>
                      <span className="text-[#0f1111]">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* About this item */}
              <div className="border-t border-[#D5D9D9] pt-3 mb-4">
                <h2 className="text-[16px] font-bold text-[#0f1111] mb-2">About this item</h2>
                <ul className="list-disc pl-5 space-y-[6px] text-[14px] text-[#0f1111] marker:text-[#0f1111]">
                  {aboutItem.map((item: string, i: number) => {
                    const colonIdx = item.indexOf(':');
                    if (colonIdx > -1) {
                      return (
                        <li key={i}>
                          <span className="font-bold">{item.substring(0, colonIdx + 1)}</span>
                          {item.substring(colonIdx + 1)}
                        </li>
                      );
                    }
                    return <li key={i}>{item}</li>;
                  })}
                </ul>
              </div>
            </div>

            {/* ===== RIGHT SECTION: Buy Box Sidebar ===== */}
            <div className="w-full lg:w-[23%] flex-shrink-0">
              <div className="border border-[#D5D9D9] rounded-lg p-4 lg:sticky lg:top-4 shadow-sm">

                {/* Prime badge */}
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[#007185] text-[16px] font-bold italic">prime</span>
                  </div>
                  <div className="text-[13px] text-[#0f1111] leading-snug">
                    Enjoy <span className="font-bold">Unlimited FREE Same day/1-day delivery</span>, Prime offers everyday and more
                  </div>
                  <Link href="#" className="text-[#007185] hover:text-[#c45500] hover:underline text-[13px] font-bold block mt-1">
                    Join Prime Shopping Edition &gt;&gt;
                  </Link>
                </div>

                {/* Price in buy box */}
                <div className="border-t border-[#D5D9D9] pt-3 mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[13px] text-[#565959] align-top">₹</span>
                    <span className="text-[28px] font-normal text-[#0f1111] leading-none">{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-[13px] text-[#565959] align-top">.00</span>
                    <Link href="#" className="text-[#007185] hover:text-[#c45500] hover:underline text-[12px] ml-1">Price history</Link>
                  </div>
                  <div className="text-[13px] text-[#565959] mt-0.5">M.R.P.: <span className="line-through">₹{product.mrp.toLocaleString('en-IN')}</span> {product.discount > 0 && `(${product.discount}% off)`}</div>
                </div>

                {/* Fulfilled badge */}
                <div className="flex items-center gap-1 mb-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" className="flex-shrink-0"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 6.5l-4 4a.5.5 0 0 1-.7 0l-2-2a.5.5 0 0 1 .7-.7L7.1 9.4l3.6-3.6a.5.5 0 0 1 .7.7z" fill="#007185" /></svg>
                  <span className="text-[#007185] text-[12px] font-medium">Fulfilled</span>
                </div>

                {/* Delivery info */}
                <div className="text-[14px] text-[#0f1111] mb-1">
                  <span className="font-bold">FREE delivery</span> <span className="font-bold">Tuesday, 31 March.</span>{' '}
                  <Link href="#" className="text-[#007185] hover:underline text-[13px]">Details</Link>
                </div>
                <div className="text-[14px] text-[#0f1111] mb-2">
                  Or <span className="font-bold">fastest delivery Tomorrow, 30 March.</span> Order within{' '}
                  <span className="text-[#007185] font-bold">13 hrs 52 mins.</span>{' '}
                  <Link href="#" className="text-[#007185] hover:underline text-[13px]">Details</Link>
                </div>

                <div className="flex items-center gap-1 text-[14px] text-[#0f1111] mb-3 cursor-pointer hover:underline">
                  <MapPin size={16} className="text-[#0f1111]" />
                  <span className="text-[#007185]">Deliver to Scaler - Bengaluru 560100</span>
                </div>

                <div className="text-[18px] text-[#007600] font-medium mb-3">In stock</div>

                {/* Ships from / Sold by */}
                <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1 text-[13px] mb-3">
                  <span className="text-[#565959]">Ships from</span>
                  <span className="text-[#0f1111]">Amazon</span>
                  <span className="text-[#565959]">Sold by</span>
                  <span className="text-[#007185] hover:underline cursor-pointer">Clicktech Retail Private Ltd</span>
                </div>

                <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1 text-[13px] mb-3">
                  <span className="text-[#565959]">Payment</span>
                  <span className="text-[#007185] hover:underline cursor-pointer">Secure transaction</span>
                  <span className="text-[#565959]">Packaging</span>
                  <span className="text-[#0f1111]">Ships in product packaging</span>
                </div>

                <Link href="#" className="text-[#007185] hover:text-[#c45500] hover:underline text-[13px] flex items-center gap-1 mb-3">
                  <ChevronDown size={14} /> See more
                </Link>

                {/* Protection Plan */}
                <div className="border-t border-[#D5D9D9] pt-3 pb-2 mb-3">
                  <div className="font-bold text-[14px] text-[#0f1111] mb-2">Add a Protection Plan:</div>
                  <div className="flex flex-col gap-2 text-[13px]">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" className="mt-0.5" />
                      <span>Extended Warranty for <span className="text-[#B12704]">₹251.00</span></span>
                    </label>
                  </div>
                </div>

                {/* Quantity */}
                <select className="bg-[#F0F2F2] border border-[#D5D9D9] hover:bg-[#e3e6e6] text-[#0f1111] text-[13px] rounded-lg px-3 py-[9px] shadow-sm mb-3 outline-none w-full cursor-pointer h-[36px] font-bold">
                  <option>Quantity: 1</option>
                  <option>Quantity: 2</option>
                  <option>Quantity: 3</option>
                </select>

                {/* Buy buttons */}
                <div className="flex flex-col gap-2 mb-3">
                  <button
                    onClick={(e) => enforceAuth(e, 'Added to cart')}
                    className="w-full h-[34px] bg-[#FFD814] hover:bg-[#F7CA00] rounded-full text-[13px] text-[#0f1111] shadow-sm font-medium cursor-pointer"
                  >
                    Add to cart
                  </button>
                  <button
                    onClick={(e) => enforceAuth(e, 'Redirecting to checkout...')}
                    className="w-full h-[34px] bg-[#FFA41C] hover:bg-[#FA8900] rounded-full text-[13px] text-[#0f1111] shadow-sm font-medium cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[#007185] text-[13px] font-medium mb-3 cursor-pointer">
                  <Lock size={14} className="text-[#565959]" /> Secure transaction
                </div>

                {/* Add to Wish List */}
                <div className="border border-[#D5D9D9] rounded bg-[#F0F2F2] hover:bg-[#e3e6e6] shadow-sm flex items-center justify-between p-2 text-[13px] cursor-pointer font-medium mb-3">
                  Add to Wish List <ChevronDown size={14} className="text-gray-500" />
                </div>

                {/* Other sellers */}
                <div className="border-t border-[#D5D9D9] pt-3">
                  <div className="font-bold text-[14px] text-[#0f1111] mb-2">Other sellers on Amazon</div>
                  <div className="text-[13px] text-[#0f1111] mb-1">
                    New <span className="font-bold">(3)</span> from <span className="text-[#B12704] font-bold">₹11,500<span className="text-[10px] align-top">.00</span></span>
                  </div>
                  <div className="flex items-center gap-1 text-[12px] mb-2">
                    <svg width="12" height="12" viewBox="0 0 16 16" className="flex-shrink-0"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 6.5l-4 4a.5.5 0 0 1-.7 0l-2-2a.5.5 0 0 1 .7-.7L7.1 9.4l3.6-3.6a.5.5 0 0 1 .7.7z" fill="#007185" /></svg>
                    <span className="text-[#007185] text-[11px]">Fulfilled</span>
                    <span className="text-[#0f1111]">FREE Delivery.</span>
                    <ChevronRight size={14} className="text-gray-400 ml-auto cursor-pointer" />
                  </div>
                </div>

                {/* Amazon Business */}
                <div className="border-t border-[#D5D9D9] pt-3 mt-1">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[16px] font-bold text-[#0f1111]">amazon</span>
                    <span className="text-[16px] font-bold text-[#e47911]">business</span>
                  </div>
                  <div className="text-[13px] text-[#0f1111] leading-snug">
                    Save up to 18% on this product with business pricing and GST input tax credit
                  </div>
                </div>
              </div>
            </div>

          </div>

          <hr className="border-[#D5D9D9] my-6 lg:my-8" />

          {/* Ask Rufus */}
          <div className="w-full mb-8">
            <h2 className="text-[18px] lg:text-[22px] font-bold text-[#0f1111] mb-3 flex items-center gap-1.5">
              {/* Rufus icon: orange circle with blue sparkle */}
              <span className="relative w-[28px] h-[28px] flex items-center justify-center flex-shrink-0">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="12" fill="#e47911" />
                  <path d="M18 8l-2 4 4-2-4 2-2 4 2-4-4 2 4-2z" fill="#1a73e8" stroke="#1a73e8" strokeWidth="0.5" strokeLinejoin="round" />
                  <circle cx="16" cy="10" r="1" fill="#1a73e8" />
                  <path d="M10 18l1-2-2 1 2-1 1-2-1 2 2-1-2 1z" fill="#1a73e8" stroke="#1a73e8" strokeWidth="0.3" strokeLinejoin="round" />
                </svg>
              </span>
              Ask Rufus
            </h2>
            <div className="flex flex-wrap gap-2 text-[14px]">
              {product.rufus_questions?.map((q: string, i: number) => (
                <span key={i} className="bg-[#E8F0FE] border border-[#B8D4F0] text-[#1a5276] px-4 py-2 rounded-full cursor-pointer hover:bg-[#d6e6f9] shadow-sm font-medium">{q}</span>
              ))}
              <span className="bg-[#1a5276] text-white px-4 py-2 rounded-full cursor-pointer hover:bg-[#164666] shadow-sm font-medium">Ask something else</span>
            </div>
          </div>

          <hr className="border-[#D5D9D9] mb-6" />

          {/* Check Compatibility */}
          <div className="mb-8">
            <h2 className="text-[18px] lg:text-[20px] font-bold text-[#0f1111] mb-3">Check Compatibility</h2>
            <div className="flex flex-wrap gap-3 mb-2">
              {product.compatibility?.map((brand: string, i: number) => (
                <button key={i} className="border border-[#D5D9D9] hover:bg-[#f3f3f3] text-[#0f1111] font-medium px-6 py-3 rounded-lg text-[15px] shadow-sm">{brand}</button>
              ))}
            </div>
            <Link href="#" className="text-[#007185] hover:text-[#c45500] hover:underline text-[14px] font-medium">See all options</Link>
          </div>

          <hr className="border-[#D5D9D9] mb-6" />

          {/* Frequently Bought Together */}
          <div className="mb-10 max-w-[900px]">
            <h2 className="text-[18px] lg:text-[22px] font-bold text-[#cc0c39] mb-4">Frequently bought together</h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex items-center gap-4">
                <div className="w-[120px] h-[120px] flex-shrink-0 relative">
                  <img src={product.images?.[0]} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                </div>
                <span className="text-[24px] text-gray-400 font-light">+</span>
                <div className="w-[120px] h-[120px] flex-shrink-0 relative border border-gray-200 p-2 rounded">
                  <img src="https://m.media-amazon.com/images/I/711R9-as-2L._SX679_.jpg" className="w-full h-full object-contain mix-blend-multiply" alt="" />
                </div>
              </div>

              <div className="flex-1 flex flex-col pt-2">
                <div className="text-[14px] text-[#0f1111] mb-1">Total price: <span className="font-bold text-[18px] text-[#B12704]">₹{(product.price + 2999).toLocaleString('en-IN')}</span></div>
                <button className="bg-[#FFD814] hover:bg-[#F7CA00] rounded-full px-5 py-2 text-[14px] font-medium shadow-sm w-max mb-3 mt-1">Add both to Cart</button>
                <div className="text-[13px] text-gray-500 mb-4">One of these items is dispatched sooner than the other. <Link href="#" className="text-[#007185]">Show details</Link></div>

                <div className="flex flex-col gap-2 text-[14px] text-[#0f1111]">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" checked readOnly className="mt-1 accent-[#007185]" />
                    <span><span className="font-bold">This item: </span>{product.title.substring(0, 40)}... <span className="text-[#B12704] font-bold ml-1">₹{product.price.toLocaleString('en-IN')}</span></span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" checked readOnly className="mt-1 accent-[#007185]" />
                    <span><Link href="#" className="text-[#007185] hover:underline">Logitech MX Master Hard Case Travel Cover</Link> <span className="text-[#B12704] font-bold ml-1">₹2,999.00</span></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-[#D5D9D9] mb-8" />

          {/* Reviews Section */}
          <div className="w-full grid lg:grid-cols-[260px_1fr] gap-10">

            {/* ===== LEFT: Ratings Summary + Write Review CTA ===== */}
            <div className="flex flex-col">
              <h2 className="text-[22px] font-bold text-[#0f1111] mb-2">Customer reviews</h2>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex text-[#de7921]">{renderStars(4.8, 18)}</div>
                <span className="text-[16px] font-bold text-[#0f1111]">4.8 out of 5</span>
              </div>
              <div className="text-[14px] text-[#565959] mb-4">12,450 global ratings</div>

              <div className="flex flex-col gap-[6px] text-[14px] text-[#007185] font-medium w-full max-w-[260px] mb-3">
                {[
                  { star: "5 star", pct: "76%", width: "76%" },
                  { star: "4 star", pct: "15%", width: "15%" },
                  { star: "3 star", pct: "4%", width: "4%" },
                  { star: "2 star", pct: "1%", width: "1%" },
                  { star: "1 star", pct: "4%", width: "4%" },
                ].map(r => (
                  <div key={r.star} className="flex items-center gap-2 cursor-pointer hover:underline">
                    <div className="w-[42px] text-[13px] text-[#007185] flex-shrink-0">{r.star}</div>
                    <div className="flex-1 h-[18px] bg-[#F0F2F2] border border-[#a2a6ac] rounded-[3px] overflow-hidden">
                      <div className="h-full bg-[#DE7921] rounded-[3px]" style={{ width: r.width }}></div>
                    </div>
                    <div className="w-[30px] text-right text-[13px] text-[#007185] flex-shrink-0">{r.pct}</div>
                  </div>
                ))}
              </div>

              <Link href="#" className="text-[13px] text-[#007185] hover:text-[#c45500] hover:underline flex items-center gap-1 mb-6">
                How are ratings calculated? <ChevronDown size={13} />
              </Link>

              <hr className="border-[#D5D9D9] mb-4" />

              <h3 className="text-[18px] font-bold text-[#0f1111] mb-1">Review this product</h3>
              <div className="text-[14px] text-[#565959] mb-3">Share your thoughts with other customers</div>
              <button className="w-full border border-[#D5D9D9] rounded-lg py-[7px] text-[13px] text-[#0f1111] font-medium hover:bg-[#F7FAFA] shadow-sm cursor-pointer">
                Write a product review
              </button>
            </div>

            {/* ===== RIGHT: AI Summary, Images, Top Reviews ===== */}
            <div className="flex flex-col">

              {/* Customers Say - AI Summary */}
              <div className="mb-5">
                <h3 className="text-[18px] font-bold text-[#0f1111] mb-2">Customers say</h3>
                <p className="text-[14px] text-[#0f1111] leading-[1.6] mb-2">
                  {product.ai_summary || "Customers find this high-quality product to be excellent for daily use. It offers a solid build and responsive performance, matching the standards expected from top brands."}
                </p>
                <div className="flex items-center gap-1 text-[12px] text-[#565959] mb-2">
                  <span className="inline-block w-[14px] h-[14px] rounded-sm bg-gradient-to-br from-[#4b6cb7] to-[#8e54e9] text-white text-[8px] flex items-center justify-center font-bold leading-none text-center"></span>
                  <span className="italic">Generated from the text of customer reviews</span>
                </div>
              </div>

              {/* Reviews with images */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[18px] font-bold text-[#0f1111]">Reviews with images</h3>
                  <Link href="#" className="text-[13px] text-[#007185] hover:text-[#c45500] hover:underline">See all photos ›</Link>
                </div>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide relative">
                  {/* Left arrow */}
                  <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-[#d5d9d9] rounded-full w-[36px] h-[36px] flex items-center justify-center shadow-md hover:bg-white cursor-pointer">
                    <ChevronDown size={18} className="text-[#0f1111] rotate-90" />
                  </button>
                  {[
                    "https://m.media-amazon.com/images/I/51HPG-zBMoL.jpg",
                    "https://m.media-amazon.com/images/I/61bcqgV7qVL.jpg",
                    "https://m.media-amazon.com/images/I/61n8WpJRkBL.jpg",
                    "https://m.media-amazon.com/images/I/718KY9MnatL.jpg",
                    "https://m.media-amazon.com/images/I/61PzVKplFAL.jpg",
                    "https://m.media-amazon.com/images/I/51Ng9gof+fL.jpg",
                    "https://m.media-amazon.com/images/I/81-UEUeD5KL.jpg",
                  ].map((img, i) => (
                    <div key={i} className="w-[110px] h-[110px] flex-shrink-0 rounded-[4px] overflow-hidden border border-[#d5d9d9] cursor-pointer hover:border-[#e77600] bg-white">
                      <img src={img} alt={`Review image ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {/* Right arrow */}
                  <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-[#d5d9d9] rounded-full w-[36px] h-[36px] flex items-center justify-center shadow-md hover:bg-white cursor-pointer">
                    <ChevronRight size={18} className="text-[#0f1111]" />
                  </button>
                </div>
              </div>

              <hr className="border-[#D5D9D9] mb-5" />

              {/* Top reviews from India */}
              <h3 className="text-[18px] font-bold text-[#0f1111] mb-4">Top reviews from India</h3>

              {effectiveReviews.map((rev: any) => (
                <div key={rev.id} className="flex flex-col mb-6 border-b border-[#D5D9D9] pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-[34px] h-[34px] bg-[#e0e0e0] rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={18} className="text-[#888]" />
                    </div>
                    <span className="text-[14px] text-[#0f1111]">{rev.user_name}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex text-[#de7921]">{renderStars(rev.rating, 14)}</div>
                    <span className="font-bold text-[14px] text-[#0f1111]">{rev.title}</span>
                  </div>
                  <div className="text-[13px] text-[#565959] mb-0.5">{rev.date_text}</div>
                  <div className="text-[13px] text-[#565959] mb-3">
                    Style Name: {rev.style_name || 'WIRED'}{' '}
                    <span className="mx-1 text-[#d5d9d9]">|</span>{' '}
                    {rev.verified && <span className="text-[#c45500] font-bold">Verified Purchase</span>}
                  </div>
                  <p className="text-[14px] text-[#0f1111] leading-[1.6] mb-3">
                    {rev.content}
                  </p>
                  <div className="text-[13px] text-[#565959] mb-2">{rev.helpful_count} people found this helpful</div>
                  <div className="flex items-center gap-3 text-[13px]">
                    <button className="border border-[#a2a6ac] rounded-full px-4 py-[5px] text-[#0f1111] font-medium hover:bg-[#F7FAFA] shadow-[0_1px_2px_rgba(15,17,17,0.15)] cursor-pointer">
                      Helpful
                    </button>
                    <span className="text-[#d5d9d9]">|</span>
                    <Link href="#" className="text-[#007185] hover:text-[#c45500] hover:underline">Report</Link>
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
