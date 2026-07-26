import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Save, X } from "lucide-react";
import { ConsultationForm } from "@/components/ConsultationForm";
import {

  emptyConsultationForm,
  validateConsultationForm,
  type ConsultationFormErrors,
  type ConsultationFormValues,
} from "@/lib/consultation";
import { requireProfilePermission } from "@/lib/permissions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/consultations/new")({
  beforeLoad: ({ context }) => {
    requireProfilePermission(context.gate.profile, "can_consultations");
  },
  head: () => ({
    meta: [
      { title: "New Consultation · Keerthi Hospital" },
      { name: "description", content: "Record a new patient consultation." },
    ],
  }),
  component: NewConsultation,
});

function NewConsultation() {
  const navigate = useNavigate();
  const [data, setData] = useState<ConsultationFormValues>(() => emptyConsultationForm());
  const [errors, setErrors] = useState<ConsultationFormErrors>({});
  const [saving, setSaving] = useState(false);

  function handleCancel() {
    navigate({ to: "/consultations" });
  }

  async function handleSave() {
    const validationErrors = validateConsultationForm(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors below.");
      return;
    }

    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;

    if (!uid) {
      toast.error("Session expired. Please sign in again.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("consultations").insert({
      created_by: uid,
      consultation_date: data.consultation_date,
      patient_name: data.patient_name.trim(),
      age: data.age.trim() ? Number(data.age) : null,
      sex: data.sex || null,
      phone: data.phone.trim() || null,
      location: data.location.trim() || null,
      notes: data.notes.trim() || null,
    });

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Consultation saved");
    navigate({ to: "/consultations" });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          <X className="mr-1 h-4 w-4" />
          Cancel
        </Button>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New Consultation</h1>
        <p className="text-sm text-muted-foreground">Record patient consultation details.</p>
      </div>

      <ConsultationForm value={data} onChange={setData} errors={errors} />

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={handleCancel} disabled={saving}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save
        </Button>
      </div>
    </div>
  );
}
