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
