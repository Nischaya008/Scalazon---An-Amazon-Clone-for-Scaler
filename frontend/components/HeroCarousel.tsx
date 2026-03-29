'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "https://images-eu.ssl-images-amazon.com/images/G/31/img21/TVs/B0F8343CVL_LG_55_Homepage_DesktopHeroTemplate_3000x1200._CB785039251_.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/dharshini/3PRIME/BAU_Hero_3000X1200_AC_2x._CB783718160_.jpg",
    "https://m.media-amazon.com/images/I/61e2Cs8xqCL._SX3000_.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img21/APAY/FEB26/travel/2_Weekend_PC_Hero_3000x1200-1._CB785031298_.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img23/shrey/PChero/Live_PC_Hero_Lifestyle_3000x1200-gun._CB785335068_.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full overflow-hidden group">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-[250px] sm:h-[300px] md:h-[400px] lg:h-[600px]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img 
              src={slide} 
              alt={`Slide ${index + 1}`} 
              className="w-full h-full object-cover object-top"
            />
          </div>
        ))}
      </div>

      {/* Gradient Overlay for blending into background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-48 md:h-64 lg:h-80 bg-gradient-to-t from-[#e3e6e6] to-transparent pointer-events-none"></div>

      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute top-10 sm:top-20 md:top-32 lg:top-40 left-4 bg-transparent hover:border-2 hover:border-white p-2 sm:p-4 md:p-6 lg:p-8 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-black" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute top-10 sm:top-20 md:top-32 lg:top-40 right-4 bg-transparent hover:border-2 hover:border-white p-2 sm:p-4 md:p-6 lg:p-8 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-black" />
      </button>
    </div>
  );
}
