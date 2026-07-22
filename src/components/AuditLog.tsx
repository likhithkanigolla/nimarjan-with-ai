import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";
import { useApp } from "@/lib/store";

export function AuditLog() {
  const { audit } = useApp();
  return (
    <div className="glass rounded-lg p-2 h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 mb-2 px-1">
        <ScrollText className="w-4 h-4 text-[var(--color-info)]" />
        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Activity / Audit</div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1 pr-1">
        {audit.map((e) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className="text-[11px] leading-snug flex gap-2"
          >
            <span className="font-mono text-muted-foreground">{e.time}</span>
            <span>{e.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
