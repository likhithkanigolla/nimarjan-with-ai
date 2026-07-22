import { useApp } from "@/lib/store";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Zap } from "lucide-react";

export function ScenarioControls() {
  const { dispatch, currentScenario, currentStep, stepIndex, autoPlay } = useApp();
  if (!currentScenario || !currentStep) return null;
  const total = currentScenario.steps.length;

  return (
    <div className="glass rounded-lg px-3 py-2 flex items-center gap-3">
      <div className="flex items-center gap-1">
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="p-2 rounded hover:bg-[var(--secondary)]" title="Reset"
        ><RotateCcw className="w-4 h-4" /></button>
        <button
          onClick={() => dispatch({ type: "PREV" })}
          disabled={stepIndex === 0}
          className="p-2 rounded hover:bg-[var(--secondary)] disabled:opacity-40" title="Previous"
        ><ChevronLeft className="w-4 h-4" /></button>
        <button
          onClick={() => dispatch({ type: "SET_AUTOPLAY", value: !autoPlay })}
          className={`p-2 rounded hover:bg-[var(--secondary)] ${autoPlay ? "text-[var(--color-info)]" : ""}`}
          title={autoPlay ? "Pause auto-play" : "Auto-play"}
        >{autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button
          onClick={() => dispatch({ type: "NEXT" })}
          disabled={stepIndex >= total - 1}
          className="p-2 rounded hover:bg-[var(--secondary)] disabled:opacity-40" title="Next"
        ><ChevronRight className="w-4 h-4" /></button>
      </div>
      <div className="h-6 w-px bg-[var(--panel-border)]" />
      <div className="flex items-center gap-2 min-w-0">
        <span className="chip"><Zap className="w-3 h-3 text-[var(--color-warn)]" /> Step {stepIndex + 1} / {total}</span>
        <span className="text-sm font-medium truncate">{currentStep.title}</span>
      </div>
    </div>
  );
}
