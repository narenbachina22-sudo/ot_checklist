-- Add last visit date field to EDD records, entered on the EDD form.
ALTER TABLE public.edd_records
  ADD COLUMN last_visit_date date;
