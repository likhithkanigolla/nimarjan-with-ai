import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Twin — Ganesh Nimarjan Operations" },
      { name: "description", content: "Interactive Digital Twin prototype for crowd, procession, resource, and emergency management during Ganesh Nimarjan in Hyderabad." },
      { property: "og:title", content: "Digital Twin — Ganesh Nimarjan Operations" },
      { property: "og:description", content: "Interactive Digital Twin prototype: predict, simulate, recommend — with human approval." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <AppShell />
      <Toaster position="bottom-center" theme="dark" richColors closeButton />
    </>
  );
}
