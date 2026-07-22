// Thin abstraction so UI never imports JSON directly.
// Later swap function bodies for fetch()/WebSocket calls.
import {
  pandals,
  idols,
  processions,
  vehicles,
  immersionPoints,
  cranes,
  cameras,
  emergencyServices,
  routes,
  MAP_CENTER,
} from "@/data/mock";

export interface OrchestratorDecision {
  pandal_id: string;
  vehicle_number: string;
  route: string;
  route_minutes: number;
  ghat: string;
  crane: number;
  slot_start: string;
  waiting_minutes: number;
  crowd_risk: string;
  risk_score: number;
  allow_entry_now: boolean;
  actions: string[];
}

export interface OrchestratorReport {
  agent_name: string;
  summary: string;
}

export interface OrchestratorSnapshot {
  generated_at: string;
  decisions: OrchestratorDecision[];
  agent_reports: OrchestratorReport[];
  remaining_crane_capacity?: string[];
}

const API_BASE_URL = import.meta.env.VITE_AGENTIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export const dataService = {
  getMapCenter: () => MAP_CENTER,
  getPandals: async () => pandals,
  getIdols: async () => idols,
  getProcessions: async () => processions,
  getVehicles: async () => vehicles,
  getImmersionPoints: async () => immersionPoints,
  getCranes: async () => cranes,
  getCameras: async () => cameras,
  getEmergencyServices: async () => emergencyServices,
  getRoutes: async () => routes,

  // Sync accessors used by scenarios / suitability engine
  syncPandals: () => pandals,
  syncIdols: () => idols,
  syncProcessions: () => processions,
  syncImmersionPoints: () => immersionPoints,
  syncCranes: () => cranes,
  syncCameras: () => cameras,
  syncEmergency: () => emergencyServices,
  syncRoutes: () => routes,

  getOrchestratorSnapshot: async (step = 0): Promise<OrchestratorSnapshot> => {
    const response = await fetch(`${API_BASE_URL}/api/orchestrator?step=${step}`);
    if (!response.ok) {
      throw new Error(`Failed to load orchestrator snapshot (${response.status})`);
    }
    return response.json() as Promise<OrchestratorSnapshot>;
  },
};
