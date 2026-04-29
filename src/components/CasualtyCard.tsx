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
