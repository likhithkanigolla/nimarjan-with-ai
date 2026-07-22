from __future__ import annotations

import csv
from pathlib import Path


DATASETS = {
    "pandal_data.csv": [
        ["id", "organizer_name", "mobile_number", "address", "organization"],
        ["P01", "Shree Ganesh Mandal", "9876543210", "Pune Camp", "Shree Ganesh Utsav Trust"],
        ["P02", "Mangal Murti Mandal", "9876501234", "Shivajinagar", "Mangal Utsav Samiti"],
        ["P03", "Sai Ganesh Utsav", "9988776655", "Kothrud", "Sai Seva Foundation"],
    ],
    "idol_data.csv": [
        ["pandal_id", "height", "estimated_weight", "width", "type"],
        ["P01", "12", "950", "7", "Eco-friendly"],
        ["P02", "16", "1400", "8", "POP/Synthetic"],
        ["P03", "10", "800", "6", "Clay"],
    ],
    "procession_data.csv": [
        ["pandal_id", "expected_immersion_date", "preferred_time", "number_of_participants", "starting_location"],
        ["P01", "2026-09-01", "09:30", "420", "Camp"],
        ["P02", "2026-09-01", "11:00", "860", "Shivajinagar"],
        ["P03", "2026-09-01", "13:15", "350", "Kothrud"],
    ],
    "vehicle_data.csv": [
        ["pandal_id", "vehicle_number", "vehicle_type", "length", "width", "number_of_wheels"],
        ["P01", "MH12AB1234", "Truck", "8.0", "2.5", "6"],
        ["P02", "MH12CD5678", "Trailer", "12.0", "2.8", "10"],
        ["P03", "MH14EF9012", "Pickup", "5.0", "2.0", "4"],
    ],
}


def main() -> None:
    base_dir = Path(__file__).resolve().parent.parent / "data"
    base_dir.mkdir(parents=True, exist_ok=True)

    for file_name, rows in DATASETS.items():
        path = base_dir / file_name
        with path.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.writer(handle)
            writer.writerows(rows)


if __name__ == "__main__":
    main()
