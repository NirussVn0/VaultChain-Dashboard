import { Injectable } from "@nestjs/common";

import type { AiProvider } from "./ai-provider.interface";

interface ClaudeRequestBody {
  model: string;
  max_tokens: number;
  messages: Array<{
    role: "user";
    content: Array<{
      type: "text";
      text: string;
    }>;
  }>;
}

@Injectable()
export class ClaudeProvider implements AiProvider {
  readonly name = "claude";

  constructor(
    private readonly apiKey: string | undefined,
    private readonly model: string,
    private readonly timeout: number,
  ) {}

  async generateInsight(prompt: string, context?: Record<string, unknown>): Promise<string> {
    if (!this.apiKey) {
      throw new Error("CLAUDE_API_KEY is not configured");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeout);

    const body: ClaudeRequestBody = {
      model: this.model,
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                context != null
                  ? `${prompt}\n\nContext JSON:\n${JSON.stringify(context)}`
                  : prompt,
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorPayload = await response.text();
        throw new Error(`Claude API error (${response.status}): ${errorPayload}`);
      }

      const payload = (await response.json()) as {
        content?: Array<{ text?: string }>;
      };

      const message = payload.content?.[0]?.text;
      if (!message) {
        throw new Error("Claude API returned no text");
      }

      return message;
    } finally {
      clearTimeout(timeout);
    }
  }
}
