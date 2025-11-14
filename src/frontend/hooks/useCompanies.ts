"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAPI } from "@/lib/api";
import type { Company, CompanyListResponse } from "@/lib/types";

/**
 * Hook parameters for filtering companies
 */
export interface UseCompaniesParams {
  industryId?: number;
  locationId?: number;
}

/**
 * Return type for useCompanies hook
 */
export interface UseCompaniesReturn {
  companies: Company[] | null;
  total: number;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch and manage companies data with optional filters
 * 
 * @param params - Filter parameters (industryId, locationId)
 * @returns Object with companies data, loading state, error, and refetch function
 * 
 * @example
 * const { companies, loading, error, refetch } = useCompanies({ 
 *   industryId: 1, 
 *   locationId: 2 
 * });
 */
export function useCompanies(params?: UseCompaniesParams): UseCompaniesReturn {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  const industryId = params?.industryId;
  const locationId = params?.locationId;

  useEffect(() => {
    let isMounted = true;

    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (industryId !== undefined) {
          queryParams.append("industry_id", String(industryId));
        }
        if (locationId !== undefined) {
          queryParams.append("location_id", String(locationId));
        }

        const queryString = queryParams.toString();
        const endpoint = `/api/v1/companies${queryString ? `?${queryString}` : ""}`;

        const data = await fetchAPI<CompanyListResponse>(endpoint);

        if (isMounted) {
          setCompanies(data.companies);
          setTotal(data.total);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch companies"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCompanies();

    return () => {
      isMounted = false;
    };
  }, [industryId, locationId, refetchTrigger]);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  return {
    companies,
    total,
    loading,
    error,
    refetch,
  };
}
