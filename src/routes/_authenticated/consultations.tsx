import { createFileRoute } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";

export const Route = createFileRoute("/_authenticated/consultations")({
  head: () => ({
    meta: [{ title: "Consultations · Keerthi Hospital" }],
  }),
  component: ConsultationsPlaceholder,
});

function ConsultationsPlaceholder() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Stethoscope className="h-6 w-6" />
      </div>
      <h1 className="text-xl font-semibold tracking-tight">Consultation Module</h1>
      <p className="text-sm text-muted-foreground">Coming Soon</p>
    </div>
  );
}
