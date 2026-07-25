import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardCheck, Plus, Search, FileText, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Checklists · OT Handover" },
      { name: "description", content: "Create and browse OT handover checklists by patient name." },
    ],
  }),
  component: Dashboard,
});

interface ChecklistRow {
  id: string;
  patient_name: string;
  created_by_name: string;
  created_at: string;
}

function Dashboard() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["checklists", search],
    queryFn: async (): Promise<ChecklistRow[]> => {
      let q = supabase
        .from("checklists")
        .select("id, patient_name, created_by_name, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (search.trim()) q = q.ilike("patient_name", `%${search.trim()}%`);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as ChecklistRow[];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Patient Checklists</h1>
          <p className="text-sm text-muted-foreground">
            Major Surgery & Cesarean Section OT Handover
          </p>
        </div>
        <Button asChild>
          <Link to="/checklist/new">
            <Plus className="mr-2 h-4 w-4" />
            New checklist
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardCheck className="h-4 w-4" />
            Previous records
          </CardTitle>
          <CardDescription>Search by patient name to find a past handover.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient name…"
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : !data || data.length === 0 ? (
            <div className="rounded-md border border-dashed py-10 text-center text-sm text-muted-foreground">
              {search ? "No records match that name." : "No checklists yet. Create the first one."}
            </div>
          ) : (
            <ul className="divide-y rounded-md border">
              {data.map((row) => (
                <li key={row.id}>
                  <Link
                    to="/checklist/$id"
                    params={{ id: row.id }}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-accent"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{row.patient_name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          By {row.created_by_name} · {new Date(row.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">Open →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
