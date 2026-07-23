import { motion } from "framer-motion";
import { Ambulance, Boxes, ShieldAlert, Users2 } from "lucide-react";

export function ClosingOverview() {
  return (
    <div className="flex-1 overflow-auto p-6 scrollbar-thin text-slate-100">
      <div className="max-w-5xl mx-auto min-h-full flex flex-col gap-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Conclusion</div>
          <h1 className="text-3xl font-semibold mt-1 text-white">One Synchronized Digital Twin</h1>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
            {[
              { icon: Users2, label: "Crowd management", color: "var(--color-safe)" },
              { icon: Boxes, label: "Traffic streamlining", color: "var(--color-info)" },
              { icon: ShieldAlert, label: "Immersion scheduling", color: "var(--color-predict)" },
              { icon: Ambulance, label: "Emergency response", color: "var(--color-critical)" },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <div
                  className="w-9 h-9 rounded-lg grid place-items-center text-white shrink-0"
                  style={{ background: item.color }}
                >
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="text-sm font-medium text-white">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-4 flex-1 min-h-[420px] flex items-center justify-center overflow-hidden">
          <img
            src="/nimarjan.jpg"
            alt="Ganesh Nimarjan"
            className="max-h-[520px] w-full object-contain"
          />
        </div>

        <div className="mt-auto pb-2 text-center text-sm md:text-base text-white">
          Unified picture. Shared action. Proactive support.
        </div>
      </div>
    </div>
  );
}
