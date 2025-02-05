-- Allow public watchlists to be viewed by anyone
CREATE POLICY "Public watchlists are viewable by everyone"
ON public.watchlists
FOR SELECT
USING (is_public = true);

-- Allow items of public watchlists to be viewed by anyone
CREATE POLICY "Public watchlist items are viewable by everyone"
ON public.watchlist_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.watchlists
    WHERE id = watchlist_items.watchlist_id
    AND is_public = true
  )
);
