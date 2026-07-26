import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Save, X } from "lucide-react";
import { EddForm } from "@/components/EddForm";
import {
  eddFormToRow,
  emptyEddForm,
  validateEddForm,
  type EddFormErrors,
  type EddFormValues,
} from "@/lib/edd";
import { requireProfilePermission } from "@/lib/permissions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/edd/new")({
  beforeLoad: ({ context }) => {
    requireProfilePermission(context.gate.profile, "can_edd");
  },
  head: () => ({
    meta: [
      { title: "New EDD Record · Keerthi Hospital" },
      { name: "description", content: "Add an expected date of delivery record." },
    ],
  }),
  component: NewEdd,
});

function NewEdd() {
  const navigate = useNavigate();
  const [data, setData] = useState<EddFormValues>(() => emptyEddForm());
  const [errors, setErrors] = useState<EddFormErrors>({});
  const [saving, setSaving] = useState(false);

  function handleCancel() {
    navigate({ to: "/edd" });
  }

  async function handleSave() {
    const validationErrors = validateEddForm(data);
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

    const { error } = await supabase.from("edd_records").insert({
      created_by: uid,
      ...eddFormToRow(data),
    });

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("EDD record saved");
    navigate({ to: "/edd" });
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
        <h1 className="text-2xl font-semibold tracking-tight">New EDD Record</h1>
        <p className="text-sm text-muted-foreground">
          Enter the LMP to auto-calculate the delivery date.
        </p>
      </div>

      <EddForm value={data} onChange={setData} errors={errors} />

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