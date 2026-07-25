import { createFileRoute, redirect } from "@tanstack/react-router";

// Old URL for the OT Checklist list, kept so existing bookmarks/links still resolve.
export const Route = createFileRoute("/_authenticated/dashboard")({
  beforeLoad: () => {
    throw redirect({ to: "/checklist" });
  },
});
