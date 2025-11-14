"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import type { Industry, IndustryListResponse } from "@/lib/types";

/**
 * Return type for useIndustries hook
 */
export interface UseIndustriesReturn {
  industries: Industry[] | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook to fetch and manage industries data
 * Fetches all available industries from the API on mount
 * 
 * @returns Object with industries data, loading state, and error
 * 
 * @example
 * const { industries, loading, error } = useIndustries();
 * 
 * if (loading) return <LoadingSpinner />;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return (
 *   <Select 
 *     options={industries.map(i => ({ value: i.id, label: i.name }))}
 *   />
 * );
 */
export function useIndustries(): UseIndustriesReturn {
  const [industries, setIndustries] = useState<Industry[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchIndustries = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchAPI<IndustryListResponse>("/api/v1/industries");

        if (isMounted) {
          setIndustries(data.industries);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch industries"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchIndustries();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    industries,
    loading,
    error,
  };
}
