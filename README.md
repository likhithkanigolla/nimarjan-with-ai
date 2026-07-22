
# Digital Twin — Ganesh Nimarjan Operations

Presentation-driven, frontend-only Digital Twin prototype for crowd &
event management during Ganesh Nimarjan (idol immersion) in Hyderabad.

Built for an ideathon demo: the moderator narrates while the presenter
clicks through deterministic scenarios that animate on a live map.

## Run

```bash
bun install     # or: npm install
bun run dev     # or: npm run dev
```

Open the preview URL. The app is a single page; presentation flow lives
in the left sidebar.

## Presentation flow

1. **Introduction** – narrated slide
2. **Scenario 1** – Proactive Crowd Risk + Emergency Response
3. **Scenario 2** – Procession & Traffic Orchestration
4. **Scenario 3** – Dynamic Immersion Pass & Resource Orchestration
5. **Future Work / Architecture** – closing slides

Each scenario is deterministic: **Reset · Prev · Play · Pause · Next**.
`Step N / M` and the current stage (Observe → Detect → Predict →
Simulate → Recommend → Approve → Adapt) are always visible.

## Layout

```
Header (title · sim time · Digital Twin sync · presenter mode · role)
Sidebar (Team | Introduction | Scenario 1/2/3 | Future | Closing)
Main workspace
   ├─ Scenario title + controls
   ├─ Stage timeline
   ├─ KPI grid
   ├─ Digital Twin Map (Leaflet, 70%)  │  Decision Panel (30%)
   └─ Presenter Cue                    │  Audit Log
```

## JSON-first data architecture

All mock data lives in `src/data/mock.ts`. UI never imports it
directly — it goes through `src/services/dataService.ts`:

```ts
dataService.getImmersionPoints();  // async
dataService.getProcessions();
dataService.getCranes();
// ...
```

To swap for a real backend later, replace each function body with a
`fetch()` or WebSocket call — the UI contracts do not change.

Registration records follow the requested Pandal / Idol / Procession /
Vehicle model, with masked mobile numbers (`98XXXXXX21`) and vehicle
numbers (`TS09 •••• 4821`).

## Scenario state engine

Each scenario is a deterministic list of steps in `src/lib/scenarios.ts`.
A step declares everything the map/panel need to render:

```ts
{
  id, title, stage, cue,
  mapCenter, mapZoom, layers,
  heatZones, flows, activeRoutes, moving, emergencyMarkers, focusIds,
  kpis, panel: { current, prediction, simulation, recommendation, impact },
  alerts, timeline, approvalId,
}
```

`src/lib/store.tsx` drives step navigation, autoplay, role, presenter
mode, approvals and the audit log. `DigitalTwinMap.tsx` renders the
current step; there are no ad-hoc `setTimeout` chains inside components.

Add a scenario: define another `Scenario` in `scenarios.ts` and add a
sidebar button + view key in `src/lib/store.tsx` / `SidebarNavigation.tsx`.

## Security by design (simulated)

- PII masked on the map/registration by default
- Role selector in header (Command Center / Traffic Police / Field
  Officer / Emergency Services / Viewer). Non-privileged roles cannot
  click **Approve** on human-in-the-loop actions
- Every recommendation is `Awaiting Approval` until a human approves
- Persistent audit log records step transitions, alerts and approvals
- Visible **"Demo Environment — Simulated Data"** badge
- No secrets, no auth, no network calls

## Replacing slide placeholders

Drop images at:

```
public/slides/team-placeholder.jpg
public/slides/introduction-placeholder.jpg
public/slides/future-work-placeholder.jpg
public/slides/architecture-placeholder.jpg
```

Anything else missing shows a tasteful `Replace with presentation image`
placeholder — the `<img>` is `object-fit: contain`, never cropped.

## Where future services plug in

| Concern | Today | Future |
|---|---|---|
| Data reads | `dataService.*` returns mock JSON | REST / GraphQL |
| Live positions | Deterministic `moving[]` paths | WebSocket GPS/IoT feed |
| Predictions | Baked into each step | AI prediction agent |
| Recommendations | Baked into each step | Optimization / RL agent |
| Approvals | Local reducer | Signed workflow API |
| Audit | In-memory | Append-only server log |

## Notes

- No paid map services — OpenStreetMap tiles via Leaflet.
- Runs on TanStack Start; the map is client-only via `ClientOnly` +
  `React.lazy` (Leaflet touches `window`).
- Target: 1920×1080 presentation screen; also fits 1366×768.
=======
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

- `GEMINI_API_KEY`
- `GEMINI_MODEL` optional, defaults to `gemini-3.5-flash-lite`

If those variables are not set, the app falls back to a local summary so the system keeps working offline.
