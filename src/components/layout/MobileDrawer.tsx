import { Stethoscope } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Mobile-only top bar. Tapping the trigger opens the same Sidebar as a slide-out drawer.
export function MobileDrawer() {
  return (
    <header className="flex items-center gap-3 border-b bg-card px-4 py-3 md:hidden">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Stethoscope className="h-4 w-4" />
        </div>
        <p className="text-sm font-semibold">Keerthi Hospital</p>
      </div>
    </header>
  );
}
