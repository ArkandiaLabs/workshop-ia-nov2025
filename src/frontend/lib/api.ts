import { HealthResponse } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Custom API Error class with status code
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Generic fetch function for API calls
 * @param endpoint - API endpoint path (e.g., "/api/v1/companies")
 * @param options - Fetch options
 * @returns Promise with typed response data
 * @throws APIError if request fails
 */
export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText,
      );
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error(
      `Failed to fetch from ${endpoint}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Fetch health status from backend API
 * @returns Promise with health response
 * @throws Error if request fails or response is invalid
 */
export async function fetchHealth(): Promise<HealthResponse> {
  return fetchAPI<HealthResponse>("/api/v1/health");
}
