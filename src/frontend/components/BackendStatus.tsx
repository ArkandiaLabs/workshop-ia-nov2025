"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import type { HealthResponse } from "@/lib/types";

/**
 * BackendStatus Component
 * 
 * Displays the connection status to the backend API with auto-refresh.
 * Shows health status, version, environment, and a visual indicator.
 * Polls the backend health endpoint every 30 seconds.
 */
export function BackendStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    /**
     * Checks backend health by calling the /health endpoint
     */
    const checkHealth = async () => {
      try {
        const response = await fetchAPI<HealthResponse>("/api/v1/health");
        setHealth(response);
        setConnected(response.status === "healthy");
        setLoading(false);
      } catch (error) {
        console.error("Failed to check backend health:", error);
        setHealth(null);
        setConnected(false);
        setLoading(false);
      }
    };

    // Initial check
    checkHealth();

    // Poll every 30 seconds
    const intervalId = setInterval(checkHealth, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
        <span>Verificando conexión...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      {/* Connection Indicator Dot */}
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"
            } ${connected ? "animate-pulse" : ""}`}
          aria-label={connected ? "Conectado" : "Desconectado"}
        />
        <span className="font-medium text-gray-700">
          Backend: {connected ? "Conectado" : "Desconectado"}
        </span>
      </div>

      {/* Health Details (only when connected) */}
      {connected && health && (
        <div className="flex items-center gap-3 text-gray-600">
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">
            Versión: <span className="font-mono">{health.version}</span>
          </span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">
            Entorno:{" "}
            <span
              className={`font-medium ${health.environment === "production"
                  ? "text-blue-600"
                  : "text-amber-600"
                }`}
            >
              {health.environment}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

export type { HealthResponse };
