import { ClipboardList, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FeatureKey } from "@/lib/features";

export interface NavItem {
  feature: FeatureKey;
  label: string;
  to: "/checklist" | "/consultations";
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { feature: "ot_checklist", label: "OT Checklist", to: "/checklist", icon: ClipboardList },
  { feature: "consultations", label: "Consultations", to: "/consultations", icon: Stethoscope },
];
