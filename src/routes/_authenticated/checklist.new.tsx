// import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
// import { useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, Loader2, Save } from "lucide-react";
// import { ChecklistForm } from "@/components/ChecklistForm";
// import { emptyChecklist, type ChecklistData } from "@/lib/checklist-schema";
// import { toast } from "sonner";

// export const Route = createFileRoute("/_authenticated/checklist/new")({
//   head: () => ({
//     meta: [
//       { title: "New Checklist · OT Handover" },
//       { name: "description", content: "Start a new Major Surgery & Cesarean Section OT handover checklist." },
//     ],
//   }),
//   component: NewChecklist,
// });

// function NewChecklist() {
//   const navigate = useNavigate();
//   const { gate } = Route.useRouteContext();
//   const [data, setData] = useState<ChecklistData>(() => emptyChecklist());
//   const [saving, setSaving] = useState(false);

//   async function handleSave() {
//     const patientName = String(data.patient_name ?? "").trim();
//     if (!patientName) {
//       toast.error("Patient name is required.");
//       return;
//     }
//     setSaving(true);
//     const { data: userData } = await supabase.auth.getUser();
//     const uid = userData.user?.id;
//     if (!uid) {
//       toast.error("Session expired. Please sign in again.");
//       setSaving(false);
//       return;
//     }
//     const { data: inserted, error } = await supabase
//       .from("checklists")
//       .insert({
//         created_by: uid,
//         created_by_name: gate.fullName,
//         patient_name: patientName,
//         data: data as never,
//       })
//       .select("id")
//       .single();
//     setSaving(false);
//     if (error) {
//       toast.error(error.message);
//       return;
//     }
//     toast.success("Checklist saved");
//     navigate({ to: "/checklist/$id", params: { id: inserted.id } });
//   }

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center justify-between gap-3">
//         <Button variant="ghost" size="sm" asChild>
//           <Link to="/dashboard">
//             <ChevronLeft className="mr-1 h-4 w-4" />
//             Back
//           </Link>
//         </Button>
//         <Button onClick={handleSave} disabled={saving}>
//           {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
//           Save checklist
//         </Button>
//       </div>

//       <div>
//         <h1 className="text-2xl font-semibold tracking-tight">New OT Handover Checklist</h1>
//         <p className="text-sm text-muted-foreground">
//           Major Surgery & Cesarean Section — Ward Sister → OT Technician
//         </p>
//       </div>

//       <ChecklistForm value={data} onChange={setData} />

//       <div className="flex justify-end pt-2">
//         <Button onClick={handleSave} disabled={saving} size="lg">
//           {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
//           Save checklist
//         </Button>
//       </div>
//     </div>
//   );
// }


import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { ChecklistForm } from "@/components/ChecklistForm";
import { emptyChecklist, type ChecklistData } from "@/lib/checklist-schema";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/checklist/new")({
  head: () => ({
    meta: [
      { title: "New Checklist · OT Handover" },
      {
        name: "description",
        content:
          "Start a new Major Surgery & Cesarean Section OT handover checklist.",
      },
    ],
  }),
  component: NewChecklist,
});

function NewChecklist() {
  const navigate = useNavigate();
  const { gate } = Route.useRouteContext();

  const [data, setData] = useState<ChecklistData>(() => {
    const now = new Date();

    // Convert to local datetime format for <input type="datetime-local">
    const localDateTime = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    return {
      ...emptyChecklist(),
      shifted_to_ot_at: localDateTime,
    };
  });

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const patientName = String(data.patient_name ?? "").trim();

    if (!patientName) {
      toast.error("Patient name is required.");
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

    const { data: inserted, error } = await supabase
      .from("checklists")
      .insert({
        created_by: uid,
        created_by_name: gate.fullName,
        patient_name: patientName,
        data: data as never,
      })
      .select("id")
      .single();

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Checklist saved");

    navigate({
      to: "/checklist/$id",
      params: { id: inserted.id },
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save checklist
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          New OT Handover Checklist
        </h1>

        <p className="text-sm text-muted-foreground">
          Major Surgery & Cesarean Section — Ward Sister → OT Technician
        </p>
      </div>

      <ChecklistForm value={data} onChange={setData} />

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save checklist
        </Button>
      </div>
    </div>
  );
}