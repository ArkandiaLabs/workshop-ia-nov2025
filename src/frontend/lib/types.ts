/**
 * Health check response from backend API
 */
export interface HealthResponse {
  status: "healthy" | "unhealthy";
  version: string;
  environment: string;
  timestamp: string;
}

/**
 * Industry entity
 */
export interface Industry {
  id: number;
  name: string;
}

/**
 * Location entity
 */
export interface Location {
  id: number;
  city: string;
  country: string;
  display_name: string;
}

/**
 * Company entity with nested relations
 */
export interface Company {
  id: number;
  name: string;
  industry: Industry;
  location: Location;
  products: string | null;
  founding_year: number | null;
  total_funding: number | null;
  arr: number | null;
  valuation: number | null;
  employees: number | null;
  g2_rating: number | null;
}

/**
 * Response for company list endpoint
 */
export interface CompanyListResponse {
  companies: Company[];
  total: number;
  filters_applied: Record<string, any>;
}

/**
 * Response for industry list endpoint
 */
export interface IndustryListResponse {
  industries: Industry[];
  total: number;
}

/**
 * Response for location list endpoint
 */
export interface LocationListResponse {
  locations: Location[];
  total: number;
}
