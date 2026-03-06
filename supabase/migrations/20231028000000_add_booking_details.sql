ALTER TABLE public.bookings
ADD COLUMN sender_name text,
ADD COLUMN sender_phone text,
ADD COLUMN sender_note text,
ADD COLUMN receiver_name text,
ADD COLUMN receiver_phone text,
ADD COLUMN receiver_note text,
ADD COLUMN item_type text;