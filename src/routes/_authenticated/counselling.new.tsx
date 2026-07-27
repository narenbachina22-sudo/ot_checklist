// import { createFileRoute, useNavigate } from "@tanstack/react-router";
// import { useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Loader2, Save, X } from "lucide-react";
// import { CounsellingForm } from "@/components/CounsellingForm";
// import {

//   emptyCounsellingForm,
//   validateCounsellingForm,
//   type CounsellingFormErrors,
//   type CounsellingFormValues,
// } from "@/lib/counselling";
// import { requireProfilePermission } from "@/lib/permissions";
// import { toast } from "sonner";

// export const Route = createFileRoute("/_authenticated/counselling/new")({
//   beforeLoad: ({ context }) => {
//     requireProfilePermission(context.gate.profile, "can_counselling");
//   },
//   head: () => ({
//     meta: [
//       { title: "New Counselling · Keerthi Hospital" },
//       { name: "description", content: "Record a new patient counselling." },
//     ],
//   }),
//   component: NewCounselling,
// });

// function NewCounselling() {
//   const navigate = useNavigate();
//   const [data, setData] = useState<CounsellingFormValues>(() => emptyCounsellingForm());
//   const [errors, setErrors] = useState<CounsellingFormErrors>({});
//   const [saving, setSaving] = useState(false);

//   function handleCancel() {
//     navigate({ to: "/counselling" });
//   }

//   async function handleSave() {
//     const validationErrors = validateCounsellingForm(data);
//     setErrors(validationErrors);
//     if (Object.keys(validationErrors).length > 0) {
//       toast.error("Please fix the errors below.");
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

//     const { error } = await supabase.from("counselling").insert({
//       created_by: uid,
//       counselling_date: data.counselling_date,
//       patient_name: data.patient_name.trim(),
//       age: data.age.trim() ? Number(data.age) : null,
//       sex: data.sex || null,
//       phone: data.phone.trim() || null,
//       location: data.location.trim() || null,
//       notes: data.notes.trim() || null,
//     });

//     setSaving(false);

//     if (error) {
//       toast.error(error.message);
//       return;
//     }

//     toast.success("Counselling saved");
//     navigate({ to: "/counselling" });
//   }

//   return (
//     <div className="space-y-5">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <Button variant="ghost" size="sm" onClick={handleCancel}>
//           <X className="mr-1 h-4 w-4" />
//           Cancel
//         </Button>

//         <Button onClick={handleSave} disabled={saving}>
//           {saving ? (
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           ) : (
//             <Save className="mr-2 h-4 w-4" />
//           )}
//           Save
//         </Button>
//       </div>

//       <div>
//         <h1 className="text-2xl font-semibold tracking-tight">New Counselling</h1>
//         <p className="text-sm text-muted-foreground">Record patient counselling details.</p>
//       </div>

//       <CounsellingForm value={data} onChange={setData} errors={errors} />

//       <div className="flex justify-end gap-2 pt-2">
//         <Button variant="outline" onClick={handleCancel} disabled={saving}>
//           <X className="mr-2 h-4 w-4" />
//           Cancel
//         </Button>
//         <Button onClick={handleSave} disabled={saving} size="lg">
//           {saving ? (
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           ) : (
//             <Save className="mr-2 h-4 w-4" />
//           )}
//           Save
//         </Button>
//       </div>
//     </div>
//   );
// }

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Save, X } from "lucide-react";
import { CounsellingForm } from "@/components/CounsellingForm";
import {
  counsellingFormToRow,
  emptyCounsellingForm,
  validateCounsellingForm,
  type CounsellingFormErrors,
  type CounsellingFormValues,
} from "@/lib/counselling";
import { requireProfilePermission } from "@/lib/permissions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/counselling/new")({
  beforeLoad: ({ context }) => {
    requireProfilePermission(context.gate.profile, "can_counselling");
  },
  head: () => ({
    meta: [
      { title: "New Counselling · Keerthi Hospital" },
      { name: "description", content: "Record a new patient counselling." },
    ],
  }),
  component: NewCounselling,
});

function NewCounselling() {
  const navigate = useNavigate();
  const [data, setData] = useState<CounsellingFormValues>(() => emptyCounsellingForm());
  const [errors, setErrors] = useState<CounsellingFormErrors>({});
  const [saving, setSaving] = useState(false);

  function handleCancel() {
    navigate({ to: "/counselling" });
  }

  async function handleSave() {
    const validationErrors = validateCounsellingForm(data);
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

    const { error } = await supabase.from("counselling").insert({
      created_by: uid,
      ...counsellingFormToRow(data),
    });

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Counselling saved");
    navigate({ to: "/counselling" });
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
        <h1 className="text-2xl font-semibold tracking-tight">New Counselling</h1>
        <p className="text-sm text-muted-foreground">Record patient counselling details.</p>
      </div>

      <CounsellingForm value={data} onChange={setData} errors={errors} />

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
