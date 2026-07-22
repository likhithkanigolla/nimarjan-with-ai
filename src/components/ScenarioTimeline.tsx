import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import type { StageKey } from "@/lib/scenarios";

const labelFor: Record<StageKey, string> = {
  OBSERVE: "Observe", DETECT: "Detect", PREDICT: "Predict",
  SIMULATE: "Simulate", RECOMMEND: "Recommend", APPROVE: "Approve", ADAPT: "Adapt",
};

export function ScenarioTimeline() {
  const { currentScenario, currentStep } = useApp();
  if (!currentScenario || !currentStep) return null;
  const active = currentStep.stage;
  return (
    <div className="glass rounded-lg px-3 py-2 flex items-center gap-1 overflow-x-auto scrollbar-thin">
      {currentScenario.stages.map((s, i) => {
        const isActive = s === active;
        return (
          <div key={s} className="flex items-center gap-1 shrink-0">
            <motion.div
              className={`px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider border transition-colors
                ${isActive
                  ? "bg-[var(--color-info)]/15 text-[var(--color-info)] border-[var(--color-info)]/40"
                  : "text-muted-foreground border-transparent"}`}
              animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: 1.4, repeat: isActive ? Infinity : 0 }}
            >{labelFor[s]}</motion.div>
            {i < currentScenario.stages.length - 1 && (
              <span className="text-muted-foreground/60">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
