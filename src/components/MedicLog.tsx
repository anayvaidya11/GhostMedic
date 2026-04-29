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
