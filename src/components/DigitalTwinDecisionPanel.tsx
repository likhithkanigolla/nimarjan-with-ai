import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ClipboardCheck, Cpu, Gauge, Sparkles, ShieldAlert } from "lucide-react";
import { useApp, useCanApprove } from "@/lib/store";

const toneColor = (t?: string) =>
  t === "safe" ? "text-[var(--color-safe)]"
    : t === "warn" ? "text-[var(--color-warn)]"
      : t === "risk" ? "text-[var(--color-risk)]"
        : t === "critical" ? "text-[var(--color-critical)]"
          : t === "info" ? "text-[var(--color-info)]"
            : "text-foreground";

function Section({ icon: Icon, title, children, tone }: { icon: any; title: string; children: React.ReactNode; tone?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="glass rounded-lg p-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${toneColor(tone)}`} />
        <div className="text-[11px] uppercase tracking-[0.14em] text-white">{title}</div>
      </div>
      {children}
    </motion.div>
  );
}

export function DigitalTwinDecisionPanel() {
  const { currentStep, approvals, approve } = useApp();
  const canApprove = useCanApprove();
  if (!currentStep) return null;
  const p = currentStep.panel;

  return (
    <div className="w-[360px] shrink-0 flex flex-col gap-3 overflow-y-auto scrollbar-thin pr-1">
      <AnimatePresence mode="popLayout">
        {p?.current && (
          <Section key="cur" icon={Gauge} title="Current State" tone="info">
            <div className="font-medium text-sm mb-2 text-white">{p.current.title}</div>
            <ul className="space-y-1.5">
              {p.current.items.map((it, i) => (
                <li key={i} className="flex justify-between text-xs">
                  <span className="text-white">{it.label}</span>
                  <span className={`font-mono ${toneColor(it.tone)}`}>{it.value}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {p?.prediction && (
          <Section key="pred" icon={Sparkles} title={`Prediction · +${p.prediction.horizonMin} min`} tone="critical">
            <div className="font-medium text-sm mb-1 text-white">{p.prediction.title}</div>
            <p className="text-xs text-white mb-2">{p.prediction.body}</p>
            {p.prediction.items && (
              <ul className="space-y-1.5">
                {p.prediction.items.map((it, i) => (
                  <li key={i} className="flex justify-between text-xs">
                    <span className="text-white">{it.label}</span>
                    <span className={`font-mono ${toneColor(it.tone)}`}>{it.value}</span>
                  </li>
                ))}
              </ul>
            )}
            {p.prediction.risk && (
              <div className="mt-2 chip" style={{ color: "var(--color-critical)", borderColor: "var(--color-critical)" }}>
                Risk: {p.prediction.risk}
              </div>
            )}
          </Section>
        )}

        {p?.simulation && (
          <Section key="sim" icon={Cpu} title="Simulation" tone="info">
            <div className="font-medium text-sm mb-2 text-white">{p.simulation.title}</div>
            <div className="space-y-1.5">
              {p.simulation.options.map((o) => (
                <div key={o.id}
                  className={`rounded-md border px-2.5 py-2 ${o.recommended
                    ? "border-[var(--color-safe)]/60 bg-[var(--color-safe)]/8"
                    : "border-[var(--panel-border)]"}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-white">{o.label}</div>
                    {o.recommended && (
                      <span className="chip" style={{ color: "var(--color-safe)", borderColor: "var(--color-safe)" }}>
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-white mt-1">{o.detail}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {p?.recommendation && (
          <Section key="rec" icon={ShieldAlert} title="Recommendation" tone="warn">
            <div className="font-medium text-sm mb-2 text-white">{p.recommendation.title}</div>
            {p.recommendation.actions.length > 0 && (
              <ul className="space-y-1 mb-2">
                {p.recommendation.actions.map((a, i) => (
                  <li key={i} className="text-xs flex gap-2 text-white">
                    <span className="text-[var(--color-warn)] mt-[1px]">◆</span>
                    <span className="leading-tight">{a}</span>
                  </li>
                ))}
              </ul>
            )}
            {p.recommendation.awaitingApproval && currentStep.approvalId && !approvals[currentStep.approvalId] && (
              <div className="mt-2">
                <div className="chip mb-2" style={{ color: "var(--color-warn)", borderColor: "var(--color-warn)" }}>
                  Awaiting Human Approval
                </div>
                <button
                  onClick={() => approve(currentStep.approvalId!)}
                  disabled={!canApprove}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-md
                    bg-[var(--color-info)] text-[var(--primary-foreground)]
                    hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                  title={canApprove ? "Approve" : "Your role cannot approve this action"}
                >
                  <ClipboardCheck className="w-4 h-4" />
                  {canApprove ? `Approve ${currentStep.approvalId}` : `${currentStep.approvalId} — role cannot approve`}
                </button>
              </div>
            )}
            {p.recommendation.approvedText && (
              <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-safe)]">
                <CheckCircle2 className="w-4 h-4" /> {p.recommendation.approvedText}
              </div>
            )}
          </Section>
        )}

        {p?.impact && (
          <Section key="imp" icon={Sparkles} title="Expected Impact" tone="safe">
            <div className="font-medium text-sm mb-2 text-white">{p.impact.title}</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md border border-[var(--panel-border)] p-2">
                <div className="text-[10px] uppercase tracking-wider text-white mb-1">Before</div>
                {p.impact.before.map((it, i) => (
                  <div key={i} className="text-xs flex justify-between">
                    <span className="text-white">{it.label}</span>
                    <span className="font-mono">{it.value}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-md border border-[var(--color-safe)]/40 bg-[var(--color-safe)]/8 p-2">
                <div className="text-[10px] uppercase tracking-wider text-[var(--color-safe)] mb-1">After</div>
                {p.impact.after.map((it, i) => (
                  <div key={i} className="text-xs flex justify-between">
                    <span className="text-white">{it.label}</span>
                    <span className="font-mono text-[var(--color-safe)]">{it.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}
      </AnimatePresence>
    </div>
  );
}
