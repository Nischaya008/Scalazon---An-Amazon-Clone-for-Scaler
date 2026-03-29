-- Wishlist & Saved Items Management

create table public.wishlists (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null default 'Shopping List',
    is_default boolean default false,
    visibility text default 'Private',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.wishlist_items (
    id uuid default gen_random_uuid() primary key,
    wishlist_id uuid references public.wishlists(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(wishlist_id, product_id)
);

-- Enable RLS
alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;

-- Policies for wishlists
create policy "Users can view their own wishlists"
    on public.wishlists for select
    using (auth.uid() = user_id);

create policy "Users can unrestrictedly view Public wishlists"
    on public.wishlists for select
    using (visibility = 'Public');

create policy "Users can insert their own wishlists"
    on public.wishlists for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own wishlists"
    on public.wishlists for update
    using (auth.uid() = user_id);

create policy "Users can delete their own wishlists"
    on public.wishlists for delete
    using (auth.uid() = user_id);

-- Policies for wishlist_items
create policy "Users can view items of lists they own"
    on public.wishlist_items for select
    using (
        exists (
            select 1 from public.wishlists
            where wishlists.id = wishlist_items.wishlist_id
            and wishlists.user_id = auth.uid()
        )
    );

create policy "Public readers can view wishlist items"
    on public.wishlist_items for select
    using (
        exists (
            select 1 from public.wishlists
            where wishlists.id = wishlist_items.wishlist_id
            and wishlists.visibility = 'Public'
        )
    );

create policy "Users can add items to their own wishlists"
    on public.wishlist_items for insert
    with check (
        exists (
            select 1 from public.wishlists
            where wishlists.id = wishlist_items.wishlist_id
            and wishlists.user_id = auth.uid()
        )
    );

create policy "Users can delete their own wishlist items"
    on public.wishlist_items for delete
    using (
        exists (
            select 1 from public.wishlists
            where wishlists.id = wishlist_items.wishlist_id
            and wishlists.user_id = auth.uid()
        )
    );
