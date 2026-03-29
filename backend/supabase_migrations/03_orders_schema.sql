-- 08_orders_schema.sql

-- 1. Create the orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount numeric NOT NULL,
  status text DEFAULT 'Processing' NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity int NOT NULL CHECK (quantity > 0),
  price_at_purchase numeric NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 4. Orders Policies
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders"
  ON public.orders FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Order Items Policies
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM public.orders WHERE id = order_items.order_id));

CREATE POLICY "Users can insert order items for their own orders"
  ON public.order_items FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.orders WHERE id = order_items.order_id));

CREATE POLICY "Users can update their own order items"
  ON public.order_items FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM public.orders WHERE id = order_items.order_id));

CREATE POLICY "Users can delete their own order items"
  ON public.order_items FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM public.orders WHERE id = order_items.order_id));
