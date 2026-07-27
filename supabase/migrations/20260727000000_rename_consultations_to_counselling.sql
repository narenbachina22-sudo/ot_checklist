-- Rename the "consultations" module to "counselling" to match the app-wide rename.
ALTER TABLE public.consultations RENAME TO counselling;
ALTER TABLE public.counselling RENAME COLUMN consultation_date TO counselling_date;
ALTER TABLE public.profiles RENAME COLUMN can_consultations TO can_counselling;
