"use client";

import React, { useState, useEffect } from "react";
import { Select } from "./ui/Select";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { useIndustries, useLocations } from "@/hooks";

/**
 * Filter values interface
 */
export interface CompanyFilters {
  industryId?: number;
  locationId?: number;
}

/**
 * Props for CompanyFilters component
 */
export interface CompanyFiltersProps {
  onFilterChange: (filters: CompanyFilters) => void;
}

/**
 * Company filters component with industry and location selects
 * Displays two dropdown filters and a clear button
 * Matches the UI design with responsive layout
 * 
 * @example
 * <CompanyFilters onFilterChange={(filters) => console.log(filters)} />
 */
export function CompanyFilters({ onFilterChange }: CompanyFiltersProps) {
  const [selectedIndustryId, setSelectedIndustryId] = useState<number | undefined>(undefined);
  const [selectedLocationId, setSelectedLocationId] = useState<number | undefined>(undefined);

  const { industries, loading: loadingIndustries, error: industriesError } = useIndustries();
  const { locations, loading: loadingLocations, error: locationsError } = useLocations();

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange({
      industryId: selectedIndustryId,
      locationId: selectedLocationId,
    });
  }, [selectedIndustryId, selectedLocationId, onFilterChange]);

  const handleIndustryChange = (value: string | number) => {
    setSelectedIndustryId(typeof value === "number" ? value : Number(value));
  };

  const handleLocationChange = (value: string | number) => {
    setSelectedLocationId(typeof value === "number" ? value : Number(value));
  };

  const handleClearFilters = () => {
    setSelectedIndustryId(undefined);
    setSelectedLocationId(undefined);
  };

  // Show loading spinner while data is being fetched
  if (loadingIndustries || loadingLocations) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md" />
        <span className="ml-3 text-gray-600">Cargando filtros...</span>
      </div>
    );
  }

  // Show error message if data fetch failed
  if (industriesError || locationsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-medium">Error al cargar filtros</p>
        <p className="text-sm mt-1">
          {industriesError?.message || locationsError?.message}
        </p>
      </div>
    );
  }

  const industryOptions = industries?.map((industry) => ({
    value: industry.id,
    label: industry.name,
  })) || [];

  const locationOptions = locations?.map((location) => ({
    value: location.id,
    label: location.display_name,
  })) || [];

  const hasActiveFilters = selectedIndustryId !== undefined || selectedLocationId !== undefined;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        {/* Industry Filter */}
        <div className="flex-1 w-full md:w-auto">
          <label htmlFor="industry-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Industria
          </label>
          <Select
            options={industryOptions}
            value={selectedIndustryId}
            onChange={handleIndustryChange}
            placeholder="Todas las industrias"
            className="w-full"
          />
        </div>

        {/* Location Filter */}
        <div className="flex-1 w-full md:w-auto">
          <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación
          </label>
          <Select
            options={locationOptions}
            value={selectedLocationId}
            onChange={handleLocationChange}
            placeholder="Todas las ubicaciones"
            className="w-full"
          />
        </div>

        {/* Clear Filters Button */}
        <div className="w-full md:w-auto">
          <button
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            className={`
              w-full md:w-auto px-6 py-2 
              text-sm font-medium 
              rounded-lg 
              transition-colors
              ${hasActiveFilters
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
              }
            `.trim().replace(/\s+/g, " ")}
            aria-label="Limpiar filtros"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
