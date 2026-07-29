// import type { Json, Tables } from "@/integrations/supabase/types";

// export type CounsellingRow = Tables<"counselling">;

// /* ------------------------------------------------------------------ */
// /* Payment type                                                        */
// /* ------------------------------------------------------------------ */

// export const PAYMENT_TYPES = ["Insurance", "Non-insurance"] as const;
// export type PaymentType = (typeof PAYMENT_TYPES)[number];

// /* ------------------------------------------------------------------ */
// /* Room options                                                        */
// /* ------------------------------------------------------------------ */

// export type RoomType = "General Ward" | "Special Room" | "AC Room";

// export const ROOM_TYPES: RoomType[] = ["General Ward", "Special Room", "AC Room"];

// export const ROOM_FEATURE_KEYS = [
//   "anesthesia",
//   "room_rent",
//   "medicines",
//   "postop_medicines",
//   "tests",
//   "pediatrician",
// ] as const;

// export type RoomFeatureKey = (typeof ROOM_FEATURE_KEYS)[number];

// export const ROOM_FEATURE_LABELS: Record<RoomFeatureKey, string> = {
//   anesthesia: "Anesthesia",
//   room_rent: "Room Rent",
//   medicines: "Medicines",
//   postop_medicines: "Post-op Medicines",
//   tests: "Tests",
//   pediatrician: "Pediatrician",
// };

// // A custom feature is just a name the doctor adds; no amount, no details.
// export interface CustomFeature {
//   id: string;
//   label: string;
// }

// export interface RoomOption {
//   id: string;
//   room_type: RoomType | "";
//   // Which of the six standard features are included in this option.
//   features: RoomFeatureKey[];
//   // Extra name-only features not in the standard six.
//   custom_features: CustomFeature[];
// }

// function makeId(): string {
//   if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
//     return crypto.randomUUID();
//   }
//   return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
// }

// export function newRoomOption(room_type: RoomType | "" = ""): RoomOption {
//   return {
//     id: makeId(),
//     room_type,
//     features: [],
//     custom_features: [],
//   };
// }

// export function newCustomFeature(label = ""): CustomFeature {
//   return { id: makeId(), label };
// }

// /* ------------------------------------------------------------------ */
// /* Form values                                                         */
// /* ------------------------------------------------------------------ */

// export interface CounsellingFormValues {
//   counselling_date: string;
//   patient_name: string;
//   age: string;
//   sex: string;
//   phone: string;
//   location: string;
//   notes: string;
//   surgery_name: string;
//   amount: string;
//   payment_type: string;
//   cmrf: boolean;
//   room_options: RoomOption[];
//   selected_option_id: string;
// }

// export function emptyCounsellingForm(): CounsellingFormValues {
//   return {
//     counselling_date: "",
//     patient_name: "",
//     age: "",
//     sex: "",
//     phone: "",
//     location: "",
//     notes: "",
//     surgery_name: "",
//     amount: "",
//     payment_type: "",
//     cmrf: false,
//     room_options: [],
//     selected_option_id: "",
//   };
// }

// /**
//  * Defensively parse the jsonb `room_options` column into typed options.
//  * Handles both the current shape (features as string[]) and any older rows
//  * that stored features/custom items with amounts.
//  */
// function normalizeRoomOptions(raw: unknown): RoomOption[] {
//   if (!Array.isArray(raw)) return [];

//   const isValidKey = (v: unknown): v is RoomFeatureKey =>
//     (ROOM_FEATURE_KEYS as readonly string[]).includes(v as string);

//   return raw.map((entry) => {
//     const obj = (entry ?? {}) as Record<string, unknown>;

//     // features: current shape is string[]; migrate old object shape if present.
//     let features: RoomFeatureKey[] = [];
//     const rawFeatures = obj.features;
//     if (Array.isArray(rawFeatures)) {
//       features = rawFeatures.filter(isValidKey);
//     } else if (rawFeatures && typeof rawFeatures === "object") {
//       features = ROOM_FEATURE_KEYS.filter((k) => {
//         const v = (rawFeatures as Record<string, unknown>)[k];
//         return v != null && String(v).trim() !== "";
//       });
//     }

//     // custom_features: keep the name only (older rows may also have a value).
//     const rawCustom = obj.custom_features;
//     const custom_features: CustomFeature[] = Array.isArray(rawCustom)
//       ? rawCustom
//           .map((c) => {
//             const co = (c ?? {}) as Record<string, unknown>;
//             return {
//               id: typeof co.id === "string" ? co.id : makeId(),
//               label: co.label == null ? "" : String(co.label),
//             };
//           })
//           .filter((c) => c.label.trim() !== "")
//       : [];

//     const rt = obj.room_type;
//     return {
//       id: typeof obj.id === "string" ? obj.id : makeId(),
//       room_type: ROOM_TYPES.includes(rt as RoomType) ? (rt as RoomType) : "",
//       features,
//       custom_features,
//     };
//   });
// }

// export function counsellingRowToForm(row: CounsellingRow): CounsellingFormValues {
//   return {
//     counselling_date: row.counselling_date?.slice(0, 10) ?? "",
//     patient_name: row.patient_name ?? "",
//     age: row.age != null ? String(row.age) : "",
//     sex: row.sex ?? "",
//     phone: row.phone ?? "",
//     location: row.location ?? "",
//     notes: row.notes ?? "",
//     surgery_name: row.surgery_name ?? "",
//     amount: row.amount != null ? String(row.amount) : "",
//     payment_type: row.payment_type ?? "",
//     cmrf: row.cmrf ?? false,
//     room_options: normalizeRoomOptions(row.room_options),
//     selected_option_id: row.selected_option_id ?? "",
//   };
// }

// /**
//  * Shapes the form values into the exact columns the DB expects.
//  * Shared by the "new" and "edit" pages so they never drift apart.
//  */
// export function counsellingFormToRow(values: CounsellingFormValues) {
//   const amountNum = values.amount.trim() ? Number(values.amount) : null;

//   // Only keep a selection that still points at an existing option.
//   const selectedIsValid = values.room_options.some((o) => o.id === values.selected_option_id);

//   return {
//     counselling_date: values.counselling_date,
//     patient_name: values.patient_name.trim(),
//     age: values.age.trim() ? Number(values.age) : null,
//     sex: values.sex || null,
//     phone: values.phone.trim() || null,
//     location: values.location.trim() || null,
//     notes: values.notes.trim() || null,
//     surgery_name: values.surgery_name.trim() || null,
//     amount: amountNum != null && Number.isFinite(amountNum) ? amountNum : null,
//     payment_type: values.payment_type || null,
//     cmrf: values.cmrf,
//     room_options: values.room_options as unknown as Json,
//     selected_option_id: selectedIsValid ? values.selected_option_id : null,
//   };
// }

// /* ------------------------------------------------------------------ */
// /* Validation & formatting                                             */
// /* ------------------------------------------------------------------ */

// export interface CounsellingFormErrors {
//   patient_name?: string;
//   counselling_date?: string;
//   amount?: string;
// }

// export function validateCounsellingForm(values: CounsellingFormValues): CounsellingFormErrors {
//   const errors: CounsellingFormErrors = {};
//   if (!values.patient_name.trim()) errors.patient_name = "Patient name is required.";
//   if (!values.counselling_date.trim()) errors.counselling_date = "Counselling date is required.";
//   if (values.amount.trim() && !Number.isFinite(Number(values.amount))) {
//     errors.amount = "Amount must be a number.";
//   }
//   return errors;
// }

// // Formats a plain "YYYY-MM-DD" date string using the local calendar day,
// // avoiding the off-by-one shift `new Date(dateOnlyString)` causes in
// // negative-UTC-offset timezones (it parses as UTC midnight).
// export function formatDateOnly(value: string): string {
//   const [y, m, d] = value.split("-").map(Number);
//   if (!y || !m || !d) return value;
//   return new Date(y, m - 1, d).toLocaleDateString();
// }

import type { Json, Tables } from "@/integrations/supabase/types";

export type CounsellingRow = Tables<"counselling">;

/* ------------------------------------------------------------------ */
/* Payment type                                                        */
/* ------------------------------------------------------------------ */

export const PAYMENT_TYPES = ["Insurance", "Non-insurance"] as const;
export type PaymentType = (typeof PAYMENT_TYPES)[number];

/* ------------------------------------------------------------------ */
/* Procedure type                                                      */
/* ------------------------------------------------------------------ */

export const PROCEDURE_TYPES = ["OPD Procedure", "IP Procedure"] as const;
export type ProcedureType = (typeof PROCEDURE_TYPES)[number];

/* ------------------------------------------------------------------ */
/* Room options                                                        */
/* ------------------------------------------------------------------ */

export type RoomType = "General Ward" | "Special Room" | "AC Room";

export const ROOM_TYPES: RoomType[] = ["General Ward", "Special Room", "AC Room"];

export const ROOM_FEATURE_KEYS = [
  "anesthesia",
  "room_rent",
  "medicines",
  "postop_medicines",
  "tests",
  "pediatrician",
] as const;

export type RoomFeatureKey = (typeof ROOM_FEATURE_KEYS)[number];

export const ROOM_FEATURE_LABELS: Record<RoomFeatureKey, string> = {
  anesthesia: "Anesthesia",
  room_rent: "Room Rent",
  medicines: "Medicines",
  postop_medicines: "Post-op Medicines",
  tests: "Tests",
  pediatrician: "Pediatrician",
};

// A custom feature is just a name the doctor adds; no amount, no details.
export interface CustomFeature {
  id: string;
  label: string;
}

export interface RoomOption {
  id: string;
  room_type: RoomType | "";
  amount_min: string; // lower bound of the estimated price range
  amount_max: string; // upper bound of the estimated price range
  // Which of the six standard features are included in this option.
  features: RoomFeatureKey[];
  // Extra name-only features not in the standard six.
  custom_features: CustomFeature[];
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function newRoomOption(room_type: RoomType | "" = ""): RoomOption {
  return {
    id: makeId(),
    room_type,
    amount_min: "",
    amount_max: "",
    features: [],
    custom_features: [],
  };
}

export function newCustomFeature(label = ""): CustomFeature {
  return { id: makeId(), label };
}

/** Formats a numeric string as ₹ with Indian grouping; passes text through. */
export function formatAmount(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const n = Number(trimmed);
  return Number.isFinite(n) ? `₹${n.toLocaleString("en-IN")}` : `₹${trimmed}`;
}

/** Formats an amount range as "₹25,000 – ₹35,000"; falls back gracefully if one side is blank. */
export function formatAmountRange(min: string, max: string): string {
  const minLabel = formatAmount(min);
  const maxLabel = formatAmount(max);
  if (minLabel && maxLabel) return `${minLabel} – ${maxLabel}`;
  return minLabel || maxLabel;
}

/* ------------------------------------------------------------------ */
/* Form values                                                         */
/* ------------------------------------------------------------------ */

export interface CounsellingFormValues {
  counselling_date: string;
  patient_name: string;
  age: string;
  sex: string;
  phone: string;
  location: string;
  notes: string;
  surgery_name: string;
  procedure_type: string;
  payment_type: string;
  cmrf: boolean;
  room_options: RoomOption[];
  selected_option_id: string;
}

export function emptyCounsellingForm(): CounsellingFormValues {
  return {
    counselling_date: "",
    patient_name: "",
    age: "",
    sex: "",
    phone: "",
    location: "",
    notes: "",
    surgery_name: "",
    procedure_type: "",
    payment_type: "",
    cmrf: false,
    room_options: [],
    selected_option_id: "",
  };
}

/**
 * Defensively parse the jsonb `room_options` column into typed options.
 * Handles both the current shape and any older rows that stored features
 * with per-feature amounts.
 */
function normalizeRoomOptions(raw: unknown): RoomOption[] {
  if (!Array.isArray(raw)) return [];

  const isValidKey = (v: unknown): v is RoomFeatureKey =>
    (ROOM_FEATURE_KEYS as readonly string[]).includes(v as string);

  return raw.map((entry) => {
    const obj = (entry ?? {}) as Record<string, unknown>;

    // features: current shape is string[]; migrate old object shape if present.
    let features: RoomFeatureKey[] = [];
    const rawFeatures = obj.features;
    if (Array.isArray(rawFeatures)) {
      features = rawFeatures.filter(isValidKey);
    } else if (rawFeatures && typeof rawFeatures === "object") {
      features = ROOM_FEATURE_KEYS.filter((k) => {
        const v = (rawFeatures as Record<string, unknown>)[k];
        return v != null && String(v).trim() !== "";
      });
    }

    // custom_features: keep the name only (older rows may also have a value).
    const rawCustom = obj.custom_features;
    const custom_features: CustomFeature[] = Array.isArray(rawCustom)
      ? rawCustom
          .map((c) => {
            const co = (c ?? {}) as Record<string, unknown>;
            return {
              id: typeof co.id === "string" ? co.id : makeId(),
              label: co.label == null ? "" : String(co.label),
            };
          })
          .filter((c) => c.label.trim() !== "")
      : [];

    const rt = obj.room_type;
    // Older rows stored a single `amount`; fall back to it for both ends of the range.
    const legacyAmount = obj.amount == null ? "" : String(obj.amount);
    return {
      id: typeof obj.id === "string" ? obj.id : makeId(),
      room_type: ROOM_TYPES.includes(rt as RoomType) ? (rt as RoomType) : "",
      amount_min: obj.amount_min == null ? legacyAmount : String(obj.amount_min),
      amount_max: obj.amount_max == null ? legacyAmount : String(obj.amount_max),
      features,
      custom_features,
    };
  });
}

export function counsellingRowToForm(row: CounsellingRow): CounsellingFormValues {
  return {
    counselling_date: row.counselling_date?.slice(0, 10) ?? "",
    patient_name: row.patient_name ?? "",
    age: row.age != null ? String(row.age) : "",
    sex: row.sex ?? "",
    phone: row.phone ?? "",
    location: row.location ?? "",
    notes: row.notes ?? "",
    surgery_name: row.surgery_name ?? "",
    procedure_type: row.procedure_type ?? "",
    payment_type: row.payment_type ?? "",
    cmrf: row.cmrf ?? false,
    room_options: normalizeRoomOptions(row.room_options),
    selected_option_id: row.selected_option_id ?? "",
  };
}

/**
 * Shapes the form values into the exact columns the DB expects.
 * Shared by the "new" and "edit" pages so they never drift apart.
 * (The legacy counselling-level `amount` column is left untouched and unused;
 * amounts now live inside each room option.)
 */
export function counsellingFormToRow(values: CounsellingFormValues) {
  const selectedIsValid = values.room_options.some((o) => o.id === values.selected_option_id);

  return {
    counselling_date: values.counselling_date,
    patient_name: values.patient_name.trim(),
    age: values.age.trim() ? Number(values.age) : null,
    sex: values.sex || null,
    phone: values.phone.trim() || null,
    location: values.location.trim() || null,
    notes: values.notes.trim() || null,
    surgery_name: values.surgery_name.trim() || null,
    procedure_type: values.procedure_type || null,
    payment_type: values.payment_type || null,
    cmrf: values.cmrf,
    room_options: values.room_options as unknown as Json,
    selected_option_id: selectedIsValid ? values.selected_option_id : null,
  };
}

/* ------------------------------------------------------------------ */
/* Validation & formatting                                             */
/* ------------------------------------------------------------------ */

export interface CounsellingFormErrors {
  patient_name?: string;
  counselling_date?: string;
}

export function validateCounsellingForm(values: CounsellingFormValues): CounsellingFormErrors {
  const errors: CounsellingFormErrors = {};
  if (!values.patient_name.trim()) errors.patient_name = "Patient name is required.";
  if (!values.counselling_date.trim()) errors.counselling_date = "Counselling date is required.";
  return errors;
}

// Formats a plain "YYYY-MM-DD" date string using the local calendar day,
// avoiding the off-by-one shift `new Date(datenOnlyString)` causes in
// negative-UTC-offset timezones (it parses as UTC midnight).
export function formatDateOnly(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString();
}

/* ------------------------------------------------------------------ */
/* WhatsApp summary sharing                                            */
/* ------------------------------------------------------------------ */

export const SUMMARY_PERIODS = ["day", "week", "month"] as const;
export type SummaryPeriod = (typeof SUMMARY_PERIODS)[number];

export const SUMMARY_PERIOD_LABELS: Record<SummaryPeriod, string> = {
  day: "Today",
  week: "This Week",
  month: "This Month",
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function toDateOnlyStr(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Half-open date range [start, end) for the given period, anchored on today. */
export function summaryPeriodRange(period: SummaryPeriod): {
  start: string;
  end: string;
  label: string;
} {
  const today = new Date();

  if (period === "day") {
    const start = toDateOnlyStr(today);
    const end = toDateOnlyStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
    return { start, end, label: formatDateOnly(start) };
  }

  if (period === "week") {
    const dow = today.getDay(); // 0 = Sunday
    const diffToMonday = dow === 0 ? 6 : dow - 1;
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - diffToMonday);
    const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 7);
    const weekLastDay = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate() - 1);
    const start = toDateOnlyStr(weekStart);
    const end = toDateOnlyStr(weekEnd);
    return { start, end, label: `${formatDateOnly(start)} – ${formatDateOnly(toDateOnlyStr(weekLastDay))}` };
  }

  // month
  const y = today.getFullYear();
  const m = today.getMonth();
  const start = `${y}-${pad2(m + 1)}-01`;
  const nextMonth = m === 11 ? 0 : m + 1;
  const nextYear = m === 11 ? y + 1 : y;
  const end = `${nextYear}-${pad2(nextMonth + 1)}-01`;
  return { start, end, label: today.toLocaleDateString(undefined, { month: "long", year: "numeric" }) };
}

export interface CounsellingSummaryRow {
  patient_name: string;
  phone: string | null;
  age: number | null;
  surgery_name: string | null;
}

/** Builds a plain-text WhatsApp-ready summary: name, phone, age, surgery per patient. */
export function buildWhatsAppSummary(rows: CounsellingSummaryRow[], periodLabel: string): string {
  const lines = [`Counselling Summary – ${periodLabel}`, `Total: ${rows.length}`, ""];
  rows.forEach((row, i) => {
    const parts = [row.patient_name || "—"];
    if (row.age != null) parts.push(`${row.age}y`);
    if (row.phone) parts.push(row.phone);
    if (row.surgery_name) parts.push(row.surgery_name);
    lines.push(`${i + 1}. ${parts.join(" | ")}`);
  });
  return lines.join("\n");
}