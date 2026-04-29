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
