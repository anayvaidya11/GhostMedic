// services/llmService.ts

const OLLAMA_BASE_URL = 'http://192.168.1.157:11434';
const MODEL = 'llama3.2:3b';

const TCCC_SYSTEM_PROMPT = `You are GHOST MEDIC — an AI clinical decision support system for US Army combat medics operating under TCCC (Tactical Combat Casualty Care) protocols in austere, comms-denied environments.

RULES:
- Follow the MARCH protocol order: Massive hemorrhage → Airway → Respiration → Circulation → Hypothermia/Head injury
- Be concise. The medic is under stress. Use numbered steps.
- Flag life threats in ALL CAPS.
- Drug dosages use standard TCCC formulary (ketamine 1-2mg/kg IM, TXA 1g IV/IO, morphine 5mg IV/IM).
- If critical info is missing, ask ONE clarifying question before proceeding.
- Always end with: "REASSESS in 5 min."

FORMAT your response exactly like this:
ASSESSMENT: [1-2 sentence summary]
PRIORITY THREATS: [bullet list]
IMMEDIATE ACTIONS:
1. [step]
2. [step]
MONITOR FOR: [deterioration signs]
REASSESS in 5 min.`;

export interface LLMCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: string) => void;
}

export async function streamTCCCGuidance(
  casualtyReport: string,
  callbacks: LLMCallbacks
): Promise<void> {
  const prompt = `CASUALTY REPORT:\n${casualtyReport}\n\nProvide TCCC guidance:`;

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        system: TCCC_SYSTEM_PROMPT,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (!reader) throw new Error('No response body from Ollama');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(l => l.trim());

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) {
            fullResponse += json.response;
            callbacks.onToken(json.response);
          }
          if (json.done) {
            callbacks.onComplete(fullResponse);
          }
        } catch {
          // incomplete JSON chunk — skip
        }
      }
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    if (msg.includes('fetch') || msg.includes('Network') || msg.includes('connect') || msg.includes('refused')) {
      callbacks.onError(
        '[ LINK DEAD ]\nCannot reach inference server.\nEnsure Ollama is running:\n  ollama serve'
      );
    } else {
      callbacks.onError(`[ ERROR ] ${msg}`);
    }
  }
}
