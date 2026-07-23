// A visually distinctive immersion pass card used by Scenario 3.
import { motion } from "framer-motion";
import { QrCode, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/store";

export function DigitalPass() {
  const { currentScenario, currentStep } = useApp();
  if (currentScenario?.id !== "scenario3") return null;

  const step = currentStep?.id ?? 1;
  const allocated = step >= 3;
  const failed = step >= 4 && step < 6;
  const reallocated = step >= 6;

  const ip = reallocated ? "IP-05" : allocated ? "IP-02" : "—";
  const crane = reallocated ? "CR-12" : allocated ? "CR-07" : "—";
  const slot = reallocated ? "21:43" : allocated ? "21:35" : "21:00–22:00";
  const route = reallocated ? "R7" : allocated ? "R6" : "—";
  const status = reallocated
    ? "REALLOCATED"
    : failed
      ? "RESOURCE FAULT"
      : allocated
        ? "ALLOCATED"
        : "REGISTERED";
  const statusColor = reallocated
    ? "var(--color-safe)"
    : failed
      ? "var(--color-critical)"
      : allocated
        ? "var(--color-info)"
        : "var(--color-warn)";

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 relative overflow-hidden border-2"
      style={{ borderColor: statusColor }}
    >
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30"
        style={{ background: `radial-gradient(closest-side, ${statusColor}, transparent)` }}
      />
      <div className="flex items-start justify-between gap-3 relative">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Immersion Planning Pass
          </div>
          <div className="text-lg font-semibold font-mono mt-0.5">GNI-2026-0142</div>
          <div className="text-xs text-muted-foreground">
            Sri Vinayaka Youth Association · PDL-007
          </div>
        </div>
        <div className="grid place-items-center w-14 h-14 rounded-md border border-[var(--panel-border)] bg-black/30">
          <QrCode className="w-8 h-8 opacity-80" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 text-xs relative">
        <Row k="Idol" v="16 ft · 2,200 kg · 9 ft · Eco-Friendly" />
        <Row k="Pax" v="650" />
        <Row k="Vehicles" v="2 (TS09 •••• 4821)" />
        <Row k="Window" v="21:00–22:00" />
        <Row k="Assigned IP" v={ip} tone={reallocated ? "safe" : "info"} />
        <Row k="Crane" v={crane} tone={reallocated ? "safe" : failed ? "critical" : "info"} />
        <Row k="Arrival slot" v={slot} />
        <Row k="Route" v={route} />
      </div>

      <div className="mt-3 flex items-center justify-between relative">
        <span className="chip" style={{ color: statusColor, borderColor: statusColor }}>
          <ShieldCheck className="w-3 h-3" /> {status}
        </span>
        <span className="text-[10px] text-muted-foreground">
          Pass adapts to live platform state
        </span>
      </div>
    </motion.div>
  );
}

function Row({
  k,
  v,
  tone,
}: {
  k: string;
  v: string;
  tone?: "info" | "safe" | "warn" | "critical";
}) {
  const c =
    tone === "safe"
      ? "var(--color-safe)"
      : tone === "info"
        ? "var(--color-info)"
        : tone === "warn"
          ? "var(--color-warn)"
          : tone === "critical"
            ? "var(--color-critical)"
            : "inherit";
  return (
    <>
      <div className="text-muted-foreground">{k}</div>
      <div className="text-right font-mono" style={{ color: c }}>
        {v}
      </div>
    </>
  );
}
