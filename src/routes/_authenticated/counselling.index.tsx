import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Stethoscope, Plus, Search, Loader2, Share2 } from "lucide-react";
import { requireProfilePermission } from "@/lib/permissions";
import {
  formatDateOnly,
  buildWhatsAppSummary,
  summaryPeriodRange,
  SUMMARY_PERIODS,
  SUMMARY_PERIOD_LABELS,
  type SummaryPeriod,
  type CounsellingSummaryRow,
} from "@/lib/counselling";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/counselling/")({
  beforeLoad: ({ context }) => {
    requireProfilePermission(context.gate.profile, "can_counselling");
  },
  head: () => ({
    meta: [
      { title: "Counselling · Keerthi Hospital" },
      { name: "description", content: "Create and browse patient counselling." },
    ],
  }),
  component: CounsellingList,
});

interface CounsellingRow {
  id: string;
  patient_name: string;
  counselling_date: string;
  created_by: string;
}

function CounsellingList() {
  const [search, setSearch] = useState("");
  const [summaryPeriod, setSummaryPeriod] = useState<SummaryPeriod>("day");

  const { data: summaryData, isFetching: summaryLoading } = useQuery({
    queryKey: ["counselling-summary", summaryPeriod],
    queryFn: async () => {
      const range = summaryPeriodRange(summaryPeriod);
      const { data, error } = await supabase
        .from("counselling")
        .select("patient_name, phone, age, surgery_name")
        .gte("counselling_date", range.start)
        .lt("counselling_date", range.end)
        .order("patient_name");
      if (error) throw error;
      return { rows: (data ?? []) as CounsellingSummaryRow[], range };
    },
  });

  const summaryRows = summaryData?.rows ?? [];

  function handleShareSummary() {
    if (!summaryData || summaryRows.length === 0) {
      toast.error("No counsellings found for this period.");
      return;
    }
    const text = buildWhatsAppSummary(summaryRows, summaryData.range.label);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  const { data, isLoading } = useQuery({
    queryKey: ["counselling", search],
    queryFn: async (): Promise<{ rows: CounsellingRow[]; creatorNames: Map<string, string> }> => {
      let q = supabase
        .from("counselling")
        .select("id, patient_name, counselling_date, created_by")
        .order("counselling_date", { ascending: false })
        .limit(200);
      if (search.trim()) q = q.ilike("patient_name", `%${search.trim()}%`);
      const { data, error } = await q;
      if (error) throw error;
      const rows = (data ?? []) as CounsellingRow[];

      const creatorIds = [...new Set(rows.map((r) => r.created_by))];
      let creatorNames = new Map<string, string>();
      if (creatorIds.length > 0) {
        const { data: creators } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", creatorIds);
        creatorNames = new Map((creators ?? []).map((c) => [c.id, c.full_name]));
      }

      return { rows, creatorNames };
    },
  });

  const rows = data?.rows ?? [];
  const creatorNames = data?.creatorNames ?? new Map<string, string>();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Counselling</h1>
          <p className="text-sm text-muted-foreground">Patient counselling records</p>
        </div>
        <Button asChild>
          <Link to="/counselling/new">
            <Plus className="mr-2 h-4 w-4" />
            New Counselling
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Share2 className="h-4 w-4" />
            Share summary
          </CardTitle>
          <CardDescription>
            Share a WhatsApp-ready summary (name, phone, age, surgery) for the selected period.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {SUMMARY_PERIODS.map((p) => (
              <Button
                key={p}
                type="button"
                variant={summaryPeriod === p ? "default" : "outline"}
                size="sm"
                onClick={() => setSummaryPeriod(p)}
              >
                {SUMMARY_PERIOD_LABELS[p]}
              </Button>
            ))}
          </div>
          <Button onClick={handleShareSummary} disabled={summaryLoading}>
            {summaryLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Share2 className="mr-2 h-4 w-4" />
            )}
            Share on WhatsApp{summaryRows.length > 0 ? ` (${summaryRows.length})` : ""}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="h-4 w-4" />
            Counselling records
          </CardTitle>
          <CardDescription>Search by patient name.</CardDescription>
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
          ) : rows.length === 0 ? (
            <div className="rounded-md border border-dashed py-10 text-center text-sm text-muted-foreground">
              {search ? "No results found." : "No counselling yet. Create the first one."}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Counselling Date</TableHead>
                    <TableHead>Doctor / Created By</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.patient_name}</TableCell>
                      <TableCell>{formatDateOnly(row.counselling_date)}</TableCell>
                      <TableCell>{creatorNames.get(row.created_by) ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/counselling/$id" params={{ id: row.id }}>
                            View / Edit
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
