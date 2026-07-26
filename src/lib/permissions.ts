import { redirect } from "@tanstack/react-router";
import type { PermissionKey, Profile } from "@/lib/profile";

// Where a signed-in user lands when they don't have access to the module
// they tried to open. Add an entry here whenever a new gated module ships.
const MODULE_HOME = {
  can_use_ot_handover_checklist: "/checklist",
  can_consultations: "/consultations",
  can_edd: "/edd",
} as const satisfies Record<PermissionKey, string>;

export function homeRouteFor(profile: Profile | null | undefined) {
  const key = (Object.keys(MODULE_HOME) as PermissionKey[]).find((k) => Boolean(profile?.[k]));
  return key ? MODULE_HOME[key] : "/auth";
}

// Route-level guard: throw this from a route's `beforeLoad` to block direct
// URL access to a module the user isn't permitted to use. Redirects to a
// module they do have access to instead of leaving them on a dead page.
export function requireProfilePermission(profile: Profile | null | undefined, key: PermissionKey) {
  if (!profile?.[key]) {
    throw redirect({ to: homeRouteFor(profile) });
  }
}