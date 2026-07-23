import { motion } from "framer-motion";
import { Boxes, ShieldAlert, Users2, Ambulance } from "lucide-react";

export function ClosingOverview() {
  return (
    <div className="flex-1 overflow-auto p-6 scrollbar-thin text-slate-100">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Conclusion</div>
          <h1 className="text-3xl font-semibold mt-1 text-white">One Synchronized Digital Twin</h1>
          <p className="max-w-3xl mt-1 text-slate-300">
            Crowd · Traffic · Immersion · Emergency
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users2, title: "Crowd", color: "var(--color-safe)", text: "Density · flow · dwell" },
            { icon: Boxes, title: "Traffic & Processions", color: "var(--color-info)", text: "Routes · vehicles · ETA" },
            { icon: ShieldAlert, title: "Immersion Resources", color: "var(--color-predict)", text: "Queues · cranes · slots" },
            { icon: Ambulance, title: "Emergency Response", color: "var(--color-critical)", text: "Corridors · units · ETA" },
          ].map((c, i) => (
            <motion.div key={c.title}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass rounded-xl p-4 border-l-4 text-slate-100" style={{ borderLeftColor: c.color }}>
              <c.icon className="w-5 h-5" style={{ color: c.color }} />
              <div className="mt-2 text-sm font-semibold text-white">{c.title}</div>
              <div className="text-xs text-slate-300">{c.text}</div>
            </motion.div>
          ))}
        </div>

        <div className="glass rounded-xl p-5 space-y-2 text-slate-100">
          <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Cascades</div>
          {[
            "Traffic → Crowd",
            "Resource → Queue",
            "Queue → Traffic",
            "Blockage → Emergency",
          ].map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
              className="flex items-center gap-2 text-sm text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-info)]" /> {t}
            </motion.div>
          ))}
        </div>

        <div className="glass rounded-xl p-6 text-center text-slate-100">
          <div className="text-lg md:text-xl leading-relaxed">
            <div className="text-white">Unified picture.</div>
            <div className="text-white">Shared action.</div>
            <div className="mt-1 text-[var(--color-info)] font-semibold">
              Proactive support.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
