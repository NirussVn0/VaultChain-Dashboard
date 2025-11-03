/**
 * Provides deterministic timestamps for mock data so server and client renders
 * stay in sync during hydration. By anchoring relative times to a fixed moment
 * in the past we avoid calling Date.now() at module evaluation time.
 */
const MOCK_NOW_ISO = "2024-04-12T16:00:00.000Z";

export const MOCK_NOW = Date.parse(MOCK_NOW_ISO);
const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

export const minutesFromNow = (minutes: number) => MOCK_NOW + minutes * MINUTE_MS;
export const hoursFromNow = (hours: number) => MOCK_NOW + hours * HOUR_MS;
