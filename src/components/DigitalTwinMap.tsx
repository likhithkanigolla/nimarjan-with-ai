// The central Digital Twin map. Client-only (Leaflet).
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { dataService } from "@/services/dataService";
import type { LatLng } from "@/lib/types";

// ------- Icon factory -------
const makeIcon = (bg: string, glyph: string, ring = false) =>
  L.divIcon({
    html: `<div class="dt-marker ${ring ? "dt-pulse" : ""}" style="width:28px;height:28px;background:${bg};color:white;font-size:12px;font-weight:700;position:relative;">${glyph}</div>`,
    className: "dt-icon-wrap",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });

const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

const makeImgIcon = (
  src: string,
  size = 32,
  label = "",
  ring = false,
  bg = "transparent",
  rounded = bg !== "transparent",
) =>
  L.divIcon({
    html: `<div class="${ring ? "dt-pulse" : ""}" style="width:${size}px;height:${size}px;background:${bg};position:relative;display:flex;align-items:center;justify-content:center;${bg !== 'transparent' ? 'border-radius:50%;' : ''}">
             <img src="${baseUrl}icons/${src}" style="width:100%;height:100%;object-fit:contain;" />
             ${label ? `<div style="position:absolute;bottom:20%;font-size:11px;font-weight:bold;background:rgba(0,0,0,0.85);color:white;padding:2px 6px;border-radius:4px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.5);">${label}</div>` : ""}
           </div>`,
    className: "dt-icon-wrap",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });

const ICONS = {
  ip: (label: string) => makeImgIcon("hotspot.png", 50, label, false),
  ipFocus: (label: string) => makeImgIcon("hotspot.png", 180, label, true),
  crane: (bg: string) => makeImgIcon("crane.png", 28, "", false, bg, false),
  cameraC: () => makeIcon("var(--color-predict)", "◉"),
  cameraCP: () => makeIcon("var(--color-predict)", "◉", true),
  cameraT: () => makeIcon("#68a3ff", "◱"),
  hospital: () => makeIcon("var(--color-critical)", "＋"),
  police: () => makeIcon("#5a7cff", "★"),
  ambulance: () => makeImgIcon("ambulance.png", 32, "", false, "var(--color-critical)"),
  procession: (color: string, label: string) =>
    L.divIcon({
      html: `<div style="display:flex;align-items:center;gap:6px;">
        <div class="dt-marker" style="width:28px;height:28px;background:${color};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px rgba(255,255,255,0.2);">
          <img src="${baseUrl}icons/truck.png" style="width:18px;height:18px;object-fit:contain;" />
        </div>
        <div style="background:rgba(15,20,35,0.85);border:1px solid rgba(255,255,255,0.12);padding:2px 6px;border-radius:6px;font-size:10px;color:#e6ecff;white-space:nowrap;">${label}</div>
      </div>`,
      className: "dt-icon-wrap",
      iconSize: [80, 28],
      iconAnchor: [14, 14],
    }),
  emergency: (label: string) =>
    L.divIcon({
      html: `<div class="dt-marker dt-pulse" style="width:30px;height:30px;background:var(--color-critical);color:white;font-size:13px;position:relative;">!</div>`,
      className: "dt-icon-wrap",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    }),
};

// ------- OSRM Routing with Local Cache -------
const osrmCache = new Map<string, LatLng[]>();

async function fetchOSRMRoute(coordinates: LatLng[]): Promise<LatLng[]> {
  if (coordinates.length < 2) return coordinates;

  const cacheKey = JSON.stringify(coordinates);
  if (osrmCache.has(cacheKey)) {
    return osrmCache.get(cacheKey)!;
  }

  try {
    const coordString = coordinates.map(c => `${c[1]},${c[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("OSRM request failed");
    const data = await res.json();
    if (data.routes && data.routes[0]) {
      const routeCoords: [number, number][] = data.routes[0].geometry.coordinates;
      const result = routeCoords.map(c => [c[1], c[0]] as LatLng);
      osrmCache.set(cacheKey, result);
      return result;
    }
  } catch (e) {
    console.error("OSRM Routing failed, falling back to straight lines", e);
  }
  return coordinates;
}

// ------- Map camera controller -------
function CameraFly({ center, zoom }: { center?: LatLng; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom ?? map.getZoom(), { duration: 1.2, easeLinearity: 0.25 });
  }, [center?.[0], center?.[1], zoom]);
  return null;
}

// ------- Moving entity marker with interpolated position -------
function MovingEntityMarker({
  path,
  color,
  label,
  kind,
}: {
  path: LatLng[];
  color: string;
  label: string;
  kind?: string;
}) {
  const [t, setT] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    setT(0);
    const start = performance.now();
    const dur = 4200;
    const tick = (now: number) => {
      const k = Math.max(0, Math.min(1, (now - start) / dur));
      setT(k);
      if (k < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [path]);

  const pos = useMemo<LatLng>(() => {
    if (path.length < 2) return path[0];
    const total = path.length - 1;
    const scaled = t * total;
    const i = Math.min(total - 1, Math.floor(scaled));
    const f = scaled - i;
    const a = path[i],
      b = path[i + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  }, [t, path]);

  return (
    <Marker
      position={pos as any}
      icon={kind === "ambulance" ? ICONS.ambulance() : ICONS.procession(color, label)}
    />
  );
}

// ------- Route line styling -------
const routeStyles: Record<
  string,
  { color: string; weight: number; dashArray?: string; opacity?: number; className?: string }
> = {
  primary: { color: "#6ea3ff", weight: 4, opacity: 0.9 },
  alt: { color: "#c07bff", weight: 4, opacity: 0.9, dashArray: "6 6" },
  emergency: { color: "#ff5b5b", weight: 5, opacity: 0.95, className: "dt-route-draw" },
  closed: { color: "#888", weight: 3, opacity: 0.5, dashArray: "2 8" },
  selected: { color: "#3ddc84", weight: 5, opacity: 0.95, className: "dt-route-draw" },
  faded: { color: "#5a6a90", weight: 3, opacity: 0.35, dashArray: "4 6" },
};

const heatColor = {
  safe: "#3ddc84",
  warn: "#f1c453",
  risk: "#ff8b3d",
  critical: "#ff4d4d",
  predict: "#b06bff",
};

export default function DigitalTwinMap() {
  const { currentStep, initializing } = useApp();
  const ips = dataService.syncImmersionPoints();
  const cams = dataService.syncCameras();
  const ems = dataService.syncEmergency();
  const cranes = dataService.syncCranes();
  const allRoutes = dataService.syncRoutes();

  const [enrichedRoutes, setEnrichedRoutes] = useState<Record<string, LatLng[]>>({});
  const [enrichedMoving, setEnrichedMoving] = useState<Record<string, LatLng[]>>({});

  useEffect(() => {
    const fetchAll = async () => {
      const promises = allRoutes.map(async (r) => {
        const detailed = await fetchOSRMRoute(r.coordinates);
        return { id: r.id, coordinates: detailed };
      });
      const results = await Promise.all(promises);
      const newMap: Record<string, LatLng[]> = {};
      results.forEach((res) => {
        newMap[res.id] = res.coordinates;
      });
      setEnrichedRoutes(newMap);
    };
    fetchAll();
  }, [allRoutes]);

  const activeMoving = useMemo(() => {
    const list: any[] = [...(currentStep?.moving || [])];
    const stepAny = currentStep as any;
    if (stepAny?.processions) {
      stepAny.processions.forEach((p: any) => {
        if (!list.some((existing) => existing.id === p.id)) {
          list.push({
            id: p.id,
            label: p.label,
            kind: p.kind || "procession",
            path: p.path,
            progress: p.progress || 0,
            color: p.color,
          });
        }
      });
    }
    return list;
  }, [currentStep?.moving, (currentStep as any)?.processions]);

  useEffect(() => {
    if (activeMoving.length === 0) return;
    const fetchMoving = async () => {
      const promises = activeMoving.map(async (m) => {
        const detailed = await fetchOSRMRoute(m.path);
        return { id: m.id, path: detailed };
      });
      const results = await Promise.all(promises);
      const newMap: Record<string, LatLng[]> = {};
      results.forEach((res) => {
        newMap[res.id] = res.path;
      });
      setEnrichedMoving(newMap);
    };
    fetchMoving();
  }, [currentStep?.moving, (currentStep as any)?.processions]);

  const layers = currentStep?.layers ?? {
    immersion: true,
    cameras: true,
    emergency: true,
    routes: true,
    crowd: true,
    cranes: true,
  };
  const focus = new Set(currentStep?.focusIds ?? []);
  const pulseCams = new Set(currentStep?.pulseCameras ?? []);
  const activeRouteMap = new Map((currentStep?.activeRoutes ?? []).map((r) => [r.id, r.style]));
  const showAllRoutes = layers.routes && !currentStep?.activeRoutes?.length;

  return (
    <div className="relative flex-1 rounded-lg overflow-hidden border border-[var(--panel-border)]">
      <MapContainer
        center={dataService.getMapCenter() as any}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />
        <CameraFly center={currentStep?.mapCenter} zoom={currentStep?.mapZoom} />

        {/* Heat zones */}
        {currentStep?.heatZones?.map((z, i) => (
          <Circle
            key={`hz-${i}`}
            center={z.center as any}
            radius={z.radius}
            pathOptions={{
              color: heatColor[z.level],
              fillColor: heatColor[z.level],
              fillOpacity: z.predicted ? 0.1 : 0.18,
              weight: z.predicted ? 2 : 1,
              dashArray: z.predicted ? "6 8" : undefined,
              className: z.predicted ? "dt-flow-dash" : undefined,
            }}
          >
            {z.label && <Popup>{z.label}</Popup>}
          </Circle>
        ))}

        {/* Flows (as thin dashed polylines with arrow-ish dot) */}
        {currentStep?.flows?.map((f, i) => (
          <Polyline
            key={`fl-${i}`}
            positions={[f.from, f.to] as any}
            pathOptions={{
              color: f.color ?? "#7aa5ff",
              weight: 2 + (f.intensity ?? 0.6) * 2,
              opacity: 0.85,
              dashArray: "4 8",
              className: "dt-flow-dash",
            }}
          />
        ))}

        {/* Routes */}
        {showAllRoutes &&
          allRoutes.map((r) => {
            const coords = enrichedRoutes[r.id] || r.coordinates;
            return (
              <Polyline
                key={r.id}
                positions={coords as any}
                pathOptions={{ color: "#4d6ba0", weight: 2, opacity: 0.35 }}
              />
            );
          })}
        {!showAllRoutes &&
          allRoutes.map((r) => {
            const style = activeRouteMap.get(r.id);
            if (!style) return null;
            const s = routeStyles[style];
            const coords = enrichedRoutes[r.id] || r.coordinates;
            return (
              <Polyline
                key={r.id + style}
                positions={coords as any}
                pathOptions={{
                  color: s.color,
                  weight: s.weight,
                  opacity: s.opacity,
                  dashArray: s.dashArray,
                  className: s.className,
                }}
              >
                <Popup>
                  {r.name} · {style}
                </Popup>
              </Polyline>
            );
          })}

        {/* Immersion Points */}
        {layers.immersion &&
          ips.map((ip) => (
            <Marker
              key={ip.id}
              position={ip.coordinates as any}
              icon={
                focus.has(ip.id)
                  ? ICONS.ipFocus(ip.id.split("-")[1])
                  : ICONS.ip(ip.id.split("-")[1])
              }
            >
              <Popup>
                <div className="font-semibold text-[13px]">
                  {ip.id} · {ip.name}
                </div>
                <div className="text-[11px] opacity-80 mt-1">
                  Status: <b>{ip.status}</b>
                  <br />
                  Crowd: <b>{ip.current_crowd}</b> / {ip.safe_crowd_capacity} (
                  {Math.round((ip.current_crowd / ip.safe_crowd_capacity) * 100)}%)
                  <br />
                  Cranes: <b>{ip.available_cranes}</b> / {ip.total_cranes}
                  <br />
                  Queue: <b>{ip.queue_length}</b> · Avg wait: ~
                  {ip.average_service_time * Math.max(1, ip.queue_length / 2)} min
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Cranes (very small, offset near IP) */}
        {layers.cranes &&
          cranes.map((c, i) => {
            const ip = ips.find((x) => x.id === c.immersion_point_id);
            if (!ip) return null;
            
            let angleBase = Math.PI / 2; // Default North
            if (ip.id === "IP-03") angleBase = -Math.PI * 0.75; // South-West for IP-03
            
            const spread = ((i % 5) - 2) * 0.25; 
            const angle = angleBase + spread;
            const dist = 0.0012; 
            
            const pos: LatLng = [
              ip.coordinates[0] + dist * Math.sin(angle), 
              ip.coordinates[1] + dist * Math.cos(angle)
            ];
            const bg =
              c.status === "FAULT"
                ? "var(--color-critical)"
                : c.status === "MAINTENANCE"
                  ? "var(--color-warn)"
                  : c.status === "BUSY"
                    ? "#f1c453"
                    : "var(--color-safe)";
            return (
              <Marker key={c.id} position={pos as any} icon={ICONS.crane(bg)}>
                <Popup>
                  <div className="font-semibold text-[13px]">{c.id}</div>
                  <div className="text-[11px] opacity-80 mt-1">
                    Status: <b>{c.status}</b>
                    <br />
                    Max weight: {c.max_supported_weight} kg
                    <br />
                    Max height: {c.max_supported_height} ft
                    <br />
                    Supports: {c.supported_idol_types.join(", ")}
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Cameras */}
        {layers.cameras &&
          cams.map((c) => (
            <Marker
              key={c.id}
              position={c.coordinates as any}
              icon={
                c.kind === "traffic"
                  ? ICONS.cameraT()
                  : pulseCams.has(c.id)
                    ? ICONS.cameraCP()
                    : ICONS.cameraC()
              }
            >
              <Popup>
                <b>{c.name}</b>
              </Popup>
            </Marker>
          ))}

        {/* Emergency services */}
        {layers.emergency &&
          ems.map((e) => (
            <Marker
              key={e.id}
              position={e.coordinates as any}
              icon={
                e.kind === "hospital"
                  ? ICONS.hospital()
                  : e.kind === "police"
                    ? ICONS.police()
                    : ICONS.ambulance()
              }
            >
              <Popup>
                <b>{e.name}</b>
              </Popup>
            </Marker>
          ))}

        {/* Emergency event markers */}
        {currentStep?.emergencyMarkers?.map((m) => (
          <Marker key={m.id} position={m.coordinates as any} icon={ICONS.emergency(m.label)}>
            <Popup>{m.label}</Popup>
          </Marker>
        ))}

        {/* Moving entities */}
        {activeMoving.map((m) => {
          const path = enrichedMoving[m.id] || m.path;
          return (
            <MovingEntityMarker
              key={m.id + "_" + path.length}
              path={path}
              color={m.color ?? "#6ea3ff"}
              label={m.label}
              kind={m.kind}
            />
          );
        })}
      </MapContainer>

      {/* Legend overlay */}
      <div className="absolute top-3 left-3 glass rounded-md text-[11px] p-2 z-[500] space-y-1 pointer-events-none">
        <LegendRow color="var(--color-info)" label="Immersion Point" />
        <LegendRow color="var(--color-safe)" label="Crane · Available" />
        <LegendRow color="#f1c453" label="Crane · Busy" />
        <LegendRow color="var(--color-critical)" label="Crane · Fault / Emergency" />
        <LegendRow color="var(--color-predict)" label="Crowd Camera" />
        <LegendRow color="#68a3ff" label="Traffic Camera" />
        <LegendRow color="#3ddc84" label="Selected Route" dash />
        <LegendRow color="#c07bff" label="Alternative Route" dash />
      </div>

      {/* Initialization overlay */}
      <AnimatePresence>
        {initializing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 grid place-items-center bg-black/60 backdrop-blur-sm z-[600]"
          >
            <div className="text-center space-y-2 max-w-md">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-info)]">
                Initializing platform
              </div>
              <div className="space-y-1 text-sm">
                {[
                  "Loading infrastructure",
                  "Loading immersion points",
                  "Synchronizing cameras",
                  "Loading crowd state",
                  "Platform synchronized",
                ].map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.25 }}
                    className="flex items-center gap-2 justify-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-info)]" /> {line}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LegendRow({ color, label, dash }: { color: string; label: string; dash?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-3 h-3 rounded-sm inline-block"
        style={{
          background: dash ? "transparent" : color,
          borderTop: dash ? `2px dashed ${color}` : undefined,
        }}
      />
      <span>{label}</span>
    </div>
  );
}
