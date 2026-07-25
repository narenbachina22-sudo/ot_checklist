
CREATE TABLE public.checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by_name text NOT NULL,
  patient_name text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX checklists_patient_name_idx ON public.checklists (lower(patient_name));
CREATE INDEX checklists_created_at_idx ON public.checklists (created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.checklists TO authenticated;
GRANT ALL ON public.checklists TO service_role;

ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authorized staff can view all checklists"
  ON public.checklists FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.can_use_ot_handover_checklist = true
    )
  );

CREATE POLICY "Authorized staff can create checklists"
  ON public.checklists FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.can_use_ot_handover_checklist = true
    )
  );

CREATE POLICY "Creators can update own checklists"
  ON public.checklists FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can delete own checklists"
  ON public.checklists FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_checklists_updated_at
  BEFORE UPDATE ON public.checklists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
