import { Injectable } from "@nestjs/common";

import type { AiProvider } from "./ai-provider.interface";

interface GeminiRequestBody {
  contents: Array<{
    role: "user";
    parts: Array<{ text: string }>;
  }>;
}

@Injectable()
export class GeminiProvider implements AiProvider {
  readonly name = "gemini";

  constructor(
    private readonly apiKey: string | undefined,
    private readonly model: string,
    private readonly timeout: number,
  ) {}

  async generateInsight(prompt: string, context?: Record<string, unknown>): Promise<string> {
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeout);

    const body: GeminiRequestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
            ...(context
              ? [
                  {
                    text: `Context JSON:\n${JSON.stringify(context)}`,
                  },
                ]
              : []),
          ],
        },
      ],
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        const errorPayload = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errorPayload}`);
      }

      const payload = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const candidateText = payload.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!candidateText) {
        throw new Error("Gemini API returned no text");
      }

      return candidateText;
    } finally {
      clearTimeout(timeout);
    }
  }
}
