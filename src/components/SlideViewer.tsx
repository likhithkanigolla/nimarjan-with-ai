import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";

export function SlideViewer({
  title,
  subtitle,
  imageSrc,
  bullets,
}: {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  bullets?: string[];
}) {
  return (
    <div className="flex-1 relative overflow-hidden">
      <motion.div
        key={title}
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="h-full w-full p-6"
      >
        <div className="w-full h-full glass rounded-xl overflow-hidden relative">
          {imageSrc ? (
            <img
              src={imageSrc.startsWith("/") ? `${import.meta.env.BASE_URL}/${imageSrc.slice(1)}` : imageSrc}
              alt={title}
              className="w-full h-full object-contain"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
            />
          ) : null}
          <div className="absolute inset-0 grid place-items-center text-muted-foreground pointer-events-none -z-10">
            <div className="text-center opacity-60">
              <ImageIcon className="w-10 h-10 mx-auto" />
              <div className="mt-2 text-sm">Replace with presentation image</div>
              <div className="text-[11px] font-mono mt-1">
                /slides/{title.toLowerCase().replace(/\W+/g, "-")}.jpg
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
