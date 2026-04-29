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
