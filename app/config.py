from __future__ import annotations

from dataclasses import dataclass
from typing import List


@dataclass(frozen=True)
class GhatConfig:
    name: str
    base_capacity: int
    congestion_penalty: float


@dataclass(frozen=True)
class CraneConfig:
    crane_number: int
    hourly_capacity: int


DEFAULT_GHATS: List[GhatConfig] = [
    GhatConfig(name="Ghat 1", base_capacity=140, congestion_penalty=0.9),
    GhatConfig(name="Ghat 2", base_capacity=120, congestion_penalty=1.0),
    GhatConfig(name="Ghat 3", base_capacity=160, congestion_penalty=0.8),
    GhatConfig(name="Ghat 4", base_capacity=110, congestion_penalty=1.1),
    GhatConfig(name="Ghat 5", base_capacity=150, congestion_penalty=0.85),
    GhatConfig(name="Ghat 6", base_capacity=130, congestion_penalty=0.95),
]

DEFAULT_CRANES: List[CraneConfig] = [
    CraneConfig(crane_number=1, hourly_capacity=4),
    CraneConfig(crane_number=2, hourly_capacity=4),
    CraneConfig(crane_number=3, hourly_capacity=5),
    CraneConfig(crane_number=4, hourly_capacity=3),
]
