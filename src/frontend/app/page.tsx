"use client";

import { useState } from "react";
import { CompanyFilters, CompanyTable, BackendStatus } from "@/components";
import { useCompanies } from "@/hooks";

/**
 * Main Page Component
 * 
 * Displays the Top SaaS Analytics Platform with:
 * - Header with title and logo placeholder
 * - Filter section (industry and location)
 * - Results indicator showing number of companies
 * - Company table with all data
 * - Footer with backend status
 */
export default function Home() {
  const [selectedIndustryId, setSelectedIndustryId] = useState<number | undefined>(undefined);
  const [selectedLocationId, setSelectedLocationId] = useState<number | undefined>(undefined);

  // Fetch companies with current filters
  const { companies, loading, error } = useCompanies({
    industryId: selectedIndustryId,
    locationId: selectedLocationId,
  });

  /**
   * Handler for filter changes
   * Updates state which triggers automatic refetch via useCompanies hook
   */
  const handleFilterChange = (filters: { industryId?: number; locationId?: number }) => {
    setSelectedIndustryId(filters.industryId);
    setSelectedLocationId(filters.locationId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            {/* Logo Placeholder */}
            <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Logo Top SaaS Analytics"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Top SaaS Analytics</h1>
              <p className="text-sm text-gray-600 mt-1">
                Análisis de las 100 empresas SaaS más destacadas
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <section className="mb-6">
          <CompanyFilters onFilterChange={handleFilterChange} />
        </section>

        {/* Results Indicator */}
        <section className="mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    role="status"
                    aria-label="Cargando"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Cargando empresas...
                </span>
              ) : error ? (
                <span className="text-red-600">Error al cargar empresas</span>
              ) : (
                <>
                  Mostrando <span className="font-semibold">{companies?.length || 0}</span>{" "}
                  {companies?.length === 1 ? "empresa" : "empresas"}
                  {(selectedIndustryId || selectedLocationId) && (
                    <span className="text-gray-500 ml-1">(filtradas)</span>
                  )}
                </>
              )}
            </p>
          </div>
        </section>

        {/* Company Table Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200">
          <CompanyTable companies={companies || []} loading={loading} error={error} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <BackendStatus />
            <p className="text-xs text-gray-500">
              © 2025 Top SaaS Analytics • Workshop IA Nov 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
