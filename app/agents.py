from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, List, Sequence, Tuple

from .config import CraneConfig, GhatConfig
from .models import (
    AgentReport,
    AnprSnapshot,
    CrowdRiskAssessment,
    CrowdSnapshot,
    ImmersionRecommendation,
    IdolRecord,
    OrchestrationResult,
    PandalRecord,
    ProcessionDecision,
    ProcessionRecord,
    RouteRecommendation,
    TrafficSnapshot,
    VehicleRecord,
    WeatherSnapshot,
)


@dataclass
class PandalAgent:
    pandal_records: Sequence[PandalRecord]
    idol_records: Sequence[IdolRecord]
    procession_records: Sequence[ProcessionRecord]
    vehicle_records: Sequence[VehicleRecord]

    def report(self) -> AgentReport:
        return AgentReport(
            agent_name="pandal-agent",
            summary=f"Loaded {len(self.pandal_records)} pandals, {len(self.procession_records)} processions, and {len(self.vehicle_records)} vehicles.",
        )

    def build_index(self) -> Dict[str, Dict[str, object]]:
        idol_index = {record.pandal_id: record for record in self.idol_records}
        procession_index = {record.pandal_id: record for record in self.procession_records}
        vehicle_index = {record.pandal_id: record for record in self.vehicle_records}
        return {
            pandal.pandal_id: {
                "pandal": pandal,
                "idol": idol_index.get(pandal.pandal_id),
                "procession": procession_index.get(pandal.pandal_id),
                "vehicle": vehicle_index.get(pandal.pandal_id),
            }
            for pandal in self.pandal_records
        }


@dataclass
class CrowdAgent:
    def assess(
        self,
        crowd: CrowdSnapshot,
        traffic: TrafficSnapshot,
        weather: WeatherSnapshot,
        procession: ProcessionRecord,
        idol: IdolRecord,
    ) -> CrowdRiskAssessment:
        size_factor = procession.number_of_participants / 450.0
        idol_factor = idol.estimated_weight / 1200.0
        traffic_factor = traffic.congestion * 0.9 + traffic.road_occupancy * 0.25
        weather_factor = (1.0 - weather.visibility) * 0.8 + weather.rainfall / 20.0
        predicted_density = crowd.crowd_density + size_factor * 42.0 + traffic_factor * 28.0 + weather_factor * 18.0 + idol_factor * 12.0
        risk_score = min(100.0, predicted_density * 0.72 + crowd.bottleneck_score * 25.0 + traffic.congestion * 18.0)

        if risk_score >= 75:
            level = "critical"
        elif risk_score >= 55:
            level = "high"
        elif risk_score >= 35:
            level = "moderate"
        else:
            level = "low"

        actions: List[str] = []
        if level in {"critical", "high"}:
            actions.extend([
                "delay incoming processions",
                "open alternate entry routes",
                "deploy additional police",
            ])
        if crowd.bottleneck_score >= 0.55:
            actions.append("install temporary barricades at bottleneck points")
        if weather.rainfall >= 8.0:
            actions.append("activate rain contingency routing")

        return CrowdRiskAssessment(
            current_density=round(crowd.crowd_density, 2),
            predicted_density=round(predicted_density, 2),
            risk_score=round(risk_score, 2),
            risk_level=level,
            actions=actions,
        )

    def report(self) -> AgentReport:
        return AgentReport(agent_name="crowd-agent", summary="Projected crowd density and stampede risk from live crowd, traffic, and weather signals.")


@dataclass
class TrafficAgent:
    def recommend_route(
        self,
        procession: ProcessionRecord,
        traffic: TrafficSnapshot,
        anpr: AnprSnapshot,
    ) -> RouteRecommendation:
        base_minutes = max(12, int(18 + traffic.congestion * 24 + traffic.road_occupancy * 15))
        if anpr.unauthorized:
            diversion_required = True
            route_name = "Route B"
            rationale = "Unauthorized or delayed vehicle detected near route entry; diversion recommended."
            base_minutes += 12
        elif traffic.congestion >= 0.72:
            diversion_required = True
            route_name = "Route C"
            rationale = "Heavy congestion detected; use a lower-load route to reduce queue spillback."
            base_minutes += 8
        else:
            diversion_required = False
            route_name = "Route A"
            rationale = "Traffic remains within acceptable range for the registered procession."

        if procession.number_of_participants >= 800:
            diversion_required = True
            route_name = "Route B"
            rationale = "Large procession size requires a route with fewer merges and tighter control."
            base_minutes += 5

        return RouteRecommendation(
            route_name=route_name,
            expected_travel_minutes=base_minutes,
            diversion_required=diversion_required,
            rationale=rationale,
        )

    def report(self) -> AgentReport:
        return AgentReport(agent_name="traffic-agent", summary="Estimated route load and diversion needs from live traffic and ANPR observations.")


@dataclass
class ANPRAgent:
    def summarize(self, vehicle: VehicleRecord, anpr: AnprSnapshot) -> AgentReport:
        status = "authenticated" if anpr.authenticated else "unauthorized"
        return AgentReport(
            agent_name="anpr-agent",
            summary=f"Vehicle {vehicle.vehicle_number} is {status} with ETA {anpr.arrival_eta_minutes} minutes.",
        )


@dataclass
class ImmersionPlannerAgent:
    ghats: Sequence[GhatConfig]
    cranes: Sequence[CraneConfig]

    def _normalize_preferred_time(self, preferred_time: str) -> str:
        value = preferred_time.strip()
        label = value.lower()
        if label in {"morning", "am"}:
            return "09:00:00"
        if label in {"afternoon", "noon"}:
            return "14:00:00"
        if label in {"evening", "pm"}:
            return "18:00:00"
        if label in {"night", "late night"}:
            return "21:00:00"

        try:
            if "t" in label:
                parsed = datetime.fromisoformat(value)
                return parsed.strftime("%H:%M:%S")
            parsed_time = datetime.strptime(value, "%H:%M:%S")
            return parsed_time.strftime("%H:%M:%S")
        except ValueError:
            try:
                parsed_time = datetime.strptime(value, "%H:%M")
                return parsed_time.strftime("%H:%M:%S")
            except ValueError:
                return "18:00:00"

    def assign(
        self,
        procession: ProcessionRecord,
        route: RouteRecommendation,
        crowd: CrowdRiskAssessment,
        immersion_date: str,
        preferred_time: str,
        index: int,
    ) -> Tuple[ImmersionRecommendation, int, int]:
        normalized_time = self._normalize_preferred_time(preferred_time)
        base_datetime = datetime.fromisoformat(f"{immersion_date}T{normalized_time}")
        route_delay = timedelta(minutes=route.expected_travel_minutes)
        crowd_delay = timedelta(minutes=int(max(0.0, crowd.risk_score - 40) * 0.8))
        arrival_time = base_datetime + route_delay + crowd_delay

        ghat_candidates = []
        for offset, ghat in enumerate(self.ghats):
            estimated_wait = int(max(0, crowd.risk_score - 25) * ghat.congestion_penalty + index * 4 + offset * 3)
            capacity_bonus = ghat.base_capacity - int(procession.number_of_participants / 12)
            ghat_candidates.append((estimated_wait, -capacity_bonus, ghat))
        ghat_candidates.sort(key=lambda item: (item[0], item[1], item[2].name))
        selected_wait, _, selected_ghat = ghat_candidates[0]

        crane_candidates = []
        for crane in self.cranes:
            crane_wait = int(max(0, crowd.risk_score - 30) / crane.hourly_capacity) + index * 2
            crane_candidates.append((crane_wait, crane.crane_number, crane))
        crane_candidates.sort(key=lambda item: (item[0], item[1]))
        crane_wait, _, selected_crane = crane_candidates[0]

        slot_start = arrival_time + timedelta(minutes=max(selected_wait, crane_wait))
        simultaneous_capacity = max(1, min(3, selected_ghat.base_capacity // 60))

        return (
            ImmersionRecommendation(
                ghat=selected_ghat.name,
                crane_number=selected_crane.crane_number,
                slot_start=slot_start.strftime("%Y-%m-%d %H:%M"),
                waiting_minutes=max(selected_wait, crane_wait),
                simultaneous_capacity=simultaneous_capacity,
            ),
            selected_wait,
            crane_wait,
        )

    def report(self) -> AgentReport:
        return AgentReport(agent_name="immersion-planner-agent", summary="Assigned ghats, cranes, and immersion slots with queue balancing across processions.")


@dataclass
class ResourceAgent:
    def recommend(self, crowd: CrowdRiskAssessment, route: RouteRecommendation) -> AgentReport:
        if crowd.risk_level == "critical":
            summary = "Deploy maximum police cover, barricades, and medical standby; restrict fresh entries until density falls."
        elif crowd.risk_level == "high":
            summary = "Deploy additional police and temporary barricades; monitor entry gates closely."
        elif route.diversion_required:
            summary = "Use traffic diversions and add spotters at route junctions to protect procession flow."
        else:
            summary = "Current staffing appears adequate with routine monitoring."
        return AgentReport(agent_name="resource-agent", summary=summary)
