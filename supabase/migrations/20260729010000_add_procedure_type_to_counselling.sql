-- Add procedure type (OPD Procedure / IP Procedure) to counselling, alongside payment_type.
ALTER TABLE public.counselling
  ADD COLUMN procedure_type text;
