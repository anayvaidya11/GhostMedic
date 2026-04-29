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
