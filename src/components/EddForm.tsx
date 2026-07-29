import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { calcEdd, formatDateOnly, type EddFormErrors, type EddFormValues } from "@/lib/edd";

interface Props {
  value: EddFormValues;
  onChange: (next: EddFormValues) => void;
  errors?: EddFormErrors;
  readOnly?: boolean;
}

const SEX_OPTIONS = ["Female", "Male", "Other"];

export function EddForm({ value, onChange, errors, readOnly = false }: Props) {
  function set<K extends keyof EddFormValues>(key: K, v: EddFormValues[K]) {
    onChange({ ...value, [key]: v });
  }

  const edd = calcEdd(value.lmp);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">EDD details</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="patient_name">Patient Name</Label>
          <Input
            id="patient_name"
            value={value.patient_name}
            onChange={(e) => set("patient_name", e.target.value)}
            placeholder="Enter patient name"
            disabled={readOnly}
            className={cn(errors?.patient_name && "border-red-500 ring-1 ring-red-500")}
          />
          {errors?.patient_name && (
            <p className="text-xs font-medium text-red-600">{errors.patient_name}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            min="0"
            value={value.age}
            onChange={(e) => set("age", e.target.value)}
            placeholder="Age"
            disabled={readOnly}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="sex">Sex</Label>
          <Select
            value={value.sex || undefined}
            onValueChange={(v) => set("sex", v)}
            disabled={readOnly}
          >
            <SelectTrigger id="sex">
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              {SEX_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={value.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="Phone number"
            disabled={readOnly}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={value.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="Address"
            disabled={readOnly}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="lmp">Last Menstrual Period (LMP)</Label>
          <Input
            id="lmp"
            type="date"
            value={value.lmp}
            onChange={(e) => set("lmp", e.target.value)}
            disabled={readOnly}
            className={cn(errors?.lmp && "border-red-500 ring-1 ring-red-500")}
          />
          {errors?.lmp && <p className="text-xs font-medium text-red-600">{errors.lmp}</p>}
        </div>

        <div className="space-y-1">
          <Label>Expected Date of Delivery (EDD)</Label>
          <div className="flex h-10 items-center rounded-md border bg-muted px-3 text-sm font-medium">
            {edd ? formatDateOnly(edd) : "—"}
          </div>
          <p className="text-xs text-muted-foreground">
            Auto-calculated from LMP (40 weeks / 280 days).
          </p>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={value.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Any notes (optional)…"
            disabled={readOnly}
            className="min-h-[120px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}