import type { Tables } from "@/integrations/supabase/types";

export type ConsultationRow = Tables<"consultations">;

export interface ConsultationFormValues {
  consultation_date: string;
  patient_name: string;
  age: string;
  sex: string;
  phone: string;
  location: string;
  notes: string;
}

export function emptyConsultationForm(): ConsultationFormValues {
  return {
    consultation_date: "",
    patient_name: "",
    age: "",
    sex: "",
    phone: "",
    location: "",
    notes: "",
  };
}

export function consultationRowToForm(row: ConsultationRow): ConsultationFormValues {
  return {
    consultation_date: row.consultation_date?.slice(0, 10) ?? "",
    patient_name: row.patient_name ?? "",
    age: row.age != null ? String(row.age) : "",
    sex: row.sex ?? "",
    phone: row.phone ?? "",
    location: row.location ?? "",
    notes: row.notes ?? "",
  };
}

export interface ConsultationFormErrors {
  patient_name?: string;
  consultation_date?: string;
}

export function validateConsultationForm(values: ConsultationFormValues): ConsultationFormErrors {
  const errors: ConsultationFormErrors = {};
  if (!values.patient_name.trim()) errors.patient_name = "Patient name is required.";
  if (!values.consultation_date.trim()) errors.consultation_date = "Consultation date is required.";
  return errors;
}

// Formats a plain "YYYY-MM-DD" date string using the local calendar day,
// avoiding the off-by-one shift `new Date(dateOnlyString)` causes in
// negative-UTC-offset timezones (it parses as UTC midnight).
export function formatDateOnly(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString();
}
