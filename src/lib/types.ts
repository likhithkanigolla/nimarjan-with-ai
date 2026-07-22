// Central types for the Digital Twin prototype.

export type EntityStatus =
  | "AVAILABLE" | "BUSY" | "MAINTENANCE" | "FAULT" | "RESERVED"
  | "NORMAL" | "MODERATE" | "HIGH" | "CRITICAL"
  | "OPERATIONAL" | "REGISTERED" | "EN_ROUTE" | "HELD" | "REROUTED" | "COMPLETED";

export type Role =
  | "Command Center"
  | "Traffic Police"
  | "Field Officer"
  | "Emergency Services"
  | "Viewer";

export type LatLng = [number, number];

export interface Pandal {
  id: string;
  organizer_name: string;
  mobile_number: string; // stored masked
  address: string;
  organization: string;
}

export interface Idol {
  pandal_id: string;
  height: number; height_unit: "ft";
  estimated_weight: number; weight_unit: "kg";
  width: number; width_unit: "ft";
  type: "Eco-Friendly" | "PoP/Synthetic";
}

export interface Procession {
  procession_id: string;
  pandal_id: string;
  expected_immersion_date: string;
  preferred_time: string;
  number_of_participants: number;
  starting_location: string;
  current_location?: LatLng;
  assigned_immersion_point?: string;
  estimated_arrival_time?: string;
  route_id?: string;
  status: EntityStatus;
}

export interface Vehicle {
  vehicle_id: string;
  pandal_id: string;
  procession_id: string;
  vehicle_number: string; // masked in views
  vehicle_type: string;
  length: number; width: number; number_of_wheels: number;
}

export interface ImmersionPoint {
  id: string; name: string; coordinates: LatLng;
  safe_crowd_capacity: number;
  current_crowd: number;
  queue_length: number;
  average_service_time: number; // minutes per idol
  available_cranes: number;
  total_cranes: number;
  status: EntityStatus;
}

export interface Crane {
  id: string; immersion_point_id: string;
  status: EntityStatus;
  max_supported_weight: number; // kg
  max_supported_height: number; // ft
  supported_idol_types: Array<"Eco-Friendly" | "PoP/Synthetic">;
  estimated_service_time: number; // minutes
}

export interface Camera { id: string; name: string; coordinates: LatLng; kind: "crowd" | "traffic"; }
export interface EmergencyService { id: string; name: string; coordinates: LatLng; kind: "hospital" | "police" | "ambulance" | "fire"; }
export interface RouteDef { id: string; name: string; coordinates: LatLng[]; kind?: "primary" | "emergency" | "alt" | "closed"; }
