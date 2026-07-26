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
import type { ConsultationFormErrors, ConsultationFormValues } from "@/lib/consultation";

interface Props {
  value: ConsultationFormValues;
  onChange: (next: ConsultationFormValues) => void;
  errors?: ConsultationFormErrors;
  readOnly?: boolean;
}

const SEX_OPTIONS = ["Male", "Female", "Other"];

export function ConsultationForm({ value, onChange, errors, readOnly = false }: Props) {
  function set<K extends keyof ConsultationFormValues>(key: K, v: ConsultationFormValues[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Consultation details</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="consultation_date">Consultation Date</Label>
          <Input
            id="consultation_date"
            type="date"
            value={value.consultation_date}
            onChange={(e) => set("consultation_date", e.target.value)}
            disabled={readOnly}
            className={cn(errors?.consultation_date && "border-red-500 ring-1 ring-red-500")}
          />
          {errors?.consultation_date && (
            <p className="text-xs font-medium text-red-600">{errors.consultation_date}</p>
          )}
        </div>

        <div className="space-y-1">
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
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={value.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Ward / address"
            disabled={readOnly}
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={value.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Consultation notes…"
            disabled={readOnly}
            className="min-h-[160px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
