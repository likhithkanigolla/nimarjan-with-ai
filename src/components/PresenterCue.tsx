import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";

export function PresenterCue() {
  const { presenterMode, currentStep } = useApp();
  return (
    <AnimatePresence>
      {presenterMode && currentStep && (
        <motion.div
          key={currentStep.id}
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
          className="glass rounded-lg px-3 py-2 max-w-2xl"
          style={{ borderColor: "var(--color-warn)" }}
        >
          <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-warn)]">Presenter Cue</div>
          <div className="text-sm text-foreground/90">{currentStep.cue}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
