from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional


@dataclass(frozen=True)
class PandalRecord:
    pandal_id: str
    organizer_name: str
    mobile_number: str
    address: str
    organization: str


@dataclass(frozen=True)
class IdolRecord:
    pandal_id: str
    height: float
    estimated_weight: float
    width: float
    idol_type: str


@dataclass(frozen=True)
class ProcessionRecord:
    pandal_id: str
    expected_immersion_date: str
    preferred_time: str
    number_of_participants: int
    starting_location: str


@dataclass(frozen=True)
class VehicleRecord:
    pandal_id: str
    vehicle_number: str
    vehicle_type: str
    length: float
    width: float
    number_of_wheels: int


@dataclass(frozen=True)
class TrafficSnapshot:
    junction_id: str
    road_occupancy: float
    congestion: float
    travel_speed: float


@dataclass(frozen=True)
class CrowdSnapshot:
    zone_id: str
    crowd_density: float
    movement_score: float
    queue_length: int
    bottleneck_score: float


@dataclass(frozen=True)
class AnprSnapshot:
    vehicle_number: str
    authenticated: bool
    arrival_eta_minutes: int
    unauthorized: bool


@dataclass(frozen=True)
class WeatherSnapshot:
    rainfall: float
    temperature: float
    visibility: float


@dataclass(frozen=True)
class RouteRecommendation:
    route_name: str
    expected_travel_minutes: int
    diversion_required: bool
    rationale: str


@dataclass(frozen=True)
class ImmersionRecommendation:
    ghat: str
    crane_number: int
    slot_start: str
    waiting_minutes: int
    simultaneous_capacity: int


@dataclass(frozen=True)
class CrowdRiskAssessment:
    current_density: float
    predicted_density: float
    risk_score: float
    risk_level: str
    actions: List[str] = field(default_factory=list)


@dataclass(frozen=True)
class ProcessionDecision:
    pandal_id: str
    vehicle_number: str
    route: RouteRecommendation
    immersion: ImmersionRecommendation
    crowd: CrowdRiskAssessment
    allow_entry_now: bool


@dataclass(frozen=True)
class AgentReport:
    agent_name: str
    summary: str


@dataclass(frozen=True)
class OrchestrationResult:
    generated_at: datetime
    decisions: List[ProcessionDecision]
    agent_reports: List[AgentReport]
    remaining_crane_capacity: List[str]
