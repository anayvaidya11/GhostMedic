import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
const COLORS = {
  bg: '#0a0f0a',
  panel: '#161c14',
  border: '#2a3326',
  text: '#8a9a73',
  dim: '#6b7560',
  green: '#7cff6b',
  red: '#ff4d4d',
  amber: '#ffb547',
};
type SectionDef = { key: string; color: string; bold: boolean };
const SECTION_DEFS: SectionDef[] = [
  { key: 'ASSESSMENT', color: COLORS.amber, bold: false },
  { key: 'PRIORITY THREATS', color: COLORS.red, bold: false },
  { key: 'IMMEDIATE ACTIONS', color: COLORS.green, bold: false },
  { key: 'MONITOR FOR', color: COLORS.dim, bold: false },
  { key: 'REASSESS', color: COLORS.green, bold: true },
];
type Section = SectionDef & { lines: string[] };
function parseSections(text: string): Section[] {
  const out: Section[] = [];
  let current: Section | null = null;
  for (const raw of text.split('\n')) {
    const def = SECTION_DEFS.find((d) => raw.trim().toUpperCase().startsWith(d.key));
    if (def) {
      if (current) out.push(current);
      current = { ...def, lines: [raw] };
    } else if (current) {
      current.lines.push(raw);
    } else {
      current = { key: '', color: COLORS.text, bold: false, lines: [raw] };
    }
  }
  if (current) out.push(current);
  return out;
}
type Props = {
  response: string;
  isThinking: boolean;
  streamingResponse: string;
};
export function AIResponse({ response, isThinking, streamingResponse }: Props) {
  const blink = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isThinking && !streamingResponse) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(blink, { toValue: 0.2, duration: 500, useNativeDriver: true }),
          Animated.timing(blink, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      );
      anim.start();
      return () => anim.stop();
    }
  }, [isThinking, streamingResponse, blink]);
  if (isThinking && !streamingResponse) {
    return (
      <View style={st.card}>
        <Animated.Text style={[st.processing, { opacity: blink }]}>
          GHOST MEDIC PROCESSING...
        </Animated.Text>
      </View>
    );
  }
  if (response) {
    const sections = parseSections(response);
    return (
      <View style={st.card}>
        <Text style={st.header}>// GHOST MEDIC</Text>
        {sections.map((sec, i) => (
          <View key={i} style={st.section}>
            {sec.lines.map((line, j) => (
              <Text
                key={j}
                style={[st.line, { color: sec.color }, (sec.bold || j === 0) && st.bold]}
              >
                {line}
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  }
  if (streamingResponse) {
    return (
      <View style={st.card}>
        <Text style={st.header}>// GHOST MEDIC</Text>
        <Text style={st.stream}>{streamingResponse}</Text>
      </View>
    );
  }
  return null;
}
const st = StyleSheet.create({
  card: { margin: 8, padding: 12, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.panel },
  header: { color: COLORS.green, fontSize: 11, letterSpacing: 3, marginBottom: 8, fontWeight: 'bold' },
  processing: { color: COLORS.green, fontSize: 13, letterSpacing: 3, fontWeight: 'bold' },
  stream: { color: COLORS.text, fontSize: 13, lineHeight: 18 },
  section: { marginBottom: 8 },
  line: { fontSize: 13, lineHeight: 18 },
  bold: { fontWeight: 'bold' },
});
