import { create } from 'zustand';
import type { Scenario } from '@/types/scenario';
import gswChest from '@/scenarios/gsw-chest.json';
import tourniquetLeg from '@/scenarios/tourniquet-leg.json';
import tensionPneumo from '@/scenarios/tension-pneumo.json';
const SCENARIOS: Scenario[] = [
  gswChest as Scenario,
  tourniquetLeg as Scenario,
  tensionPneumo as Scenario,
];
export type LogEntry = {
  id: string;
  timestamp: number;
  text: string;
};
type ScenarioState = {
  scenarios: Scenario[];
  activeId: string;
  log: LogEntry[];
  aiResponse: string;
  isThinking: boolean;
  streamingResponse: string;
  loadScenario: (id: string) => void;
  appendLog: (text: string) => void;
  clearLog: () => void;
  setThinking: (val: boolean) => void;
  appendStreamToken: (token: string) => void;
  setAiResponse: (text: string) => void;
};
export const useScenarioStore = create<ScenarioState>((set, get) => ({
  scenarios: SCENARIOS,
  activeId: SCENARIOS[0].id,
  log: [],
  aiResponse: '',
  isThinking: false,
  streamingResponse: '',
  loadScenario: (id) => {
    const found = get().scenarios.find((s) => s.id === id);
    if (!found) return;
    set({ activeId: id, log: [] });
  },
  appendLog: (text) => {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      text,
    };
    set((s) => ({ log: [...s.log, entry] }));
  },
  clearLog: () => set({ log: [] }),
  setThinking: (val) =>
    set(val ? { isThinking: true, streamingResponse: '', aiResponse: '' } : { isThinking: false }),
  appendStreamToken: (token) =>
    set((s) => ({ streamingResponse: s.streamingResponse + token })),
  setAiResponse: (text) => set({ aiResponse: text }),
}));
export const selectActiveScenario = (s: ScenarioState): Scenario =>
  s.scenarios.find((x) => x.id === s.activeId) ?? s.scenarios[0];
