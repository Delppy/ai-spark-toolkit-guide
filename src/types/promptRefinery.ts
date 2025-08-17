// Define the structure of the JSON returned by Lovable
export interface AiToUsePromptResponse {
  assumptions: string; // 1–3 bullet points of assumptions made
  primary_prompt: {
    title: string;   // short descriptive title
    prompt: string;  // the refined, copy-ready prompt
    notes?: string;  // optional execution notes (max 3 bullets)
  };
  alternate_prompts: {
    title: string;   // short title for alternate angle
    prompt: string;  // concise alternate prompt
  }[];
}

// Validation function to ensure the response matches the expected structure
export function validatePromptResponse(data: any): data is AiToUsePromptResponse {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check assumptions
  if (typeof data.assumptions !== 'string') {
    return false;
  }

  // Check primary_prompt
  if (!data.primary_prompt || typeof data.primary_prompt !== 'object') {
    return false;
  }

  const primaryPrompt = data.primary_prompt;
  if (typeof primaryPrompt.title !== 'string' || typeof primaryPrompt.prompt !== 'string') {
    return false;
  }

  if (primaryPrompt.notes !== undefined && typeof primaryPrompt.notes !== 'string') {
    return false;
  }

  // Check alternate_prompts
  if (!Array.isArray(data.alternate_prompts)) {
    return false;
  }

  for (const alt of data.alternate_prompts) {
    if (!alt || typeof alt !== 'object') {
      return false;
    }
    if (typeof alt.title !== 'string' || typeof alt.prompt !== 'string') {
      return false;
    }
  }

  return true;
}