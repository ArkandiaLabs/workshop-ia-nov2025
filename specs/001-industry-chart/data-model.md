# Data Model: Gráfico de Empresas por Industria en Dashboard

**Feature**: 001-industry-chart  
**Date**: 2025-11-18  
**Purpose**: Definir schemas, tipos y contratos de datos para backend y frontend

## Backend Schemas (Pydantic)

### IndustryStatItem

Representa una industria con su conteo de empresas y porcentaje del total.

```python
# File: src/backend/schemas/industry_stats.py

from pydantic import BaseModel, Field

class IndustryStatItem(BaseModel):
    """
    Single industry statistics item.
    
    Attributes:
        id: Unique identifier of the industry
        name: Display name of the industry (e.g., "Software", "E-commerce")
        company_count: Number of companies in this industry
        percentage: Percentage of total companies (0-100, with 2 decimal precision)
    """
    id: int = Field(..., description="Industry unique identifier", gt=0)
    name: str = Field(..., description="Industry name", min_length=1, max_length=100)
    company_count: int = Field(..., description="Number of companies", ge=0)
    percentage: float = Field(
        ..., 
        description="Percentage of total companies (0-100)", 
        ge=0.0, 
        le=100.0
    )

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Software",
                "company_count": 42,
                "percentage": 35.25
            }
        }
```

### IndustryStatsResponse

Response completa del endpoint `/api/v1/industries/stats`.

```python
# File: src/backend/schemas/industry_stats.py

from pydantic import BaseModel, Field

class IndustryStatsResponse(BaseModel):
    """
    Response for industry statistics endpoint.
    
    Contains list of industries with their company counts, sorted by count descending.
    Includes metadata about total companies and industries.
    """
    stats: list[IndustryStatItem] = Field(
        ..., 
        description="List of industries with stats, sorted by company_count DESC"
    )
    total_companies: int = Field(
        ..., 
        description="Total number of companies across all industries", 
        ge=0
    )
    total_industries: int = Field(
        ..., 
        description="Number of unique industries with at least 1 company", 
        ge=0
    )

    class Config:
        json_schema_extra = {
            "example": {
                "stats": [
                    {
                        "id": 1,
                        "name": "Software",
                        "company_count": 42,
                        "percentage": 35.25
                    },
                    {
                        "id": 2,
                        "name": "E-commerce",
                        "company_count": 30,
                        "percentage": 25.21
                    },
                    {
                        "id": 3,
                        "name": "Fintech",
                        "company_count": 28,
                        "percentage": 23.53
                    }
                ],
                "total_companies": 119,
                "total_industries": 8
            }
        }
```

---

## Frontend Types (TypeScript)

### IndustryStatItem

Interface TypeScript equivalente al schema Pydantic.

```typescript
// File: src/frontend/lib/types.ts (extend existing file)

/**
 * Single industry statistics item
 */
export interface IndustryStatItem {
  /** Industry unique identifier */
  id: number
  /** Industry display name */
  name: string
  /** Number of companies in this industry */
  company_count: number
  /** Percentage of total companies (0-100) */
  percentage: number
}
```

### IndustryStatsResponse

Response type del endpoint.

```typescript
// File: src/frontend/lib/types.ts (extend existing file)

/**
 * Response from /api/v1/industries/stats endpoint
 */
export interface IndustryStatsResponse {
  /** List of industries with statistics, sorted by company_count DESC */
  stats: IndustryStatItem[]
  /** Total number of companies across all industries */
  total_companies: number
  /** Number of unique industries with at least 1 company */
  total_industries: number
}
```

### IndustryChartProps

Props para el componente del gráfico.

```typescript
// File: src/frontend/components/IndustryChart.tsx

/**
 * Props for IndustryChart component
 */
export interface IndustryChartProps {
  /** Industry statistics data to display */
  data: IndustryStatItem[]
  /** Total number of companies (for context) */
  totalCompanies: number
  /** Optional: className for styling */
  className?: string
  /** Optional: loading state */
  isLoading?: boolean
  /** Optional: error state */
  error?: string | null
}
```

---

## Database Entities (Existing)

### Industry (existing table)

**Note**: Esta tabla ya existe en la base de datos. No se modifica.

```sql
-- Table: industries (EXISTING - NO CHANGES)
CREATE TABLE industries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);
```

**Attributes**:
- `id`: Primary key, auto-increment
- `name`: Industry name, unique constraint

### Company (existing table)

**Note**: Esta tabla ya existe. No se modifica, solo se lee para agregación.

```sql
-- Table: companies (EXISTING - NO CHANGES)
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry_id INTEGER REFERENCES industries(id),
    -- ... other fields
);
```

**Relevant Attributes for this feature**:
- `id`: Primary key
- `industry_id`: Foreign key to industries table (used for GROUP BY)

---

## Data Flow

### Request Flow

```
User Browser
    ↓ (HTTP GET)
Next.js Frontend (Server Component)
    ↓ (fetch to /api/v1/industries/stats?location_id=1)
FastAPI Backend Router (api/industries.py)
    ↓ (inject IndustryStatsService)
IndustryStatsService (services/industry_stats_service.py)
    ↓ (call repository.get_stats())
IndustryStatsRepository (repositories/industry_stats_repository.py)
    ↓ (SQL query with GROUP BY)
Supabase/PostgreSQL Database
    ↓ (raw results)
IndustryStatsRepository
    ↓ (transform to IndustryStatItem list)
IndustryStatsService
    ↓ (calculate percentages, validate)
FastAPI Backend Router
    ↓ (return IndustryStatsResponse)
Next.js Frontend (Server Component)
    ↓ (render IndustryChart with data)
User Browser (sees chart)
```

### Response Flow Example

**SQL Query Result** (from Supabase):
```json
[
  { "id": 1, "name": "Software", "company_count": 42 },
  { "id": 2, "name": "E-commerce", "company_count": 30 },
  { "id": 3, "name": "Fintech", "company_count": 28 }
]
```

**After Repository Processing**:
```python
# List[IndustryStatItem] (percentages calculated)
[
  IndustryStatItem(id=1, name="Software", company_count=42, percentage=35.25),
  IndustryStatItem(id=2, name="E-commerce", company_count=30, percentage=25.21),
  IndustryStatItem(id=3, name="Fintech", company_count=28, percentage=23.53)
]
```

**API Response** (IndustryStatsResponse):
```json
{
  "stats": [
    { "id": 1, "name": "Software", "company_count": 42, "percentage": 35.25 },
    { "id": 2, "name": "E-commerce", "company_count": 30, "percentage": 25.21 },
    { "id": 3, "name": "Fintech", "company_count": 28, "percentage": 23.53 }
  ],
  "total_companies": 119,
  "total_industries": 8
}
```

**Frontend Data** (passed to chart):
```typescript
const chartData: IndustryStatItem[] = response.stats
// Recharts consume directamente este formato
```

---

## Validation Rules

### Backend (Pydantic)

- `id`: Must be positive integer (`gt=0`)
- `name`: Non-empty string, max 100 chars
- `company_count`: Non-negative integer (`ge=0`)
- `percentage`: Float between 0.0 and 100.0 (`ge=0.0`, `le=100.0`)
- `stats`: Cannot be null, can be empty list `[]`
- `total_companies`: Non-negative integer
- `total_industries`: Non-negative integer

### Frontend (Runtime checks)

```typescript
// Ejemplo de validación en componente
function validateIndustryStats(data: IndustryStatsResponse): boolean {
  if (!data || !Array.isArray(data.stats)) return false
  if (data.total_companies < 0 || data.total_industries < 0) return false
  
  // Validar cada item
  return data.stats.every(item => 
    item.id > 0 &&
    item.name.length > 0 &&
    item.company_count >= 0 &&
    item.percentage >= 0 &&
    item.percentage <= 100
  )
}
```

---

## Edge Cases Handling

### Empty Data

**Scenario**: No hay empresas en la base de datos.

**Backend Response**:
```json
{
  "stats": [],
  "total_companies": 0,
  "total_industries": 0
}
```

**Frontend Behavior**: Mostrar mensaje "No hay datos disponibles"

### Single Industry

**Scenario**: Todas las empresas están en una sola industria.

**Backend Response**:
```json
{
  "stats": [
    { "id": 1, "name": "Software", "company_count": 100, "percentage": 100.0 }
  ],
  "total_companies": 100,
  "total_industries": 1
}
```

**Frontend Behavior**: Mostrar gráfico con una sola barra al 100%

### Filtered Results

**Scenario**: Usuario filtra por location_id y solo quedan 2 industrias.

**Request**: `GET /api/v1/industries/stats?location_id=5`

**Backend Response**:
```json
{
  "stats": [
    { "id": 3, "name": "Fintech", "company_count": 15, "percentage": 60.0 },
    { "id": 7, "name": "Healthcare", "company_count": 10, "percentage": 40.0 }
  ],
  "total_companies": 25,
  "total_industries": 2
}
```

**Frontend Behavior**: Mostrar solo estas 2 industrias en el gráfico

---

## Type Safety Guarantees

### Backend → Frontend Contract

- **Pydantic validation**: Garantiza que todos los campos cumplen constraints antes de serializar
- **OpenAPI schema**: Auto-generado por FastAPI, documenta contrato exacto
- **TypeScript types**: Espejo exacto de schemas Pydantic para type checking en compilación

### Compile-time Checks

```typescript
// TypeScript previene uso incorrecto en compilación
const stats: IndustryStatsResponse = await fetchIndustryStats()

// ✅ OK - field exists
console.log(stats.total_companies)

// ❌ ERROR - Property 'invalid_field' does not exist
console.log(stats.invalid_field)

// ✅ OK - correct type
const firstStat: IndustryStatItem = stats.stats[0]

// ❌ ERROR - Type mismatch
const wrongType: string = stats.stats[0]  // Cannot assign IndustryStatItem to string
```

---

## Summary

- **Backend**: 2 Pydantic schemas (`IndustryStatItem`, `IndustryStatsResponse`)
- **Frontend**: 3 TypeScript interfaces (`IndustryStatItem`, `IndustryStatsResponse`, `IndustryChartProps`)
- **Database**: 0 new tables (usa `industries` y `companies` existentes)
- **Validation**: Pydantic constraints + TypeScript type checking
- **Data flow**: Unidireccional Backend → Frontend, sin caché
