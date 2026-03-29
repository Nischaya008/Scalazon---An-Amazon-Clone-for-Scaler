-- 06_frontend_schema_and_seed.sql

-- 1. Create tables for Home Page
CREATE TABLE IF NOT EXISTS public.home_categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  link_text text NOT NULL,
  single_image boolean DEFAULT false,
  items jsonb NOT NULL,
  order_index int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.home_carousels (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  images text[] NOT NULL,
  order_index int DEFAULT 0
);

-- 2. Create table for Search Page Promos
CREATE TABLE IF NOT EXISTS public.search_promos (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  rating numeric NOT NULL,
  reviews int NOT NULL,
  image text NOT NULL,
  order_index int DEFAULT 0
);

-- 3. Alter Products Table for detailed page data
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS discount numeric,
ADD COLUMN IF NOT EXISTS delivery_date text,
ADD COLUMN IF NOT EXISTS tag text,
ADD COLUMN IF NOT EXISTS sponsored boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_summary text,
ADD COLUMN IF NOT EXISTS specs jsonb,
ADD COLUMN IF NOT EXISTS about_item text[],
ADD COLUMN IF NOT EXISTS media jsonb,
ADD COLUMN IF NOT EXISTS rufus_questions text[],
ADD COLUMN IF NOT EXISTS compatibility text[],
ADD COLUMN IF NOT EXISTS offers jsonb,
ADD COLUMN IF NOT EXISTS styles jsonb;

-- 4. Create Product Reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  rating numeric NOT NULL,
  title text NOT NULL,
  date_text text NOT NULL,
  style_name text,
  verified boolean DEFAULT true,
  content text NOT NULL,
  helpful_count int DEFAULT 0
);

-- 5. CLEAR existing mock data
DELETE FROM public.products;
DELETE FROM public.categories;
DELETE FROM public.home_categories;
DELETE FROM public.home_carousels;
DELETE FROM public.search_promos;
DELETE FROM public.product_reviews;

-- 6. Insert new Categories
INSERT INTO public.categories (id, name, slug) VALUES
('11111111-1111-1111-1111-111111111111', 'Electronics', 'electronics'),
('22222222-2222-2222-2222-222222222222', 'Home', 'home'),
('33333333-3333-3333-3333-333333333333', 'Fashion', 'fashion');

-- 7. Insert Home Categories
INSERT INTO public.home_categories (title, link_text, single_image, items, order_index) VALUES
('Get your game on', 'Shop gaming', true, '[{"image": "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}]'::jsonb, 1),
('Top categories in Kitchen appliances', 'Explore more', false, '[{"title": "Cooker", "image": "https://images.unsplash.com/photo-1587377224626-36041d9bd9c9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}, {"title": "Coffee Maker", "image": "https://images.unsplash.com/photo-1608354580875-30bd4168b351?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}, {"title": "Blender", "image": "https://plus.unsplash.com/premium_photo-1717749801344-8ed38d55aead?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fEJsZW5kZXJ8ZW58MHx8MHx8fDA%3D"}, {"title": "Toaster", "image": "https://plus.unsplash.com/premium_photo-1718559007272-26a72b83fdcc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}]'::jsonb, 2),
('New home arrivals under $50', 'Shop the latest from Home', false, '[{"title": "Kitchen & Dining", "image": "https://images.unsplash.com/photo-1501420896719-ad7fe0ee297e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}, {"title": "Home Improvement", "image": "https://plus.unsplash.com/premium_photo-1729436833449-225649403fc0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8U21hcnQlMjBIb21lfGVufDB8fDB8fHww"}, {"title": "Decor", "image": "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SG9tZSUyMGRlY29yfGVufDB8fDB8fHww"}, {"title": "Bedding", "image": "https://images.unsplash.com/photo-1728614669329-29e10a0698ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8QmVkZGluZ3xlbnwwfHwwfHx8MA%3D%3D"}]'::jsonb, 3),
('Shop Fashion for less', 'See more', false, '[{"title": "Jeans under $50", "image": "https://plus.unsplash.com/premium_photo-1674828601362-afb73c907ebe?q=80&w=753&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}, {"title": "Tops under $25", "image": "https://plus.unsplash.com/premium_photo-1687188210526-50610de047d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29tZW4lMjB0b3BzfGVufDB8fDB8fHww"}, {"title": "Dresses under $30", "image": "https://images.unsplash.com/photo-1668371459824-094a960a227d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW5kaWFuJTIwZXRobmljJTIwd2VhcnxlbnwwfHwwfHx8MA%3D%3D"}, {"title": "Shoes under $50", "image": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U2hvZXN8ZW58MHx8MHx8fDA%3D"}]'::jsonb, 4),
('Fashion trends you like', 'Explore more', false, '[{"title": "Dresses", "image": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}, {"title": "Knits", "image": "https://plus.unsplash.com/premium_photo-1675799745842-33425f7716df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fEtuaXR0aW5nfGVufDB8fDB8fHww"}, {"title": "Jackets", "image": "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fEphY2tldHN8ZW58MHx8MHx8fDA%3D"}, {"title": "Jewelry", "image": "https://plus.unsplash.com/premium_photo-1681276169450-4504a2442173?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D"}]'::jsonb, 5),
('Up to 45% off on home refresh', 'Explore more', true, '[{"image": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=400&auto=format&fit=crop"}]'::jsonb, 6),
('Beauty picks', 'Shop now', true, '[{"image": "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhdXR5JTIwcHJvZHVjdHN8ZW58MHx8MHx8fDA%3D"}]'::jsonb, 7),
('Discover fashion trends', 'See more', false, '[{"title": "Women", "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop"}, {"title": "Men", "image": "https://images.unsplash.com/photo-1610384104075-e05c8cf200c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVuJTIwZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D"}, {"title": "Girls", "image": "https://plus.unsplash.com/premium_photo-1723874486879-4059a9aefa3d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z2lybHMlMjBraWQlMjBmYXNoaW9ufGVufDB8fDB8fHww"}, {"title": "Boys", "image": "https://images.unsplash.com/photo-1758782213532-bbb5fd89885e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym95cyUyMGtpZCUyMGZhc2hpb258ZW58MHx8MHx8fDA%3D"}]'::jsonb, 8);

-- 8. Insert Home Carousels
INSERT INTO public.home_carousels (title, images, order_index) VALUES
('Best Sellers in Clothing, Shoes & Jewelry', ARRAY['https://images.pexels.com/photos/29210804/pexels-photo-29210804.jpeg','https://images.pexels.com/photos/28773347/pexels-photo-28773347.jpeg','https://images.pexels.com/photos/8030173/pexels-photo-8030173.jpeg','https://images.pexels.com/photos/19166246/pexels-photo-19166246.jpeg','https://images.pexels.com/photos/8318201/pexels-photo-8318201.jpeg','https://images.pexels.com/photos/2918534/pexels-photo-2918534.jpeg','https://images.pexels.com/photos/25283501/pexels-photo-25283501.jpeg','https://images.pexels.com/photos/94843/pexels-photo-94843.jpeg','https://images.pexels.com/photos/35059564/pexels-photo-35059564.jpeg','https://images.pexels.com/photos/2733490/pexels-photo-2733490.jpeg'], 1),
('Best Sellers in Computers & Accessories', ARRAY['https://images.pexels.com/photos/8250837/pexels-photo-8250837.jpeg','https://images.pexels.com/photos/29871288/pexels-photo-29871288.jpeg','https://images.pexels.com/photos/30469971/pexels-photo-30469971.jpeg','https://images.pexels.com/photos/7793740/pexels-photo-7793740.jpeg','https://images.pexels.com/photos/28297689/pexels-photo-28297689.jpeg','https://images.pexels.com/photos/14130157/pexels-photo-14130157.jpeg','https://images.pexels.com/photos/7240349/pexels-photo-7240349.jpeg','https://images.pexels.com/photos/7265945/pexels-photo-7265945.jpeg','https://images.pexels.com/photos/7915211/pexels-photo-7915211.jpeg','https://images.pexels.com/photos/4225229/pexels-photo-4225229.jpeg'], 2);

-- 9. Insert Search Promos
INSERT INTO public.search_promos (title, rating, reviews, image, order_index) VALUES
('Logitech MX Master 4 for Mac', 4.8, 1532, 'https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/gallery/mx-master-4-pale-grey-top-angle-gallery-1.png', 1),
('Logitech ERGO M575S', 4.6, 4120, 'https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/m575s-ergo-wireless-trackball/gallery/ergo-m575s-m575sp-black-silver-ball-gallery-1.png', 2),
('Logitech POP Mouse', 4.7, 3370, 'https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/pop-wireless-mouse/gallery/wave-2/pop-mouse-gallery-cosmo-1.png', 3);

-- 10. Insert Main Data (Search Results + Product Detail)
-- We use a known UUID for logic (Logitech MX Master 4 is the primary product)
INSERT INTO public.products (
  id, category_id, title, description, price, mrp, stock, images, rating, reviews_count,
  brand, brand_name, is_prime_eligible, discount, delivery_date, tag, sponsored,
  ai_summary, specs, about_item, media, rufus_questions, compatibility,
  offers, styles
) VALUES
(
  '99999999-9999-9999-9999-999999999999',
  '11111111-1111-1111-1111-111111111111',
  'Logitech MX Master 4 Wireless Mouse, Supercharged Haptic Feedback, MagSpeed Scrolling, Ergonomic, Connects Up to 3 Mac/PC Computers',
  'Wireless Mouse',
  11500,
  12999,
  100,
  ARRAY['https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/gallery/mx-master-4-graphite-top-angle-gallery-1.png'],
  4.8,
  12450,
  'Logitech',
  'Logitech',
  true,
  15,
  'Tomorrow',
  'Best seller',
  true,
  'Customers find this gaming mouse to be of high quality and excellent for gaming, particularly noting its suitability for FPS and MMO games. The reliability receives mixed feedback – while some customers report excellent performance, others mention issues with right-click functionality.',
  '{"Brand": "Logitech G", "Colour": "Black", "Connectivity Technology": "USB", "Special Feature": "Programmable Buttons", "Movement Detection Technology": "Optical"}'::jsonb,
  ARRAY['HERO Sensor: Next generation HERO sensor delivers precision tracking up to 25,600 DPI with zero smoothing, filtering, or acceleration.', '11 Programmable Buttons: 11 programmable buttons and dual-mode hyper-fast scroll wheel give you fully customisable control over your gameplay.', 'Connect up to 3 Computers: Seamlessly transition between devices with Easy-Switch technology.', 'Haptic Sense Panel: Experience custom haptic feedback for actions like scrolling, zooming, and switching apps.', 'Quickly Charges: Powered down? Get back on track with a fast charge — 1 minute gives you 3 hours of use.'],
  '[{"type": "image", "src": "https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/gallery/mx-master-4-graphite-top-angle-gallery-1.png"}, {"type": "image", "src": "https://resource.logitech.com/w_544,h_544,ar_1,c_fill,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/gallery/mx-master-4-graphite-lifestyle-gallery-2-new2.png"}, {"type": "image", "src": "https://resource.logitech.com/w_544,h_544,ar_1,c_fill,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/gallery/mx-master-4-graphite-offer-lifestyle-gallery-3.png"}, {"type": "image", "src": "https://resource.logitech.com/w_544,h_544,ar_1,c_fill,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/gallery/mx-master-4-graphite-lifestyle-gallery-4-new.png"}, {"type": "image", "src": "https://resource.logitech.com/w_544,h_544,ar_1,c_fill,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/gallery/mx-master-4-graphite-lifestyle-gallery-5-new2.png"}, {"type": "video", "src": "https://www.youtube.com/embed/PyB191uRES8", "thumb": "https://resource.logitech.com/w_776,h_437,ar_16:9,c_fill,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/mx-master-4-magspeed-scroll-wheel.gif"}]'::jsonb,
  ARRAY['Can it be used on a glass table?', 'Does it work with Mac computers?', 'How long does the battery last?'],
  ARRAY['Samsung', 'Apple', 'Xiaomi', 'Lenovo', 'Honor'],
  '[{"title": "Cashback", "desc": "Upto ₹107.00 cashback on Amazon Pay Balance when...", "count": "5 offers ›"}, {"title": "No Cost EMI", "desc": "Upto ₹93.73 EMI interest savings on Amazon Pay ICICI...", "count": "1 offer ›"}, {"title": "Bank Offer", "desc": "Upto ₹1,000.00 discount on select Credit Cards", "count": "21 offers ›"}, {"title": "Partner Offers", "desc": "Get GST invoice & save up to 18% on business purchase...", "count": "1 offer ›"}]'::jsonb,
  '[{"name": "WIRED", "price": "11,500.00", "selected": true}, {"name": "WIRELESS", "price": "13,295.00", "selected": false}]'::jsonb
),
(
  '88888888-8888-8888-8888-888888888888',
  '11111111-1111-1111-1111-111111111111',
  'Logitech G502 X PLUS - LIGHTSPEED Wireless Gaming Mouse with LIGHTSYNC RGB',
  'Gaming Mouse',
  16999,
  20999,
  100,
  ARRAY['https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/gaming/en/products/g502x-plus/gallery/g502x-plus-gallery-2-black.png'],
  4.6,
  3020,
  'Logitech',
  'Logitech',
  true,
  19,
  'Tomorrow',
  'Limited time deal',
  false,
  NULL, '{}'::jsonb, ARRAY[]::text[], '[]'::jsonb, ARRAY[]::text[], ARRAY[]::text[], '[]'::jsonb, '[]'::jsonb
),
(
  '77777777-7777-7777-7777-777777777777',
  '11111111-1111-1111-1111-111111111111',
  'Razer Razer DeathAdder V4 Pro - FOR THE PRO',
  'Gaming Mouse',
  15999,
  17999,
  4,
  ARRAY['https://assets3.razerzone.com/9FvPlvujlrxafg7AbznLiEuAncE=/300x300/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh01%2Fhf3%2F9926511951902%2Fdeathadder-v4-pro-black-500x500.png'],
  4.5,
  2150,
  'Razer',
  'Razer',
  true,
  11,
  'Wed, 3 Apr',
  NULL,
  true,
  NULL, '{}'::jsonb, ARRAY[]::text[], '[]'::jsonb, ARRAY[]::text[], ARRAY[]::text[], '[]'::jsonb, '[]'::jsonb
),
(
  '66666666-6666-6666-6666-666666666666',
  '11111111-1111-1111-1111-111111111111',
  'Corsair IRONCLAW WIRELESS SE Gaming Mouse',
  'Gaming Mouse',
  6590,
  8990,
  100,
  ARRAY['https://d1q3zw97enxzq2.cloudfront.net/images/Ironclaw-product-renderTop-0605_.width-1000.format-webp.webp'],
  4.3,
  1100,
  'Corsair',
  'Corsair',
  true,
  26,
  'Thu, 4 Apr',
  NULL,
  false,
  NULL, '{}'::jsonb, ARRAY[]::text[], '[]'::jsonb, ARRAY[]::text[], ARRAY[]::text[], '[]'::jsonb, '[]'::jsonb
),
(
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  'SteelSeries Aerox 9 Wireless - Ultra Lightweight Super-Fast Mouse with AquaBarrier',
  'Gaming Mouse',
  7999,
  11999,
  100,
  ARRAY['https://images.ctfassets.net/hmm5mo4qf4mf/5OdlQsrRweJDlAR3OzkERY/3249c2a84d1a52bc3d7d2b892fa1162c/666a8680fbff440384dc74d49ed324b8-933.png?fm=webp&q=90&fit=scale&w=768'],
  4.4,
  3200,
  'SteelSeries',
  'SteelSeries',
  true,
  33,
  'Tomorrow',
  NULL,
  false,
  NULL, '{}'::jsonb, ARRAY[]::text[], '[]'::jsonb, ARRAY[]::text[], ARRAY[]::text[], '[]'::jsonb, '[]'::jsonb
),
(
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  'Logitech M325S Wireless Mouse - Compact & comfortable with speed wheel',
  'Wireless Mouse',
  1800,
  2495,
  100,
  ARRAY['https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/m325s-wireless-mouse/gallery/pale-gray/m325s-pale-grey-mouse-top-view-1.png'],
  4.6,
  84000,
  'Logitech',
  'Logitech',
  true,
  27,
  'Wed, 3 Apr',
  'Limited time deal',
  false,
  NULL, '{}'::jsonb, ARRAY[]::text[], '[]'::jsonb, ARRAY[]::text[], ARRAY[]::text[], '[]'::jsonb, '[]'::jsonb
);

-- 11. Insert Reviews for primary product
INSERT INTO public.product_reviews (product_id, user_name, rating, title, date_text, style_name, verified, content, helpful_count) VALUES
(
  '99999999-9999-9999-9999-999999999999',
  'Yash n.',
  5,
  'Comfortable, precise and highly customisable.',
  'Reviewed in India on 21 December 2025',
  'WIRED',
  true,
  'G502 is one of the best gaming mice I''ve used in a long time. Right out of the box, it feels solid and well-built — not cheap or flimsy. The shape fits my hand comfortably whether I''m clawing or palm-gripping, and the buttons are responsive without being too stiff.',
  3
),
(
  '99999999-9999-9999-9999-999999999999',
  'Arun K.',
  5,
  'Simply the best wireless mouse available. Period.',
  'Reviewed in India on 6 January 2026',
  'WIRELESS',
  true,
  'The haptic feedback feature feels completely immersive. The battery lasts seemingly forever, and scrolling through massive IDE files is insanely fast with the MagSpeed wheel. The ergonomic design is perfect for long coding sessions — no wrist fatigue even after 10+ hours.',
  7
);
