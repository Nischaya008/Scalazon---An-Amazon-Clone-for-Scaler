import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import CategoryCard from '@/components/CategoryCard';
import ProductCarousel from '@/components/ProductCarousel';
import Footer from '@/components/Footer';
import Link from 'next/link';

import { createClient } from '@/utils/supabase/server';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;
  const region = searchParams?.region === 'in' ? 'in' : 'com';

  const supabase = await createClient();
  const { data: homeCategories } = await supabase.from('home_categories').select('*').order('order_index');
  const { data: homeCarousels } = await supabase.from('home_carousels').select('*').order('order_index');


  return (
    <div className="min-h-screen bg-[#e3e6e6] font-sans">
      <Header />

      <main className="max-w-[1500px] mx-auto relative">
        <HeroCarousel />

        <div className="relative z-20 px-4 -mt-16 sm:-mt-24 md:-mt-40 lg:-mt-80">
          {/* Localization Banner */}
          <div className="bg-white p-3 mb-4 text-center text-sm rounded-sm">
            {region === 'com' ? (
              <>You are on amazon.com. You can also shop on Amazon India for millions of products with fast local delivery. <Link href="/?region=in" className="text-[#007185] hover:text-[#c45500] hover:underline">Click here to go to amazon.in</Link></>
            ) : (
              <>You are on amazon.in. You can also shop on Amazon US for millions of products with fast local delivery. <Link href="/?region=com" className="text-[#007185] hover:text-[#c45500] hover:underline">Click here to go to amazon.com</Link></>
            )}
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {homeCategories?.map((category) => (
              <CategoryCard
                key={category.id}
                title={category.title}
                linkText={category.link_text}
                singleImage={category.single_image}
                items={category.items}
              />
            ))}
          </div>

          {/* Best Sellers Carousel Section */}
          {homeCarousels?.map((carousel) => (
            <ProductCarousel 
              key={carousel.id} 
              title={carousel.title} 
              images={carousel.images} 
            />
          ))}

        </div>
      </main>

      <Footer />
    </div>
  );
}
