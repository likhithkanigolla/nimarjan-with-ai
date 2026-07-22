# Agentic AI Crowd Management

A lightweight agentic AI prototype for Ganesh Chaturthi crowd safety and procession management.

This version starts with an application layer instead of a dashboard. It combines:

- CSV-backed pandal registration data
- Synthetic live data generators for crowd, traffic, ANPR, and weather
- Independent agents for each operational concern
- A hybrid AI advisor that turns the structured agent output into a short operational briefing
- A coordinator that turns predictions into actionable recommendations

## What it does

- Predicts near-future crowd risk around immersion locations
- Estimates traffic pressure and route suitability
- Assigns ghat, crane, and immersion slot recommendations
- Flags unsafe crowd growth and suggests proactive interventions

## Project layout

- `app/`: core application code
- `data/`: example CSV inputs
- `scripts/`: helper scripts for synthetic data generation
- `tests/`: focused unit tests

## Run

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the demo simulation:

```bash
python -m app.demo
```

Run the API:

```bash
uvicorn app.api:app --reload
```

## Inputs

The static registration layer expects these CSV files:

- `data/pandal_data.csv`
- `data/idol_data.csv`
- `data/procession_data.csv`
- `data/vehicle_data.csv`

Live observations are synthetic for now and are produced by the generator modules.

## Hybrid AI layer

The deterministic agents still make the safety decisions, but the final report now includes an AI advisory summary.

To enable a remote LLM for that summary, set:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` optional, defaults to `gpt-4o-mini`

If those variables are not set, the app falls back to a local summary so the system keeps working offline.
