"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/Table";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { formatCurrency, truncateText } from "@/lib/utils";
import type { Company } from "@/lib/types";

/**
 * Props for CompanyTable component
 */
export interface CompanyTableProps {
  companies: Company[];
  loading: boolean;
  error: Error | null;
}

/**
 * Company table component displaying SaaS companies data
 * Shows a responsive table with sticky header and hover effects
 * Matches the UI design with proper formatting for currency and text
 * 
 * @example
 * <CompanyTable 
 *   companies={companies} 
 *   loading={false} 
 *   error={null} 
 * />
 */
export function CompanyTable({ companies, loading, error }: CompanyTableProps) {
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Cargando empresas...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <div className="text-red-600 mb-2">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Error al cargar datos
        </h3>
        <p className="text-red-700">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Empty state
  if (companies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No se encontraron empresas
        </h3>
        <p className="text-gray-600">
          Intenta cambiar los filtros para ver más resultados
        </p>
      </div>
    );
  }

  // Table with data
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Industria</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Año Fundación</TableHead>
              <TableHead>Inversión Total</TableHead>
              <TableHead>ARR</TableHead>
              <TableHead>Valoración</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <span className="font-medium text-gray-900">
                    {company.name}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600 text-sm">
                    {company.industry.name}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600 text-sm">
                    {company.location.city}, {company.location.country}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600 text-sm">
                    {company.products
                      ? truncateText(company.products, 40)
                      : "-"}
                  </span>
                </TableCell>
                <TableCell align="center">
                  <span className="text-gray-600 text-sm">
                    {company.founding_year || "-"}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(company.total_funding)}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(company.arr)}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <span className="text-blue-600 font-medium">
                    {formatCurrency(company.valuation)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Results summary footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Mostrando <span className="font-medium text-gray-900">1</span> a{" "}
          <span className="font-medium text-gray-900">{companies.length}</span> de{" "}
          <span className="font-medium text-gray-900">{companies.length}</span> empresas
        </p>
      </div>
    </div>
  );
}
