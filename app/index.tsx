import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCENARIOS = [
  {
    id: 'gsw-chest-01',
    title: 'GSW — Right Chest',
    environment: 'Urban, night, hostile',
    briefing: 'Patrol contact. Single casualty down behind cover. Took small-arms fire approximately 90 seconds ago.',
    casualty: {
      callsign: 'BRAVO-2-1', age: 24, sex: 'M', weightKg: 84,
      mechanism: 'Single GSW, anterior right chest, 7.62mm suspected',
      timeOfInjury: 'T-00:01:30', consciousness: 'V',
      injuries: [{ region: 'right anterior chest', type: 'GSW', severity: 'critical', notes: 'Sucking chest wound. No exit wound.' }],
      vitals: { hr: 132, bpSys: 92, bpDia: 58, rr: 28, spo2: 88 }
    }
  },
  {
    id: 'tq-leg-01',
    title: 'TQ — Left Thigh',
    environment: 'Rural road, day, post-blast',
    briefing: 'IED strike. One casualty with massive lower-extremity bleeding. Buddy TQ applied.',
    casualty: {
      callsign: 'ALPHA-1-3', age: 31, sex: 'M', weightKg: 91,
      mechanism: 'Blast / frag, left lower extremity',
      timeOfInjury: 'T-00:04:10', consciousness: 'V',
      injuries: [{ region: 'left thigh', type: 'blast frag', severity: 'critical', notes: 'TQ in place, bleeding continues.' }],
      vitals: { hr: 144, bpSys: 78, bpDia: 44, rr: 30, spo2: 94 }
    }
  },
  {
    id: 'tension-pneumo-01',
    title: 'Tension Pneumothorax',
    environment: 'CCP, daylight, secured',
    briefing: 'Casualty treated 12 min ago for chest trauma. Now decompensating rapidly.',
    casualty: {
      callsign: 'CHARLIE-3-2', age: 27, sex: 'F', weightKg: 68,
      mechanism: 'Penetrating chest trauma, frag',
      timeOfInjury: 'T-00:12:00', consciousness: 'P',
      injuries: [{ region: 'left lateral chest', type: 'penetrating frag', severity: 'critical', notes: 'JVD noted. Tracheal deviation right. Absent breath sounds left.' }],
      vitals: { hr: 138, bpSys: 84, bpDia: 52, rr: 36, spo2: 82 }
    }
  }
];

const vitalColor = (type: string, val: number) => {
  if (type === 'hr' && (val > 130 || val < 50)) return '#ff4d4d';
  if (type === 'hr' && (val > 100 || val < 60)) return '#ffb547';
  if (type === 'bp' && (val < 80 || val > 180)) return '#ff4d4d';
  if (type === 'bp' && (val < 90 || val > 140)) return '#ffb547';
  if (type === 'rr' && (val > 30 || val < 8)) return '#ff4d4d';
  if (type === 'rr' && (val > 20 || val < 12)) return '#ffb547';
  if (type === 'spo2' && val < 90) return '#ff4d4d';
  if (type === 'spo2' && val < 95) return '#ffb547';
  return '#7cff6b';
};

export default function Home() {
  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const [log, setLog] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const scenario = SCENARIOS.find(s => s.id === activeId)!;
  const { casualty } = scenario;

  const transmit = () => {
    if (!input.trim()) return;
    setLog(l => [...l, input.trim()]);
    setInput('');
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>GHOST MEDIC</Text>
        <Text style={s.sub}>v0.1 // offline // training aid</Text>
      </View>
      <ScrollView style={s.scroll} keyboardShouldPersistTaps="handled">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.pickerRow}>
          {SCENARIOS.map(sc => (
            <Pressable key={sc.id} onPress={() => setActiveId(sc.id)}
              style={[s.pill, activeId === sc.id && s.pillActive]}>
              <Text style={[s.pillText, activeId === sc.id && s.pillTextActive]}>{sc.title}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardLabel}>{scenario.title}</Text>
            <Text style={s.dim}>{scenario.environment}</Text>
          </View>
          <Text style={s.sage}>{scenario.briefing}</Text>
        </View>
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardLabel}>CASUALTY // {casualty.callsign}</Text>
          </View>
          <View style={s.bioRow}>
            {([['AGE', casualty.age], ['SEX', casualty.sex], ['WT', `${casualty.weightKg}kg`], ['AVPU', casualty.consciousness]] as [string, string|number][]).map(([l, v]) => (
              <View key={l} style={s.bioCell}>
                <Text style={s.dim}>{l}</Text>
                <Text style={s.sage}>{v}</Text>
              </View>
            ))}
          </View>
          <Text style={s.dim}>MECHANISM</Text>
          <Text style={[s.sage, { marginBottom: 12 }]}>{casualty.mechanism}</Text>
          <Text style={s.dim}>VITALS</Text>
          <View style={s.vitalsRow}>
            {([
              ['HR', String(casualty.vitals.hr), 'bpm', vitalColor('hr', casualty.vitals.hr)],
              ['BP', `${casualty.vitals.bpSys}/${casualty.vitals.bpDia}`, 'mmHg', vitalColor('bp', casualty.vitals.bpSys)],
              ['RR', String(casualty.vitals.rr), '/min', vitalColor('rr', casualty.vitals.rr)],
              ['SpO2', `${casualty.vitals.spo2}`, '%', vitalColor('spo2', casualty.vitals.spo2)],
            ] as [string, string, string, string][]).map(([label, val, unit, color]) => (
              <View key={label} style={s.vitalCell}>
                <Text style={s.dim}>{label}</Text>
                <Text style={[s.vitalVal, { color }]}>{val}</Text>
                <Text style={s.dim}>{unit}</Text>
              </View>
            ))}
          </View>
          <Text style={[s.dim, { marginTop: 12 }]}>INJURIES</Text>
          {casualty.injuries.map((inj, i) => (
            <View key={i} style={s.injuryCard}>
              <Text style={s.injuryTitle}>{inj.type.toUpperCase()} — {inj.region}</Text>
              <Text style={s.dim}>Severity: {inj.severity}</Text>
              {inj.notes ? <Text style={s.sage}>{inj.notes}</Text> : null}
            </View>
          ))}
        </View>
        <View style={s.card}>
          <Text style={s.cardLabel}>MEDIC LOG</Text>
          {log.length === 0
            ? <Text style={s.dim}>No transmissions yet...</Text>
            : log.map((entry, i) => <Text key={i} style={s.sage}>› {entry}</Text>)
          }
        </View>
        <View style={s.card}>
          <Text style={s.cardLabel}>&gt; MEDIC INPUT</Text>
          <TextInput
            value={input} onChangeText={setInput}
            placeholder="Describe what you observe…"
            placeholderTextColor="#5b6b48"
            multiline style={s.input}
          />
          <Pressable onPress={transmit} style={s.btn}>
            <Text style={s.btnText}>TRANSMIT</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f0a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2a3326', backgroundColor: '#11160f' },
  title: { color: '#7cff6b', fontSize: 16, letterSpacing: 6, fontWeight: 'bold' },
  sub: { color: '#6b7560', fontSize: 10 },
  scroll: { flex: 1 },
  pickerRow: { padding: 8 },
  pill: { marginRight: 8, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#2a3326', backgroundColor: '#0a0f0a' },
  pillActive: { borderColor: '#7cff6b', backgroundColor: '#3d4a30' },
  pillText: { color: '#6b7560', fontSize: 11 },
  pillTextActive: { color: '#7cff6b' },
  card: { margin: 8, padding: 12, borderWidth: 1, borderColor: '#2a3326', backgroundColor: '#161c14' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#2a3326' },
  cardLabel: { color: '#8a9a73', fontSize: 11, letterSpacing: 3 },
  dim: { color: '#6b7560', fontSize: 11, letterSpacing: 2, marginBottom: 2 },
  sage: { color: '#8a9a73', fontSize: 13, marginBottom: 4 },
  bioRow: { flexDirection: 'row', marginBottom: 12 },
  bioCell: { marginRight: 20 },
  vitalsRow: { flexDirection: 'row', marginTop: 4 },
  vitalCell: { flex: 1, alignItems: 'center', padding: 8, borderWidth: 1, borderColor: '#2a3326', marginHorizontal: 2 },
  vitalVal: { fontSize: 24, fontWeight: 'bold' },
  injuryCard: { borderLeftWidth: 2, borderLeftColor: '#ff4d4d', paddingLeft: 8, marginTop: 8, backgroundColor: '#11160f', padding: 8 },
  injuryTitle: { color: '#8a9a73', fontWeight: 'bold', fontSize: 12 },
  input: { color: '#8a9a73', borderWidth: 1, borderColor: '#2a3326', padding: 10, minHeight: 60, marginTop: 8, backgroundColor: '#0a0f0a', textAlignVertical: 'top' },
  btn: { marginTop: 8, padding: 12, backgroundColor: '#3d4a30', borderWidth: 1, borderColor: '#5b6b48', alignItems: 'center' },
  btnText: { color: '#8a9a73', letterSpacing: 3, fontSize: 12, fontWeight: 'bold' },
});
