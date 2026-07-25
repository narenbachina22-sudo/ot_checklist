// Temporary hardcoded feature flags for the signed-in user.
// TODO: replace with a Supabase-backed lookup once per-user feature access is modeled there.
export type FeatureKey = "ot_checklist" | "consultations";

export const userFeatures: FeatureKey[] = ["ot_checklist", "consultations"];
