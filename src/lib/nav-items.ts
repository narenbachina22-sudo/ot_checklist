import { ClipboardList, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PermissionKey } from "@/lib/profile";

export interface NavItem {
  permissionKey: PermissionKey;
  label: string;
  to: "/checklist" | "/consultations";
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  {
    permissionKey: "can_use_ot_handover_checklist",
    label: "OT Checklist",
    to: "/checklist",
    icon: ClipboardList,
  },
  {
    permissionKey: "can_consultations",
    label: "Consultations",
    to: "/consultations",
    icon: Stethoscope,
  },
];
