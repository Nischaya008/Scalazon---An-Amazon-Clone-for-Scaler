'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#232f3e] text-white text-[13px] mt-8">
      <div 
        className="bg-[#37475a] hover:bg-[#485769] text-center py-4 cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top
      </div>
      
      <div className="max-w-[1000px] mx-auto py-10 px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-base mb-3">Get to Know Us</h3>
          <ul className="space-y-2 text-[#dddddd]">
            <li><Link href="#" className="hover:underline">Careers</Link></li>
            <li><Link href="#" className="hover:underline">Blog</Link></li>
            <li><Link href="#" className="hover:underline">About Amazon</Link></li>
            <li><Link href="#" className="hover:underline">Investor Relations</Link></li>
            <li><Link href="#" className="hover:underline">Amazon Devices</Link></li>
            <li><Link href="#" className="hover:underline">Amazon Science</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-base mb-3">Make Money with Us</h3>
          <ul className="space-y-2 text-[#dddddd]">
            <li><Link href="#" className="hover:underline">Sell products on Amazon</Link></li>
            <li><Link href="#" className="hover:underline">Sell on Amazon Business</Link></li>
            <li><Link href="#" className="hover:underline">Sell apps on Amazon</Link></li>
            <li><Link href="#" className="hover:underline">Become an Affiliate</Link></li>
            <li><Link href="#" className="hover:underline">Advertise Your Products</Link></li>
            <li><Link href="#" className="hover:underline">Self-Publish with Us</Link></li>
            <li><Link href="#" className="hover:underline">Host an Amazon Hub</Link></li>
            <li><Link href="#" className="hover:underline">› See More Make Money with Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-base mb-3">Amazon Payment Products</h3>
          <ul className="space-y-2 text-[#dddddd]">
            <li><Link href="#" className="hover:underline">Amazon Business Card</Link></li>
            <li><Link href="#" className="hover:underline">Shop with Points</Link></li>
            <li><Link href="#" className="hover:underline">Reload Your Balance</Link></li>
            <li><Link href="#" className="hover:underline">Amazon Currency Converter</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-base mb-3">Let Us Help You</h3>
          <ul className="space-y-2 text-[#dddddd]">
            <li><Link href="#" className="hover:underline">Amazon and COVID-19</Link></li>
            <li><Link href="#" className="hover:underline">Your Account</Link></li>
            <li><Link href="#" className="hover:underline">Your Orders</Link></li>
            <li><Link href="#" className="hover:underline">Shipping Rates & Policies</Link></li>
            <li><Link href="#" className="hover:underline">Returns & Replacements</Link></li>
            <li><Link href="#" className="hover:underline">Manage Your Content and Devices</Link></li>
            <li><Link href="#" className="hover:underline">Help</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#3a4553] py-8 flex flex-col items-center">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-16 mb-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="w-[76px]" />
          <div className="flex flex-wrap justify-center gap-2">
            <button className="border border-[#848688] rounded px-2 py-1.5 flex items-center gap-2 text-[#cccccc] hover:text-white">
              <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="EN" className="w-4 h-3 object-cover" /> English <span className="text-[10px]">▼</span>
            </button>
            <button className="border border-[#848688] rounded px-2 py-1.5 flex items-center gap-2 text-[#cccccc] hover:text-white">
              $ USD - U.S. Dollar
            </button>
            <button className="border border-[#848688] rounded px-2 py-1.5 flex items-center gap-2 text-[#cccccc] hover:text-white">
              <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="US" className="w-4 h-3 object-cover" /> United States
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#131921] py-8 px-4">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 text-[11px] text-[#999]">
          <div className="flex flex-col gap-4">
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Amazon Music</span><br/>Stream millions<br/>of songs</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Amazon Business</span><br/>Everything For<br/>Your Business</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">IMDbPro</span><br/>Get Info Entertainment<br/>Professionals Need</Link>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Amazon Ads</span><br/>Reach customers<br/>wherever they<br/>spend their time</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">AmazonGlobal</span><br/>Ship Orders<br/>Internationally</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Kindle Direct Publishing</span><br/>Indie Digital & Print Publishing<br/>Made Easy</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">eero WiFi</span><br/>Stream 4K Video<br/>in Every Room</Link>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">6pm</span><br/>Score deals<br/>on fashion brands</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Amazon Web Services</span><br/>Scalable Cloud<br/>Computing Services</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Prime Video Direct</span><br/>Video Distribution<br/>Made Easy</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Blink</span><br/>Smart Security<br/>for Every Home</Link>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">AbeBooks</span><br/>Books, art<br/>& collectibles</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Audible</span><br/>Listen to Books & Original<br/>Audio Performances</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Shopbop</span><br/>Designer<br/>Fashion Brands</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Neighbors App</span><br/>Real-Time Crime<br/>& Safety Alerts</Link>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">ACX</span><br/>Audiobook Publishing<br/>Made Easy</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Box Office Mojo</span><br/>Find Movie<br/>Box Office Data</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Woot!</span><br/>Deals and<br/>Shenanigans</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Amazon Subscription Boxes</span><br/>Top subscription boxes – right to your door</Link>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Sell on Amazon</span><br/>Start a Selling Account</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Goodreads</span><br/>Book reviews<br/>& recommendations</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Zappos</span><br/>Shoes &<br/>Clothing</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">PillPack</span><br/>Pharmacy Simplified</Link>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Veeqo</span><br/>Shipping Software<br/>Inventory Management</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">IMDb</span><br/>Movies, TV<br/>& Celebrities</Link>
            <Link href="#" className="hover:underline"><span className="text-[#ddd]">Ring</span><br/>Smart Home<br/>Security Systems</Link>
          </div>
        </div>
        <div className="text-center mt-8 text-[11px] text-[#ddd] flex flex-col items-center gap-1">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#" className="hover:underline">Conditions of Use</Link>
            <Link href="#" className="hover:underline">Privacy Notice</Link>
            <Link href="#" className="hover:underline">Consumer Health Data Privacy Disclosure</Link>
            <Link href="#" className="hover:underline">Your Ads Privacy Choices</Link>
          </div>
          <span>© 1996-2026, Amazon.com, Inc. or its affiliates</span>
        </div>
      </div>
    </footer>
  );
}
