import React from "react";

/**
 * Props for LoadingSpinner component
 */
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Loading spinner component with animation
 * Displays a circular spinning animation to indicate loading state
 * 
 * @example
 * <LoadingSpinner size="md" />
 * <LoadingSpinner size="lg" className="my-4" />
 */
export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div
        className={`
          ${sizeClasses[size]}
          animate-spin 
          rounded-full 
          border-gray-200 
          border-t-blue-600
        `.trim().replace(/\s+/g, " ")}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
