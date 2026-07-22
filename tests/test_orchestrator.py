from __future__ import annotations

from pathlib import Path

from app.orchestrator import DigitalTwinOrchestrator


def test_orchestrator_produces_decisions() -> None:
    base_dir = Path(__file__).resolve().parent.parent
    orchestrator = DigitalTwinOrchestrator(data_dir=base_dir / "data", seed=7)
    result = orchestrator.run(step=1)

    assert len(result.decisions) == 3
    assert any(decision.crowd.risk_level in {"high", "critical"} for decision in result.decisions)
    assert all(decision.route.route_name.startswith("Route") for decision in result.decisions)
    assert all(decision.immersion.crane_number in {1, 2, 3, 4} for decision in result.decisions)
    assert result.agent_reports
    assert result.agent_reports[-1].agent_name == "ai-advisor"
