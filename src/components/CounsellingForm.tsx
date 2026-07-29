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
import {
  PAYMENT_TYPES,
  PROCEDURE_TYPES,
  type CounsellingFormErrors,
  type CounsellingFormValues,
} from "@/lib/counselling";
import { CounsellingRoomOptions } from "@/components/CounsellingRoomOptions";

interface Props {
  value: CounsellingFormValues;
  onChange: (next: CounsellingFormValues) => void;
  errors?: CounsellingFormErrors;
  readOnly?: boolean;
}

const SEX_OPTIONS = ["Male", "Female", "Other"];

export function CounsellingForm({ value, onChange, errors, readOnly = false }: Props) {
  function set<K extends keyof CounsellingFormValues>(key: K, v: CounsellingFormValues[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="space-y-4">
      {/* 1) Counselling details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Counselling details</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="counselling_date">Counselling Date</Label>
            <Input
              id="counselling_date"
              type="date"
              value={value.counselling_date}
              onChange={(e) => set("counselling_date", e.target.value)}
              disabled={readOnly}
              className={cn(errors?.counselling_date && "border-red-500 ring-1 ring-red-500")}
            />
            {errors?.counselling_date && (
              <p className="text-xs font-medium text-red-600">{errors.counselling_date}</p>
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
            <Label htmlFor="surgery_name">Name of Surgery</Label>
            <Input
              id="surgery_name"
              value={value.surgery_name}
              onChange={(e) => set("surgery_name", e.target.value)}
              placeholder="e.g. Appendectomy"
              disabled={readOnly}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="procedure_type">Procedure Type</Label>
            <Select
              value={value.procedure_type || undefined}
              onValueChange={(v) => set("procedure_type", v)}
              disabled={readOnly}
            >
              <SelectTrigger id="procedure_type">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {PROCEDURE_TYPES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="payment_type">Payment Type</Label>
            <Select
              value={value.payment_type || undefined}
              onValueChange={(v) => set("payment_type", v)}
              disabled={readOnly}
            >
              <SelectTrigger id="payment_type">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_TYPES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end sm:pb-2">
            <label
              htmlFor="cmrf"
              className={cn(
                "flex items-center gap-2 text-sm font-medium",
                readOnly ? "cursor-default" : "cursor-pointer",
              )}
            >
              <input
                id="cmrf"
                type="checkbox"
                checked={value.cmrf}
                disabled={readOnly}
                onChange={(e) => set("cmrf", e.target.checked)}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              CMRF
              <span className="font-normal text-muted-foreground">
                (Chief Minister&apos;s Relief Fund)
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* 2) Room options — moved above notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Room options &amp; estimate</CardTitle>
        </CardHeader>
        <CardContent>
          <CounsellingRoomOptions
            options={value.room_options}
            selectedId={value.selected_option_id}
            onOptionsChange={(next) => set("room_options", next)}
            onSelectedChange={(id) => set("selected_option_id", id)}
            readOnly={readOnly}
          />
        </CardContent>
      </Card>

      {/* 3) Notes — moved to the bottom */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            value={value.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Counselling notes…"
            disabled={readOnly}
            className="min-h-[160px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}