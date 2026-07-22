// Mock data for the Ganesh Nimarjan Digital Twin.
// Coordinates centered around Hussain Sagar / Tank Bund / NTR Marg, Hyderabad.
import type {
  Pandal, Idol, Procession, Vehicle, ImmersionPoint, Crane,
  Camera, EmergencyService, RouteDef, LatLng,
} from "@/lib/types";

// Anchor: Hussain Sagar approx 17.4239, 78.4738
export const MAP_CENTER: LatLng = [17.4239, 78.4738];

// Mask helpers
const maskPhone = (n: string) => n.slice(0, 2) + "XXXXXX" + n.slice(-2);
const maskVehicle = (v: string) => v.replace(/^([A-Z]{2}\d{2})(.*)(\d{4})$/, (_, a, _b, c) => `${a} •••• ${c}`);

const hydNeighborhoods = [
  "Banjara Hills","Jubilee Hills","Ameerpet","Kukatpally","Secunderabad","Begumpet",
  "Somajiguda","Punjagutta","Khairatabad","Abids","Nampally","Charminar",
  "Malakpet","Dilsukhnagar","LB Nagar","Uppal","Miyapur","SR Nagar","Mehdipatnam","Tolichowki",
];
const orgs = [
  "Sri Ganesh Utsav Committee","Sri Vinayaka Youth Association","Balaji Seva Samithi",
  "Ganapati Mandal","Vighnaharta Trust","Ekadanta Utsav Samithi","Modaka Youth Group",
  "Siddhi Vinayaka Sangham","Mahaganapati Samithi","Lambodara Yuva Sena",
];
const first = ["Ramesh","Suresh","Anil","Praveen","Kiran","Naveen","Rajesh","Vinod","Srinivas","Harish","Mahesh","Vikram","Sandeep","Bhaskar","Ravi","Arjun","Nikhil","Karthik","Rohit","Manoj"];
const last = ["Kumar","Reddy","Rao","Sharma","Naidu","Goud","Yadav","Patel","Verma","Chowdary"];

export const pandals: Pandal[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `PDL-${String(i + 1).padStart(3, "0")}`,
  organizer_name: `${first[i % first.length]} ${last[i % last.length]}`,
  mobile_number: maskPhone(`98${String(10000000 + i * 137).slice(0, 8)}`),
  address: `${hydNeighborhoods[i % hydNeighborhoods.length]}, Hyderabad`,
  organization: orgs[i % orgs.length],
}));

export const idols: Idol[] = pandals.map((p, i) => ({
  pandal_id: p.id,
  height: [8, 10, 12, 14, 16, 18, 22][i % 7],
  height_unit: "ft",
  estimated_weight: [400, 800, 1200, 1800, 2200, 2800, 3600][i % 7],
  weight_unit: "kg",
  width: [5, 6, 7, 8, 9, 10, 12][i % 7],
  width_unit: "ft",
  type: i % 3 === 0 ? "PoP/Synthetic" : "Eco-Friendly",
}));

// 6 immersion points around Hussain Sagar + suburbs
export const immersionPoints: ImmersionPoint[] = [
  { id: "IP-01", name: "NTR Marg — North",   coordinates: [17.4262, 78.4736], safe_crowd_capacity: 2200, current_crowd: 1780, queue_length: 34, available_cranes: 1, total_cranes: 3, average_service_time: 12, status: "OPERATIONAL" },
  { id: "IP-02", name: "Tank Bund — East",   coordinates: [17.4285, 78.4772], safe_crowd_capacity: 2000, current_crowd: 1350, queue_length: 12, available_cranes: 3, total_cranes: 4, average_service_time: 10, status: "OPERATIONAL" },
  { id: "IP-03", name: "Necklace Road",       coordinates: [17.4210, 78.4715], safe_crowd_capacity: 2000, current_crowd: 1420, queue_length: 12, available_cranes: 3, total_cranes: 4, average_service_time: 11, status: "OPERATIONAL" },
  { id: "IP-04", name: "Sanjeevaiah Park",    coordinates: [17.4321, 78.4720], safe_crowd_capacity: 1800, current_crowd:  620, queue_length:  4, available_cranes: 2, total_cranes: 2, average_service_time: 13, status: "OPERATIONAL" },
  { id: "IP-05", name: "Durgam Cheruvu",      coordinates: [17.4380, 78.3830], safe_crowd_capacity: 1600, current_crowd:  510, queue_length:  6, available_cranes: 2, total_cranes: 3, average_service_time: 14, status: "OPERATIONAL" },
  { id: "IP-06", name: "Saroornagar Lake",    coordinates: [17.3547, 78.5310], safe_crowd_capacity: 1400, current_crowd:  380, queue_length:  3, available_cranes: 1, total_cranes: 2, average_service_time: 16, status: "OPERATIONAL" },
];

export const cranes: Crane[] = [
  // IP-01
  { id: "CR-01", immersion_point_id: "IP-01", status: "BUSY",      max_supported_weight: 3000, max_supported_height: 18, supported_idol_types: ["Eco-Friendly","PoP/Synthetic"], estimated_service_time: 12 },
  { id: "CR-02", immersion_point_id: "IP-01", status: "AVAILABLE", max_supported_weight: 2000, max_supported_height: 14, supported_idol_types: ["Eco-Friendly"], estimated_service_time: 10 },
  { id: "CR-03", immersion_point_id: "IP-01", status: "MAINTENANCE",max_supported_weight: 4000, max_supported_height: 22, supported_idol_types: ["Eco-Friendly","PoP/Synthetic"], estimated_service_time: 14 },
  // IP-02
  { id: "CR-04", immersion_point_id: "IP-02", status: "AVAILABLE", max_supported_weight: 2500, max_supported_height: 16, supported_idol_types: ["Eco-Friendly","PoP/Synthetic"], estimated_service_time: 11 },
  { id: "CR-05", immersion_point_id: "IP-02", status: "AVAILABLE", max_supported_weight: 3500, max_supported_height: 20, supported_idol_types: ["Eco-Friendly","PoP/Synthetic"], estimated_service_time: 12 },
  { id: "CR-06", immersion_point_id: "IP-02", status: "BUSY",      max_supported_weight: 2000, max_supported_height: 14, supported_idol_types: ["Eco-Friendly"], estimated_service_time: 10 },
  { id: "CR-07", immersion_point_id: "IP-02", status: "AVAILABLE", max_supported_weight: 3000, max_supported_height: 18, supported_idol_types: ["Eco-Friendly","PoP/Synthetic"], estimated_service_time: 12 },
  // IP-03 — small cranes only (used in Scenario 3 suitability logic)
  { id: "CR-08", immersion_point_id: "IP-03", status: "AVAILABLE", max_supported_weight: 1500, max_supported_height: 12, supported_idol_types: ["Eco-Friendly"], estimated_service_time: 9 },
  { id: "CR-09", immersion_point_id: "IP-03", status: "AVAILABLE", max_supported_weight: 1800, max_supported_height: 13, supported_idol_types: ["Eco-Friendly"], estimated_service_time: 10 },
  { id: "CR-10", immersion_point_id: "IP-03", status: "BUSY",      max_supported_weight: 1500, max_supported_height: 12, supported_idol_types: ["Eco-Friendly"], estimated_service_time: 9 },
  // IP-04
  { id: "CR-11", immersion_point_id: "IP-04", status: "AVAILABLE", max_supported_weight: 3000, max_supported_height: 18, supported_idol_types: ["Eco-Friendly","PoP/Synthetic"], estimated_service_time: 12 },
  // IP-05
  { id: "CR-12", immersion_point_id: "IP-05", status: "AVAILABLE", max_supported_weight: 3500, max_supported_height: 20, supported_idol_types: ["Eco-Friendly","PoP/Synthetic"], estimated_service_time: 11 },
  { id: "CR-13", immersion_point_id: "IP-05", status: "AVAILABLE", max_supported_weight: 2500, max_supported_height: 16, supported_idol_types: ["Eco-Friendly","PoP/Synthetic"], estimated_service_time: 11 },
];

export const processions: Procession[] = Array.from({ length: 15 }).map((_, i) => {
  const pandal = pandals[i];
  const targets = ["IP-01","IP-02","IP-03","IP-04","IP-05","IP-06"];
  return {
    procession_id: `P-${100 + i}`,
    pandal_id: pandal.id,
    expected_immersion_date: "2026-09-15",
    preferred_time: ["19:00","20:00","21:00","22:00"][i % 4],
    number_of_participants: 300 + (i % 6) * 120,
    starting_location: pandal.address,
    assigned_immersion_point: targets[i % targets.length],
    estimated_arrival_time: `${19 + (i % 4)}:${["05","20","35","50"][i % 4]}`,
    status: i % 5 === 0 ? "EN_ROUTE" : "REGISTERED",
  };
});

export const vehicles: Vehicle[] = processions.flatMap((p, i) =>
  Array.from({ length: (i % 3) + 1 }).map((_, k) => ({
    vehicle_id: `V-${p.procession_id}-${k + 1}`,
    pandal_id: p.pandal_id,
    procession_id: p.procession_id,
    vehicle_number: maskVehicle(`TS${String(7 + (i % 20)).padStart(2, "0")}AB${String(4000 + i * 41 + k * 7).slice(-4)}`),
    vehicle_type: k === 0 ? "Truck (Idol Carrier)" : "Support Van",
    length: k === 0 ? 6.5 : 4.5,
    width: 2.4,
    number_of_wheels: k === 0 ? 6 : 4,
  })),
);

export const cameras: Camera[] = [
  { id: "CAM-01", name: "Tank Bund North Cam",  coordinates: [17.4290, 78.4760], kind: "crowd" },
  { id: "CAM-02", name: "NTR Marg Cam",          coordinates: [17.4258, 78.4735], kind: "crowd" },
  { id: "CAM-03", name: "Necklace Road Cam",     coordinates: [17.4218, 78.4720], kind: "crowd" },
  { id: "CAM-04", name: "Checkpoint C4 (Traffic)",coordinates: [17.4165, 78.4700], kind: "traffic" },
  { id: "CAM-05", name: "Junction J2 (Traffic)",  coordinates: [17.4180, 78.4778], kind: "traffic" },
  { id: "CAM-06", name: "Junction J4 (Traffic)",  coordinates: [17.4245, 78.4790], kind: "traffic" },
];

export const emergencyServices: EmergencyService[] = [
  { id: "EMS-01", name: "Yashoda Hospital (Somajiguda)", coordinates: [17.4175, 78.4570], kind: "hospital" },
  { id: "EMS-02", name: "Care Hospital (Banjara Hills)", coordinates: [17.4110, 78.4360], kind: "hospital" },
  { id: "EMS-03", name: "Ambulance Base — Necklace Rd",  coordinates: [17.4225, 78.4700], kind: "ambulance" },
  { id: "EMS-04", name: "Police Cmd — Khairatabad",      coordinates: [17.4145, 78.4640], kind: "police" },
  { id: "EMS-05", name: "Police Cmd — Secunderabad",     coordinates: [17.4400, 78.4980], kind: "police" },
];

// Routes / corridors used in scenarios
export const routes: RouteDef[] = [
  { id: "R1", name: "Banjara Hills → IP-02",    kind: "primary",   coordinates: [[17.4110,78.4360],[17.4155,78.4530],[17.4200,78.4650],[17.4260,78.4735],[17.4285,78.4772]] },
  { id: "R2", name: "Jubilee Hills → IP-02",    kind: "primary",   coordinates: [[17.4340,78.4020],[17.4310,78.4300],[17.4280,78.4560],[17.4285,78.4772]] },
  { id: "R3-A", name: "Route A — Standard",     kind: "primary",   coordinates: [[17.4225,78.4700],[17.4212,78.4680],[17.4180,78.4640],[17.4170,78.4590],[17.4175,78.4570]] },
  { id: "R3-B", name: "Route B — Alt",           kind: "alt",      coordinates: [[17.4225,78.4700],[17.4235,78.4665],[17.4210,78.4610],[17.4180,78.4585],[17.4175,78.4570]] },
  { id: "R3-C", name: "Route C — Emergency",     kind: "emergency",coordinates: [[17.4225,78.4700],[17.4200,78.4665],[17.4175,78.4615],[17.4172,78.4585],[17.4175,78.4570]] },
  { id: "R6", name: "Banjara Hills → IP-02 (R6)",kind: "primary",  coordinates: [[17.4110,78.4360],[17.4150,78.4510],[17.4210,78.4640],[17.4260,78.4740],[17.4285,78.4772]] },
  { id: "R7", name: "Banjara Hills → IP-05 (R7)",kind: "alt",      coordinates: [[17.4110,78.4360],[17.4200,78.4200],[17.4300,78.4020],[17.4380,78.3830]] },
];
