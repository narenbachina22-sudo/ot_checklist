// import { createFileRoute, Link } from "@tanstack/react-router";
// import { useEffect, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, Loader2, Pencil, Save, X } from "lucide-react";
// import { ConsultationForm } from "@/components/ConsultationForm";
// import {
//   consultationRowToForm,
//   emptyConsultationForm,
//   validateConsultationForm,
//   type ConsultationFormErrors,
//   type ConsultationFormValues,
// } from "@/lib/consultation";
// import { requireProfilePermission } from "@/lib/permissions";
// import { toast } from "sonner";

// export const Route = createFileRoute("/_authenticated/consultations/$id")({
//   beforeLoad: ({ context }) => {
//     requireProfilePermission(context.gate.profile, "can_consultations");
//   },
//   head: () => ({
//     meta: [
//       { title: "Consultation · Keerthi Hospital" },
//       { name: "description", content: "View a saved patient consultation." },
//     ],
//   }),
//   component: ViewConsultation,
//   errorComponent: ({ error }) => (
//     <div className="p-6 text-sm text-destructive">Failed to load: {error.message}</div>
//   ),
//   notFoundComponent: () => <div className="p-6 text-sm">Consultation not found.</div>,
// });

// function ViewConsultation() {
//   const { id } = Route.useParams();

//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [formData, setFormData] = useState<ConsultationFormValues>(emptyConsultationForm());
//   const [errors, setErrors] = useState<ConsultationFormErrors>({});
//   const [creatorName, setCreatorName] = useState<string | null>(null);

//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ["consultation", id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("consultations")
//         .select("*")
//         .eq("id", id)
//         .maybeSingle();
//       if (error) throw error;
//       return data;
//     },
//   });

//   useEffect(() => {
//     if (data) {
//       setFormData(consultationRowToForm(data));
//     }
//   }, [data]);

//   useEffect(() => {
//     if (!data?.created_by) return;
//     let cancelled = false;
//     supabase
//       .from("profiles")
//       .select("full_name")
//       .eq("id", data.created_by)
//       .maybeSingle()
//       .then(({ data: creator }) => {
//         if (!cancelled) setCreatorName(creator?.full_name ?? null);
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, [data?.created_by]);

//   async function handleSaveChanges() {
//     const validationErrors = validateConsultationForm(formData);
//     setErrors(validationErrors);
//     if (Object.keys(validationErrors).length > 0) {
//       toast.error("Please fix the errors below.");
//       return;
//     }

//     setSaving(true);

//     const { error } = await supabase
//       .from("consultations")
//       .update({
//         consultation_date: formData.consultation_date,
//         patient_name: formData.patient_name.trim(),
//         age: formData.age.trim() ? Number(formData.age) : null,
//         sex: formData.sex || null,
//         phone: formData.phone.trim() || null,
//         location: formData.location.trim() || null,
//         notes: formData.notes.trim() || null,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", id);

//     setSaving(false);

//     if (error) {
//       toast.error(error.message);
//       return;
//     }

//     toast.success("Consultation updated.");
//     setEditing(false);
//     refetch();
//   }

//   function handleCancel() {
//     if (!data) return;
//     setFormData(consultationRowToForm(data));
//     setErrors({});
//     setEditing(false);
//   }

//   return (
//     <div className="space-y-5">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <Button variant="ghost" size="sm" asChild>
//           <Link to="/consultations">
//             <ChevronLeft className="mr-1 h-4 w-4" />
//             Back to consultations
//           </Link>
//         </Button>

//         {!isLoading && data && (
//           <div className="flex flex-wrap gap-2">
//             {editing ? (
//               <>
//                 <Button variant="outline" onClick={handleCancel} disabled={saving}>
//                   <X className="mr-2 h-4 w-4" />
//                   Cancel
//                 </Button>
//                 <Button onClick={handleSaveChanges} disabled={saving}>
//                   {saving ? (
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   ) : (
//                     <Save className="mr-2 h-4 w-4" />
//                   )}
//                   Save Changes
//                 </Button>
//               </>
//             ) : (
//               <Button onClick={() => setEditing(true)}>
//                 <Pencil className="mr-2 h-4 w-4" />
//                 Edit
//               </Button>
//             )}
//           </div>
//         )}
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center py-10">
//           <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
//         </div>
//       ) : error ? (
//         <p className="text-sm text-destructive">{error.message}</p>
//       ) : !data ? (
//         <p className="text-sm text-muted-foreground">Consultation not found.</p>
//       ) : (
//         <>
//           <div>
//             <h1 className="text-2xl font-semibold tracking-tight">{formData.patient_name}</h1>
//             <p className="text-sm text-muted-foreground">
//               {creatorName ? `Recorded by ${creatorName} · ` : ""}
//               {new Date(data.created_at).toLocaleString()}
//             </p>
//           </div>

//           <ConsultationForm
//             value={formData}
//             onChange={setFormData}
//             errors={errors}
//             readOnly={!editing}
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
import { ChevronLeft, Loader2, Pencil, Save, X } from "lucide-react";
import { ConsultationForm } from "@/components/ConsultationForm";
import {
  consultationFormToRow,
  consultationRowToForm,
  emptyConsultationForm,
  validateConsultationForm,
  type ConsultationFormErrors,
  type ConsultationFormValues,
} from "@/lib/consultation";
import { requireProfilePermission } from "@/lib/permissions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/consultations/$id")({
  beforeLoad: ({ context }) => {
    requireProfilePermission(context.gate.profile, "can_consultations");
  },
  head: () => ({
    meta: [
      { title: "Consultation · Keerthi Hospital" },
      { name: "description", content: "View a saved patient consultation." },
    ],
  }),
  component: ViewConsultation,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Failed to load: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-6 text-sm">Consultation not found.</div>,
});

function ViewConsultation() {
  const { id } = Route.useParams();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ConsultationFormValues>(emptyConsultationForm());
  const [errors, setErrors] = useState<ConsultationFormErrors>({});
  const [creatorName, setCreatorName] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["consultation", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setFormData(consultationRowToForm(data));
    }
  }, [data]);

  useEffect(() => {
    if (!data?.created_by) return;
    let cancelled = false;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", data.created_by)
      .maybeSingle()
      .then(({ data: creator }) => {
        if (!cancelled) setCreatorName(creator?.full_name ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [data?.created_by]);

  async function handleSaveChanges() {
    const validationErrors = validateConsultationForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors below.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("consultations")
      .update({
        ...consultationFormToRow(formData),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Consultation updated.");
    setEditing(false);
    refetch();
  }

  function handleCancel() {
    if (!data) return;
    setFormData(consultationRowToForm(data));
    setErrors({});
    setEditing(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/consultations">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to consultations
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
        <p className="text-sm text-muted-foreground">Consultation not found.</p>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{formData.patient_name}</h1>
            <p className="text-sm text-muted-foreground">
              {creatorName ? `Recorded by ${creatorName} · ` : ""}
              {new Date(data.created_at).toLocaleString()}
            </p>
          </div>

          <ConsultationForm
            value={formData}
            onChange={setFormData}
            errors={errors}
            readOnly={!editing}
          />
        </>
      )}
    </div>
  );
}