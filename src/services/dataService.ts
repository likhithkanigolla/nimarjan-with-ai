// Thin abstraction so UI never imports JSON directly.
// Later swap function bodies for fetch()/WebSocket calls.
import {
  pandals, idols, processions, vehicles, immersionPoints,
  cranes, cameras, emergencyServices, routes, MAP_CENTER,
} from "@/data/mock";

export const dataService = {
  getMapCenter: () => MAP_CENTER,
  getPandals:   async () => pandals,
  getIdols:     async () => idols,
  getProcessions: async () => processions,
  getVehicles:  async () => vehicles,
  getImmersionPoints: async () => immersionPoints,
  getCranes:    async () => cranes,
  getCameras:   async () => cameras,
  getEmergencyServices: async () => emergencyServices,
  getRoutes:    async () => routes,

  // Sync accessors used by scenarios / suitability engine
  syncPandals: () => pandals,
  syncIdols: () => idols,
  syncProcessions: () => processions,
  syncImmersionPoints: () => immersionPoints,
  syncCranes: () => cranes,
  syncCameras: () => cameras,
  syncEmergency: () => emergencyServices,
  syncRoutes: () => routes,
};
