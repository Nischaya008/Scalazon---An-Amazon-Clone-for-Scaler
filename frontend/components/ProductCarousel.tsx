'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ProductCarouselProps {
  title: string;
  images: string[];
}

export default function ProductCarousel({ title, images }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth - 100; // Scroll distance
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white mt-5 p-5 relative group">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-[21px] font-bold text-[#0f1111]">{title}</h2>
        <Link href="/search" className="text-[#007185] hover:text-[#c45500] hover:underline text-sm">Shop now</Link>
      </div>
      
      {/* Left Arrow */}
      <button 
        onClick={() => scroll('left')} 
        className="absolute left-5 top-[50%] -translate-y-4 bg-white shadow-md border border-gray-300 w-11 h-[100px] flex items-center justify-center rounded-r opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-gray-50 text-black cursor-pointer hidden md:flex"
      >
        <ChevronLeft size={30} />
      </button>

      {/* Carousel */}
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
        {images.map((url, i) => (
          <Link href="/search" key={i} className="min-w-[200px] max-w-[200px] cursor-pointer bg-white p-2 border border-transparent hover:border-gray-300 block">
            <img src={url} alt={`Best Seller ${i+1}`} className="w-[185px] h-[185px] object-contain mb-2 mix-blend-multiply" />
          </Link>
        ))}
      </div>

      {/* Right Arrow */}
      <button 
        onClick={() => scroll('right')} 
        className="absolute right-5 top-[50%] -translate-y-4 bg-white shadow-md border border-gray-300 w-11 h-[100px] flex items-center justify-center rounded-l opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-gray-50 text-black cursor-pointer hidden md:flex"
      >
        <ChevronRight size={30} />
      </button>
    </div>
  );
}
