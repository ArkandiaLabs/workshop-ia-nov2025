# Descripción General

**Top SaaS Analytics Platform** es una aplicación full-stack diseñada para inversionistas que desean analizar y evaluar métricas de las empresas SaaS más importantes del mundo. La plataforma proporciona un dashboard interactivo con visualización de datos financieros, operacionales y de mercado de 100 empresas SaaS líderes.

## Problema que resuelve
Los inversionistas necesitan una forma rápida y eficiente de evaluar y comparar empresas SaaS basándose en métricas clave como valoración, ingresos anuales recurrentes (ARR), total de inversión, industria y ubicación geográfica. Actualmente, esta información está dispersa y requiere consolidación manual.

## Valor para el usuario
- **Visibilidad centralizada**: Acceso a métricas de 100 empresas SaaS en un solo lugar
- **Análisis comparativo**: Capacidad de filtrar y comparar empresas por industria y ubicación
- **Toma de decisiones informada**: Datos estructurados y normalizados para análisis de inversión
- **Eficiencia**: Interfaz intuitiva que reduce el tiempo de investigación

## Usuario objetivo
- **Perfil primario**: Inversionistas VC/PE analizando oportunidades en el sector SaaS
- **Perfil secundario**: Analistas financieros, emprendedores investigando el mercado SaaS

---

# Funcionalidades Principales

## 1. Listado de empresas SaaS
**Qué hace:** Muestra un listado completo de 100 empresas SaaS con sus métricas clave en formato de tabla.

**Por qué es importante:** Es la funcionalidad core que permite a los inversionistas ver de un vistazo las empresas disponibles y sus datos principales. El formato tabular facilita la comparación directa de métricas entre empresas.

**Cómo funciona:**
- El frontend solicita todas las empresas al backend mediante `GET /api/v1/companies`
- El backend consulta la base de datos con JOINs a `industry` y `location`
- Se retornan las 100 empresas con datos completos (sin paginación)
- El frontend renderiza los datos en una tabla HTML responsive

**Campos visualizados (en orden):**
1. Nombre de la empresa
2. Industria (nombre de la categoría)
3. Ubicación (formato: "Ciudad, País")
4. Productos/Servicios (texto separado por comas)
5. Año de fundación
6. Total de inversión (en formato USD, "N/A" si NULL)
7. Ingresos anuales recurrentes - ARR (en formato USD, "N/A" si NULL)
8. Valoración (en formato USD, "N/A" si NULL)

## 2. Filtro por industria
**Qué hace:** Permite filtrar el listado de empresas seleccionando una o múltiples industrias de un dropdown.

**Por qué es importante:** Los inversionistas suelen especializarse en sectores específicos (ej: CRM, E-commerce, Fintech) y necesitan enfocarse en empresas relevantes.

**Cómo funciona:**
- El frontend obtiene la lista de industrias mediante `GET /api/v1/industries`
- Se muestra un select/dropdown con todas las industrias disponibles
- Al seleccionar una industria, se envía query parameter: `GET /api/v1/companies?industry_id={id}`
- El backend filtra usando `WHERE company.industry_id = {id}` en SQL
- El listado se actualiza mostrando solo empresas de esa industria

## 3. Filtro por ubicación
**Qué hace:** Permite filtrar el listado de empresas seleccionando una ubicación geográfica de un dropdown.

**Por qué es importante:** Los inversionistas pueden enfocarse en mercados geográficos específicos (ej: Silicon Valley, Europa, Asia).

**Cómo funciona:**
- El frontend obtiene la lista de ubicaciones mediante `GET /api/v1/locations`
- Se muestra un select/dropdown con todas las ubicaciones disponibles (formato: "Ciudad, País")
- Al seleccionar una ubicación, se envía query parameter: `GET /api/v1/companies?location_id={id}`
- El backend filtra usando `WHERE company.location_id = {id}` en SQL
- El listado se actualiza mostrando solo empresas de esa ubicación

## 4. Filtros combinados
**Qué hace:** Permite aplicar filtros de industria y ubicación simultáneamente.

**Por qué es importante:** Habilita análisis más granulares (ej: "Empresas de CRM en San Francisco").

**Cómo funciona:**
- Los filtros son independientes y combinables
- Query con ambos parámetros: `GET /api/v1/companies?industry_id={id}&location_id={id}`
- El backend aplica ambos filtros con `WHERE industry_id = X AND location_id = Y`
- Si no hay empresas que cumplan ambos criterios, se muestra mensaje vacío

## 5. Health check del backend
**Qué hace:** Endpoint para verificar el estado del servidor API.

**Por qué es importante:** Permite monitoreo de disponibilidad y debugging durante desarrollo.

**Cómo funciona:**
- Endpoint `GET /api/v1/health` retorna status del servidor
- Respuesta: `{"status": "healthy", "version": "1.0.0", "environment": "development"}`
- El frontend puede mostrar un indicador de conectividad

---

# Experiencia de Usuario

## Perfiles de usuario

### Inversionista VC/PE (Usuario primario)
**Contexto:** Analiza 10-20 empresas por día, busca patrones de inversión, compara métricas financieras.

**Necesidades:**
- Acceso rápido a datos financieros clave
- Capacidad de filtrar por sector e industria
- Visualización clara de métricas de valoración y ARR

**Casos de uso:**
- "Quiero ver todas las empresas de CRM en San Francisco con ARR > $1B"
- "¿Cuáles son las empresas más valoradas en E-commerce?"
- "Comparar empresas fundadas después de 2010"

### Analista financiero (Usuario secundario)
**Contexto:** Genera reportes de mercado, identifica tendencias, analiza competidores.

**Necesidades:**
- Datos estructurados y exportables
- Filtros múltiples para análisis segmentado
- Información de productos/servicios de cada empresa

---

## Flujos clave de usuario

### Flujo 1: Exploración general (Happy path)
1. Usuario accede a la URL del frontend (`http://localhost:3000`)
2. La página carga automáticamente el listado de 100 empresas
3. Usuario visualiza tabla con todas las métricas en columnas
4. Usuario scrollea verticalmente para explorar empresas

**Resultado esperado:** Visualización completa de empresas en <2 segundos

### Flujo 2: Filtrado por industria
1. Usuario ve dropdown "Filtrar por industria" con opciones cargadas
2. Usuario selecciona "CRM" del dropdown
3. El listado se actualiza mostrando solo empresas de CRM
4. Usuario ve indicador de "X empresas encontradas"

**Resultado esperado:** Filtrado instantáneo (<500ms), listado actualizado

### Flujo 3: Filtrado combinado
1. Usuario selecciona industria "E-commerce" del primer dropdown
2. Usuario selecciona ubicación "San Francisco, USA" del segundo dropdown
3. El listado se actualiza con empresas que cumplen ambos criterios
4. Usuario ve "Y empresas de E-commerce en San Francisco"

**Resultado esperado:** Filtrado combinado funcional, mensaje descriptivo si no hay resultados

### Flujo 4: Limpieza de filtros
1. Usuario tiene filtros aplicados
2. Usuario hace clic en "Limpiar filtros" o selecciona opción "Todos"
3. El listado vuelve a mostrar las 100 empresas

**Resultado esperado:** Restauración del estado inicial

---

## Consideraciones de UI/UX

### Layout y estructura
- **Header:** Logo + título "Top SaaS Analytics"
- **Barra de filtros:** Dropdowns para industria y ubicación (horizontal)
- **Listado principal:** Tabla HTML responsive con scroll horizontal
- **Footer:** Información de versión y estado del backend

### Responsividad
- **Desktop (>1024px):** Tabla completa con 8 columnas visibles
- **Tablet (768-1024px):** Tabla con scroll horizontal, todas las columnas disponibles
- **Mobile (<768px):** Tabla con scroll horizontal, priorizar columnas clave (nombre, industria, valoración)

### Estados de carga
- **Loading inicial:** Skeleton loaders o spinner mientras carga data
- **Loading de filtros:** Indicador visual al aplicar filtro
- **Estado vacío:** Mensaje "No se encontraron empresas con estos filtros"
- **Error:** Mensaje de error si falla conexión con backend

### Formato de datos
- **Montos financieros:** Formato USD con abreviaciones (`$1.2B`, `$500M`, `$65.4M`)
- **Valores NULL:** Mostrar "N/A" en gris claro
- **Año:** Formato simple (ej: `2011`)
- **Ubicación:** "Ciudad, País" (sin estado)
- **Productos:** Texto simple separado por comas, truncado si es muy largo

### Accesibilidad
- Labels claros en dropdowns
- Contraste de colores adecuado (WCAG AA)
- Soporte de navegación por teclado
- Textos alternativos en imágenes/iconos

---

# Arquitectura

## Componentes del sistema

### Frontend (Next.js + TypeScript)
```
src/frontend/
├── app/
│   ├── layout.tsx                 # Layout principal
│   ├── page.tsx                   # Página de listado de empresas
│   └── globals.css                # Estilos globales
├── components/
│   ├── CompanyTable.tsx           # Componente de tabla de empresas
│   ├── CompanyFilters.tsx         # Barra de filtros (industria/ubicación)
│   ├── BackendStatus.tsx          # Indicador de estado del backend
│   └── ui/
│       ├── Select.tsx             # Dropdown reutilizable
│       ├── Table.tsx              # Componente de tabla base
│       └── LoadingSpinner.tsx    # Spinner de carga
├── hooks/
│   ├── useCompanies.ts            # Hook para fetch de empresas
│   ├── useIndustries.ts           # Hook para fetch de industrias
│   └── useLocations.ts            # Hook para fetch de ubicaciones
├── lib/
│   ├── api.ts                     # Cliente API (fetch wrapper)
│   ├── types.ts                   # TypeScript types
│   └── utils.ts                   # Funciones auxiliares (formatCurrency, etc.)
└── package.json
```

**Tecnologías clave:**
- Next.js 16+ (App Router) - Framework React
- TypeScript - Type safety
- Tailwind CSS - Estilos utility-first
- SWR o React Query - Data fetching con caché (opcional para MVP)

### Backend (FastAPI + Python)
```
src/backend/
├── main.py                        # Entry point de FastAPI
├── api/
│   ├── __init__.py
│   ├── health.py                  # Health check endpoint
│   ├── companies.py               # Routers de empresas
│   ├── industries.py              # Routers de industrias
│   └── locations.py               # Routers de ubicaciones
├── services/
│   ├── __init__.py
│   ├── company_service.py         # Lógica de negocio de empresas
│   ├── industry_service.py        # Lógica de negocio de industrias
│   └── location_service.py        # Lógica de negocio de ubicaciones
├── repositories/
│   ├── __init__.py
│   ├── company_repository.py      # Acceso a datos de empresas
│   ├── industry_repository.py     # Acceso a datos de industrias
│   └── location_repository.py     # Acceso a datos de ubicaciones
├── models/
│   ├── __init__.py
│   └── database.py                # Modelos SQLAlchemy (Company, Industry, Location)
├── schemas/
│   ├── __init__.py
│   ├── company.py                 # Pydantic schemas (CompanyRead, CompanyList)
│   ├── industry.py                # Pydantic schemas (IndustryRead)
│   └── location.py                # Pydantic schemas (LocationRead)
├── core/
│   ├── __init__.py
│   ├── config.py                  # Configuración (env vars, Supabase connection)
│   └── database.py                # Database session, dependency injection
├── pyproject.toml                 # Dependencies (uv)
└── ruff.toml                      # Linting config
```

**Tecnologías clave:**
- FastAPI - Framework web asíncrono
- SQLAlchemy (async) - ORM
- Pydantic - Validación de datos
- psycopg2 o asyncpg - Driver PostgreSQL
- uv - Gestor de paquetes

---

## Modelos de datos

### Modelo de base de datos (PostgreSQL)

**Tablas existentes:**

#### `location`
```sql
id BIGSERIAL PRIMARY KEY
city TEXT NOT NULL
state TEXT
country TEXT NOT NULL
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

#### `industry`
```sql
id BIGSERIAL PRIMARY KEY
name VARCHAR(255) NOT NULL UNIQUE
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

#### `investor`
```sql
id BIGSERIAL PRIMARY KEY
name VARCHAR(255) NOT NULL UNIQUE
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

#### `company` (tabla principal)
```sql
id BIGSERIAL PRIMARY KEY
name TEXT NOT NULL
products TEXT
founding_year INTEGER
total_funding BIGINT              -- En USD (montos completos)
arr BIGINT                         -- Annual Recurring Revenue en USD
valuation BIGINT                   -- Valoración en USD
employees INTEGER
g2_rating REAL
industry_id BIGINT FK → industry(id)
location_id BIGINT FK → location(id)
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

#### `company_investor` (relación muchos a muchos)
```sql
company_id BIGINT FK → company(id)
investor_id BIGINT FK → investor(id)
PRIMARY KEY (company_id, investor_id)
```

**Nota:** La tabla `investor` y `company_investor` existen pero no se usan en esta fase.

### Schemas de API (Pydantic)

#### `CompanyRead` (respuesta de empresa individual)
```python
class LocationBase(BaseModel):
    id: int
    city: str
    country: str

class IndustryBase(BaseModel):
    id: int
    name: str

class CompanyRead(BaseModel):
    id: int
    name: str
    industry: IndustryBase
    location: LocationBase
    products: Optional[str]
    founding_year: Optional[int]
    total_funding: Optional[int]      # BIGINT, puede ser NULL
    arr: Optional[int]                # BIGINT, puede ser NULL
    valuation: Optional[int]          # BIGINT, puede ser NULL
    employees: Optional[int]
    g2_rating: Optional[float]
```

#### `CompanyListResponse` (respuesta de listado)
```python
class CompanyListResponse(BaseModel):
    companies: List[CompanyRead]
    total: int
    filters_applied: Dict[str, Any]
```

#### `IndustryRead`
```python
class IndustryRead(BaseModel):
    id: int
    name: str
```

#### `LocationRead`
```python
class LocationRead(BaseModel):
    id: int
    city: str
    country: str
    display_name: str  # Computed: "City, Country"
```

---

## APIs e integraciones

### Backend API Endpoints

#### `GET /api/v1/health`
**Descripción:** Health check del servidor

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "development"
}
```

#### `GET /api/v1/companies`
**Descripción:** Obtiene listado de empresas con filtros opcionales

**Query Parameters:**
- `industry_id` (optional): int - Filtrar por ID de industria
- `location_id` (optional): int - Filtrar por ID de ubicación

**Response:**
```json
{
  "companies": [
    {
      "id": 1,
      "name": "Microsoft",
      "industry": {
        "id": 1,
        "name": "Enterprise Software"
      },
      "location": {
        "id": 1,
        "city": "Redmond",
        "country": "USA"
      },
      "products": "Azure, Office 365, Teams",
      "founding_year": 1975,
      "total_funding": 1000000000,
      "arr": 270000000000,
      "valuation": 3000000000000,
      "employees": 221000,
      "g2_rating": 4.4
    }
  ],
  "total": 100,
  "filters_applied": {
    "industry_id": null,
    "location_id": null
  }
}
```

**Status Codes:**
- `200 OK` - Listado retornado exitosamente
- `400 Bad Request` - Parámetros inválidos
- `500 Internal Server Error` - Error del servidor

#### `GET /api/v1/industries`
**Descripción:** Obtiene listado de todas las industrias

**Response:**
```json
{
  "industries": [
    {
      "id": 1,
      "name": "Enterprise Software"
    },
    {
      "id": 2,
      "name": "CRM"
    }
  ],
  "total": 42
}
```

**Status Codes:**
- `200 OK` - Listado retornado exitosamente
- `500 Internal Server Error` - Error del servidor

#### `GET /api/v1/locations`
**Descripción:** Obtiene listado de todas las ubicaciones

**Response:**
```json
{
  "locations": [
    {
      "id": 1,
      "city": "Redmond",
      "country": "USA",
      "display_name": "Redmond, USA"
    },
    {
      "id": 2,
      "city": "San Francisco",
      "country": "USA",
      "display_name": "San Francisco, USA"
    }
  ],
  "total": 50
}
```

**Status Codes:**
- `200 OK` - Listado retornado exitosamente
- `500 Internal Server Error` - Error del servidor

---

### Integraciones externas

**Supabase (PostgreSQL)**
- **Propósito:** Base de datos principal
- **Autenticación:** Connection string con credenciales en `.env`
- **Variables de entorno:**
  - `DATABASE_URL`: Connection string de PostgreSQL
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (alternativa)

**CORS Configuration**
- **Origen permitido:** `http://localhost:3000` (frontend en desarrollo)
- **Producción:** Configurar dominio específico

---

## Requisitos de infraestructura

### Desarrollo local

**Backend:**
- Python 3.12+
- `uv` package manager instalado
- PostgreSQL (Supabase) accesible
- Puerto: `8000` (FastAPI dev server)

**Frontend:**
- Node.js 18+ con npm
- Puerto: `3000` (Next.js dev server)

**Base de datos:**
- PostgreSQL 15+ (Supabase)
- Scripts de creación ya ejecutados
- 100 registros de empresas cargados

### Variables de entorno

**Backend (`.env`):**
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
ENVIRONMENT=development
LOG_LEVEL=INFO
```

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Comandos de desarrollo

**Backend:**
```bash
cd src/backend
uv sync                          # Instalar dependencias
uv run fastapi dev              # Iniciar servidor (port 8000)
# o usar script
./scripts/dev/run-backend.sh
```

**Frontend:**
```bash
cd src/frontend
npm install                      # Instalar dependencias
npm run dev                      # Iniciar servidor (port 3000)
# o usar script
./scripts/dev/run-frontend.sh
```

**Tests:**
```bash
# Backend
cd src/backend
uv run pytest                    # Ejecutar tests
uv run pytest --cov              # Con coverage

# Frontend
cd src/frontend
npm test                         # Ejecutar tests
npm run test:coverage            # Con coverage
```

---

# Hoja de Ruta de Desarrollo

## Fase 1: Setup y configuración inicial (MVP Core)

### Backend - Estructura base
**Tareas:**
1. Configurar proyecto FastAPI con `uv`
   - Crear `pyproject.toml` con dependencias: fastapi, uvicorn, sqlalchemy, asyncpg, pydantic-settings
   - Configurar `ruff.toml` para linting
   - Crear estructura de carpetas (api/, services/, repositories/, models/, schemas/, core/)

2. Configurar conexión a base de datos
   - Crear `core/config.py` con carga de variables de entorno (Pydantic Settings)
   - Crear `core/database.py` con SQLAlchemy async engine y session factory
   - Implementar dependency injection para DB session

3. Crear modelos SQLAlchemy
   - `models/database.py`: Classes `Company`, `Industry`, `Location` mapeando tablas existentes
   - Configurar relaciones (Company → Industry, Company → Location)
   - Validar que los modelos mapeen correctamente con `alembic` o queries de prueba

4. Implementar health check endpoint
   - Crear `api/health.py` con router
   - Endpoint `GET /api/v1/health` retornando status, version, environment
   - Registrar router en `main.py`

**Criterios de aceptación:**
- ✅ Servidor FastAPI inicia en `http://localhost:8000`
- ✅ `GET /api/v1/health` retorna `{"status": "healthy"}`
- ✅ Conexión a Supabase PostgreSQL exitosa
- ✅ Modelos SQLAlchemy mapeados correctamente
- ✅ `uv run fastapi dev` funciona sin errores
- ✅ `uv run ruff check` pasa sin warnings

### Backend - Endpoint de empresas
**Tareas:**
1. Crear schemas Pydantic
   - `schemas/company.py`: `CompanyRead`, `CompanyListResponse`
   - `schemas/industry.py`: `IndustryBase`
   - `schemas/location.py`: `LocationBase`

2. Implementar repository de empresas
   - `repositories/company_repository.py`
   - Método `get_all(industry_id: Optional[int], location_id: Optional[int]) -> List[Company]`
   - Query con JOINs a `industry` y `location`
   - Aplicar filtros WHERE si los parámetros son provistos

3. Implementar service de empresas
   - `services/company_service.py`
   - Método `list_companies(industry_id, location_id)` que usa el repository
   - Transformación de modelos SQLAlchemy a schemas Pydantic

4. Crear router de empresas
   - `api/companies.py` con `APIRouter`
   - Endpoint `GET /api/v1/companies` con query params opcionales
   - Inyección de dependencias (DB session, service)
   - Manejo de errores con `HTTPException`

5. Registrar router en `main.py`
   - Configurar CORS para `http://localhost:3000`
   - Incluir router de companies

**Criterios de aceptación:**
- ✅ `GET /api/v1/companies` retorna 100 empresas con estructura correcta
- ✅ `GET /api/v1/companies?industry_id=1` filtra correctamente
- ✅ `GET /api/v1/companies?location_id=2` filtra correctamente
- ✅ `GET /api/v1/companies?industry_id=1&location_id=2` aplica ambos filtros
- ✅ Response incluye campos: name, industry, location, products, founding_year, total_funding, arr, valuation
- ✅ Valores NULL se retornan como `null` en JSON
- ✅ Response time < 500ms para queries sin filtros

### Backend - Endpoints de filtros
**Tareas:**
1. Implementar repository de industrias
   - `repositories/industry_repository.py`
   - Método `get_all() -> List[Industry]`

2. Implementar service de industrias
   - `services/industry_service.py`
   - Método `list_industries()` retornando lista ordenada alfabéticamente

3. Crear router de industrias
   - `api/industries.py`
   - Endpoint `GET /api/v1/industries`

4. Implementar repository de ubicaciones
   - `repositories/location_repository.py`
   - Método `get_all() -> List[Location]`

5. Implementar service de ubicaciones
   - `services/location_service.py`
   - Método `list_locations()` con formato "Ciudad, País"

6. Crear router de ubicaciones
   - `api/locations.py`
   - Endpoint `GET /api/v1/locations`

7. Registrar routers en `main.py`

**Criterios de aceptación:**
- ✅ `GET /api/v1/industries` retorna lista de ~42 industrias únicas
- ✅ `GET /api/v1/locations` retorna lista de ~50 ubicaciones únicas
- ✅ Industrias ordenadas alfabéticamente
- ✅ Ubicaciones con formato "Ciudad, País"
- ✅ Response time < 200ms para ambos endpoints

### Backend - Tests unitarios
**Tareas:**
1. Configurar pytest
   - Crear `tests/conftest.py` con fixtures (DB session mock, test client)
   - Configurar pytest en `pyproject.toml`

2. Tests para repositories
   - `tests/repositories/test_company_repository.py`
   - Tests para `get_all()` con y sin filtros
   - Tests para `test_industry_repository.py` y `test_location_repository.py`

3. Tests para services
   - `tests/services/test_company_service.py`
   - Mockear repository y validar transformaciones

4. Tests para endpoints
   - `tests/api/test_companies.py`
   - Usar `TestClient` de FastAPI
   - Tests para cada combinación de filtros
   - Tests de errores (parámetros inválidos)

**Criterios de aceptación:**
- ✅ Coverage mínimo del 60% en backend
- ✅ Todos los tests pasan con `uv run pytest`
- ✅ Tests incluyen casos: happy path, filtros, casos límite, errores

---

## Fase 2: Frontend básico

### Frontend - Estructura base
**Tareas:**
1. Configurar proyecto Next.js
   - Verificar `package.json` con dependencias: next, react, typescript, tailwind
   - Configurar `tsconfig.json` con paths alias (`@/components`, `@/lib`)
   - Validar `tailwind.config.ts` y `postcss.config.mjs`

2. Crear tipos TypeScript
   - `lib/types.ts` con interfaces: `Company`, `Industry`, `Location`, `CompanyListResponse`
   - Alinear con schemas Pydantic del backend

3. Crear cliente API
   - `lib/api.ts` con función `fetchAPI(endpoint, options)` wrapper de `fetch`
   - Manejo de errores y parsing JSON
   - Configurar base URL desde `NEXT_PUBLIC_API_URL`

4. Crear utilidades
   - `lib/utils.ts` con función `formatCurrency(value: number | null): string`
   - Lógica para formatear "$1.2B", "$500M", o "N/A" si NULL
   - Función `formatLocation(city: string, country: string): string`

**Criterios de aceptación:**
- ✅ Proyecto Next.js compila sin errores con `npm run dev`
- ✅ TypeScript types definidos y exportados
- ✅ Cliente API puede hacer fetch a `http://localhost:8000`
- ✅ `formatCurrency(1000000000)` retorna "$1B"
- ✅ `formatCurrency(null)` retorna "N/A"

### Frontend - Componentes de UI base
**Tareas:**
1. Crear componente Select
   - `components/ui/Select.tsx` con props: `options`, `value`, `onChange`, `placeholder`
   - Estilos con Tailwind
   - Accesibilidad (aria-labels)

2. Crear componente LoadingSpinner
   - `components/ui/LoadingSpinner.tsx`
   - Spinner simple con animación CSS

3. Crear componente Table
   - `components/ui/Table.tsx` como wrapper reutilizable para tablas
   - Props: `children`, `className`
   - Estilos base con Tailwind (borders, padding, hover states)

**Criterios de aceptación:**
- ✅ Componentes compilan sin errores TypeScript
- ✅ Componentes son reutilizables y tipados
- ✅ Estilos responsive con Tailwind

### Frontend - Custom hooks
**Tareas:**
1. Crear hook `useCompanies`
   - `hooks/useCompanies.ts`
   - Fetch a `GET /api/v1/companies` con query params opcionales
   - Estado: `data`, `loading`, `error`
   - Función `refetch()` para recargar datos

2. Crear hook `useIndustries`
   - `hooks/useIndustries.ts`
   - Fetch a `GET /api/v1/industries`
   - Retornar lista de industrias

3. Crear hook `useLocations`
   - `hooks/useLocations.ts`
   - Fetch a `GET /api/v1/locations`
   - Retornar lista de ubicaciones

**Criterios de aceptación:**
- ✅ Hooks retornan data correctamente tipada
- ✅ Loading states funcionan correctamente
- ✅ Error handling implementado
- ✅ Hooks son reutilizables en múltiples componentes

### Frontend - Componente de filtros
**Tareas:**
1. Crear componente CompanyFilters
   - `components/CompanyFilters.tsx`
   - Usa hooks `useIndustries` y `useLocations`
   - Renderiza dos componentes `Select` (industria y ubicación)
   - Props: `onFilterChange` callback con `{ industryId, locationId }`
   - Botón "Limpiar filtros" que resetea ambos selects

**Criterios de aceptación:**
- ✅ Dropdowns cargan opciones desde backend
- ✅ Seleccionar industria dispara callback con ID correcto
- ✅ Seleccionar ubicación dispara callback con ID correcto
- ✅ Botón "Limpiar filtros" resetea ambos selects a "Todos"
- ✅ Loading state mientras cargan industrias/ubicaciones

### Frontend - Componente de tabla
**Tareas:**
1. Crear componente CompanyTable
   - `components/CompanyTable.tsx`
   - Props: `companies: Company[]`, `loading: boolean`, `error: Error | null`
   - Renderiza tabla HTML con 8 columnas:
     1. Nombre (sticky column en mobile)
     2. Industria
     3. Ubicación
     4. Productos
     5. Año de fundación
     6. Total inversión
     7. ARR
     8. Valoración
   - Headers de tabla con estilos apropiados
   - Rows con hover effect
   - Usa `formatCurrency` para columnas de montos
   - Usa `formatLocation` para columna de ubicación
   - Trunca productos si es muy largo (> 80 caracteres) con tooltip
   - Muestra LoadingSpinner si `loading === true`
   - Muestra mensaje de error si `error !== null`
   - Muestra mensaje "No se encontraron empresas" si `companies.length === 0`
   - Scroll horizontal en pantallas pequeñas

**Criterios de aceptación:**
- ✅ Tabla renderiza 100 empresas correctamente
- ✅ Todas las columnas visibles y alineadas
- ✅ Headers con estilos sticky (permanecen visibles al scroll)
- ✅ Montos NULL muestran "N/A"
- ✅ Productos truncados con "..." si son largos
- ✅ Loading state funciona correctamente
- ✅ Estado vacío muestra mensaje apropiado
- ✅ Responsive con scroll horizontal en mobile

### Frontend - Página principal
**Tareas:**
1. Actualizar `app/page.tsx`
   - Server Component que renderiza layout principal
   - Integrar `CompanyFilters` y `CompanyTable`
   - Hook `useCompanies` con state de filtros
   - Callback `handleFilterChange` que actualiza filtros y refetch
   - Container con ancho máximo para mejor legibilidad

2. Actualizar `app/layout.tsx`
   - Configurar metadata (title, description)
   - Estructura HTML base

3. Crear componente BackendStatus
   - `components/BackendStatus.tsx`
   - Fetch a `GET /api/v1/health` cada 30 segundos
   - Mostrar indicador verde/rojo según status
   - Mostrar version y environment

**Criterios de aceptación:**
- ✅ Página carga y muestra 100 empresas en tabla
- ✅ Filtros actualizan la tabla correctamente
- ✅ Filtros combinados funcionan
- ✅ BackendStatus muestra conexión correcta
- ✅ Layout responsive (desktop, tablet, mobile)
- ✅ Tabla tiene scroll horizontal en pantallas pequeñas

### Frontend - Tests unitarios
**Tareas:**
1. Configurar Vitest/Jest
   - Instalar dependencias de testing
   - Configurar `vitest.config.ts` o `jest.config.js`

2. Tests para utilidades
   - `lib/utils.test.ts`
   - Tests para `formatCurrency` con valores: 1B, 500M, 65.4M, null
   - Tests para `formatLocation`

3. Tests para componentes
   - `components/CompanyTable.test.tsx` con React Testing Library
   - Tests para tabla (loading, error, empty, con datos, 8 columnas)
   - Tests para `CompanyFilters.test.tsx`

**Criterios de aceptación:**
- ✅ Coverage mínimo del 60% en frontend
- ✅ Todos los tests pasan con `npm test`
- ✅ Tests incluyen casos: rendering, eventos, estados

---

## Fase 3: Refinamiento y calidad

### Backend - Logging y monitoreo
**Tareas:**
1. Configurar logging
   - Usar `loguru` o `logging` estándar
   - Logs en formato JSON para producción
   - Log de cada request (método, path, status, tiempo)

2. Middleware de logging
   - Middleware que registra todas las requests
   - Incluir `correlation_id` único por request

**Criterios de aceptación:**
- ✅ Logs estructurados en consola durante desarrollo
- ✅ Logs incluyen timestamp, level, message, correlation_id

### Frontend - Mejoras UX
**Tareas:**
1. Optimizar performance
   - Implementar memoization con `useMemo` en listado
   - Lazy loading de imágenes (si aplica)
   - Optimizar re-renders con `React.memo` en CompanyCard

2. Mejorar feedback visual
   - Animaciones suaves en transiciones de filtros
   - Toasts/notificaciones para errores
   - Indicador de "X empresas encontradas"

3. Accesibilidad
   - Validar contraste de colores
   - Añadir aria-labels en elementos interactivos
   - Navegación por teclado en filtros

**Criterios de aceptación:**
- ✅ Página carga en < 2 segundos
- ✅ Filtros responden en < 500ms
- ✅ WCAG AA compliance en contraste de colores
- ✅ Navegación por teclado funcional

### Testing end-to-end
**Tareas:**
1. Configurar Playwright o Cypress (opcional para MVP)
   - Instalar dependencias
   - Configurar `playwright.config.ts`

2. Tests E2E básicos
   - Test: Cargar página y ver 100 empresas
   - Test: Filtrar por industria
   - Test: Filtrar por ubicación
   - Test: Limpiar filtros

**Criterios de aceptación:**
- ✅ Tests E2E pasan en ambiente local
- ✅ Coverage de flujos principales (exploración, filtrado)

### Documentación
**Tareas:**
1. Actualizar README.md
   - Instrucciones de setup (backend + frontend)
   - Variables de entorno requeridas
   - Comandos de desarrollo
   - Arquitectura y estructura del proyecto

2. Documentar decisiones arquitectónicas
   - Crear ADR en `docs/adrs/001-arquitectura-por-capas.md`
   - Crear ADR en `docs/adrs/002-filtros-server-side.md`
   - Crear ADR en `docs/adrs/003-sin-paginacion-mvp.md`

3. Documentar API
   - OpenAPI/Swagger en `/docs` (automático con FastAPI)
   - Ejemplos de uso en README

**Criterios de aceptación:**
- ✅ README.md tiene instrucciones completas de setup
- ✅ Nuevos desarrolladores pueden levantar proyecto siguiendo README
- ✅ ADRs documentan decisiones clave
- ✅ API docs accesibles en `http://localhost:8000/docs`

---

# Riesgos y Mitigaciones

## Riesgos técnicos

### 1. Latencia en queries con múltiples JOINs
**Riesgo:** Queries con JOINs a `industry` y `location` pueden ser lentas si no están optimizadas.

**Impacto:** Alto - Afecta UX si el listado tarda > 1 segundo

**Mitigación:**
- Índices ya creados en `industry_id` y `location_id` (ver `01-top-saas-db-creation.sql`)
- Usar `EXPLAIN ANALYZE` para validar planes de ejecución
- Considerar caché de queries frecuentes si la performance no es aceptable
- Dataset de 100 registros es pequeño, no debería haber problemas en MVP

**Prioridad:** Media (validar en testing)

### 2. Manejo inconsistente de valores NULL
**Riesgo:** Valores NULL en `total_funding`, `arr`, `valuation` podrían causar errores de rendering o formateo.

**Impacto:** Medio - Puede romper UI o mostrar datos incorrectos

**Mitigación:**
- Schemas Pydantic con `Optional[int]` para campos nullables
- TypeScript types con `number | null`
- Función `formatCurrency` maneja NULL explícitamente retornando "N/A"
- Tests unitarios para casos con valores NULL

**Prioridad:** Alta (implementar desde el inicio)

### 3. CORS en producción
**Riesgo:** Configuración CORS incorrecta puede bloquear requests del frontend.

**Impacto:** Crítico - App no funciona

**Mitigación:**
- Configurar CORS explícitamente en FastAPI middleware
- Variables de entorno para `ALLOWED_ORIGINS`
- Testing en ambiente de staging antes de producción
- Documentar configuración en README

**Prioridad:** Alta

### 4. Desincronización de tipos entre backend y frontend
**Riesgo:** Schemas Pydantic y TypeScript types pueden desincronizarse causando bugs.

**Impacto:** Medio - Errores runtime, TypeScript no detecta inconsistencias

**Mitigación:**
- Mantener `lib/types.ts` y `schemas/*.py` sincronizados manualmente
- Tests de integración que validen contratos de API
- Considerar generación automática de tipos con `openapi-typescript` (post-MVP)
- Code review cuidadoso en cambios de schemas

**Prioridad:** Media

---

## Riesgos de alcance y recursos

### 5. Sobre-ingeniería en MVP
**Riesgo:** Intentar implementar features avanzadas (paginación, auth, caché) en MVP.

**Impacto:** Alto - Retraso en entrega, mayor complejidad

**Mitigación:**
- Mantener scope estricto: listado + filtros básicos solamente
- Diferir features a "Mejoras futuras"
- Revisión de scope antes de cada fase de desarrollo
- Priorizar factibilidad y mantenibilidad

**Prioridad:** Alta

### 6. Dataset estático puede volverse obsoleto
**Riesgo:** 100 empresas son datos estáticos de Kaggle, pueden desactualizarse.

**Impacto:** Bajo - No afecta funcionalidad, solo relevancia de datos

**Mitigación:**
- Documentar fuente de datos y fecha en README
- Considerar actualización manual periódica (trimestral)
- Post-MVP: implementar ingesta automatizada o integración con APIs de datos
- Para MVP, dataset estático es suficiente para demostración

**Prioridad:** Baja

---

## Riesgos de definición de requisitos

### 7. Formato de montos puede ser confuso
**Riesgo:** Formato "$1.2B" vs "$1,200,000,000" puede no ser claro para todos los usuarios.

**Impacto:** Bajo - UX subóptima, pero no bloqueante

**Mitigación:**
- Implementar formato abreviado ($1.2B) por defecto
- Tooltip o hover que muestre monto completo formateado
- Considerar toggle de formato en configuración (post-MVP)
- Validar con usuarios reales en testing

**Prioridad:** Baja (nice-to-have)

### 8. Ubicación sin estado puede ser ambiguo
**Riesgo:** Formato "Ciudad, País" sin estado puede causar confusión (ej: "San Francisco" en USA y Argentina).

**Impacto:** Bajo - Confusión ocasional, pero dataset tiene contexto claro

**Mitigación:**
- Para MVP, "Ciudad, País" es suficiente
- DB ya tiene campo `state`, puede incluirse en tooltip si es necesario
- Validar con usuarios si hay ambigüedad real
- Post-MVP: considerar formato "Ciudad, Estado, País" si state existe

**Prioridad:** Baja

---

## Definir versión inicial (MVP)

**Alcance mínimo funcional:**

**Backend:**
- ✅ Health check endpoint
- ✅ Endpoint `GET /api/v1/companies` con filtros opcionales (industry_id, location_id)
- ✅ Endpoint `GET /api/v1/industries`
- ✅ Endpoint `GET /api/v1/locations`
- ✅ Tests unitarios con coverage > 60%
- ✅ CORS configurado
- ✅ Logging básico

**Frontend:**
- ✅ Página principal con listado de empresas
- ✅ Componente de filtros (industria + ubicación)
- ✅ Cards/tabla responsive con 8 campos
- ✅ Loading states y error handling
- ✅ Formato de montos ("$1.2B" o "N/A")
- ✅ BackendStatus indicator
- ✅ Tests unitarios con coverage > 60%

**Base de datos:**
- ✅ Schema ya creado y con datos cargados
- ✅ 100 empresas con información completa

**Documentación:**
- ✅ README.md con instrucciones de setup
- ✅ ADRs de decisiones principales
- ✅ OpenAPI docs en `/docs`

**Criterio de éxito del MVP:**
- Usuario puede acceder a `http://localhost:3000`
- Ver listado de 100 empresas con métricas completas
- Filtrar por industria
- Filtrar por ubicación
- Filtrar por ambos criterios simultáneamente
- Limpiar filtros y volver al listado completo
- Todo funciona en < 2 segundos de carga inicial

**Fuera del alcance del MVP:**
- ❌ Paginación
- ❌ Ordenamiento (sorting)
- ❌ Filtros avanzados (rangos, búsqueda por texto)
- ❌ Vista detallada de empresa
- ❌ Mostrar inversores
- ❌ Exportación de datos
- ❌ Autenticación/autorización
- ❌ Gráficos y visualizaciones avanzadas
- ❌ Dashboard de estadísticas agregadas

---

# Apéndice

## Hallazgos de investigación

### Análisis del dataset
- **100 empresas** de diferentes industrias SaaS
- **~42 industrias únicas** (Enterprise Software, CRM, E-commerce, etc.)
- **~50 ubicaciones únicas** distribuidas globalmente
- **Cobertura de datos:**
  - `name`: 100% (todos tienen nombre)
  - `industry`: 100% (todas tienen industria asignada)
  - `location`: 100% (todas tienen ubicación)
  - `products`: ~95% (algunos pueden estar vacíos)
  - `founding_year`: ~98%
  - `total_funding`: ~85% (algunos NULL)
  - `arr`: ~90% (algunos NULL)
  - `valuation`: ~80% (varios NULL, especialmente empresas adquiridas)
  - `employees`: ~95%
  - `g2_rating`: ~90%

### Análisis de performance esperada
- **Backend query time:** < 100ms para listado completo (100 rows con JOINs)
- **Backend query time con filtros:** < 50ms (WHERE con índices)
- **Payload size:** ~50-100KB JSON para 100 empresas
- **Frontend initial load:** < 2 segundos (incluye fetch + render)
- **Filtrado:** < 500ms (request + response + re-render)

### Alternativas consideradas y descartadas

#### 1. GraphQL en lugar de REST
**Descartado por:**
- Mayor complejidad de setup (Apollo Server, Resolvers, Schema)
- REST es más simple y suficiente para 4 endpoints
- Equipo más familiarizado con REST
- No necesitamos queries flexibles para este MVP

#### 2. Filtros client-side en lugar de server-side
**Descartado por:**
- Server-side establece buenas prácticas desde el inicio
- Queries SQL optimizadas con índices existentes
- Backend tiene control sobre la lógica de filtrado
- Facilita agregar filtros adicionales en el futuro

#### 3. Cards en lugar de tabla
**Descartado por:**
- Inversionistas prefieren formato tabular para comparar métricas
- Tabla permite ver múltiples empresas side-by-side
- Mejor para análisis comparativo de datos financieros
- Formato más profesional para dashboard analítico

#### 4. ORM alternativo (Prisma, Tortoise ORM)
**Descartado por:**
- SQLAlchemy es estándar en FastAPI
- DB schema ya existe, no necesitamos migraciones generadas
- Mejor integración async/await con FastAPI
- Mayor madurez y documentación

#### 5. UI component library (shadcn/ui, Material-UI)
**Descartado por:**
- Overhead de setup innecesario para MVP
- Tailwind CSS es suficiente para tabla simple
- Mayor control sobre estilos
- Menor bundle size

---

## Especificaciones técnicas adicionales

### Formato de montos financieros
Implementación de `formatCurrency(value: number | null): string`

```typescript
export function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) {
    return "N/A";
  }

  const billion = 1_000_000_000;
  const million = 1_000_000;
  const thousand = 1_000;

  if (value >= billion) {
    const formatted = (value / billion).toFixed(1);
    return `$${formatted}B`;
  } else if (value >= million) {
    const formatted = (value / million).toFixed(1);
    return `$${formatted}M`;
  } else if (value >= thousand) {
    const formatted = (value / thousand).toFixed(1);
    return `$${formatted}K`;
  } else {
    return `$${value.toLocaleString()}`;
  }
}

// Ejemplos:
// formatCurrency(3000000000000) → "$3000.0B" o "$3T" (considerar trillions)
// formatCurrency(270000000000) → "$270.0B"
// formatCurrency(65400000) → "$65.4M"
// formatCurrency(null) → "N/A"
```

**Nota:** Considerar agregar soporte para trillions (T) si hay valores > $999B.

### Estructura de response del backend
Ejemplo completo de `GET /api/v1/companies`:

```json
{
  "companies": [
    {
      "id": 1,
      "name": "Microsoft",
      "industry": {
        "id": 1,
        "name": "Enterprise Software"
      },
      "location": {
        "id": 1,
        "city": "Redmond",
        "country": "USA"
      },
      "products": "Azure, Office 365, Teams",
      "founding_year": 1975,
      "total_funding": 1000000000,
      "arr": 270000000000,
      "valuation": 3000000000000,
      "employees": 221000,
      "g2_rating": 4.4
    },
    {
      "id": 5,
      "name": "SAP",
      "industry": {
        "id": 1,
        "name": "Enterprise Software"
      },
      "location": {
        "id": 5,
        "city": "Walldorf",
        "country": "Germany"
      },
      "products": "S/4HANA, SuccessFactors",
      "founding_year": 1972,
      "total_funding": null,
      "arr": 32500000000,
      "valuation": 215000000000,
      "employees": 107415,
      "g2_rating": 4.1
    }
  ],
  "total": 100,
  "filters_applied": {
    "industry_id": null,
    "location_id": null
  }
}
```

### Convenciones de código

**Backend (Python):**
```python
# Estructura de archivo típica
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..services.company_service import CompanyService
from ..schemas.company import CompanyListResponse

router = APIRouter(prefix="/api/v1/companies", tags=["companies"])

@router.get("/", response_model=CompanyListResponse)
async def list_companies(
    industry_id: Optional[int] = None,
    location_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
) -> CompanyListResponse:
    """
    List all companies with optional filters.
    
    Args:
        industry_id: Filter by industry ID
        location_id: Filter by location ID
        db: Database session
    
    Returns:
        CompanyListResponse with list of companies and metadata
    """
    service = CompanyService(db)
    return await service.list_companies(industry_id, location_id)
```

**Frontend (TypeScript):**
```typescript
// Estructura de componente típica
'use client';

import { useState, useEffect } from 'react';
import { Company } from '@/lib/types';
import { fetchAPI } from '@/lib/api';
import { formatCurrency, formatLocation } from '@/lib/utils';

interface CompanyTableProps {
  industryId?: number;
  locationId?: number;
}

export function CompanyTable({ industryId, locationId }: CompanyTableProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadCompanies() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (industryId) params.append('industry_id', industryId.toString());
        if (locationId) params.append('location_id', locationId.toString());
        
        const data = await fetchAPI(`/companies?${params}`);
        setCompanies(data.companies);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    
    loadCompanies();
  }, [industryId, locationId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (companies.length === 0) return <EmptyState />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Industria
            </th>
            {/* ...más headers */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company) => (
            <tr key={company.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {company.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {company.industry.name}
              </td>
              {/* ...más celdas */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Checklist de entrega del MVP

### Backend
- [ ] Servidor FastAPI corre en `http://localhost:8000`
- [ ] Endpoint `GET /api/v1/health` funcional
- [ ] Endpoint `GET /api/v1/companies` retorna 100 empresas
- [ ] Filtro por `industry_id` funciona
- [ ] Filtro por `location_id` funciona
- [ ] Filtros combinados funcionan
- [ ] Endpoint `GET /api/v1/industries` retorna lista de industrias
- [ ] Endpoint `GET /api/v1/locations` retorna lista de ubicaciones
- [ ] CORS configurado para `http://localhost:3000`
- [ ] Tests unitarios > 60% coverage
- [ ] `uv run pytest` pasa todos los tests
- [ ] `uv run ruff check` sin warnings
- [ ] `uv run mypy .` sin errores de tipos
- [ ] Logging configurado y funcional
- [ ] OpenAPI docs en `/docs` accesible

### Frontend
- [ ] Servidor Next.js corre en `http://localhost:3000`
- [ ] Página principal carga tabla de 100 empresas
- [ ] Tabla muestra 8 columnas correctamente
- [ ] Headers de tabla son sticky (permanecen visibles al scroll)
- [ ] Dropdown de industrias carga opciones correctamente
- [ ] Dropdown de ubicaciones carga opciones correctamente
- [ ] Filtrar por industria actualiza tabla
- [ ] Filtrar por ubicación actualiza tabla
- [ ] Filtros combinados funcionan
- [ ] Botón "Limpiar filtros" resetea tabla
- [ ] Montos financieros formatados correctamente ($1.2B)
- [ ] Valores NULL muestran "N/A"
- [ ] Ubicaciones en formato "Ciudad, País"
- [ ] Productos se muestran como texto separado por comas (truncados si son largos)
- [ ] Hover effect en filas de tabla
- [ ] Loading states funcionan
- [ ] Error handling funciona
- [ ] Estado vacío muestra mensaje apropiado
- [ ] BackendStatus indica conexión correcta
- [ ] Layout responsive (desktop, tablet, mobile)
- [ ] Scroll horizontal funciona en pantallas pequeñas
- [ ] Tests unitarios > 60% coverage
- [ ] `npm test` pasa todos los tests
- [ ] `npm run lint` sin errores
- [ ] `npm run build` compila sin errores

### Documentación
- [ ] README.md actualizado con instrucciones de setup
- [ ] Variables de entorno documentadas
- [ ] Comandos de desarrollo documentados
- [ ] ADRs creados para decisiones clave
- [ ] Arquitectura documentada

### Integración
- [ ] Backend y frontend corren simultáneamente sin conflictos
- [ ] Frontend se conecta correctamente al backend
- [ ] Filtros end-to-end funcionan correctamente
- [ ] Performance < 2 segundos de carga inicial
- [ ] Performance < 500ms para filtrado

---

**Fin del documento de planeación**
