-- Add phone and address fields to EDD records, entered on the "add new EDD record" form.
ALTER TABLE public.edd_records
  ADD COLUMN phone text,
  ADD COLUMN address text;
