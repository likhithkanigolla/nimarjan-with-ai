import { motion } from "framer-motion";
import { useApp, type ViewKey } from "@/lib/store";
import { Bot, Users, Radar, Route as RouteIcon, Boxes, Lightbulb, Layers, Presentation } from "lucide-react";

const nav: Array<{
  key: ViewKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
}> = [
  { key: "opening", label: "Opening", icon: Presentation },
  { key: "intro", label: "Introduction", icon: Presentation },
  { key: "vision", label: "Vision", icon: Presentation },
  { key: "stakeholders", label: "Stakeholders", icon: Presentation },
  {
    key: "application",
    label: "Agentic AI Application",
    icon: Bot,
    hint: "Data sources + agent mesh",
  },
  { key: "scenario1", label: "Crowd Prediction", icon: Radar, hint: "Density + risk" },
  { key: "scenario2", label: "Traffic & Routes", icon: RouteIcon, hint: "ETA + diversion" },
  { key: "scenario3", label: "Immersion Planning", icon: Boxes, hint: "Time + crane allocation" },
  { key: "future", label: "Future Work", icon: Lightbulb },
  { key: "closing", label: "Closing", icon: Layers },
  { key: "team", label: "Team", icon: Users },
];

export function SidebarNavigation() {
  const { view, goToView } = useApp();
  return (
    <aside className="glass w-[240px] shrink-0 border-r border-[var(--panel-border)] flex flex-col">
      <nav className="p-2 flex-1 space-y-1">
        {nav.map(({ key, label, icon: Icon, hint }) => {
          const active = view === key;
          return (
            <button
              key={key}
              onClick={() => goToView(key)}
              className={`w-full text-left group relative flex items-start gap-3 px-3 py-2.5 rounded-md transition-colors
                ${
                  active
                    ? "bg-[var(--accent)] text-foreground"
                    : "hover:bg-[var(--secondary)] text-muted-foreground hover:text-foreground"
                }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute left-0 top-1 bottom-1 w-1 rounded-r bg-[var(--color-info)]"
                />
              )}
              <Icon className={`w-4 h-4 mt-0.5 ${active ? "text-[var(--color-info)]" : ""}`} />
              <span className="flex-1">
                <div className="text-sm font-medium leading-tight">{label}</div>
                {hint && (
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {hint}
                  </div>
                )}
              </span>
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-[var(--panel-border)] text-[10px] text-muted-foreground uppercase tracking-wider">
        v0.1 · Prototype
      </div>
    </aside>
  );
}
