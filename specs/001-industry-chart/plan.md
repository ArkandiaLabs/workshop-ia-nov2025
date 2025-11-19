# Implementation Plan: Gráfico de Empresas por Industria en Dashboard

**Branch**: `001-industry-chart` | **Date**: 2025-11-18 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-industry-chart/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Agregar un componente de gráfico visual al dashboard existente que muestre la distribución de empresas SaaS agrupadas por industria. El gráfico debe ser interactivo (tooltips con detalles), responsive (mobile-first), y obtener datos en tiempo real sin caché. La feature se implementa en 3 user stories independientes: (P1) visualización básica del gráfico, (P2) tooltips interactivos, (P3) responsive design para móviles.

**Enfoque técnico**: Backend crea nuevo endpoint REST para agregación de datos por industria; Frontend usa Server Component con librería de gráficos (Recharts) para renderizado, con Client Component solo para interactividad. Sin caché en ninguna capa según requisito explícito del usuario.

## Technical Context

**Language/Version**: Python 3.12+ (backend), TypeScript/ES2022+ (frontend)  
**Primary Dependencies**: 
  - Backend: FastAPI 0.109+, Pydantic 2.5+, Supabase Python client
  - Frontend: Next.js 15+ (App Router), React 19+, Recharts 2.10+ (o similar), Tailwind CSS
**Storage**: PostgreSQL via Supabase (lectura de tablas `companies` e `industries` existentes)  
**Testing**: 
  - Backend: pytest con TestClient de FastAPI
  - Frontend: Vitest/Jest con React Testing Library
**Target Platform**: Web application (navegadores modernos: Chrome, Firefox, Safari, Edge últimas 2 versiones)  
**Project Type**: Web (frontend + backend ya existentes, solo agregar feature)  
**Performance Goals**: 
  - Endpoint de agregación: <1 segundo con 1000+ empresas
  - Renderizado inicial del gráfico: <3 segundos después de cargar dashboard
  - Tooltips: respuesta <100ms al hover
**Constraints**: 
  - NO implementar caché (requisito explícito del usuario)
  - Datos en tiempo real en cada request
  - Responsive: 320px (mobile) hasta 2560px (4K)
  - Mantener arquitectura por capas existente (Router→Service→Repository)
**Scale/Scope**: 
  - ~50-100 empresas actuales, preparado para 1000+
  - ~10-20 industrias únicas
  - 1 nuevo endpoint backend
  - 2-3 componentes frontend nuevos
  - Estimado: ~500-800 líneas de código total (respetando límite de 500 líneas por archivo)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Arquitectura por Capas (NON-NEGOTIABLE)
**Status**: PASS  
**Backend**: Se creará nuevo endpoint siguiendo Router→Service→Repository→Database. Sin lógica en router.  
**Frontend**: Se usarán Server Components para data fetching, Client Components solo para interactividad (tooltips). API client centralizado en `lib/`.

### ✅ II. Testing Obligatorio (NON-NEGOTIABLE)
**Status**: PASS  
**Plan**: Cada capa tendrá tests (happy path + edge case + error):
- Backend: pytest para endpoint, service y repository
- Frontend: Vitest/Jest para componentes de gráfico
- Target coverage: ≥60%

### ✅ III. Modularidad y Límite de Tamaño
**Status**: PASS  
**Plan**: 
- Backend: ~4 archivos (<150 líneas cada uno): router, service, repository, schema
- Frontend: ~3 archivos (<200 líneas cada uno): componente gráfico, hook de datos, tipos
- Ningún archivo excederá 500 líneas

### ✅ IV. Type Safety Obligatorio
**Status**: PASS  
**Backend**: Type hints en todas las funciones, Pydantic para schemas, mypy strict  
**Frontend**: Tipos explícitos para props/estados, interfaces para respuestas de API, sin `any`

### ✅ V. Convenciones de Nombres Consistentes
**Status**: PASS  
**Backend**: `snake_case` (funciones/vars), `PascalCase` (schemas), nombres descriptivos  
**Frontend**: `camelCase` (funciones/vars), `PascalCase` (componentes), prefijo `use` para hooks

### ✅ VI. Imports y Estructura de Archivos
**Status**: PASS  
**Backend**: Imports absolutos, agrupados (stdlib, third-party, local)  
**Frontend**: Alias `@/components`, `@/lib`, sin imports relativos profundos

### 🔍 Security Check
**Status**: PASS  
- Sin credenciales hardcodeadas
- Variables de entorno para configuración
- Validación de entrada en endpoint
- CORS ya configurado en proyecto existente

### 🔍 Performance Check
**Status**: PASS (with note)  
- Backend: async/await para I/O
- **NO CACHE** según requisito explícito del usuario (trade-off aceptado)
- Frontend: Server Components por defecto, lazy loading si es necesario

### 📋 Summary
**ALL GATES PASSED** ✅  
No violations detected. Ready to proceed to Phase 0 (Research).

## Project Structure

### Documentation (this feature)

```text
specs/001-industry-chart/
├── spec.md              # Feature specification (DONE)
├── plan.md              # This file (IN PROGRESS)
├── research.md          # Phase 0 output (PENDING)
├── data-model.md        # Phase 1 output (PENDING)
├── quickstart.md        # Phase 1 output (PENDING)
├── contracts/           # Phase 1 output (PENDING)
│   └── industry-stats-endpoint.yaml  # OpenAPI spec for new endpoint
├── checklists/
│   └── requirements.md  # Quality validation (DONE)
└── tasks.md             # Phase 2 output - NOT created by /speckit.plan (PENDING)
```

### Source Code (repository root)

**Project Type**: Web application (existing `src/backend/` and `src/frontend/`)

```text
src/backend/
├── api/
│   ├── __init__.py
│   ├── health.py                    # Existing
│   ├── companies.py                 # Existing
│   ├── industries.py                # Existing - WILL EXTEND
│   └── locations.py                 # Existing
├── services/
│   ├── __init__.py
│   └── industry_stats_service.py    # NEW - Business logic for aggregation
├── repositories/
│   ├── __init__.py
│   └── industry_stats_repository.py # NEW - Data access for aggregations
├── schemas/
│   ├── __init__.py
│   └── industry_stats.py            # NEW - IndustryStatsResponse, IndustryStatItem
├── core/
│   ├── __init__.py
│   ├── config.py                    # Existing
│   └── database.py                  # Existing
└── tests/
    ├── api/
    │   └── test_industry_stats.py   # NEW - Tests for endpoint
    ├── services/
    │   └── test_industry_stats_service.py  # NEW - Tests for service
    └── repositories/
        └── test_industry_stats_repository.py  # NEW - Tests for repository

src/frontend/
├── app/
│   └── page.tsx                     # Existing dashboard - WILL EXTEND
├── components/
│   ├── BackendStatus.tsx            # Existing
│   ├── IndustryChart.tsx            # NEW - Main chart component (Client Component)
│   └── IndustryChartContainer.tsx   # NEW - Data fetching wrapper (Server Component)
├── lib/
│   ├── api.ts                       # Existing - WILL EXTEND
│   └── types.ts                     # Existing - WILL EXTEND with IndustryStatsData
├── hooks/
│   └── useIndustryStats.ts          # NEW - Custom hook for chart data (if needed)
└── __tests__/
    ├── components/
    │   ├── IndustryChart.test.tsx   # NEW - Tests for chart component
    │   └── IndustryChartContainer.test.tsx  # NEW - Tests for container
    └── hooks/
        └── useIndustryStats.test.ts # NEW - Tests for custom hook
```

**Structure Decision**: 

Esta feature extiende la aplicación web existente (opción 2: Web application). Se mantiene la separación backend/frontend con arquitectura por capas:

- **Backend**: Patrón Router→Service→Repository. Se extiende `api/industries.py` con nuevo endpoint `/api/v1/industries/stats` o se crea router dedicado si crece mucho. Se crean service y repository nuevos para lógica de agregación.

- **Frontend**: Se agregan 2-3 componentes en `components/`, se extiende API client en `lib/api.ts`, y se integra en dashboard existente (`app/page.tsx`). Se usa Server Component para fetching inicial, Client Component solo para interactividad del gráfico.

- **Tests**: Estructura paralela a código fuente en ambos proyectos, manteniendo convención existente.

**Key Files to Modify**:
- `src/backend/api/industries.py` - agregar endpoint stats
- `src/frontend/app/page.tsx` - integrar componente de gráfico
- `src/frontend/lib/api.ts` - agregar función para obtener stats

**Key Files to Create**:
- Backend: 3 archivos nuevos (service, repository, schema)
- Frontend: 2-3 archivos nuevos (componentes + tipos)
- Tests: ~6 archivos nuevos de tests

## Complexity Tracking

> **No violations detected - this section is empty per constitution requirements**

All constitution checks passed. No complexity justifications needed.

---

## Post-Design Constitution Re-Check

*Re-evaluation after Phase 1 design (research, data-model, contracts)*

### ✅ I. Arquitectura por Capas (NON-NEGOTIABLE)
**Status**: PASS (Confirmed)  
**Design compliance**:
- Backend: Router (`api/industries.py` extendido) → Service (`services/industry_stats_service.py`) → Repository (`repositories/industry_stats_repository.py`) → Database (Supabase)
- Frontend: Server Component (`IndustryChartContainer.tsx`) para fetching → Client Component (`IndustryChart.tsx`) solo para interactividad → API client (`lib/api.ts`) → Types (`lib/types.ts`)
- Schemas separados: `schemas/industry_stats.py` en backend, interfaces TypeScript en `lib/types.ts`

### ✅ II. Testing Obligatorio (NON-NEGOTIABLE)
**Status**: PASS (Confirmed)  
**Test plan detailed**:
- Backend: 3 archivos de tests (`test_industry_stats.py` en api/, services/, repositories/)
- Frontend: 3 archivos de tests (`IndustryChart.test.tsx`, `IndustryChartContainer.test.tsx`, `useIndustryStats.test.ts`)
- Coverage target: ≥60% (manteniendo estándar actual del proyecto)

### ✅ III. Modularidad y Límite de Tamaño
**Status**: PASS (Confirmed)  
**File size estimates**:
- Backend schemas: ~80 líneas (`schemas/industry_stats.py`)
- Backend service: ~100-120 líneas (`services/industry_stats_service.py`)
- Backend repository: ~120-150 líneas (`repositories/industry_stats_repository.py`)
- Backend router extension: +40-50 líneas en `api/industries.py` (actualmente ~150, total ~200)
- Frontend IndustryChart: ~150-180 líneas (componente principal)
- Frontend IndustryChartContainer: ~80-100 líneas (wrapper)
- Frontend types: +30 líneas en `lib/types.ts`
- **Todos los archivos <500 líneas** ✅

### ✅ IV. Type Safety Obligatorio
**Status**: PASS (Confirmed)  
**Type coverage**:
- Backend: Pydantic schemas con constraints (`Field` validators), mypy strict compliant
- Frontend: TypeScript interfaces con tipos explícitos, sin `any`, enums para estados
- API contract: OpenAPI 3.1 spec auto-generado por FastAPI

### ✅ V. Convenciones de Nombres Consistentes
**Status**: PASS (Confirmed)  
**Naming verified**:
- Backend: `industry_stats_service.py`, `get_stats()`, `IndustryStatItem` (PascalCase)
- Frontend: `IndustryChart.tsx`, `useIndustryStats.ts` (hook prefix), `IndustryStatItem` interface
- Consistente con estándares existentes del proyecto

### ✅ VI. Imports y Estructura de Archivos
**Status**: PASS (Confirmed)  
**Import organization**:
- Backend: Imports absolutos (`from schemas.industry_stats import ...`), agrupados
- Frontend: Alias `@/components`, `@/lib` para imports limpios

### 🔍 Security Check (Post-Design)
**Status**: PASS (Confirmed)  
- Sin hardcoded credentials en ningún archivo
- Endpoint de solo lectura (GET), sin mutaciones peligrosas
- Input validation con Pydantic (query params)
- CORS ya configurado en `main.py`

### 🔍 Performance Check (Post-Design)
**Status**: PASS (Confirmed with trade-offs documented)  
**Design decisions**:
- Backend: SQL query con GROUP BY optimizado, async/await para I/O
- Frontend: Server Component para initial fetch reduce JavaScript client-side
- **NO CACHE**: Trade-off aceptado según requisito explícito (data siempre fresh)
- Recharts lazy loading automático de gráfico (solo renderiza elementos visibles)

### 🔍 Dependencies Check (Post-Design)
**Status**: PASS (Confirmed)  
**New dependencies justified**:
- `recharts@^2.10.0`: Necesario para visualización de gráficos, bien mantenido, 100KB gzipped (aceptable)
- Sin nuevas dependencias en backend (usa Supabase client existente)

### 📋 Post-Design Summary
**ALL GATES PASSED** ✅  
Design detallado cumple con todos los principios de la constitución. No se detectaron violaciones. Ready para Phase 2 (`/speckit.tasks`).
