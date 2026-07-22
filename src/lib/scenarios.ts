// Scenario step definitions. Each step is a fully deterministic snapshot
// the ScenarioController renders. Presenter clicks Next/Prev to advance.
import type { LatLng } from "@/lib/types";

export type StageKey = "OBSERVE" | "DETECT" | "PREDICT" | "SIMULATE" | "RECOMMEND" | "APPROVE" | "ADAPT";

export interface HeatZone {
  center: LatLng;
  radius: number; // meters
  level: "safe" | "warn" | "risk" | "critical" | "predict";
  predicted?: boolean;
  label?: string;
}

export interface FlowArrow {
  from: LatLng; to: LatLng;
  color?: string;
  intensity?: number; // 0..1
  dashed?: boolean;
}

export interface MovingEntity {
  id: string; label: string;
  kind: "procession" | "ambulance" | "police";
  path: LatLng[]; // interpolated 0..1 across path
  progress: number; // 0..1
  color?: string;
}

export interface Kpi { label: string; value: string; delta?: string; tone?: "safe"|"warn"|"risk"|"critical"|"info"; }

export interface DecisionPanel {
  current?: { title: string; items: Array<{label:string; value:string; tone?: Kpi["tone"]}> };
  prediction?: { title: string; body: string; horizonMin: number; risk?: "LOW"|"MEDIUM"|"HIGH"|"CRITICAL"; items?: Array<{label:string;value:string;tone?: Kpi["tone"]}> };
  simulation?: { title: string; options: Array<{ id:string; label:string; detail:string; recommended?:boolean }> };
  recommendation?: { title: string; actions: string[]; awaitingApproval?: boolean; approvedText?: string };
  impact?: { title: string; before: { label:string; value:string }[]; after: { label:string; value:string }[] };
}

export interface ScenarioStep {
  id: number;
  title: string;
  stage: StageKey;
  cue: string;
  mapCenter?: LatLng;
  mapZoom?: number;
  layers?: Partial<Record<"crowd"|"processions"|"traffic"|"immersion"|"cranes"|"cameras"|"emergency"|"predictions"|"routes", boolean>>;
  activeRoutes?: Array<{ id: string; style: "primary"|"alt"|"emergency"|"closed"|"selected"|"faded" }>;
  heatZones?: HeatZone[];
  flows?: FlowArrow[];
  moving?: MovingEntity[];
  pulseCameras?: string[];
  emergencyMarkers?: Array<{ id: string; coordinates: LatLng; label: string }>;
  focusIds?: string[]; // marker IDs to spotlight
  kpis?: Kpi[];
  panel?: DecisionPanel;
  alerts?: Array<{ severity: "INFO"|"ADVISORY"|"WARNING"|"CRITICAL"; text: string }>;
  timeline?: Array<{ time: string; text: string }>;
  approvalId?: string; // when set, panel needs approval before next step
}

export interface Scenario {
  id: "scenario1" | "scenario2" | "scenario3";
  name: string;
  headline: string;
  stages: StageKey[];
  steps: ScenarioStep[];
}

const IP03: LatLng = [17.4210, 78.4715];
const IP02: LatLng = [17.4285, 78.4772];
const IP05: LatLng = [17.4380, 78.3830];

const stagesFull: StageKey[] = ["OBSERVE","DETECT","PREDICT","SIMULATE","RECOMMEND","APPROVE","ADAPT"];

// ---------- SCENARIO 1: Proactive Crowd Risk + Emergency Response ----------
export const scenario1: Scenario = {
  id: "scenario1",
  name: "Proactive Crowd Risk & Emergency Response",
  headline: "IP-03 · Necklace Road",
  stages: stagesFull,
  steps: [
    {
      id: 1, title: "Current Monitoring", stage: "OBSERVE",
      cue: "Current crowd is still within capacity. Ask the audience: why worry?",
      mapCenter: IP03, mapZoom: 15,
      layers: { crowd: true, cameras: true, immersion: true, routes: true },
      pulseCameras: ["CAM-02","CAM-03"],
      heatZones: [{ center: IP03, radius: 320, level: "safe", label: "IP-03 crowd — NORMAL" }],
      flows: [
        { from: [17.4165,78.4700], to: IP03 },
        { from: [17.4250,78.4700], to: IP03 },
      ],
      focusIds: ["IP-03"],
      kpis: [
        { label: "Current Crowd", value: "1,420 / 2,000", tone: "safe" },
        { label: "Utilization", value: "71%", tone: "safe" },
        { label: "Incoming", value: "95 /min", tone: "info" },
        { label: "Outgoing", value: "45 /min", tone: "info" },
      ],
      panel: {
        current: { title: "Live Crowd Analytics — IP-03", items: [
          { label: "Occupancy", value: "1,420 / 2,000 (71%)", tone: "safe" },
          { label: "Net accumulation", value: "+50 people/min", tone: "warn" },
          { label: "Cameras online", value: "3 / 3", tone: "safe" },
        ]},
      },
      timeline: [{ time: "20:30", text: "Normal operations" }],
      alerts: [{ severity: "INFO", text: "Digital Twin synchronized — IP-03 telemetry live" }],
    },
    {
      id: 2, title: "Critical Density Predicted (+10 min)", stage: "PREDICT",
      cue: "Reveal the predicted state. Emphasize NOW vs +10 MIN.",
      mapCenter: IP03, mapZoom: 15,
      layers: { crowd: true, cameras: true, immersion: true, predictions: true, routes: true },
      pulseCameras: ["CAM-02","CAM-03"],
      heatZones: [
        { center: IP03, radius: 320, level: "warn", label: "NOW — 71%" },
        { center: IP03, radius: 460, level: "predict", predicted: true, label: "+10 MIN — 104% predicted" },
      ],
      flows: [
        { from: [17.4165,78.4700], to: IP03, intensity: 1 },
        { from: [17.4250,78.4700], to: IP03, intensity: 1 },
        { from: [17.4180,78.4740], to: IP03, intensity: 0.8 },
      ],
      focusIds: ["IP-03"],
      kpis: [
        { label: "Crowd (now)", value: "1,420", tone: "warn" },
        { label: "Crowd (+10m)", value: "2,080", tone: "critical" },
        { label: "Utilization (+10m)", value: "104%", tone: "critical" },
        { label: "Risk", value: "HIGH", tone: "risk" },
      ],
      panel: {
        current: { title: "Current State", items: [
          { label: "Utilization", value: "71%", tone: "warn" },
          { label: "Net inflow", value: "+50 / min", tone: "warn" },
        ]},
        prediction: {
          title: "Prediction — 10 min horizon",
          body: "Projected critical capacity in approximately 10 minutes at IP-03.",
          horizonMin: 10, risk: "HIGH",
          items: [
            { label: "Projected crowd", value: "2,080", tone: "critical" },
            { label: "Projected utilization", value: "104%", tone: "critical" },
          ],
        },
      },
      alerts: [{ severity: "WARNING", text: "Projected crowd threshold breach at IP-03 in 10 min" }],
      timeline: [{ time: "20:35", text: "Crowd inflow rising" }, { time: "20:40", text: "Critical density predicted" }],
    },
    {
      id: 3, title: "Proactive Recommendation", stage: "RECOMMEND",
      cue: "Explain the four coordinated actions. Human approval required.",
      mapCenter: IP03, mapZoom: 15,
      layers: { crowd: true, cameras: true, immersion: true, predictions: true, routes: true, emergency: true },
      heatZones: [{ center: IP03, radius: 460, level: "risk", predicted: true, label: "Predicted critical zone" }],
      activeRoutes: [{ id: "R3-A", style: "closed" }, { id: "R3-B", style: "alt" }],
      flows: [
        { from: [17.4165,78.4700], to: [17.4235,78.4665], color: "var(--color-info)", dashed: true },
      ],
      focusIds: ["IP-03"],
      kpis: [
        { label: "Recommendation", value: "R-102", tone: "info" },
        { label: "Actions", value: "4", tone: "info" },
        { label: "Awaiting", value: "APPROVAL", tone: "warn" },
      ],
      panel: {
        recommendation: {
          title: "Recommended Intervention (R-102)",
          actions: [
            "Restrict new pedestrian inflow from Entry E3",
            "Redirect incoming crowd toward Zone B",
            "Position police personnel near Junction J4",
            "Pre-position medical response team near IP-03",
          ],
          awaitingApproval: true,
        },
      },
      approvalId: "R-102",
      alerts: [{ severity: "ADVISORY", text: "Recommendation R-102 generated — awaiting Command Center approval" }],
      timeline: [{ time: "20:41", text: "Intervention recommended" }],
    },
    {
      id: 4, title: "Simulated Adaptation", stage: "ADAPT",
      cue: "Approval registered. Show the projected density falling.",
      mapCenter: IP03, mapZoom: 15,
      layers: { crowd: true, cameras: true, immersion: true, predictions: true, routes: true },
      heatZones: [
        { center: IP03, radius: 340, level: "safe", label: "After intervention — 82%" },
        { center: [17.4230, 78.4680], radius: 260, level: "warn", label: "Zone B receiving diverted flow" },
      ],
      activeRoutes: [{ id: "R3-A", style: "closed" }, { id: "R3-B", style: "selected" }],
      flows: [
        { from: [17.4165,78.4700], to: [17.4230,78.4680], color: "var(--color-safe)" },
      ],
      focusIds: ["IP-03"],
      kpis: [
        { label: "Projected utilization", value: "82%", tone: "safe" },
        { label: "Δ vs no-action", value: "-22 pts", tone: "safe" },
        { label: "Status", value: "STABILIZED", tone: "safe" },
      ],
      panel: {
        impact: {
          title: "Predicted Impact",
          before: [{ label: "Utilization (+10m)", value: "104%" }, { label: "Risk", value: "HIGH" }],
          after:  [{ label: "Utilization (+10m)", value: "82%"  }, { label: "Risk", value: "LOW"  }],
        },
        recommendation: { title: "R-102", actions: [], approvedText: "Approved by Command Center · executing" },
      },
      alerts: [{ severity: "INFO", text: "R-102 approved — pedestrian redirection active" }],
      timeline: [{ time: "20:42", text: "R-102 approved" }, { time: "20:46", text: "Density stabilizing" }],
    },
    {
      id: 5, title: "Medical Emergency — IP-03 West", stage: "DETECT",
      cue: "Introduce the emergency. Ask: which route now?",
      mapCenter: IP03, mapZoom: 15,
      layers: { crowd: true, immersion: true, routes: true, emergency: true, predictions: true },
      heatZones: [{ center: IP03, radius: 340, level: "safe" }],
      activeRoutes: [
        { id: "R3-A", style: "faded" },
        { id: "R3-B", style: "faded" },
        { id: "R3-C", style: "faded" },
      ],
      emergencyMarkers: [{ id: "EV-1", coordinates: [17.4198, 78.4695], label: "Medical Emergency" }],
      focusIds: ["EMS-03","EMS-01"],
      kpis: [
        { label: "Event", value: "MED-EMERG", tone: "critical" },
        { label: "Route A", value: "18 min", tone: "warn" },
        { label: "Route B", value: "12 min", tone: "warn" },
        { label: "Route C", value: "7 min", tone: "safe" },
      ],
      panel: {
        current: { title: "Emergency Detected", items: [
          { label: "Location", value: "IP-03 West", tone: "critical" },
          { label: "Type", value: "Medical", tone: "critical" },
          { label: "Nearest EMS", value: "Ambulance Base — Necklace Rd", tone: "info" },
        ]},
        simulation: { title: "Candidate Response Routes", options: [
          { id: "A", label: "Route A — Standard", detail: "Currently congested · 18 min" },
          { id: "B", label: "Route B — Alt",       detail: "Moderate · 12 min" },
          { id: "C", label: "Route C + Emergency Corridor", detail: "Cleared corridor · 7 min", recommended: true },
        ]},
      },
      alerts: [{ severity: "CRITICAL", text: "Medical emergency reported near IP-03 West" }],
      timeline: [{ time: "20:47", text: "Emergency reported — evaluating routes" }],
    },
    {
      id: 6, title: "Emergency Corridor Approved", stage: "APPROVE",
      cue: "Approve the corridor. Ambulance animates along Route C.",
      mapCenter: [17.4200, 78.4640], mapZoom: 15,
      layers: { immersion: true, routes: true, emergency: true, predictions: true },
      activeRoutes: [
        { id: "R3-A", style: "faded" },
        { id: "R3-B", style: "faded" },
        { id: "R3-C", style: "emergency" },
      ],
      moving: [{
        id: "amb-1", label: "Ambulance A-14", kind: "ambulance",
        path: [[17.4225,78.4700],[17.4200,78.4665],[17.4175,78.4615],[17.4172,78.4585],[17.4175,78.4570]],
        progress: 1, color: "var(--color-critical)",
      }],
      emergencyMarkers: [{ id: "EV-1", coordinates: [17.4198, 78.4695], label: "Medical Emergency" }],
      focusIds: ["EMS-03","EMS-01"],
      kpis: [
        { label: "Baseline ETA", value: "18 min", tone: "warn" },
        { label: "DT-assisted ETA", value: "7 min", tone: "safe" },
        { label: "Time saved", value: "11 min", tone: "safe" },
        { label: "Corridor", value: "ACTIVE", tone: "safe" },
      ],
      panel: {
        recommendation: {
          title: "Emergency Corridor via Route C — APPROVED",
          actions: [
            "Hold incoming traffic at Junction J2",
            "Divert Procession P-108",
            "Open temporary emergency lane",
            "Dispatch nearest medical response unit",
          ],
          approvedText: "Approved by Command Center · Traffic Police coordinated",
        },
        impact: {
          title: "Response Impact",
          before: [{ label: "ETA to Hospital", value: "18 min" }, { label: "Crowd risk", value: "STABLE" }],
          after:  [{ label: "ETA to Hospital", value: "7 min"  }, { label: "Crowd risk", value: "STABLE" }],
        },
      },
      alerts: [{ severity: "CRITICAL", text: "Emergency corridor Route C activated · ambulance dispatched" }],
      timeline: [
        { time: "20:48", text: "Corridor approved" },
        { time: "20:55", text: "Ambulance at hospital — Digital Twin synchronized" },
      ],
    },
  ],
};

// ---------- SCENARIO 2: Procession & Traffic Orchestration ----------
export const scenario2: Scenario = {
  id: "scenario2",
  name: "Procession & Traffic Orchestration",
  headline: "P-102 & P-108 → IP-02",
  stages: stagesFull,
  steps: [
    {
      id: 1, title: "Registration Identified at Checkpoint C4", stage: "DETECT",
      cue: "Show pre-registration linking pandal → idol → procession → vehicle.",
      mapCenter: [17.4200, 78.4700], mapZoom: 14,
      layers: { processions: true, cameras: true, immersion: true, routes: true, traffic: true },
      pulseCameras: ["CAM-04"],
      activeRoutes: [{ id: "R1", style: "primary" }, { id: "R2", style: "primary" }],
      focusIds: ["IP-02"],
      kpis: [
        { label: "Active processions", value: "2", tone: "info" },
        { label: "Registered vehicle", value: "TS09 •••• 4821", tone: "info" },
        { label: "Destination", value: "IP-02", tone: "info" },
      ],
      panel: {
        current: { title: "Registered Procession Detected · C4", items: [
          { label: "Procession", value: "P-102", tone: "info" },
          { label: "Pandal", value: "PDL-007 · Sri Vinayaka Youth Assoc.", tone: "info" },
          { label: "Vehicles", value: "3 · lead TS09 •••• 4821", tone: "info" },
          { label: "Participants", value: "800", tone: "info" },
        ]},
      },
      alerts: [{ severity: "INFO", text: "Registered procession P-102 detected at Checkpoint C4" }],
      timeline: [{ time: "20:32", text: "P-102 identified at C4" }],
    },
    {
      id: 2, title: "Digital Twin Synchronization", stage: "OBSERVE",
      cue: "Both processions moving toward IP-02, ETA visible.",
      mapCenter: [17.4230, 78.4600], mapZoom: 14,
      layers: { processions: true, immersion: true, routes: true, traffic: true },
      activeRoutes: [{ id: "R1", style: "primary" }, { id: "R2", style: "primary" }],
      moving: [
        { id: "P-102", label: "P-102 · 800", kind: "procession", path: [[17.4110,78.4360],[17.4155,78.4530],[17.4200,78.4650]], progress: 1, color: "var(--color-info)" },
        { id: "P-108", label: "P-108 · 650", kind: "procession", path: [[17.4340,78.4020],[17.4310,78.4300],[17.4280,78.4560]], progress: 1, color: "var(--color-warn)" },
      ],
      focusIds: ["IP-02"],
      kpis: [
        { label: "P-102 ETA", value: "12 min", tone: "info" },
        { label: "P-108 ETA", value: "17 min", tone: "info" },
        { label: "IP-02 occupancy", value: "1,350 / 2,000 (68%)", tone: "safe" },
      ],
      panel: {
        current: { title: "Two processions converging on IP-02", items: [
          { label: "P-102", value: "ETA 12m · 800 pax · 3 veh", tone: "info" },
          { label: "P-108", value: "ETA 17m · 650 pax · 2 veh", tone: "info" },
          { label: "IP-02", value: "1,350 / 2,000 · 3 cranes free", tone: "safe" },
        ]},
      },
      timeline: [{ time: "20:34", text: "Twin synchronized · 2 processions tracked" }],
    },
    {
      id: 3, title: "Convergence Predicted", stage: "PREDICT",
      cue: "Combine current crowd + procession sizes + ETA + road capacity.",
      mapCenter: IP02, mapZoom: 14,
      layers: { processions: true, immersion: true, routes: true, predictions: true, traffic: true },
      activeRoutes: [{ id: "R1", style: "primary" }, { id: "R2", style: "primary" }],
      heatZones: [
        { center: IP02, radius: 300, level: "warn", label: "IP-02 now — 68%" },
        { center: IP02, radius: 480, level: "predict", predicted: true, label: "+20 MIN — 128% predicted" },
      ],
      focusIds: ["IP-02"],
      kpis: [
        { label: "Predicted utilization", value: "128%", tone: "critical" },
        { label: "Road R4 congestion", value: "SEVERE", tone: "critical" },
        { label: "Horizon", value: "+20 min", tone: "info" },
      ],
      panel: {
        prediction: {
          title: "Convergence Prediction (+20 min)",
          body: "If both processions continue toward IP-02, projected crowd utilization reaches 128% and Road R4 will experience severe congestion.",
          horizonMin: 20, risk: "HIGH",
          items: [
            { label: "Projected IP-02", value: "2,560 / 2,000 (128%)", tone: "critical" },
            { label: "Road R4", value: "SEVERE congestion", tone: "critical" },
          ],
        },
      },
      alerts: [{ severity: "WARNING", text: "Processions P-102 and P-108 predicted to converge on IP-02" }],
      timeline: [{ time: "20:36", text: "Convergence predicted" }],
    },
    {
      id: 4, title: "Simulate Alternatives", stage: "SIMULATE",
      cue: "Walk through the three options and their trade-offs.",
      mapCenter: [17.4300, 78.4400], mapZoom: 12,
      layers: { processions: true, immersion: true, routes: true, predictions: true },
      activeRoutes: [
        { id: "R1", style: "primary" },
        { id: "R2", style: "faded" },
        { id: "R7", style: "alt" },
      ],
      focusIds: ["IP-02","IP-05"],
      kpis: [
        { label: "Option A", value: "Severe congestion", tone: "critical" },
        { label: "Option B", value: "Hold P-108 15m", tone: "warn" },
        { label: "Option C", value: "Redirect via R7 → IP-05", tone: "safe" },
      ],
      panel: {
        simulation: { title: "Three Alternatives", options: [
          { id: "A", label: "Allow both → IP-02",           detail: "Severe congestion · 128% at IP-02" },
          { id: "B", label: "Hold P-108 for 15 min",         detail: "Moderate congestion · +15m delay" },
          { id: "C", label: "Redirect P-108 → IP-04/IP-05 via R7", detail: "Balanced load · +6m travel · lower system congestion", recommended: true },
        ]},
      },
      timeline: [{ time: "20:37", text: "Simulation of 3 options completed" }],
    },
    {
      id: 5, title: "System-wide Recommendation", stage: "RECOMMEND",
      cue: "Objective: safest system-wide movement, not shortest individual route.",
      mapCenter: [17.4300, 78.4400], mapZoom: 12,
      layers: { processions: true, immersion: true, routes: true, predictions: true },
      activeRoutes: [
        { id: "R1", style: "primary" },
        { id: "R2", style: "faded" },
        { id: "R7", style: "selected" },
      ],
      focusIds: ["IP-02","IP-05"],
      kpis: [
        { label: "Recommended", value: "Option C", tone: "safe" },
        { label: "Awaiting", value: "APPROVAL", tone: "warn" },
      ],
      panel: {
        recommendation: {
          title: "Recommendation — Redirect P-108 via R7 → IP-05",
          actions: [
            "IP-05 has sufficient crowd capacity",
            "3 cranes available (incl. CR-12)",
            "R7 has lower predicted traffic load",
            "Additional travel time ~6 min",
            "Reduces predicted IP-02 load from 128% → 84%",
          ],
          awaitingApproval: true,
        },
      },
      approvalId: "R-207",
      alerts: [{ severity: "ADVISORY", text: "R-207 recommends redirect of P-108 · awaiting Traffic Police approval" }],
      timeline: [{ time: "20:38", text: "R-207 generated" }],
    },
    {
      id: 6, title: "Adaptation Applied", stage: "ADAPT",
      cue: "P-108 reroutes, IP-02 stabilizes. Emphasize: shortest ≠ safest.",
      mapCenter: [17.4300, 78.4400], mapZoom: 12,
      layers: { processions: true, immersion: true, routes: true, predictions: true },
      activeRoutes: [
        { id: "R1", style: "primary" },
        { id: "R7", style: "selected" },
      ],
      moving: [
        { id: "P-102", label: "P-102 → IP-02", kind: "procession",
          path: [[17.4110,78.4360],[17.4155,78.4530],[17.4200,78.4650],[17.4260,78.4735],[17.4285,78.4772]], progress: 1, color: "var(--color-info)" },
        { id: "P-108", label: "P-108 → IP-05 (rerouted)", kind: "procession",
          path: [[17.4340,78.4020],[17.4310,78.4300],[17.4300,78.4020],[17.4380,78.3830]], progress: 1, color: "var(--color-safe)" },
      ],
      focusIds: ["IP-02","IP-05"],
      kpis: [
        { label: "IP-02 (before)", value: "128%", tone: "critical" },
        { label: "IP-02 (after)",  value: "84%",  tone: "safe" },
        { label: "Road R4",         value: "MODERATE", tone: "safe" },
      ],
      panel: {
        impact: {
          title: "System Impact — Safest System-wide Movement",
          before: [{ label: "IP-02", value: "128%" }, { label: "Road R4", value: "SEVERE" }, { label: "Emergency headroom", value: "None" }],
          after:  [{ label: "IP-02", value: "84%"  }, { label: "Road R4", value: "MODERATE" }, { label: "Emergency headroom", value: "Restored" }],
        },
        recommendation: { title: "R-207", actions: [], approvedText: "Approved by Traffic Police · P-108 rerouted via R7" },
      },
      alerts: [{ severity: "INFO", text: "System-wide route optimized (R-207 executed)" }],
      timeline: [{ time: "20:39", text: "P-108 rerouted · IP-02 stabilizing" }],
    },
  ],
};

// ---------- SCENARIO 3: Dynamic Immersion Queue + Resource Orchestration ----------
export const scenario3: Scenario = {
  id: "scenario3",
  name: "Dynamic Immersion Pass & Resource Orchestration",
  headline: "GNI-2026-0142 · Sri Vinayaka Youth Association",
  stages: stagesFull,
  steps: [
    {
      id: 1, title: "Digital Immersion Pass Registered", stage: "OBSERVE",
      cue: "The pass carries pandal + idol + procession + vehicle context.",
      mapCenter: [17.4260, 78.4400], mapZoom: 14,
      layers: { immersion: true, cranes: true, routes: true, processions: true },
      processions: [
        { id: "P-142", label: "GNI-2026-0142", kind: "procession", path: [[17.4260, 78.4400], [17.4240, 78.4500]], progress: 0, color: "var(--color-info)" }
      ],
      focusIds: ["IP-01","IP-02","IP-03","IP-04","IP-05"],
      kpis: [
        { label: "Pass", value: "GNI-2026-0142", tone: "info" },
        { label: "Idol", value: "16 ft · 2,200 kg · Eco-Friendly", tone: "info" },
        { label: "Participants", value: "650", tone: "info" },
      ],
      panel: {
        current: { title: "Digital Immersion Pass", items: [
          { label: "Pandal", value: "Sri Vinayaka Youth Association" },
          { label: "Idol", value: "16 ft · 2,200 kg · 9 ft wide · Eco-Friendly" },
          { label: "Procession", value: "650 pax · 2 vehicles · Banjara Hills" },
          { label: "Preferred window", value: "21:00 – 22:00" },
          { label: "Status", value: "REGISTERED", tone: "info" },
        ]},
      },
      timeline: [{ time: "20:15", text: "Digital Pass GNI-2026-0142 registered" }],
    },
    {
      id: 2, title: "Multi-constraint Suitability Analysis", stage: "SIMULATE",
      cue: "IP-03 is closest but cranes can't lift 2,200 kg × 16 ft. Distance ≠ suitability.",
      mapCenter: [17.4260, 78.4500], mapZoom: 14,
      layers: { immersion: true, cranes: true, routes: true, processions: true },
      processions: [
        { id: "P-142", label: "GNI-2026-0142", kind: "procession", path: [[17.4260, 78.4400], [17.4240, 78.4500]], progress: 0.2, color: "var(--color-info)" }
      ],
      activeRoutes: [{ id: "R6", style: "alt" }],
      focusIds: ["IP-01","IP-02","IP-03"],
      kpis: [
        { label: "IP-01", value: "Wait 46m · 1 crane", tone: "warn" },
        { label: "IP-02", value: "Wait 18m · 3 cranes", tone: "safe" },
        { label: "IP-03", value: "Crane capacity NOT suitable", tone: "critical" },
      ],
      panel: {
        simulation: { title: "Candidate Immersion Points", options: [
          { id: "IP-01", label: "IP-01 · 8.2 km", detail: "Crowd HIGH · queue 34 · 1 crane · predicted wait 46 min" },
          { id: "IP-02", label: "IP-02 · 10.4 km", detail: "Crowd MEDIUM · queue 12 · 3 cranes · predicted wait 18 min", recommended: true },
          { id: "IP-03", label: "IP-03 · 6.9 km", detail: "Closest · but crane capacity NOT suitable for 2,200 kg × 16 ft idol" },
        ]},
      },
      alerts: [{ severity: "ADVISORY", text: "IP-03 excluded — crane capacity insufficient for 2,200 kg / 16 ft idol" }],
      timeline: [{ time: "20:16", text: "Suitability analysis across 3 IPs" }],
    },
    {
      id: 3, title: "Initial Allocation — IP-02 / CR-07", stage: "RECOMMEND",
      cue: "Explain WHY this decision: dimensions × crane × queue × crowd × traffic.",
      mapCenter: [17.4230, 78.4600], mapZoom: 14,
      layers: { immersion: true, cranes: true, routes: true, processions: true },
      processions: [
        { id: "P-142", label: "GNI-2026-0142", kind: "procession", path: [[17.4260, 78.4400], [17.4240, 78.4500]], progress: 0.5, color: "var(--color-info)" }
      ],
      activeRoutes: [{ id: "R6", style: "selected" }],
      focusIds: ["IP-02"],
      kpis: [
        { label: "Assigned IP", value: "IP-02", tone: "safe" },
        { label: "Crane", value: "CR-07", tone: "safe" },
        { label: "Arrival slot", value: "21:35", tone: "info" },
        { label: "Predicted wait", value: "16–18 min", tone: "safe" },
      ],
      panel: {
        recommendation: {
          title: "Allocation — IP-02 · CR-07 · 21:35 · Route R6",
          actions: [
            "Idol dimensions compatible with CR-07",
            "Suitable crane available at time of arrival",
            "Lower predicted queue at IP-02",
            "Safe crowd capacity headroom",
            "Acceptable traffic conditions on R6",
          ],
          approvedText: "Allocation issued — pass updated",
        },
      },
      timeline: [{ time: "20:18", text: "Allocation IP-02 / CR-07 / 21:35 issued" }],
    },
    {
      id: 4, title: "Resource Failure — CR-07 FAULT", stage: "DETECT",
      cue: "A crane fault cascades to queue → traffic → crowd.",
      mapCenter: IP02, mapZoom: 14,
      layers: { immersion: true, cranes: true, routes: true, processions: true, predictions: true },
      processions: [
        { id: "P-142", label: "GNI-2026-0142", kind: "procession", path: [[17.4260, 78.4400], [17.4240, 78.4500]], progress: 0.8, color: "var(--color-warn)" }
      ],
      heatZones: [{ center: IP02, radius: 380, level: "risk", predicted: true, label: "Predicted spillback +HIGH" }],
      focusIds: ["IP-02"],
      kpis: [
        { label: "CR-07", value: "FAULT", tone: "critical" },
        { label: "Queue (now)", value: "12", tone: "warn" },
        { label: "Queue (+30m)", value: "29", tone: "critical" },
        { label: "Wait (+30m)", value: "47 min", tone: "critical" },
      ],
      panel: {
        prediction: {
          title: "Cascade Prediction — Resource → Queue → Traffic → Crowd",
          body: "CR-07 fault will grow the IP-02 queue from 12 → 29 vehicles, wait time 18 → 47 min, with HIGH road spillback risk and ~+420 people accumulating.",
          horizonMin: 30, risk: "HIGH",
          items: [
            { label: "Queue", value: "12 → 29", tone: "critical" },
            { label: "Wait", value: "18m → 47m", tone: "critical" },
            { label: "Spillback risk", value: "HIGH", tone: "critical" },
            { label: "Crowd accumulation", value: "+420", tone: "critical" },
          ],
        },
      },
      alerts: [{ severity: "CRITICAL", text: "Crane CR-07 unavailable — cascade prediction generated" }],
      timeline: [{ time: "20:30", text: "CR-07 FAULT detected" }, { time: "20:31", text: "Cascade prediction generated" }],
    },
    {
      id: 5, title: "Re-simulation of Alternatives", stage: "SIMULATE",
      cue: "Compare keep / delay / reallocate.",
      mapCenter: [17.4310, 78.4300], mapZoom: 14,
      layers: { immersion: true, cranes: true, routes: true, predictions: true, processions: true },
      processions: [
        { id: "P-142", label: "GNI-2026-0142", kind: "procession", path: [[17.4240, 78.4500], [17.4300, 78.4600]], progress: 0.2, color: "var(--color-info)" }
      ],
      activeRoutes: [{ id: "R6", style: "faded" }, { id: "R7", style: "alt" }],
      focusIds: ["IP-02","IP-05"],
      kpis: [
        { label: "Option A", value: "Wait 47m", tone: "critical" },
        { label: "Option B", value: "Delay 25m", tone: "warn" },
        { label: "Option C", value: "Reallocate → IP-05 / CR-12", tone: "safe" },
      ],
      panel: {
        simulation: { title: "Alternatives", options: [
          { id: "A", label: "Keep allocation at IP-02", detail: "Wait 47 min · high queue spillback" },
          { id: "B", label: "Delay procession +25 min", detail: "Wait 22 min · but holding area congestion" },
          { id: "C", label: "Reallocate → IP-05 / CR-12", detail: "+8 min travel · wait 14 min · crowd 61% · traffic LOW", recommended: true },
        ]},
      },
      timeline: [{ time: "20:32", text: "Alternatives re-simulated" }],
    },
    {
      id: 6, title: "Dynamic Reallocation — Pass Updated", stage: "ADAPT",
      cue: "The Digital Immersion Pass is dynamic — it adapts to the real system state.",
      mapCenter: [17.4310, 78.4200], mapZoom: 12,
      layers: { immersion: true, cranes: true, routes: true, processions: true, predictions: true },
      processions: [
        { id: "P-142", label: "GNI-2026-0142 (Rerouted to IP-05)", kind: "procession", path: [[17.4240, 78.4500], [17.4340, 78.4600]], progress: 0.9, color: "var(--color-safe)" }
      ],
      activeRoutes: [{ id: "R6", style: "faded" }, { id: "R7", style: "selected" }],
      moving: [{
        id: "P-142", label: "Procession GNI-0142 · rerouted",
        kind: "procession",
        path: [[17.4110,78.4360],[17.4200,78.4200],[17.4300,78.4020],[17.4380,78.3830]],
        progress: 1, color: "var(--color-safe)",
      }],
      focusIds: ["IP-05"],
      kpis: [
        { label: "New IP", value: "IP-05", tone: "safe" },
        { label: "New crane", value: "CR-12", tone: "safe" },
        { label: "New slot", value: "21:43", tone: "info" },
        { label: "Wait", value: "47m → 14m", tone: "safe" },
      ],
      panel: {
        impact: {
          title: "Before / After Adaptation",
          before: [{ label: "Wait", value: "47 min" }, { label: "Spillback", value: "HIGH" }, { label: "Crowd risk", value: "Rising" }],
          after:  [{ label: "Wait", value: "14 min" }, { label: "Spillback", value: "Avoided" }, { label: "Crowd risk", value: "Stable" }],
        },
        recommendation: { title: "Pass updated: IP-05 · CR-12 · 21:43 · Route R7", actions: [], approvedText: "Digital Twin re-synchronized after resource change" },
      },
      alerts: [{ severity: "INFO", text: "Pass GNI-2026-0142 dynamically updated · IP-05 / CR-12" }],
      timeline: [{ time: "20:33", text: "Pass reallocated · rerouted via R7" }, { time: "20:34", text: "Digital Twin re-synchronized" }],
    },
  ],
};

export const scenarios: Record<Scenario["id"], Scenario> = {
  scenario1, scenario2, scenario3,
};
