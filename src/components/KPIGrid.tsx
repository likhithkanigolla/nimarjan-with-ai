import { motion } from "framer-motion";
import { useApp } from "@/lib/store";

const toneColor = (t?: string) =>
  t === "safe" ? "text-[var(--color-safe)]"
  : t === "warn" ? "text-[var(--color-warn)]"
  : t === "risk" ? "text-[var(--color-risk)]"
  : t === "critical" ? "text-[var(--color-critical)]"
  : t === "info" ? "text-[var(--color-info)]"
  : "text-foreground";

export function KPIGrid() {
  const { currentStep } = useApp();
  if (!currentStep?.kpis?.length) return null;
  return (
    <div className="glass rounded-lg p-2 flex gap-2 overflow-x-auto scrollbar-thin">
      {currentStep.kpis.map((k, i) => (
        <motion.div
          key={`${k.label}-${i}`}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="min-w-[130px] rounded-md border border-[var(--panel-border)] px-2.5 py-1.5"
        >
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
          <div className={`text-sm font-semibold font-mono ${toneColor(k.tone)}`}>{k.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
