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
