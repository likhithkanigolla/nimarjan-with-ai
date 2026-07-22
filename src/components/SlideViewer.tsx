// Slide viewer for Team / Introduction / Future / Closing placeholders.
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";

export function SlideViewer({
  title, subtitle, imageSrc, bullets,
}: {
  title: string; subtitle?: string; imageSrc?: string; bullets?: string[];
}) {
  return (
    <div className="flex-1 relative overflow-hidden">
      <motion.div
        key={title}
        initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="h-full w-full grid grid-rows-[auto_1fr] p-6 gap-4"
      >
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Presentation Slide</div>
          <h1 className="text-3xl font-semibold mt-1">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1 max-w-3xl">{subtitle}</p>}
        </div>

        <div className="glass rounded-xl grid grid-cols-[1.4fr_1fr] gap-6 p-6 overflow-hidden">
          <div className="relative rounded-lg border border-[var(--panel-border)] bg-black/30 overflow-hidden grid place-items-center">
            {imageSrc ? (
              <img
                src={imageSrc} alt={title}
                className="w-full h-full object-contain"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
              />
            ) : null}
            <div className="absolute inset-0 grid place-items-center text-muted-foreground pointer-events-none">
              <div className="text-center opacity-60">
                <ImageIcon className="w-10 h-10 mx-auto" />
                <div className="mt-2 text-sm">Replace with presentation image</div>
                <div className="text-[11px] font-mono mt-1">/public/slides/{title.toLowerCase().replace(/\W+/g,"-")}.jpg</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {bullets?.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex gap-3 items-start"
              >
                <div className="w-2 h-2 rounded-full mt-2 bg-[var(--color-info)] shadow-[0_0_10px_var(--color-info)]" />
                <p className="text-sm text-foreground/90 leading-relaxed">{b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
