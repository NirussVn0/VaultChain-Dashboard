export interface AiProvider {
  readonly name: string;
  generateInsight(prompt: string, context?: Record<string, unknown>): Promise<string>;
}
