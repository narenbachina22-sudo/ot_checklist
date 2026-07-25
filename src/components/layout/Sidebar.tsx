import { Link, useRouterState } from "@tanstack/react-router";
import { Loader2, LogOut, Stethoscope } from "lucide-react";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navItems } from "@/lib/nav-items";
import { userFeatures } from "@/lib/features";

interface AppSidebarProps {
  userName: string;
  onSignOut: () => void;
  signingOut: boolean;
}

export function AppSidebar({ userName, onSignOut, signingOut }: AppSidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const visibleItems = navItems.filter((item) => userFeatures.includes(item.feature));

  return (
    <SidebarPrimitive>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Stethoscope className="h-4 w-4" />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold">Keerthi Hospital</p>
            <p className="truncate text-xs text-muted-foreground">{userName}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.to)}>
                    <Link to={item.to}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onSignOut} disabled={signingOut}>
              {signingOut ? <Loader2 className="animate-spin" /> : <LogOut />}
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}
