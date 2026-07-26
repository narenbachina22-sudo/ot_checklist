import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Loader2, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import type { Profile } from "@/lib/profile";

interface GateData {
  fullName: string;
  profile: Profile | null;
  authorized: boolean;
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async (): Promise<{ gate: GateData }> => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "id, full_name, role, hospital_id, can_use_ot_handover_checklist, can_consultations, can_edd, created_at",
      )
      .eq("id", data.user.id)
      .maybeSingle();

    return {
      gate: {
        fullName: profile?.full_name ?? data.user.email ?? "Staff",
        profile: profile ?? null,
        authorized: Boolean(
          profile?.can_use_ot_handover_checklist ||
            profile?.can_consultations ||
            profile?.can_edd,
        ),
      },
    };
  },
  component: AuthenticatedLayout,
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

function AuthenticatedLayout() {
  const { gate } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate({ to: "/auth", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function handleSignOut() {
    setSigningOut(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (!gate.authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <CardTitle>Access restricted</CardTitle>
            <CardDescription>You are not authorized to access this application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Signed in as <span className="font-medium text-foreground">{gate.fullName}</span>.
              Please contact your administrator if you believe this is a mistake.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AppLayout
      userName={gate.fullName}
      profile={gate.profile}
      onSignOut={handleSignOut}
      signingOut={signingOut}
    >
      <Outlet />
    </AppLayout>
  );
}
