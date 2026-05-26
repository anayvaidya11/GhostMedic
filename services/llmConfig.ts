// services/llmConfig.ts
// To swap providers: change PROVIDER to 'anthropic' or 'openai'
// and update the fetch logic in llmService.ts accordingly
export const PROVIDER = 'ollama';
export const OLLAMA_BASE_URL = 'http://192.168.1.157:11434';
export const OLLAMA_MODEL = 'llama3.2:3b';
