from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import List

from .agents import ANPRAgent, CrowdAgent, ImmersionPlannerAgent, PandalAgent, ResourceAgent, TrafficAgent
from .ai import HybridAIAdvisor
from .config import DEFAULT_CRANES, DEFAULT_GHATS
from .ingestion import load_idol_records, load_pandal_records, load_procession_records, load_vehicle_records
from .models import AgentReport, OrchestrationResult, ProcessionDecision
from .synthetic import SyntheticFeedGenerator


@dataclass
class DigitalTwinOrchestrator:
    data_dir: Path
    seed: int = 42

    def run(self, step: int = 0) -> OrchestrationResult:
        pandals = load_pandal_records(self.data_dir / "pandal_data.csv")
        idols = load_idol_records(self.data_dir / "idol_data.csv")
        processions = load_procession_records(self.data_dir / "procession_data.csv")
        vehicles = load_vehicle_records(self.data_dir / "vehicle_data.csv")

        pandal_agent = PandalAgent(pandals, idols, processions, vehicles)
        traffic_agent = TrafficAgent()
        crowd_agent = CrowdAgent()
        anpr_agent = ANPRAgent()
        immersion_agent = ImmersionPlannerAgent(DEFAULT_GHATS, DEFAULT_CRANES)
        resource_agent = ResourceAgent()

        generator = SyntheticFeedGenerator(seed=self.seed + step)
        pandal_index = pandal_agent.build_index()
        decisions: List[ProcessionDecision] = []
        reports: List[AgentReport] = [pandal_agent.report()]

        for index, pandal in enumerate(pandals):
            details = pandal_index.get(pandal.pandal_id)
            procession = details["procession"]
            idol = details["idol"]
            vehicle = details["vehicle"]
            if procession is None or idol is None or vehicle is None:
                continue

            crowd_snapshot = generator.crowd(zone_id=procession.starting_location, step=step + index)
            traffic_snapshot = generator.traffic(junction_id=f"J-{index + 1}", step=step + index)
            weather_snapshot = generator.weather(step=step)
            anpr_snapshot = generator.anpr(vehicle.vehicle_number, step=step + index)

            route = traffic_agent.recommend_route(procession, traffic_snapshot, anpr_snapshot)
            crowd = crowd_agent.assess(crowd_snapshot, traffic_snapshot, weather_snapshot, procession, idol)
            immersion, _, _ = immersion_agent.assign(
                procession=procession,
                route=route,
                crowd=crowd,
                immersion_date=procession.expected_immersion_date,
                preferred_time=procession.preferred_time,
                index=index,
            )

            allow_entry_now = crowd.risk_level in {"low", "moderate"} and not route.diversion_required
            if crowd.risk_level == "critical":
                allow_entry_now = False

            decisions.append(
                ProcessionDecision(
                    pandal_id=pandal.pandal_id,
                    vehicle_number=vehicle.vehicle_number,
                    route=route,
                    immersion=immersion,
                    crowd=crowd,
                    allow_entry_now=allow_entry_now,
                )
            )

            reports.append(anpr_agent.summarize(vehicle, anpr_snapshot))
            reports.append(resource_agent.recommend(crowd, route))

        reports.append(traffic_agent.report())
        reports.append(crowd_agent.report())
        reports.append(immersion_agent.report())
        reports.append(anpr_agent.summarize(vehicles[0], generator.anpr(vehicles[0].vehicle_number, step)))

        advisor = HybridAIAdvisor.from_environment()
        reports.append(advisor.summarize(decisions, reports))

        remaining = [f"{crane.crane_number}:{crane.hourly_capacity}" for crane in DEFAULT_CRANES]
        return OrchestrationResult(
            generated_at=datetime.now(timezone.utc),
            decisions=decisions,
            agent_reports=reports,
            remaining_crane_capacity=remaining,
        )
