import { AppSettings } from './types';

// WebLLM Types (imported dynamically to avoid SSR build errors)
let webLLMModule: any = null;

// Helper to check if WebGPU is available in the browser
export function isWebGpuSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(navigator as any).gpu;
}

// Dynamically load @mlc-ai/web-llm on the client side
async function getWebLLM() {
  if (!webLLMModule) {
    webLLMModule = await import('@mlc-ai/web-llm');
  }
  return webLLMModule;
}

export interface ModelLoadProgress {
  progress: number;
  text: string;
}

// Cache the MLC engine instance once loaded
let cachedEngine: any = null;
let activeModelId: string = '';

// Load the local MLC WebGPU model
export async function loadLocalModel(
  modelId: string = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
  onProgress: (progress: ModelLoadProgress) => void
): Promise<any> {
  if (cachedEngine && activeModelId === modelId) {
    onProgress({ progress: 1, text: 'Model already loaded.' });
    return cachedEngine;
  }

  const webLLM = await getWebLLM();
  
  onProgress({ progress: 0, text: 'Initializing WebGPU worker...' });

  const engine = await webLLM.CreateMLCEngine(
    modelId,
    {
      initProgressCallback: (report: any) => {
        // report.progress is 0 to 1
        onProgress({
          progress: report.progress,
          text: report.text,
        });
      },
    }
  );

  cachedEngine = engine;
  activeModelId = modelId;
  return engine;
}

// Generate the specific prompt instructions
function buildPrompt(bulletText: string, instruction: string): { system: string; user: string } {
  let instructionPrompt = '';
  if (instruction === 'verb') {
    instructionPrompt = 'Rewrite this bullet point to start with a very strong engineering action verb (e.g., "Engineered", "Optimized", "Architected", "Spearheaded") and remove any passive language (e.g. "Worked on", "Responsible for").';
  } else if (instruction === 'quantify') {
    instructionPrompt = 'Rewrite this bullet point to focus heavily on metrics, business outcomes, and quantifiable achievements. Even if you don\'t know the exact numbers, insert bracketed metric placeholders like "[X%]", "[$Y]", "[Z hours]" or "[Nx]" so the user knows where they need to fill in their own metrics.';
  } else if (instruction === 'tighten') {
    instructionPrompt = 'Rewrite this bullet point to be extremely concise and punchy. Eliminate wordiness and fluff while retaining all core technical impact and achievements. Make it fit in a single clean line.';
  } else {
    // general improvement
    instructionPrompt = 'Optimize this bullet point for ATS scanning by improving the professional tone, introducing strong action verbs, and leaving placeholders for metrics like [X%] where appropriate.';
  }

  const system = `You are a professional technical resume writer and ATS optimization engine. 
Your goal is to optimize a single resume bullet point. 
CRITICAL RULE: Output ONLY the revised bullet point text. Do NOT include greetings, intro, outro, explanations, notes, or quotation marks. Return exactly the revised sentence and nothing else.`;

  const user = `Original bullet point: "${bulletText}"
Instruction: ${instructionPrompt}`;

  return { system, user };
}

// Local polish call using the loaded MLC engine
export async function polishBulletLocal(
  engine: any,
  bulletText: string,
  instruction: string
): Promise<string> {
  const { system, user } = buildPrompt(bulletText, instruction);

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ];

  const reply = await engine.chat.completions.create({
    messages,
    temperature: 0.3,
  });

  let cleanText = reply.choices[0].message.content || '';
  // Strip quotes if LLM added them
  cleanText = cleanText.trim().replace(/^["']|["']$/g, '');
  // Strip markdown bold formatting sometimes added by LLMs
  cleanText = cleanText.replace(/\*\*/g, '');
  return cleanText;
}

// Cloud BYOK polish call via API keys
export async function polishBulletCloud(
  settings: AppSettings,
  bulletText: string,
  instruction: string
): Promise<string> {
  const { system, user } = buildPrompt(bulletText, instruction);

  if (settings.aiProvider === 'gemini') {
    if (!settings.aiApiKey) throw new Error('Gemini API Key is missing. Configure it in settings.');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settings.aiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${system}\n\n${user}` }]
          }],
          generationConfig: {
            temperature: 0.3,
          }
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    text = text.trim().replace(/^["']|["']$/g, '');
    text = text.replace(/\*\*/g, '');
    return text;

  } else {
    // openai
    if (!settings.aiApiKey) throw new Error('OpenAI API Key is missing. Configure it in settings.');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.aiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content || '';
    text = text.trim().replace(/^["']|["']$/g, '');
    text = text.replace(/\*\*/g, '');
    return text;
  }
}
