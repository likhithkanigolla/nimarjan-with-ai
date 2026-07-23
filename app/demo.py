from __future__ import annotations

import json
from pathlib import Path

from .orchestrator import DigitalTwinOrchestrator


def main() -> None:
    base_dir = Path(__file__).resolve().parent.parent
    orchestrator = DigitalTwinOrchestrator(data_dir=base_dir / "data")
    result = orchestrator.run(step=0)

    payload = {
        "generated_at": result.generated_at.isoformat(),
        "decisions": [
            {
                "pandal_id": decision.pandal_id,
                "vehicle_number": decision.vehicle_number,
                "route": decision.route.route_name,
                "route_minutes": decision.route.expected_travel_minutes,
                "ghat": decision.immersion.ghat,
                "crane": decision.immersion.crane_number,
                "slot_start": decision.immersion.slot_start,
                "waiting_minutes": decision.immersion.waiting_minutes,
                "crowd_risk": decision.crowd.risk_level,
                "risk_score": decision.crowd.risk_score,
                "allow_entry_now": decision.allow_entry_now,
                "actions": decision.crowd.actions,
            }
            for decision in result.decisions
        ],
        "agent_reports": [report.__dict__ for report in result.agent_reports],
    }
    print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
