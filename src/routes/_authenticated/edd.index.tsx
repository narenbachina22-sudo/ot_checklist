// import { createFileRoute, Link } from "@tanstack/react-router";
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Baby, Loader2, Plus, Search } from "lucide-react";
// import { requireProfilePermission } from "@/lib/permissions";
// import { formatDateOnly, MONTHS, monthRange } from "@/lib/edd";

// export const Route = createFileRoute("/_authenticated/edd/")({
//   beforeLoad: ({ context }) => {
//     requireProfilePermission(context.gate.profile, "can_edd");
//   },
//   head: () => ({
//     meta: [
//       { title: "EDD List · Keerthi Hospital" },
//       { name: "description", content: "Expected delivery dates by month." },
//     ],
//   }),
//   component: EddList,
// });

// interface EddListRow {
//   id: string;
//   patient_name: string;
//   age: number | null;
//   sex: string | null;
//   lmp: string;
//   edd: string;
//   created_by: string;
// }

// function EddList() {
//   const now = new Date();
//   const [month, setMonth] = useState<number>(now.getMonth() + 1);
//   const [year, setYear] = useState<number>(now.getFullYear());
//   const [search, setSearch] = useState("");

//   const baseYear = now.getFullYear();
//   const years = Array.from({ length: 5 }, (_, i) => baseYear - 2 + i);

//   const { data, isLoading } = useQuery({
//     queryKey: ["edd-list", year, month, search],
//     queryFn: async (): Promise<{ rows: EddListRow[]; creatorNames: Map<string, string> }> => {
//       const { start, end } = monthRange(year, month);
//       let q = supabase
//         .from("edd_records")
//         .select("id, patient_name, age, sex, lmp, edd, created_by")
//         .gte("edd", start)
//         .lt("edd", end)
//         .order("edd", { ascending: true })
//         .limit(500);
//       if (search.trim()) q = q.ilike("patient_name", `%${search.trim()}%`);
//       const { data, error } = await q;
//       if (error) throw error;
//       const rows = (data ?? []) as EddListRow[];

//       const creatorIds = [...new Set(rows.map((r) => r.created_by))];
//       let creatorNames = new Map<string, string>();
//       if (creatorIds.length > 0) {
//         const { data: creators } = await supabase
//           .from("profiles")
//           .select("id, full_name")
//           .in("id", creatorIds);
//         creatorNames = new Map((creators ?? []).map((c) => [c.id, c.full_name]));
//       }
//       return { rows, creatorNames };
//     },
//   });

//   const rows = data?.rows ?? [];
//   const creatorNames = data?.creatorNames ?? new Map<string, string>();

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight">EDD List</h1>
//           <p className="text-sm text-muted-foreground">Patients by expected month of delivery</p>
//         </div>
//         <Button asChild>
//           <Link to="/edd/new">
//             <Plus className="mr-2 h-4 w-4" />
//             New EDD Record
//           </Link>
//         </Button>
//       </div>

//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="flex items-center gap-2 text-base">
//             <Baby className="h-4 w-4" />
//             Expected deliveries
//           </CardTitle>
//           <CardDescription>Pick a month to see everyone due then.</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//             <div className="flex gap-2">
//               <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
//                 <SelectTrigger className="w-[150px]">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {MONTHS.map((name, i) => (
//                     <SelectItem key={name} value={String(i + 1)}>
//                       {name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
//                 <SelectTrigger className="w-[110px]">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {years.map((y) => (
//                     <SelectItem key={y} value={String(y)}>
//                       {y}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Filter by patient name…"
//                 className="pl-9"
//               />
//             </div>
//           </div>

//           {isLoading ? (
//             <div className="flex justify-center py-10">
//               <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
//             </div>
//           ) : rows.length === 0 ? (
//             <div className="rounded-md border border-dashed py-10 text-center text-sm text-muted-foreground">
//               No EDD records for {MONTHS[month - 1]} {year}.
//             </div>
//           ) : (
//             <div className="overflow-x-auto rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Patient Name</TableHead>
//                     <TableHead>Age</TableHead>
//                     <TableHead>Sex</TableHead>
//                     <TableHead>LMP</TableHead>
//                     <TableHead>EDD</TableHead>
//                     <TableHead>Created By</TableHead>
//                     <TableHead className="text-right">Action</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {rows.map((row) => (
//                     <TableRow key={row.id}>
//                       <TableCell className="font-medium">{row.patient_name}</TableCell>
//                       <TableCell>{row.age ?? "—"}</TableCell>
//                       <TableCell>{row.sex ?? "—"}</TableCell>
//                       <TableCell>{formatDateOnly(row.lmp)}</TableCell>
//                       <TableCell className="font-medium">{formatDateOnly(row.edd)}</TableCell>
//                       <TableCell>{creatorNames.get(row.created_by) ?? "—"}</TableCell>
//                       <TableCell className="text-right">
//                         <Button variant="outline" size="sm" asChild>
//                           <Link to="/edd/$id" params={{ id: row.id }}>
//                             View / Edit
//                           </Link>
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Baby, Loader2, Plus, Search } from "lucide-react";
import { requireProfilePermission } from "@/lib/permissions";
import { formatDateOnly, MONTHS, monthRange } from "@/lib/edd";

export const Route = createFileRoute("/_authenticated/edd/")({
  beforeLoad: ({ context }) => {
    requireProfilePermission(context.gate.profile, "can_edd");
  },
  head: () => ({
    meta: [
      { title: "EDD List · Keerthi Hospital" },
      { name: "description", content: "Expected delivery dates by month." },
    ],
  }),
  component: EddList,
});

// month === 0 means "All months" (no date filter).
const ALL_MONTHS = 0;

interface EddListRow {
  id: string;
  patient_name: string;
  age: number | null;
  sex: string | null;
  lmp: string;
  edd: string;
  created_by: string;
}

function EddList() {
  const now = new Date();
  const [month, setMonth] = useState<number>(ALL_MONTHS); // show everything by default
  const [year, setYear] = useState<number>(now.getFullYear());
  const [search, setSearch] = useState("");

  const baseYear = now.getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => baseYear - 2 + i);

  const { data, isLoading } = useQuery({
    queryKey: ["edd-list", year, month, search],
    queryFn: async (): Promise<{ rows: EddListRow[]; creatorNames: Map<string, string> }> => {
      let q = supabase
        .from("edd_records")
        .select("id, patient_name, age, sex, lmp, edd, created_by")
        .order("edd", { ascending: true })
        .limit(500);

      // Only constrain by date when a specific month is chosen.
      if (month !== ALL_MONTHS) {
        const { start, end } = monthRange(year, month);
        q = q.gte("edd", start).lt("edd", end);
      }
      if (search.trim()) q = q.ilike("patient_name", `%${search.trim()}%`);

      const { data, error } = await q;
      if (error) throw error;
      const rows = (data ?? []) as EddListRow[];

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
          <h1 className="text-2xl font-semibold tracking-tight">EDD List</h1>
          <p className="text-sm text-muted-foreground">Patients by expected month of delivery</p>
        </div>
        <Button asChild>
          <Link to="/edd/new">
            <Plus className="mr-2 h-4 w-4" />
            New EDD Record
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Baby className="h-4 w-4" />
            Expected deliveries
          </CardTitle>
          <CardDescription>Showing all records — pick a month to narrow the list.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex gap-2">
              <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(ALL_MONTHS)}>All months</SelectItem>
                  {MONTHS.map((name, i) => (
                    <SelectItem key={name} value={String(i + 1)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(year)}
                onValueChange={(v) => setYear(Number(v))}
                disabled={month === ALL_MONTHS}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by patient name…"
                className="pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-md border border-dashed py-10 text-center text-sm text-muted-foreground">
              {month === ALL_MONTHS
                ? "No EDD records yet."
                : `No EDD records for ${MONTHS[month - 1]} ${year}.`}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Sex</TableHead>
                    <TableHead>LMP</TableHead>
                    <TableHead>EDD</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.patient_name}</TableCell>
                      <TableCell>{row.age ?? "—"}</TableCell>
                      <TableCell>{row.sex ?? "—"}</TableCell>
                      <TableCell>{formatDateOnly(row.lmp)}</TableCell>
                      <TableCell className="font-medium">{formatDateOnly(row.edd)}</TableCell>
                      <TableCell>{creatorNames.get(row.created_by) ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/edd/$id" params={{ id: row.id }}>
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