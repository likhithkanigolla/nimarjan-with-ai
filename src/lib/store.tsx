// Global app state — role, view, scenario controller, audit log, alerts.
import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import { scenarios, type Scenario } from "@/lib/scenarios";
import type { Role } from "@/lib/types";

export type ViewKey =
  | "team" | "introduction"
  | "scenario1" | "scenario2" | "scenario3"
  | "future" | "closing";

export interface AuditEntry { id: string; time: string; text: string; }

interface State {
  view: ViewKey;
  role: Role;
  presenterMode: boolean;
  scenarioId: Scenario["id"] | null;
  stepIndex: number;
  approvals: Record<string, boolean>;
  autoPlay: boolean;
  audit: AuditEntry[];
  simTime: string; // HH:MM
  initializing: boolean;
}

type Action =
  | { type: "SET_VIEW"; view: ViewKey }
  | { type: "SET_ROLE"; role: Role }
  | { type: "TOGGLE_PRESENTER" }
  | { type: "START_SCENARIO"; id: Scenario["id"] }
  | { type: "SET_STEP"; index: number }
  | { type: "NEXT" } | { type: "PREV" } | { type: "RESET" }
  | { type: "APPROVE"; approvalId: string }
  | { type: "SET_AUTOPLAY"; value: boolean }
  | { type: "AUDIT"; text: string }
  | { type: "SET_INITIALIZING"; value: boolean };

const initial: State = {
  view: "introduction",
  role: "Command Center",
  presenterMode: true,
  scenarioId: null,
  stepIndex: 0,
  approvals: {},
  autoPlay: false,
  audit: [{ id: crypto.randomUUID(), time: "20:30", text: "Digital Twin initialized · demo data loaded" }],
  simTime: "20:30",
  initializing: false,
};

function reduce(state: State, action: Action): State {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, view: action.view };
    case "SET_ROLE":
      return { ...state, role: action.role };
    case "TOGGLE_PRESENTER":
      return { ...state, presenterMode: !state.presenterMode };
    case "START_SCENARIO":
      return { ...state, scenarioId: action.id, stepIndex: 0, approvals: {}, view: action.id };
    case "SET_STEP":
      return { ...state, stepIndex: Math.max(0, action.index) };
    case "NEXT": {
      if (!state.scenarioId) return state;
      const scen = scenarios[state.scenarioId];
      return { ...state, stepIndex: Math.min(state.stepIndex + 1, scen.steps.length - 1) };
    }
    case "PREV":
      return { ...state, stepIndex: Math.max(0, state.stepIndex - 1) };
    case "RESET":
      return { ...state, stepIndex: 0, approvals: {}, autoPlay: false };
    case "APPROVE":
      return { ...state, approvals: { ...state.approvals, [action.approvalId]: true } };
    case "SET_AUTOPLAY":
      return { ...state, autoPlay: action.value };
    case "AUDIT": {
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
      return { ...state, audit: [{ id: crypto.randomUUID(), time, text: action.text }, ...state.audit].slice(0, 50) };
    }
    case "SET_INITIALIZING":
      return { ...state, initializing: action.value };
    default: return state;
  }
}

interface Ctx extends State {
  dispatch: React.Dispatch<Action>;
  currentScenario: Scenario | null;
  currentStep: ReturnType<() => Scenario["steps"][number]> | null;
  goToView: (v: ViewKey) => void;
  approve: (id: string) => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduce, initial);

  const currentScenario = state.scenarioId ? scenarios[state.scenarioId] : null;
  const currentStep = currentScenario?.steps[state.stepIndex] ?? null;

  // Autoplay
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (state.autoPlay && currentScenario) {
      const isLast = state.stepIndex >= currentScenario.steps.length - 1;
      if (isLast) { dispatch({ type: "SET_AUTOPLAY", value: false }); return; }
      timer.current = setTimeout(() => dispatch({ type: "NEXT" }), 4200);
    }
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [state.autoPlay, state.stepIndex, currentScenario]);

  // Emit alerts + audit on step change
  const lastAudit = useRef<string>("");
  useEffect(() => {
    if (!currentStep || !currentScenario) return;
    const stamp = `${currentScenario.id}#${currentStep.id}`;
    if (lastAudit.current === stamp) return;
    lastAudit.current = stamp;
    currentStep.alerts?.forEach((a) => {
      const fn = a.severity === "CRITICAL" ? toast.error
        : a.severity === "WARNING" ? toast.warning
        : a.severity === "ADVISORY" ? toast.message
        : toast.info;
      fn(a.text, { description: `${currentScenario.name} · Step ${currentStep.id}` });
      dispatch({ type: "AUDIT", text: `[${a.severity}] ${a.text}` });
    });
    currentStep.timeline?.forEach((t) => dispatch({ type: "AUDIT", text: `${t.time} — ${t.text}` }));
  }, [currentStep, currentScenario]);

  // Initializing pulse when entering a scenario
  useEffect(() => {
    if (!state.scenarioId) return;
    dispatch({ type: "SET_INITIALIZING", value: true });
    const id = setTimeout(() => dispatch({ type: "SET_INITIALIZING", value: false }), 1800);
    return () => clearTimeout(id);
  }, [state.scenarioId]);

  const value = useMemo<Ctx>(() => ({
    ...state,
    dispatch,
    currentScenario,
    currentStep,
    goToView: (v) => {
      if (v === "scenario1" || v === "scenario2" || v === "scenario3") {
        dispatch({ type: "START_SCENARIO", id: v });
        dispatch({ type: "AUDIT", text: `Presenter opened ${scenarios[v].name}` });
      } else {
        dispatch({ type: "SET_VIEW", view: v });
      }
    },
    approve: (id) => {
      dispatch({ type: "APPROVE", approvalId: id });
      dispatch({ type: "AUDIT", text: `Approval registered for ${id} by ${state.role}` });
      toast.success(`${id} approved by ${state.role}`);
      setTimeout(() => dispatch({ type: "NEXT" }), 400);
    },
  }), [state, currentScenario, currentStep]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function useCanApprove() {
  const { role } = useApp();
  return role === "Command Center" || role === "Traffic Police" || role === "Emergency Services";
}
