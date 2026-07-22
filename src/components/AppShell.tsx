import { lazy, Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppProvider, useApp } from "@/lib/store";
import { Header } from "@/components/Header";
import { SidebarNavigation } from "@/components/SidebarNavigation";
import { SlideViewer } from "@/components/SlideViewer";
import { AgenticApplicationOverview } from "@/components/AgenticApplicationOverview";
import { ScenarioControls } from "@/components/ScenarioControls";
import { ScenarioTimeline } from "@/components/ScenarioTimeline";
import { DigitalTwinDecisionPanel } from "@/components/DigitalTwinDecisionPanel";
import { KPIGrid } from "@/components/KPIGrid";
import { PresenterCue } from "@/components/PresenterCue";
import { AuditLog } from "@/components/AuditLog";
import { DigitalPass } from "@/components/DigitalPass";
import { ClosingOverview } from "@/components/ClosingOverview";
import { ClientOnly } from "@/components/ClientOnly";
import { FileBadge, EyeOff } from "lucide-react";

const DigitalTwinMap = lazy(() => import("@/components/DigitalTwinMap"));

function ScenarioWorkspace() {
  const { currentScenario, role } = useApp();
  const [showPass, setShowPass] = useState(false);
  if (!currentScenario) return null;

  return (
    <div className="flex-1 flex flex-col gap-3 min-h-0">
      <div className="flex items-center gap-3 justify-between">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {currentScenario.name}
          </div>
          <div className="text-sm font-medium truncate">{currentScenario.headline}</div>
        </div>
        <ScenarioControls />
      </div>

      {/* <ScenarioTimeline /> */}
      <KPIGrid />

      <div className="flex-1 min-h-0 flex gap-3">
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <ClientOnly
            fallback={
              <div className="flex-1 rounded-lg border border-[var(--panel-border)] grid place-items-center text-muted-foreground">
                Loading map…
              </div>
            }
          >
            <Suspense
              fallback={
                <div className="flex-1 rounded-lg border border-[var(--panel-border)] grid place-items-center text-muted-foreground">
                  Loading map…
                </div>
              }
            >
              <DigitalTwinMap />
            </Suspense>
          </ClientOnly>
          <div className="flex items-end justify-between gap-3 absolute bottom-4 left-4 z-[400] right-4 pointer-events-none">
            <div className="pointer-events-auto">
              <PresenterCue />
            </div>
            {currentScenario.id === "scenario3" && (
              <div className="flex flex-col items-end gap-2 pointer-events-auto">
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="bg-[var(--card)] border border-[var(--panel-border)] shadow-lg px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[var(--card-hover)] transition-colors"
                >
                  <FileBadge className="w-4 h-4 text-[var(--color-info)]" />
                  {showPass ? "Hide Pass" : "View Digital Pass"}
                </button>
                <AnimatePresence>
                  {showPass && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="min-w-[340px] max-w-[380px]"
                    >
                      <DigitalPass />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {role !== "Viewer" ? (
          <div className="w-[360px] shrink-0 flex flex-col gap-3 min-h-0 relative z-[400]">
            <div className="flex-1 min-h-0 flex flex-col gap-3">
              <DigitalTwinDecisionPanel />
            </div>
            <div className="h-[160px] shrink-0">
              <AuditLog />
            </div>
          </div>
        ) : (
          <div className="w-[360px] shrink-0 flex flex-col gap-3 min-h-0 relative z-[400]">
            <div className="glass rounded-lg flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground border border-[var(--panel-border)]">
              <EyeOff className="w-10 h-10 mb-4 opacity-50" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Viewer Mode</h3>
              <p className="text-xs">
                Your current role has read-only access. Decision controls and logs are hidden.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ViewSwitcher() {
  const { view } = useApp();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1 flex flex-col min-h-0"
      >
        {view === "application" && <AgenticApplicationOverview />}
        {view === "team" && (
          <SlideViewer
            title="Team"
            subtitle="Team presentation · Agentic AI platform for event operations"
            imageSrc="/slides/team-placeholder.jpg"
            bullets={[
              "Moderator + 4 team members",
              "Roles: Vision · Data · Simulation · Ops",
              "Replace this slide with the team photo",
            ]}
          />
        )}
        {(view === "scenario1" || view === "scenario2" || view === "scenario3") && (
          <ScenarioWorkspace />
        )}
        {view === "future" && (
          <SlideViewer
            title="Future Work"
            subtitle="From prototype to production-grade agentic AI platform"
            imageSrc="/slides/future-work-placeholder.jpg"
            bullets={[
              "AI prediction agent (crowd density, arrival forecasting)",
              "Traffic optimization agent (system-wide, not greedy shortest path)",
              "Resource allocation agent (crane/queue/window optimization)",
              "Real-time WebSocket feeds from cameras, GPS, IoT",
              "Full audit trail with cryptographic signing",
              "Multi-agency access with fine-grained RBAC",
            ]}
          />
        )}
        {view === "closing" && <ClosingOverview />}
      </motion.div>
    </AnimatePresence>
  );
}

export function AppShell() {
  return (
    <AppProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex min-h-0">
          <SidebarNavigation />
          <main className="flex-1 min-w-0 p-3 flex flex-col">
            <ViewSwitcher />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
