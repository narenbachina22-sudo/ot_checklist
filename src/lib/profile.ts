import type { Tables } from "@/integrations/supabase/types";

// Single source of truth for the signed-in user's profile shape, including
// per-module permission flags. Derived from the generated DB types so it
// never drifts out of sync with the `profiles` table.
export type Profile = Tables<"profiles">;

export type PermissionKey = "can_use_ot_handover_checklist" | "can_consultations";
