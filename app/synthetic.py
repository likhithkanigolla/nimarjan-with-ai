from __future__ import annotations

import random
from dataclasses import dataclass
from datetime import datetime, timedelta

from .models import AnprSnapshot, CrowdSnapshot, TrafficSnapshot, WeatherSnapshot


@dataclass
class SyntheticFeedGenerator:
    seed: int = 42

    def __post_init__(self) -> None:
        self._random = random.Random(self.seed)

    def crowd(self, zone_id: str, step: int) -> CrowdSnapshot:
        base_density = 45 + (step * 4) + self._random.randint(-5, 12)
        bottleneck = max(0.0, min(1.0, base_density / 120.0 + self._random.uniform(-0.1, 0.15)))
        return CrowdSnapshot(
            zone_id=zone_id,
            crowd_density=round(max(0.0, base_density), 2),
            movement_score=round(max(0.2, 1.6 - bottleneck), 2),
            queue_length=max(0, int(base_density / 10) + self._random.randint(0, 4)),
            bottleneck_score=round(bottleneck, 2),
        )

    def traffic(self, junction_id: str, step: int) -> TrafficSnapshot:
        occupancy = max(0.15, min(0.98, 0.45 + step * 0.04 + self._random.uniform(-0.05, 0.18)))
        congestion = max(0.05, min(1.0, occupancy * 0.95 + self._random.uniform(0.0, 0.12)))
        speed = max(8.0, 42.0 - congestion * 22.0 + self._random.uniform(-2.0, 3.0))
        return TrafficSnapshot(
            junction_id=junction_id,
            road_occupancy=round(occupancy, 2),
            congestion=round(congestion, 2),
            travel_speed=round(speed, 1),
        )

    def anpr(self, vehicle_number: str, step: int) -> AnprSnapshot:
        authenticated = self._random.random() > 0.1
        arrival_eta = max(1, int(8 + step * 3 + self._random.randint(-2, 4)))
        return AnprSnapshot(
            vehicle_number=vehicle_number,
            authenticated=authenticated,
            arrival_eta_minutes=arrival_eta,
            unauthorized=not authenticated,
        )

    def weather(self, step: int) -> WeatherSnapshot:
        rainfall = max(0.0, self._random.uniform(0.0, 12.0) + step * 0.5)
        temperature = max(22.0, 33.0 - step * 0.2 + self._random.uniform(-1.5, 1.5))
        visibility = max(0.4, 1.0 - rainfall / 30.0 + self._random.uniform(-0.08, 0.05))
        return WeatherSnapshot(
            rainfall=round(rainfall, 1),
            temperature=round(temperature, 1),
            visibility=round(min(1.0, visibility), 2),
        )

    def timestamp_for_step(self, step: int) -> datetime:
        return datetime.utcnow() + timedelta(minutes=step * 5)
