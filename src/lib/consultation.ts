// import type { Json, Tables } from "@/integrations/supabase/types";

// export type ConsultationRow = Tables<"consultations">;

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

// export interface ConsultationFormValues {
//   consultation_date: string;
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

// export function emptyConsultationForm(): ConsultationFormValues {
//   return {
//     consultation_date: "",
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

// export function consultationRowToForm(row: ConsultationRow): ConsultationFormValues {
//   return {
//     consultation_date: row.consultation_date?.slice(0, 10) ?? "",
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
// export function consultationFormToRow(values: ConsultationFormValues) {
//   const amountNum = values.amount.trim() ? Number(values.amount) : null;

//   // Only keep a selection that still points at an existing option.
//   const selectedIsValid = values.room_options.some((o) => o.id === values.selected_option_id);

//   return {
//     consultation_date: values.consultation_date,
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

// export interface ConsultationFormErrors {
//   patient_name?: string;
//   consultation_date?: string;
//   amount?: string;
// }

// export function validateConsultationForm(values: ConsultationFormValues): ConsultationFormErrors {
//   const errors: ConsultationFormErrors = {};
//   if (!values.patient_name.trim()) errors.patient_name = "Patient name is required.";
//   if (!values.consultation_date.trim()) errors.consultation_date = "Consultation date is required.";
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

export type ConsultationRow = Tables<"consultations">;

/* ------------------------------------------------------------------ */
/* Payment type                                                        */
/* ------------------------------------------------------------------ */

export const PAYMENT_TYPES = ["Insurance", "Non-insurance"] as const;
export type PaymentType = (typeof PAYMENT_TYPES)[number];

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
  amount: string; // price for this option
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
    amount: "",
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

/* ------------------------------------------------------------------ */
/* Form values                                                         */
/* ------------------------------------------------------------------ */

export interface ConsultationFormValues {
  consultation_date: string;
  patient_name: string;
  age: string;
  sex: string;
  phone: string;
  location: string;
  notes: string;
  surgery_name: string;
  payment_type: string;
  cmrf: boolean;
  room_options: RoomOption[];
  selected_option_id: string;
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
    surgery_name: "",
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
    return {
      id: typeof obj.id === "string" ? obj.id : makeId(),
      room_type: ROOM_TYPES.includes(rt as RoomType) ? (rt as RoomType) : "",
      amount: obj.amount == null ? "" : String(obj.amount),
      features,
      custom_features,
    };
  });
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
    surgery_name: row.surgery_name ?? "",
    payment_type: row.payment_type ?? "",
    cmrf: row.cmrf ?? false,
    room_options: normalizeRoomOptions(row.room_options),
    selected_option_id: row.selected_option_id ?? "",
  };
}

/**
 * Shapes the form values into the exact columns the DB expects.
 * Shared by the "new" and "edit" pages so they never drift apart.
 * (The legacy consultation-level `amount` column is left untouched and unused;
 * amounts now live inside each room option.)
 */
export function consultationFormToRow(values: ConsultationFormValues) {
  const selectedIsValid = values.room_options.some((o) => o.id === values.selected_option_id);

  return {
    consultation_date: values.consultation_date,
    patient_name: values.patient_name.trim(),
    age: values.age.trim() ? Number(values.age) : null,
    sex: values.sex || null,
    phone: values.phone.trim() || null,
    location: values.location.trim() || null,
    notes: values.notes.trim() || null,
    surgery_name: values.surgery_name.trim() || null,
    payment_type: values.payment_type || null,
    cmrf: values.cmrf,
    room_options: values.room_options as unknown as Json,
    selected_option_id: selectedIsValid ? values.selected_option_id : null,
  };
}

/* ------------------------------------------------------------------ */
/* Validation & formatting                                             */
/* ------------------------------------------------------------------ */

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
// avoiding the off-by-one shift `new Date(datenOnlyString)` causes in
// negative-UTC-offset timezones (it parses as UTC midnight).
export function formatDateOnly(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString();
}