// import { createFileRoute, Link } from "@tanstack/react-router";
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, Loader2 } from "lucide-react";
// import { ChecklistForm } from "@/components/ChecklistForm";
// import { emptyChecklist, type ChecklistData } from "@/lib/checklist-schema";

// export const Route = createFileRoute("/_authenticated/checklist/$id")({
//   head: () => ({
//     meta: [
//       { title: "Checklist · OT Handover" },
//       { name: "description", content: "View a saved OT handover checklist." },
//     ],
//   }),
//   component: ViewChecklist,
//   errorComponent: ({ error }) => (
//     <div className="p-6 text-sm text-destructive">Failed to load: {error.message}</div>
//   ),
//   notFoundComponent: () => <div className="p-6 text-sm">Checklist not found.</div>,
// });

// function ViewChecklist() {
//   const { id } = Route.useParams();

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["checklist", id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("checklists")
//         .select("id, patient_name, created_by_name, created_at, data")
//         .eq("id", id)
//         .maybeSingle();
//       if (error) throw error;
//       return data;
//     },
//   });

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center justify-between gap-3">
//         <Button variant="ghost" size="sm" asChild>
//           <Link to="/dashboard">
//             <ChevronLeft className="mr-1 h-4 w-4" />
//             Back to records
//           </Link>
//         </Button>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center py-10">
//           <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
//         </div>
//       ) : error ? (
//         <p className="text-sm text-destructive">{error.message}</p>
//       ) : !data ? (
//         <p className="text-sm text-muted-foreground">Checklist not found.</p>
//       ) : (
//         <>
//           <div>
//             <h1 className="text-2xl font-semibold tracking-tight">{data.patient_name}</h1>
//             <p className="text-sm text-muted-foreground">
//               Recorded by {data.created_by_name} · {new Date(data.created_at as string).toLocaleString()}
//             </p>
//           </div>
//           <ChecklistForm
//             value={{ ...emptyChecklist(), ...((data.data as ChecklistData) ?? {}) }}
//             onChange={() => {}}
//             readOnly
//           />
//         </>
//       )}
//     </div>
//   );
// }



import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Loader2,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { ChecklistForm } from "@/components/ChecklistForm";
import {
  emptyChecklist,
  type ChecklistData,
} from "@/lib/checklist-schema";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/checklist/$id")({
  head: () => ({
    meta: [
      { title: "Checklist · OT Handover" },
      { name: "description", content: "View a saved OT handover checklist." },
    ],
  }),
  component: ViewChecklist,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Failed to load: {error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="p-6 text-sm">Checklist not found.</div>
  ),
});

function ViewChecklist() {
  const { id } = Route.useParams();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ChecklistData>(emptyChecklist());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["checklist", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checklists")
        .select("id, patient_name, created_by_name, created_at, data")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setFormData({
        ...emptyChecklist(),
        ...((data.data as ChecklistData) ?? {}),
      });
    }
  }, [data]);

  async function handleSaveChanges() {
    const patientName = String(formData.patient_name ?? "").trim();

    if (!patientName) {
      toast.error("Patient name is required.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("checklists")
      .update({
        patient_name: patientName,
        data: formData as never,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Checklist updated.");
    setEditing(false);
    refetch();
  }

  function handleCancel() {
    if (!data) return;

    setFormData({
      ...emptyChecklist(),
      ...((data.data as ChecklistData) ?? {}),
    });

    setEditing(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to records
          </Link>
        </Button>

        {!isLoading && data && (
          <div className="flex flex-wrap gap-2">
            {editing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>

                <Button onClick={handleSaveChanges} disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error.message}</p>
      ) : !data ? (
        <p className="text-sm text-muted-foreground">Checklist not found.</p>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {formData.patient_name}
            </h1>

            <p className="text-sm text-muted-foreground">
              Recorded by {data.created_by_name} ·{" "}
              {new Date(data.created_at as string).toLocaleString()}
            </p>
          </div>

          <ChecklistForm
            value={formData}
            onChange={setFormData}
            readOnly={!editing}
          />
        </>
      )}
    </div>
  );
}
