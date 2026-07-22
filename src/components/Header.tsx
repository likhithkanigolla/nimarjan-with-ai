import { motion } from "framer-motion";
import { Activity, ShieldCheck, Radio } from "lucide-react";
import { useApp } from "@/lib/store";
import { RoleSelector } from "./RoleSelector";

export function Header() {
  const { simTime, dispatch } = useApp();
  return (
    <header className="glass flex h-14 items-center justify-between px-4 border-b border-[var(--panel-border)] relative z-30">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="grid place-items-center w-9 h-9 rounded-md bg-gradient-to-br from-[var(--color-info)] to-[var(--color-predict)] shadow-lg shadow-black/40"
        >
          <Activity className="w-5 h-5 text-white" />
        </motion.div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-wide">
            Digital Twin for Crowd &amp; Event Management
          </div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Ganesh Nimarjan Operations · Hyderabad
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="chip">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warn)]" />
          Demo Environment — Simulated Data
        </span>
        <span className="chip">
          <Radio className="w-3 h-3 text-[var(--color-safe)]" />
          Sim Time <span className="font-mono">{simTime}</span>
        </span>
        <span className="chip">
          <ShieldCheck className="w-3 h-3 text-[var(--color-info)]" />
          Digital Twin: <span className="text-[var(--color-safe)] font-semibold ml-1">SYNCHRONIZED</span>
          <motion.span
            className="ml-1 w-1.5 h-1.5 rounded-full bg-[var(--color-safe)]"
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.6, repeat: Infinity }}
          />
        </span>
        <RoleSelector />
      </div>
    </header>
  );
}
