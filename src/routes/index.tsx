import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Twin for Event Operations" },
      {
        name: "description",
        content:
          "Agentic AI application for event operations, using registration data, synthetic live feeds, prediction, and decision support.",
      },
      { property: "og:title", content: "Digital Twin for Event Operations" },
      {
        property: "og:description",
        content:
          "Agentic AI platform for crowd prediction, traffic routing, and immersion planning.",
      },
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
