# GHOST MEDIC

Offline-first AI clinical decision support for combat medics — proof-of-concept.

> **Decision support / training aid only. Not autonomous diagnosis. The medic makes the call.**

## Status

**Session 1 — Skeleton.** Loads JSON scenario files, displays a casualty card
with vitals (HR, BP, RR, SpO2), and accepts free-text medic input. **No AI
yet** — Session 2 wires in on-device `llama.cpp` inference.

## Stack

- React Native (Expo) + expo-router
- Zustand (state)
- NativeWind / Tailwind (styling, dark military palette)
- Hardcoded JSON scenarios in `src/scenarios/`

## Run it

```bash
npm install
npx expo start
```

Then scan the QR with Expo Go (iOS/Android), or press `i` / `a` for a
simulator.

## Layout

```
app/
  _layout.tsx          # expo-router root, dark theme, NativeWind import
  index.tsx            # main screen
src/
  components/          # CasualtyCard, VitalsRow, InputBox, MedicLog, ScenarioPicker
  store/scenarioStore.ts
  scenarios/*.json     # scripted casualties (GSW chest, TQ leg, tension pneumo)
  types/scenario.ts
  lib/vitals.ts        # vital-sign severity thresholds + color mapping
```

## Roadmap

| Session | Deliverable |
|---|---|
| 1 | Skeleton + scenario display **(this)** |
| 2 | `llama.cpp` on-device inference (Phi-3-mini / Llama 3.2 3B) |
| 3 | TCCC RAG (ChromaDB / sqlite-vec) with cited protocols |
| 4 | MARCH decision tree + weight-based drug calculator |
| 5 | Demo polish, degrading-vitals playback, scripted scenarios |
