-- To provide more flexibility for future status additions,
-- we are converting the 'status' column from a custom ENUM type to a simple 'text' type.

-- Step 1: Drop the default value constraint that depends on the enum type.
ALTER TABLE public.bookings ALTER COLUMN status DROP DEFAULT;

-- Step 2: Convert the column type to text.
-- The USING clause is necessary to cast existing enum values to text.
ALTER TABLE public.bookings ALTER COLUMN status TYPE text USING status::text;

-- Step 3: Re-add the default value, now as a text literal.
ALTER TABLE public.bookings ALTER COLUMN status SET DEFAULT 'pending';

-- Step 4: Drop the now-unused custom enum type.
DROP TYPE IF EXISTS public.booking_status;
