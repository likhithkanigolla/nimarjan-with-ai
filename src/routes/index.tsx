import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
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
