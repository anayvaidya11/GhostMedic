#!/usr/bin/env bash
set -euo pipefail

mkdir -p app src/components src/lib src/scenarios src/store src/types

cat <<'EOF' > .gitignore
node_modules/
.expo/
.expo-shared/
dist/
web-build/
ios/
android/
*.log
.DS_Store
.env
.env.*
*.tsbuildinfo
expo-env.d.ts
EOF

cat <<'EOF' > README.md
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
EOF

cat <<'EOF' > package.json
{
  "name": "ghost-medic",
  "version": "0.1.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.28",
    "expo-router": "~3.5.23",
    "expo-status-bar": "~1.12.1",
    "expo-constants": "~16.0.2",
    "expo-linking": "~6.3.1",
    "react": "18.2.0",
    "react-native": "0.74.5",
    "react-native-safe-area-context": "4.10.5",
    "react-native-screens": "3.31.1",
    "react-native-reanimated": "~3.10.1",
    "react-native-gesture-handler": "~2.16.1",
    "nativewind": "^4.0.36",
    "tailwindcss": "^3.4.0",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "typescript": "~5.3.3"
  },
  "private": true
}
EOF

cat <<'EOF' > app.json
{
  "expo": {
    "name": "GHOST MEDIC",
    "slug": "ghost-medic",
    "version": "0.1.0",
    "orientation": "landscape",
    "userInterfaceStyle": "dark",
    "scheme": "ghostmedic",
    "splash": {
      "backgroundColor": "#0a0f0a",
      "resizeMode": "contain"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.ghostmedic.app"
    },
    "android": {
      "package": "com.ghostmedic.app"
    },
    "web": {
      "bundler": "metro"
    },
    "plugins": [
      "expo-router"
    ],
    "experiments": {
      "typedRoutes": false
    }
  }
}
EOF

cat <<'EOF' > babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: ['react-native-reanimated/plugin'],
  };
};
EOF

cat <<'EOF' > metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
EOF

cat <<'EOF' > tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Dark military palette
        ops: {
          black: '#0a0f0a',
          char: '#11160f',
          panel: '#161c14',
          line: '#2a3326',
          olive: '#3d4a30',
          drab: '#5b6b48',
          sage: '#8a9a73',
          dim: '#6b7560',
        },
        signal: {
          green: '#7cff6b',
          amber: '#ffb547',
          red: '#ff4d4d',
          cyan: '#5be7ff',
        },
      },
      fontFamily: {
        mono: ['Courier', 'monospace'],
      },
    },
  },
  plugins: [],
};
EOF

cat <<'EOF' > global.css
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

cat <<'EOF' > tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "jsx": "react-jsx"
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "nativewind-env.d.ts",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
EOF

cat <<'EOF' > nativewind-env.d.ts
/// <reference types="nativewind/types" />
EOF

cat <<'EOF' > app/_layout.tsx
import '../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-ops-black">
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0a0f0a' },
            animation: 'fade',
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}
EOF

cat <<'EOF' > app/index.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CasualtyCard } from '@/components/CasualtyCard';
import { InputBox } from '@/components/InputBox';
import { ScenarioPicker } from '@/components/ScenarioPicker';
import { MedicLog } from '@/components/MedicLog';
import { selectActiveScenario, useScenarioStore } from '@/store/scenarioStore';

export default function Home() {
  const scenario = useScenarioStore(selectActiveScenario);
  const appendLog = useScenarioStore((s) => s.appendLog);

  return (
    <SafeAreaView className="flex-1 bg-ops-black" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top bar */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-ops-line bg-ops-char">
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-signal-green mr-3" />
            <Text className="text-signal-green text-base tracking-[6px] font-bold">
              GHOST MEDIC
            </Text>
            <Text className="text-ops-dim text-[10px] tracking-[3px] ml-3 uppercase">
              v0.1 // offline // training aid
            </Text>
          </View>
          <Text className="text-ops-dim text-[10px] tracking-[3px] uppercase">
            session 1 // skeleton
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <ScenarioPicker />

          {/* Briefing strip */}
          <View className="mt-4 border border-ops-line bg-ops-panel rounded-sm">
            <View className="px-3 py-2 border-b border-ops-line bg-ops-char flex-row justify-between">
              <Text className="text-ops-sage text-xs tracking-[3px] uppercase">
                {scenario.title}
              </Text>
              <Text className="text-ops-dim text-[10px] tracking-[3px] uppercase">
                {scenario.environment}
              </Text>
            </View>
            <View className="px-4 py-3">
              <Text className="text-ops-sage text-sm">{scenario.briefing}</Text>
            </View>
          </View>

          {/* Casualty card */}
          <View className="mt-4">
            <CasualtyCard casualty={scenario.casualty} />
          </View>

          {/* Two-column on wide screens, stacked on phones */}
          <View className="mt-4 flex-col md:flex-row">
            <View className="flex-1 md:mr-2 mb-4 md:mb-0" style={{ minHeight: 220 }}>
              <MedicLog />
            </View>
            <View className="flex-1 md:ml-2">
              <InputBox onSubmit={appendLog} />
              <View className="mt-3 px-3 py-2 border border-dashed border-ops-line bg-ops-char rounded-sm">
                <Text className="text-ops-dim text-[10px] tracking-[2px] uppercase">
                  Note
                </Text>
                <Text className="text-ops-dim text-xs mt-0.5">
                  Session 1 skeleton — no AI yet. Input is logged locally only.
                  LLM inference is wired in Session 2.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
EOF

cat <<'EOF' > src/types/scenario.ts
export type Vitals = {
  hr: number;       // beats per minute
  bpSys: number;    // systolic mmHg
  bpDia: number;    // diastolic mmHg
  rr: number;       // respirations per minute
  spo2: number;     // % oxygen saturation
};

export type Injury = {
  region: string;     // e.g. "right chest", "left thigh"
  type: string;       // e.g. "GSW", "blast frag", "burn"
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  notes?: string;
};

export type Casualty = {
  callsign: string;
  age: number;
  sex: 'M' | 'F';
  weightKg: number;
  mechanism: string;       // mechanism of injury
  timeOfInjury: string;    // ISO-ish, free text for demo
  consciousness: 'A' | 'V' | 'P' | 'U'; // AVPU
  injuries: Injury[];
  vitals: Vitals;
};

export type Scenario = {
  id: string;
  title: string;
  briefing: string;
  environment: string;     // e.g. "urban, night, hostile"
  casualty: Casualty;
};
EOF

cat <<'EOF' > src/lib/vitals.ts
import type { Vitals } from '@/types/scenario';

export type Severity = 'normal' | 'caution' | 'critical';

export const hrSeverity = (hr: number): Severity => {
  if (hr < 50 || hr > 130) return 'critical';
  if (hr < 60 || hr > 100) return 'caution';
  return 'normal';
};

export const bpSeverity = (sys: number): Severity => {
  if (sys < 80 || sys > 180) return 'critical';
  if (sys < 90 || sys > 140) return 'caution';
  return 'normal';
};

export const rrSeverity = (rr: number): Severity => {
  if (rr < 8 || rr > 30) return 'critical';
  if (rr < 12 || rr > 20) return 'caution';
  return 'normal';
};

export const spo2Severity = (spo2: number): Severity => {
  if (spo2 < 90) return 'critical';
  if (spo2 < 95) return 'caution';
  return 'normal';
};

export const severityToTextClass = (s: Severity): string => {
  switch (s) {
    case 'critical':
      return 'text-signal-red';
    case 'caution':
      return 'text-signal-amber';
    default:
      return 'text-signal-green';
  }
};

export const overallSeverity = (v: Vitals): Severity => {
  const all: Severity[] = [
    hrSeverity(v.hr),
    bpSeverity(v.bpSys),
    rrSeverity(v.rr),
    spo2Severity(v.spo2),
  ];
  if (all.includes('critical')) return 'critical';
  if (all.includes('caution')) return 'caution';
  return 'normal';
};
EOF

cat <<'EOF' > src/store/scenarioStore.ts
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
  loadScenario: (id: string) => void;
  appendLog: (text: string) => void;
  clearLog: () => void;
};

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  scenarios: SCENARIOS,
  activeId: SCENARIOS[0].id,
  log: [],
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
}));

export const selectActiveScenario = (s: ScenarioState): Scenario =>
  s.scenarios.find((x) => x.id === s.activeId) ?? s.scenarios[0];
EOF

cat <<'EOF' > src/components/VitalCell.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Severity, severityToTextClass } from '@/lib/vitals';

type Props = {
  label: string;
  value: string;
  unit?: string;
  severity: Severity;
};

export function VitalCell({ label, value, unit, severity }: Props) {
  const tone = severityToTextClass(severity);
  return (
    <View className="flex-1 border border-ops-line bg-ops-char px-4 py-3 mx-1 rounded-sm">
      <Text className="text-ops-dim text-[11px] tracking-[3px] uppercase">
        {label}
      </Text>
      <View className="flex-row items-baseline mt-1">
        <Text className={`${tone} text-4xl font-bold tracking-tight`}>
          {value}
        </Text>
        {unit ? (
          <Text className="text-ops-dim ml-1 text-xs uppercase">{unit}</Text>
        ) : null}
      </View>
      <View className="h-[2px] mt-2 bg-ops-line">
        <View
          className={`h-full ${
            severity === 'critical'
              ? 'bg-signal-red'
              : severity === 'caution'
              ? 'bg-signal-amber'
              : 'bg-signal-green'
          }`}
          style={{
            width:
              severity === 'critical'
                ? '100%'
                : severity === 'caution'
                ? '60%'
                : '30%',
          }}
        />
      </View>
    </View>
  );
}
EOF

cat <<'EOF' > src/components/VitalsRow.tsx
import React from 'react';
import { View } from 'react-native';
import { VitalCell } from './VitalCell';
import {
  bpSeverity,
  hrSeverity,
  rrSeverity,
  spo2Severity,
} from '@/lib/vitals';
import type { Vitals } from '@/types/scenario';

export function VitalsRow({ vitals }: { vitals: Vitals }) {
  return (
    <View className="flex-row -mx-1">
      <VitalCell
        label="HR"
        value={String(vitals.hr)}
        unit="bpm"
        severity={hrSeverity(vitals.hr)}
      />
      <VitalCell
        label="BP"
        value={`${vitals.bpSys}/${vitals.bpDia}`}
        unit="mmHg"
        severity={bpSeverity(vitals.bpSys)}
      />
      <VitalCell
        label="RR"
        value={String(vitals.rr)}
        unit="/min"
        severity={rrSeverity(vitals.rr)}
      />
      <VitalCell
        label="SpO2"
        value={`${vitals.spo2}`}
        unit="%"
        severity={spo2Severity(vitals.spo2)}
      />
    </View>
  );
}
EOF

cat <<'EOF' > src/components/CasualtyCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { VitalsRow } from './VitalsRow';
import { overallSeverity, severityToTextClass } from '@/lib/vitals';
import type { Casualty } from '@/types/scenario';

const AVPU_LABEL: Record<Casualty['consciousness'], string> = {
  A: 'ALERT',
  V: 'VERBAL',
  P: 'PAIN',
  U: 'UNRESPONSIVE',
};

export function CasualtyCard({ casualty }: { casualty: Casualty }) {
  const sev = overallSeverity(casualty.vitals);
  const tone = severityToTextClass(sev);

  return (
    <View className="border border-ops-line bg-ops-panel rounded-sm">
      {/* Header strip */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-ops-line bg-ops-char">
        <View className="flex-row items-center">
          <View
            className={`w-2 h-2 mr-3 ${
              sev === 'critical'
                ? 'bg-signal-red'
                : sev === 'caution'
                ? 'bg-signal-amber'
                : 'bg-signal-green'
            }`}
          />
          <Text className="text-ops-sage text-xs tracking-[3px] uppercase">
            Casualty // {casualty.callsign}
          </Text>
        </View>
        <Text className={`${tone} text-xs tracking-[3px] uppercase`}>
          {sev === 'critical'
            ? 'PRIORITY: URGENT'
            : sev === 'caution'
            ? 'PRIORITY: PRIORITY'
            : 'PRIORITY: ROUTINE'}
        </Text>
      </View>

      <View className="px-4 pt-4 pb-3">
        {/* Bio line */}
        <View className="flex-row flex-wrap mb-3">
          <Field label="AGE" value={`${casualty.age}`} />
          <Field label="SEX" value={casualty.sex} />
          <Field label="WT" value={`${casualty.weightKg} kg`} />
          <Field label="AVPU" value={AVPU_LABEL[casualty.consciousness]} />
          <Field label="TOI" value={casualty.timeOfInjury} />
        </View>

        {/* Mechanism */}
        <View className="mb-4">
          <Text className="text-ops-dim text-[10px] tracking-[3px] uppercase mb-1">
            Mechanism
          </Text>
          <Text className="text-ops-sage text-sm">{casualty.mechanism}</Text>
        </View>

        {/* Vitals */}
        <Text className="text-ops-dim text-[10px] tracking-[3px] uppercase mb-2">
          Vitals
        </Text>
        <VitalsRow vitals={casualty.vitals} />

        {/* Injuries */}
        <Text className="text-ops-dim text-[10px] tracking-[3px] uppercase mt-4 mb-2">
          Injuries
        </Text>
        <View>
          {casualty.injuries.map((inj, idx) => (
            <View
              key={idx}
              className="border-l-2 border-signal-red bg-ops-char px-3 py-2 mb-2"
            >
              <Text className="text-ops-sage text-sm font-semibold uppercase">
                {inj.type} — {inj.region}
              </Text>
              <Text className="text-ops-dim text-[11px] uppercase tracking-widest mt-0.5">
                Severity: {inj.severity}
              </Text>
              {inj.notes ? (
                <Text className="text-ops-sage text-xs mt-1">{inj.notes}</Text>
              ) : null}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View className="mr-6 mb-2">
      <Text className="text-ops-dim text-[10px] tracking-[3px] uppercase">
        {label}
      </Text>
      <Text className="text-ops-sage text-sm font-semibold">{value}</Text>
    </View>
  );
}
EOF

cat <<'EOF' > src/components/InputBox.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';

type Props = {
  onSubmit: (text: string) => void;
  placeholder?: string;
};

export function InputBox({ onSubmit, placeholder }: Props) {
  const [value, setValue] = useState('');

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue('');
  };

  return (
    <View className="border border-ops-line bg-ops-panel rounded-sm">
      <View className="flex-row items-center px-3 py-2 border-b border-ops-line bg-ops-char">
        <Text className="text-signal-green text-xs tracking-[3px] uppercase">
          {'>'} Medic Input
        </Text>
        <View className="ml-2 w-1.5 h-1.5 bg-signal-green" />
      </View>
      <View className="flex-row items-end p-3">
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder ?? 'Describe what you observe…'}
          placeholderTextColor="#5b6b48"
          multiline
          onSubmitEditing={submit}
          blurOnSubmit
          returnKeyType="send"
          className="flex-1 text-ops-sage text-base min-h-[56px] max-h-[140px] px-2 py-2 bg-ops-black border border-ops-line rounded-sm"
          style={{ textAlignVertical: 'top' }}
        />
        <Pressable
          onPress={submit}
          className="ml-3 px-4 py-3 bg-ops-olive border border-ops-drab active:bg-ops-drab"
        >
          <Text className="text-ops-sage text-xs tracking-[3px] uppercase font-bold">
            Transmit
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
EOF

cat <<'EOF' > src/components/MedicLog.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useScenarioStore } from '@/store/scenarioStore';

const fmt = (ts: number) => {
  const d = new Date(ts);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export function MedicLog() {
  const log = useScenarioStore((s) => s.log);

  return (
    <View className="border border-ops-line bg-ops-panel rounded-sm flex-1">
      <View className="flex-row items-center justify-between px-3 py-2 border-b border-ops-line bg-ops-char">
        <Text className="text-ops-sage text-xs tracking-[3px] uppercase">
          Medic Log
        </Text>
        <Text className="text-ops-dim text-[10px] tracking-[2px] uppercase">
          {log.length} entr{log.length === 1 ? 'y' : 'ies'}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 12 }}
        className="flex-1"
      >
        {log.length === 0 ? (
          <Text className="text-ops-dim text-sm italic">
            No transmissions logged. Awaiting medic input…
          </Text>
        ) : (
          log.map((entry) => (
            <View key={entry.id} className="mb-3">
              <Text className="text-signal-cyan text-[10px] tracking-[2px] uppercase">
                [{fmt(entry.timestamp)}] medic
              </Text>
              <Text className="text-ops-sage text-sm mt-0.5">
                {entry.text}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
EOF

cat <<'EOF' > src/components/ScenarioPicker.tsx
import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useScenarioStore } from '@/store/scenarioStore';

export function ScenarioPicker() {
  const scenarios = useScenarioStore((s) => s.scenarios);
  const activeId = useScenarioStore((s) => s.activeId);
  const loadScenario = useScenarioStore((s) => s.loadScenario);

  return (
    <View className="border border-ops-line bg-ops-panel rounded-sm">
      <View className="px-3 py-2 border-b border-ops-line bg-ops-char">
        <Text className="text-ops-sage text-xs tracking-[3px] uppercase">
          Scenario File
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 8 }}
      >
        {scenarios.map((s) => {
          const active = s.id === activeId;
          return (
            <Pressable
              key={s.id}
              onPress={() => loadScenario(s.id)}
              className={`mr-2 px-3 py-2 border ${
                active
                  ? 'border-signal-green bg-ops-olive'
                  : 'border-ops-line bg-ops-black'
              }`}
            >
              <Text
                className={`text-[10px] tracking-[2px] uppercase ${
                  active ? 'text-signal-green' : 'text-ops-dim'
                }`}
              >
                {s.id}
              </Text>
              <Text
                className={`text-sm ${
                  active ? 'text-ops-sage' : 'text-ops-dim'
                }`}
              >
                {s.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
EOF

cat <<'EOF' > src/scenarios/gsw-chest.json
{
  "id": "gsw-chest-01",
  "title": "GSW — Right Chest",
  "briefing": "Patrol contact. Single casualty down behind cover. Took small-arms fire approximately 90 seconds ago. Pulled to CCP under suppressive fire.",
  "environment": "Urban, night, hostile",
  "casualty": {
    "callsign": "BRAVO-2-1",
    "age": 24,
    "sex": "M",
    "weightKg": 84,
    "mechanism": "Single GSW, anterior right chest, 7.62mm suspected",
    "timeOfInjury": "T-00:01:30",
    "consciousness": "V",
    "injuries": [
      {
        "region": "right anterior chest",
        "type": "GSW",
        "severity": "critical",
        "notes": "Penetrating wound, 4th intercostal space, mid-clavicular line. No exit wound located. Sucking sound on inspiration."
      }
    ],
    "vitals": {
      "hr": 132,
      "bpSys": 92,
      "bpDia": 58,
      "rr": 28,
      "spo2": 88
    }
  }
}
EOF

cat <<'EOF' > src/scenarios/tourniquet-leg.json
{
  "id": "tq-leg-01",
  "title": "Junctional Hemorrhage — Left Thigh",
  "briefing": "IED strike on lead vehicle. One casualty extracted with massive lower-extremity bleeding. Buddy applied improvised tourniquet en route.",
  "environment": "Rural road, day, post-blast",
  "casualty": {
    "callsign": "ALPHA-1-3",
    "age": 31,
    "sex": "M",
    "weightKg": 91,
    "mechanism": "Blast / frag, left lower extremity",
    "timeOfInjury": "T-00:04:10",
    "consciousness": "V",
    "injuries": [
      {
        "region": "left thigh, mid-femur",
        "type": "blast frag, partial amputation",
        "severity": "critical",
        "notes": "Buddy TQ in place, bright red bleeding still observed distal to TQ. Pulses absent below knee."
      }
    ],
    "vitals": {
      "hr": 144,
      "bpSys": 78,
      "bpDia": 44,
      "rr": 30,
      "spo2": 94
    }
  }
}
EOF

cat <<'EOF' > src/scenarios/tension-pneumo.json
{
  "id": "tension-pneumo-01",
  "title": "Suspected Tension Pneumothorax",
  "briefing": "Casualty treated 12 minutes ago for penetrating chest trauma with chest seal. Now decompensating rapidly. Increasing respiratory distress.",
  "environment": "CCP, daylight, secured",
  "casualty": {
    "callsign": "CHARLIE-3-2",
    "age": 27,
    "sex": "F",
    "weightKg": 68,
    "mechanism": "Penetrating chest trauma, frag",
    "timeOfInjury": "T-00:12:00",
    "consciousness": "P",
    "injuries": [
      {
        "region": "left lateral chest",
        "type": "penetrating frag",
        "severity": "critical",
        "notes": "Vented chest seal in place. JVD noted. Tracheal deviation to right. Absent breath sounds left side."
      }
    ],
    "vitals": {
      "hr": 138,
      "bpSys": 84,
      "bpDia": 52,
      "rr": 36,
      "spo2": 82
    }
  }
}
EOF

echo "GHOST MEDIC Session 1 skeleton: 24 files written. Run: npm install && npx expo start"
