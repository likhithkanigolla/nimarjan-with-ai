from __future__ import annotations

import json
import os
from collections import Counter
from dataclasses import asdict, dataclass
from typing import Sequence
from urllib import error, request

from .models import AgentReport, ProcessionDecision


@dataclass
class HybridAIAdvisor:
    api_key: str | None = None
    model: str = "gpt-4o-mini"
    endpoint: str = "https://api.openai.com/v1/chat/completions"
    timeout_seconds: float = 12.0

    @classmethod
    def from_environment(cls) -> "HybridAIAdvisor":
        return cls(
            api_key=os.getenv("OPENAI_API_KEY"),
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        )

    def summarize(self, decisions: Sequence[ProcessionDecision], reports: Sequence[AgentReport]) -> AgentReport:
        prompt = self._build_prompt(decisions, reports)
        remote_summary = self._call_remote_model(prompt)
        summary = remote_summary if remote_summary else self._fallback_summary(decisions)
        return AgentReport(agent_name="ai-advisor", summary=summary)

    def _build_prompt(self, decisions: Sequence[ProcessionDecision], reports: Sequence[AgentReport]) -> str:
        payload = {
            "decision_count": len(decisions),
            "risk_levels": Counter(decision.crowd.risk_level for decision in decisions),
            "route_counts": Counter(decision.route.route_name for decision in decisions),
            "allow_entry_now": sum(1 for decision in decisions if decision.allow_entry_now),
            "sample_decisions": [asdict(decision) for decision in decisions[:3]],
            "agent_reports": [asdict(report) for report in reports[-5:]],
        }
        return (
            "You are an operations copilot for a crowd management system. "
            "Summarize the current state in 2-3 short sentences and include 3 practical next actions. "
            "Keep the tone direct, safety-focused, and concise. Input data:\n"
            f"{json.dumps(payload, indent=2, default=str)}"
        )

    def _call_remote_model(self, prompt: str) -> str | None:
        if not self.api_key:
            return None

        body = json.dumps(
            {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": "You write concise operational summaries for crowd safety teams."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.2,
            }
        ).encode("utf-8")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        req = request.Request(self.endpoint, data=body, headers=headers, method="POST")

        try:
            with request.urlopen(req, timeout=self.timeout_seconds) as response:
                data = json.loads(response.read().decode("utf-8"))
        except (error.URLError, TimeoutError, ValueError, KeyError):
            return None

        choices = data.get("choices", [])
        if not choices:
            return None

        message = choices[0].get("message", {})
        content = message.get("content")
        if isinstance(content, str) and content.strip():
            return content.strip()
        return None

    def _fallback_summary(self, decisions: Sequence[ProcessionDecision]) -> str:
        if not decisions:
            return "Hybrid review: no procession decisions were generated, so no intervention is needed yet."

        risk_counts = Counter(decision.crowd.risk_level for decision in decisions)
        route_counts = Counter(decision.route.route_name for decision in decisions)
        critical = risk_counts.get("critical", 0)
        high = risk_counts.get("high", 0)
        diversions = sum(1 for decision in decisions if decision.route.diversion_required)
        allowed = sum(1 for decision in decisions if decision.allow_entry_now)

        top_route = route_counts.most_common(1)[0][0]
        action = "hold entries and escalate crowd control" if critical else "keep monitoring and stage resources" if high else "maintain routine monitoring"

        return (
            f"Hybrid review: {len(decisions)} processions were evaluated, with {critical} critical and {high} high-risk cases. "
            f"Most guidance points to {top_route}, and {diversions} diversions were recommended while {allowed} entries remain open. "
            f"Primary action: {action}. Next steps are to review the riskiest routes, confirm ghat capacity, and brief field staff."
        )