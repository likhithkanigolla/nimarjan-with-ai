from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI

from .orchestrator import DigitalTwinOrchestrator

app = FastAPI(title="Agentic AI Crowd Management", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/simulate")
def simulate(step: int = 0) -> dict:
    base_dir = Path(__file__).resolve().parent.parent
    orchestrator = DigitalTwinOrchestrator(data_dir=base_dir / "data")
    result = orchestrator.run(step=step)
    return {
        "generated_at": result.generated_at.isoformat(),
        "decisions": [
            {
                "pandal_id": decision.pandal_id,
                "vehicle_number": decision.vehicle_number,
                "route": decision.route.route_name,
                "ghat": decision.immersion.ghat,
                "crane_number": decision.immersion.crane_number,
                "slot_start": decision.immersion.slot_start,
                "crowd_risk": decision.crowd.risk_level,
                "risk_score": decision.crowd.risk_score,
                "allow_entry_now": decision.allow_entry_now,
                "actions": decision.crowd.actions,
            }
            for decision in result.decisions
        ],
        "agent_reports": [report.__dict__ for report in result.agent_reports],
        "remaining_crane_capacity": result.remaining_crane_capacity,
    }
