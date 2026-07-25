import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { MobileDrawer } from "@/components/layout/MobileDrawer";

interface AppLayoutProps {
  userName: string;
  onSignOut: () => void;
  signingOut: boolean;
  children: ReactNode;
}

export function AppLayout({ userName, onSignOut, signingOut, children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar userName={userName} onSignOut={onSignOut} signingOut={signingOut} />
      <SidebarInset>
        <MobileDrawer />
        <main className="flex-1 px-4 py-6 md:px-6">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
