from __future__ import annotations

import csv
from pathlib import Path
from typing import Dict, Iterable, List, TypeVar

from .models import IdolRecord, PandalRecord, ProcessionRecord, VehicleRecord

T = TypeVar("T")


class DataIngestionError(RuntimeError):
    pass


def _read_rows(path: Path) -> List[Dict[str, str]]:
    if not path.exists():
        raise DataIngestionError(f"Missing input file: {path}")

    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def load_pandal_records(path: Path) -> List[PandalRecord]:
    return [
        PandalRecord(
            pandal_id=row["id"],
            organizer_name=row["organizer_name"],
            mobile_number=row["mobile_number"],
            address=row["address"],
            organization=row["organization"],
        )
        for row in _read_rows(path)
    ]


def load_idol_records(path: Path) -> List[IdolRecord]:
    return [
        IdolRecord(
            pandal_id=row["pandal_id"],
            height=float(row.get("height", row.get("idol_height", 0.0))),
            estimated_weight=float(row["estimated_weight"]),
            width=float(row.get("width", row.get("idol_width", 0.0))),
            idol_type=row.get("type", row.get("idol_type", "")),
        )
        for row in _read_rows(path)
    ]


def load_procession_records(path: Path) -> List[ProcessionRecord]:
    return [
        ProcessionRecord(
            pandal_id=row["pandal_id"],
            expected_immersion_date=row["expected_immersion_date"],
            preferred_time=row["preferred_time"],
            number_of_participants=int(row["number_of_participants"]),
            starting_location=row["starting_location"],
        )
        for row in _read_rows(path)
    ]


def load_vehicle_records(path: Path) -> List[VehicleRecord]:
    return [
        VehicleRecord(
            pandal_id=row["pandal_id"],
            vehicle_number=row["vehicle_number"],
            vehicle_type=row["vehicle_type"],
            length=float(row["length"]),
            width=float(row["width"]),
            number_of_wheels=int(row["number_of_wheels"]),
        )
        for row in _read_rows(path)
    ]
