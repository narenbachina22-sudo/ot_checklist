import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { ChecklistForm } from "@/components/ChecklistForm";
import { emptyChecklist, type ChecklistData } from "@/lib/checklist-schema";

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
  notFoundComponent: () => <div className="p-6 text-sm">Checklist not found.</div>,
});

function ViewChecklist() {
  const { id } = Route.useParams();

  const { data, isLoading, error } = useQuery({
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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to records
          </Link>
        </Button>
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
            <h1 className="text-2xl font-semibold tracking-tight">{data.patient_name}</h1>
            <p className="text-sm text-muted-foreground">
              Recorded by {data.created_by_name} · {new Date(data.created_at as string).toLocaleString()}
            </p>
          </div>
          <ChecklistForm
            value={{ ...emptyChecklist(), ...((data.data as ChecklistData) ?? {}) }}
            onChange={() => {}}
            readOnly
          />
        </>
      )}
    </div>
  );
}
