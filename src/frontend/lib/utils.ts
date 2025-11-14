/**
 * Format a numeric value as currency with appropriate suffixes
 * @param value - The numeric value to format (in USD)
 * @returns Formatted currency string with suffix (T, B, M, K) or "N/A" if null
 * @example
 * formatCurrency(1500000000000) // "$1.5T"
 * formatCurrency(2500000000) // "$2.5B"
 * formatCurrency(45000000) // "$45.0M"
 * formatCurrency(500000) // "$500K"
 * formatCurrency(5000) // "$5,000"
 * formatCurrency(null) // "N/A"
 */
export function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) {
    return "N/A";
  }

  // Trillion (1,000,000,000,000+)
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
  }

  // Billion (1,000,000,000+)
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }

  // Million (1,000,000+)
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  // Thousand (1,000+)
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }

  // Below 1,000
  return `$${value.toLocaleString("en-US")}`;
}

/**
 * Format location as "City, Country"
 * @param city - City name
 * @param country - Country name
 * @returns Formatted location string
 * @example
 * formatLocation("San Francisco", "USA") // "San Francisco, USA"
 */
export function formatLocation(city: string, country: string): string {
  return `${city}, ${country}`;
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with "..." if exceeds maxLength, otherwise original text
 * @example
 * truncateText("This is a very long text", 10) // "This is a ..."
 * truncateText("Short", 10) // "Short"
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Combine CSS class names (utility for Tailwind)
 * Filters out falsy values and joins with spaces
 * @param classes - Array of class names (can include undefined, null, false)
 * @returns Combined class string
 * @example
 * cn("text-blue-500", undefined, "font-bold") // "text-blue-500 font-bold"
 * cn("p-4", false && "hidden", "m-2") // "p-4 m-2"
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
