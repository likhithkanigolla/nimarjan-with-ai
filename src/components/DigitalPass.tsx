// A visually distinctive immersion pass card used by Scenario 3.
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, ShieldCheck, ChevronLeft } from "lucide-react";
import { useApp } from "@/lib/store";

const mockPasses = [
  { id: "GNI-2026-0142", name: "Sri Vinayaka Youth Association", code: "PDL-007", idol: "16 ft · 2,200 kg · 9 ft · Eco-Friendly", pax: "650", vehicles: "2 (TS09 •••• 4821)", window: "21:00–22:00", isMain: true },
  { id: "GNI-2026-0089", name: "Khairatabad Ganesh Utsav", code: "PDL-001", idol: "63 ft · 45,000 kg · 25 ft · Plaster", pax: "12,000", vehicles: "1 (TS09 •••• 1111)", window: "14:00–18:00", isMain: false, staticStatus: "ALLOCATED", staticIp: "IP-01", staticCrane: "CR-01" },
  { id: "GNI-2026-0310", name: "Balapur Ganesh Mandal", code: "PDL-023", idol: "21 ft · 3,500 kg · 12 ft · Clay", pax: "3,000", vehicles: "4", window: "18:00–20:00", isMain: false, staticStatus: "ALLOCATED", staticIp: "IP-04", staticCrane: "CR-22" },
  { id: "GNI-2026-0412", name: "Ameerpet Youth Assoc.", code: "PDL-102", idol: "12 ft · 1,200 kg · 6 ft · Eco-Friendly", pax: "400", vehicles: "1", window: "19:00–21:00", isMain: false, staticStatus: "REGISTERED", staticIp: "—", staticCrane: "—" },
  { id: "GNI-2026-0881", name: "Secunderabad Friends Circle", code: "PDL-304", idol: "18 ft · 2,800 kg · 10 ft · Clay", pax: "800", vehicles: "3", window: "20:30–22:30", isMain: false, staticStatus: "REGISTERED", staticIp: "—", staticCrane: "—" }
];

export function DigitalPass() {
  const { currentScenario, currentStep } = useApp();
  const [selectedPass, setSelectedPass] = useState<typeof mockPasses[0] | null>(null);

  if (currentScenario?.id !== "scenario3") return null;

  const step = currentStep?.id ?? 1;
  const allocated = step >= 3;
  const failed = step >= 4 && step < 6;
  const reallocated = step >= 6;

  const mainStatus = reallocated
    ? "REALLOCATED"
    : failed
      ? "RESOURCE FAULT"
      : allocated
        ? "ALLOCATED"
        : "REGISTERED";
  const mainStatusColor = reallocated
    ? "var(--color-safe)"
    : failed
      ? "var(--color-critical)"
      : allocated
        ? "var(--color-info)"
        : "var(--color-warn)";

  if (!selectedPass) {
    return (
      <div className="glass rounded-xl p-3 flex flex-col gap-2 max-h-[450px] overflow-y-auto scrollbar-thin border border-[var(--panel-border)] pointer-events-auto">
        <div className="text-[11px] uppercase tracking-[0.2em] text-white px-2 pt-1 pb-2 sticky top-0 bg-[var(--panel)] z-10 backdrop-blur-md">
          Digital Passes Database
        </div>
        {mockPasses.map((p) => {
          const status = p.isMain ? mainStatus : p.staticStatus;
          const statusColor = p.isMain ? mainStatusColor : status === "ALLOCATED" ? "var(--color-info)" : "var(--color-warn)";
          return (
            <div
              key={p.id}
              onClick={() => setSelectedPass(p)}
              className="glass p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors border border-[var(--panel-border)]"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-semibold text-sm text-white">{p.id}</div>
                <span className="chip" style={{ color: statusColor, borderColor: statusColor, fontSize: '9px', padding: '0.1rem 0.3rem' }}>
                  {status}
                </span>
              </div>
              <div className="text-xs text-white">{p.name} · {p.code}</div>
            </div>
          );
        })}
      </div>
    );
  }

  // Expanded View
  const p = selectedPass;
  const status = p.isMain ? mainStatus : p.staticStatus!;
  const statusColor = p.isMain ? mainStatusColor : status === "ALLOCATED" ? "var(--color-info)" : "var(--color-warn)";

  const ip = p.isMain ? (reallocated ? "IP-05" : allocated ? "IP-02" : "—") : p.staticIp;
  const crane = p.isMain ? (reallocated ? "CR-12" : allocated ? "CR-07" : "—") : p.staticCrane;
  const slot = p.isMain ? (reallocated ? "21:43" : allocated ? "21:35" : "21:00–22:00") : p.window;
  const route = p.isMain ? (reallocated ? "R7" : allocated ? "R6" : "—") : (status === "ALLOCATED" ? "R2" : "—");

  return (
    <motion.div
      key="expanded"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-xl p-4 relative overflow-hidden border-2 flex flex-col pointer-events-auto"
      style={{ borderColor: statusColor }}
    >
      <button
        onClick={() => setSelectedPass(null)}
        className="absolute top-3 left-3 z-50 p-1.5 bg-black/40 hover:bg-black/60 rounded-full transition-colors flex items-center justify-center border border-white/10"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 pointer-events-none"
        style={{ background: `radial-gradient(closest-side, ${statusColor}, transparent)` }}
      />

      <div className="flex flex-col items-center justify-center mb-4 mt-8">
        <div className="grid place-items-center p-3 rounded-xl border border-[var(--panel-border)] bg-white shadow-xl">
          <QrCode className="w-32 h-32 text-black" />
        </div>
        <div className="text-lg font-semibold font-mono mt-4 text-white">{p.id}</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-white mt-1">
          Immersion Planning Pass
        </div>
      </div>

      <div className="text-center mb-4 px-2">
        <div className="text-sm font-medium text-white">{p.name}</div>
        <div className="text-xs text-white mt-0.5">{p.code}</div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-xs relative bg-black/30 p-4 rounded-lg border border-[var(--panel-border)]">
        <Row k="Idol" v={p.idol} />
        <Row k="Pax" v={p.pax} />
        <Row k="Vehicles" v={p.vehicles} />
        <Row k="Window" v={p.window} />
        <Row k="Assigned IP" v={ip!} tone={status === "REALLOCATED" ? "safe" : status === "ALLOCATED" ? "info" : undefined} />
        <Row k="Crane" v={crane!} tone={status === "REALLOCATED" ? "safe" : (p.isMain && failed) ? "critical" : status === "ALLOCATED" ? "info" : undefined} />
        <Row k="Arrival slot" v={slot!} />
        <Row k="Route" v={route} />
      </div>

      <div className="mt-5 flex items-center justify-between relative">
        <span className="chip" style={{ color: statusColor, borderColor: statusColor }}>
          <ShieldCheck className="w-3 h-3" /> {status}
        </span>
        <span className="text-[10px] text-white">
          Live Sync Active
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
      <div className="text-white">{k}</div>
      <div className="text-right font-mono" style={{ color: c }}>
        {v}
      </div>
    </>
  );
}
