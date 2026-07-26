import type { Tables } from "@/integrations/supabase/types";

export type EddRow = Tables<"edd_records">;

/* ------------------------------------------------------------------ */
/* Form values                                                         */
/* ------------------------------------------------------------------ */

export interface EddFormValues {
  patient_name: string;
  age: string;
  sex: string;
  lmp: string; // last menstrual period, "YYYY-MM-DD"
  notes: string;
}

export function emptyEddForm(): EddFormValues {
  return { patient_name: "", age: "", sex: "", lmp: "", notes: "" };
}

export function eddRowToForm(row: EddRow): EddFormValues {
  return {
    patient_name: row.patient_name ?? "",
    age: row.age != null ? String(row.age) : "",
    sex: row.sex ?? "",
    lmp: row.lmp?.slice(0, 10) ?? "",
    notes: row.notes ?? "",
  };
}

/* ------------------------------------------------------------------ */
/* EDD calculation (Naegele's rule: LMP + 280 days = 40 weeks)         */
/* ------------------------------------------------------------------ */

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return "";
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/** Expected date of delivery from the last menstrual period. */
export function calcEdd(lmp: string): string {
  if (!lmp) return "";
  return addDays(lmp, 280);
}

/** Shapes the form into the columns the DB expects (EDD is derived here). */
export function eddFormToRow(values: EddFormValues) {
  return {
    patient_name: values.patient_name.trim(),
    age: values.age.trim() ? Number(values.age) : null,
    sex: values.sex || null,
    lmp: values.lmp,
    edd: calcEdd(values.lmp),
    notes: values.notes.trim() || null,
  };
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export interface EddFormErrors {
  patient_name?: string;
  lmp?: string;
}

export function validateEddForm(values: EddFormValues): EddFormErrors {
  const errors: EddFormErrors = {};
  if (!values.patient_name.trim()) errors.patient_name = "Patient name is required.";
  if (!values.lmp.trim()) errors.lmp = "Last menstrual period is required.";
  return errors;
}

/* ------------------------------------------------------------------ */
/* Month filter helpers (for the list)                                 */
/* ------------------------------------------------------------------ */

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Half-open date range [start, end) covering the given month. */
export function monthRange(year: number, month1to12: number): { start: string; end: string } {
  const start = `${year}-${String(month1to12).padStart(2, "0")}-01`;
  const nextMonth = month1to12 === 12 ? 1 : month1to12 + 1;
  const nextYear = month1to12 === 12 ? year + 1 : year;
  const end = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;
  return { start, end };
}

// Local-calendar formatting; avoids the UTC off-by-one of new Date("YYYY-MM-DD").
export function formatDateOnly(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString();
}