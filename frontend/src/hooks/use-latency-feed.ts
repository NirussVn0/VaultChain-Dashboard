'use client';

import { useEffect, useRef, useState } from "react";

type ConnectionStatus = "connecting" | "online" | "offline";

export interface LatencyState {
  latency: number;
  status: ConnectionStatus;
  lastUpdated: number | null;
  error?: string;
}

interface UseLatencyFeedOptions {
  /**
   * Interval (ms) to use when falling back to synthetic latency data.
   */
  mockIntervalMs?: number;
  /**
   * Whether to force mock mode regardless of WebSocket availability.
   */
  forceMock?: boolean;
}

const DEFAULT_LATENCY: LatencyState = {
  latency: 0,
  status: "connecting",
  lastUpdated: null,
};

const parseLatency = (payload: unknown): number | null => {
  if (typeof payload === "number") {
    return payload;
  }

  if (typeof payload === "string") {
    const numeric = Number.parseFloat(payload);
    return Number.isFinite(numeric) ? numeric : null;
  }

  if (typeof payload === "object" && payload != null && "latency" in payload) {
    const value = (payload as Record<string, unknown>)["latency"];
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const numeric = Number.parseFloat(value);
      return Number.isFinite(numeric) ? numeric : null;
    }
  }

  return null;
};

export function useLatencyFeed(
  url: string | undefined,
  { mockIntervalMs = 3000, forceMock = false }: UseLatencyFeedOptions = {},
): LatencyState {
  const [state, setState] = useState<LatencyState>(DEFAULT_LATENCY);
  const fallbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let socket: WebSocket | null = null;

    const clearTimers = () => {
      if (fallbackTimerRef.current) {
        clearInterval(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    const startMockStream = () => {
      clearTimers();
      setState({
        latency: 38,
        status: "online",
        lastUpdated: Date.now(),
      });

      fallbackTimerRef.current = setInterval(() => {
        setState({
          latency: Math.round(30 + Math.random() * 32),
          status: "online",
          lastUpdated: Date.now(),
        });
      }, mockIntervalMs);
    };

    const connect = () => {
      if (!url || forceMock) {
        startMockStream();
        return;
      }

      try {
        socket = new WebSocket(url);
      } catch (error) {
        console.error("Latency socket connection failed", error);
        startMockStream();
        return;
      }

      setState((prev) => ({
        ...prev,
        status: "connecting",
      }));

      socket.onopen = () => {
        setState((prev) => ({
          ...prev,
          status: "online",
        }));
      };

      socket.onmessage = (event: MessageEvent) => {
        let payload: unknown;
        try {
          payload = JSON.parse(event.data);
        } catch {
          payload = event.data;
        }

        const latencyValue = parseLatency(payload);
        if (latencyValue != null) {
          setState({
            latency: Math.max(latencyValue, 0),
            status: "online",
            lastUpdated: Date.now(),
          });
        }
      };

      socket.onerror = (event: Event) => {
        console.error("Latency socket error", event);
        setState((prev) => ({
          ...prev,
          status: "offline",
          error: "Connection error",
        }));
      };

      socket.onclose = () => {
        setState((prev) => ({
          ...prev,
          status: "offline",
        }));
        reconnectTimerRef.current = setTimeout(connect, 4000);
      };
    };

    connect();

    return () => {
      clearTimers();
      if (socket) {
        socket.close();
        socket = null;
      }
    };
  }, [forceMock, mockIntervalMs, url]);

  return state;
}
