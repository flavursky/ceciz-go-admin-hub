import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/admin/pages";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Dashboard — CECIZ GO Admin" },
    { name: "description", content: "CECIZ GO operational dashboard for batches, payments, tracking, and tax." },
    { property: "og:title", content: "Dashboard — CECIZ GO Admin" },
    { property: "og:description", content: "CECIZ GO operational dashboard for batches, payments, tracking, and tax." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: DashboardPage,
});
