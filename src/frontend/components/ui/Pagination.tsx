"use client";

import React from "react";

/**
 * Props for Pagination component
 */
export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

/**
 * Pagination component for navigating through paginated data
 * 
 * Features:
 * - Previous/Next buttons
 * - Page number buttons with ellipsis for many pages
 * - Responsive design with Tailwind CSS
 * - Accessible with proper aria-labels
 * 
 * @example
 * <Pagination
 *   currentPage={1}
 *   totalItems={100}
 *   itemsPerPage={15}
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 */
export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxVisiblePages = 7,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Don't render if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  /**
   * Generate array of page numbers to display
   * Shows first page, last page, current page, and pages around current
   * Uses ellipsis (...) for gaps
   */
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const leftSiblingIndex = Math.max(currentPage - 1, 2);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages - 1);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        // Show more pages on the left
        const leftItemCount = 3;
        for (let i = 2; i <= leftItemCount + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        // Show more pages on the right
        pages.push("...");
        const rightItemCount = 3;
        for (let i = totalPages - rightItemCount; i < totalPages; i++) {
          pages.push(i);
        }
      } else if (shouldShowLeftDots && shouldShowRightDots) {
        // Show pages around current with dots on both sides
        pages.push("...");
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pages.push(i);
        }
        pages.push("...");
      } else {
        // Show all middle pages
        for (let i = 2; i < totalPages; i++) {
          pages.push(i);
        }
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
      aria-label="Paginación"
    >
      {/* Mobile: Simple Previous/Next */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className={`
            relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
            ${canGoPrevious
              ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            }
          `}
          aria-label="Página anterior"
        >
          Anterior
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={`
            relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
            ${canGoNext
              ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            }
          `}
          aria-label="Página siguiente"
        >
          Siguiente
        </button>
      </div>

      {/* Desktop: Full pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando{" "}
            <span className="font-medium">
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
            </span>{" "}
            a{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            de <span className="font-medium">{totalItems}</span> resultados
          </p>
        </div>

        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Paginación"
          >
            {/* Previous button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!canGoPrevious}
              className={`
                relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300
                focus:z-20 focus:outline-offset-0
                ${canGoPrevious
                  ? "text-gray-400 hover:bg-gray-50 focus:outline-2 focus:outline-blue-600"
                  : "text-gray-300 cursor-not-allowed bg-gray-50"
                }
              `}
              aria-label="Página anterior"
            >
              <span className="sr-only">Anterior</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Page numbers */}
            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                  >
                    ...
                  </span>
                );
              }

              const pageNumber = page as number;
              const isActive = pageNumber === currentPage;

              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`
                    relative inline-flex items-center px-4 py-2 text-sm font-semibold
                    ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0
                    ${isActive
                      ? "z-10 bg-blue-600 text-white focus:outline-2 focus:outline-blue-600"
                      : "text-gray-900 hover:bg-gray-50 focus:outline-2 focus:outline-blue-600"
                    }
                  `}
                  aria-label={`Ir a página ${pageNumber}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canGoNext}
              className={`
                relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300
                focus:z-20 focus:outline-offset-0
                ${canGoNext
                  ? "text-gray-400 hover:bg-gray-50 focus:outline-2 focus:outline-blue-600"
                  : "text-gray-300 cursor-not-allowed bg-gray-50"
                }
              `}
              aria-label="Página siguiente"
            >
              <span className="sr-only">Siguiente</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </nav>
  );
}
