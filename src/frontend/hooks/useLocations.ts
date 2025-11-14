"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import type { Location, LocationListResponse } from "@/lib/types";

/**
 * Return type for useLocations hook
 */
export interface UseLocationsReturn {
  locations: Location[] | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook to fetch and manage locations data
 * Fetches all available locations from the API on mount
 * 
 * @returns Object with locations data, loading state, and error
 * 
 * @example
 * const { locations, loading, error } = useLocations();
 * 
 * if (loading) return <LoadingSpinner />;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return (
 *   <Select 
 *     options={locations.map(l => ({ 
 *       value: l.id, 
 *       label: l.display_name 
 *     }))}
 *   />
 * );
 */
export function useLocations(): UseLocationsReturn {
  const [locations, setLocations] = useState<Location[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchAPI<LocationListResponse>("/api/v1/locations");

        if (isMounted) {
          setLocations(data.locations);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch locations"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    locations,
    loading,
    error,
  };
}
