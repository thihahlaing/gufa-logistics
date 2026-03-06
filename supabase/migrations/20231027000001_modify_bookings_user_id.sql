-- Drop the existing RLS policies first as they depend on the old column type and FK
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create new bookings" ON public.bookings;

-- Drop the foreign key constraint on user_id
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;

-- Change the user_id column type from uuid to text
ALTER TABLE public.bookings ALTER COLUMN user_id TYPE text;
