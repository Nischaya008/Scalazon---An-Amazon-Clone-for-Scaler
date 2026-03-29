import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  linkText: string;
  items: { title?: string; image: string }[];
  singleImage?: boolean;
}

export default function CategoryCard({ title, linkText, items, singleImage }: CategoryCardProps) {
  return (
    <div className="bg-white px-5 pt-5 pb-4 flex flex-col h-[420px] z-10 relative">
      <h2 className="text-[21px] font-bold text-[#0f1111] mb-[10px] leading-[1.2] line-clamp-2 min-h-[50px]">{title}</h2>
      
      <div className="flex-1 w-full min-h-0 flex flex-col mb-[18px]">
        {singleImage ? (
          <Link href="/search" className="w-full h-full flex items-center justify-center overflow-hidden min-h-0 block cursor-pointer">
            <img src={items[0].image} alt={title} className="w-full h-full object-cover" />
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 h-full min-h-0">
            {items.map((item, idx) => (
              <Link href="/search" key={idx} className="flex flex-col h-full overflow-hidden min-h-0 block cursor-pointer">
                <div className="flex-1 w-full overflow-hidden min-h-0">
                  <img src={item.image} alt={item.title || ''} className="w-full h-full object-cover" />
                </div>
                {item.title && <span className="text-[12px] text-[#0f1111] mt-1 line-clamp-1 flex-none hover:text-[#c45500] hover:underline">{item.title}</span>}
              </Link>
            ))}
          </div>
        )}
      </div>

      <Link href="/search" className="text-[#007185] hover:text-[#c45500] hover:underline text-[13px] font-medium mt-auto flex-none relative z-20">
        {linkText}
      </Link>
    </div>
  );
}
