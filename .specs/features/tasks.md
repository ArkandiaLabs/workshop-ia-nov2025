# Lista de Tareas del Proyecto - Top SaaS Analytics Platform

Este documento desglosa el trabajo definido en `planning.md` en tareas accionables y ejecutables.

---

## Fase 0: Diseño y Documentación

### Architectural Decision Records (ADRs)
- [x] Crear ADR-001: Arquitectura por capas con Supabase
    - [x] Documentar contexto: Necesidad de separación de responsabilidades y código mantenible, uso de Supabase como base de datos
    - [x] Describir decisión: Patrón de capas (Backend: Routers → Services → Repositories → Supabase Client; Frontend: Pages/Components → Hooks → Services → Types)
    - [x] Justificar uso de Supabase Python client en lugar de ORM:
        - Supabase ofrece cliente Python nativo optimizado
        - Reduce complejidad de setup (no requiere SQLAlchemy, migraciones, etc.)
        - API REST-like más simple para queries
        - Integración directa con PostgreSQL de Supabase
    - [x] Listar consecuencias: Facilita testing con mocks, mantenibilidad, permite trabajo en paralelo por capas
    - [x] Incluir alternativas descartadas: SQLAlchemy ORM, arquitectura monolítica, DDD completo
    - [x] Guardar en: `docs/adrs/001-arquitectura-por-capas.md`

- [x] Crear ADR-002: Filtros server-side vs client-side
    - [x] Documentar contexto: Dataset de 100 empresas, necesidad de filtrado por industria y ubicación
    - [x] Describir decisión: Filtros server-side con query parameters (`?industry_id=X&location_id=Y`)
    - [x] Listar consecuencias: Queries SQL optimizadas, escalable, backend controla lógica de filtrado
    - [x] Incluir alternativas descartadas: Filtros client-side con JavaScript
    - [x] Guardar en: `docs/adrs/002-filtros-server-side.md`

- [x] Crear ADR-003: Sin paginación en el MVP
    - [x] Documentar contexto: Dataset de 100 empresas, balance entre simplicidad y escalabilidad
    - [x] Describir decisión: Retornar todas las empresas sin paginación en endpoint `GET /api/v1/companies`
    - [x] Listar consecuencias: Implementación más rápida, payload ~50-100KB manejable, refactorización futura si dataset crece
    - [x] Incluir alternativas descartadas: Paginación offset-based, cursor-based
    - [x] Guardar en: `docs/adrs/003-sin-paginacion-mvp.md`

### Diagramas de Arquitectura (Modelo C4)

#### Diagrama de Contexto (Nivel 1)
- [x] Crear diagrama de contexto usando Mermaid
    - [x] Definir sistema principal: Top SaaS Analytics Platform
    - [x] Definir actores:
        - Usuario primario: Inversionista VC/PE
        - Usuario secundario: Analista financiero
    - [x] Definir interacciones:
        - Usuarios → Sistema: Visualiza métricas de empresas SaaS, aplica filtros
    - [x] Incluir descripción del sistema: Dashboard interactivo para análisis de 100 empresas SaaS
    - [x] Guardar en: `docs/architecture/c4-context-diagram.md`

#### Diagrama de Contenedores (Nivel 2)
- [x] Crear diagrama de contenedores usando Mermaid
    - [x] Definir contenedor Frontend:
        - Tecnología: Next.js 16+ (App Router) + TypeScript + Tailwind CSS
        - Puerto: 3000
        - Responsabilidad: Interfaz de usuario, tabla de empresas, filtros interactivos
    - [x] Definir contenedor Backend API:
        - Tecnología: FastAPI + Python 3.12+ + Supabase Python Client
        - Puerto: 8000
        - Responsabilidad: API REST, lógica de negocio, acceso a datos vía Supabase
    - [x] Definir contenedor Base de Datos:
        - Tecnología: PostgreSQL 15+ (Supabase)
        - Responsabilidad: Almacenamiento de empresas, industrias, ubicaciones, inversores
        - Nota: Gestionado por Supabase (hosted)
    - [x] Definir interacciones:
        - Frontend → Backend: HTTP/REST (GET /api/v1/companies, /industries, /locations)
        - Backend → Supabase: API calls usando Supabase Python client (método `.table().select()`, etc.)
    - [x] Incluir nota sobre autenticación: Backend usa service role key de Supabase
    - [x] La base de datos hace parte del límite del sistema
    - [x] Guardar en: `docs/architecture/c4-container-diagram.md`

### Diagrama de Base de Datos (Modelo Entidad-Relación)
- [x] Crear diagrama ER usando Mermaid
    - [x] Definir entidad `company`:
        - Atributos: id (PK), name, products, founding_year, total_funding, arr, valuation, employees, g2_rating, industry_id (FK), location_id (FK), created_at, updated_at
    - [x] Definir entidad `industry`:
        - Atributos: id (PK), name (unique), created_at, updated_at
    - [x] Definir entidad `location`:
        - Atributos: id (PK), city, state, country, created_at, updated_at
    - [x] Definir entidad `investor`:
        - Atributos: id (PK), name (unique), created_at, updated_at
    - [x] Definir tabla de unión `company_investor`:
        - Atributos: company_id (FK, PK), investor_id (FK, PK)
    - [x] Definir relaciones:
        - company N:1 industry (company.industry_id → industry.id)
        - company N:1 location (company.location_id → location.id)
        - company M:N investor (a través de company_investor)
    - [x] Incluir índices: idx_company_industry, idx_company_location, idx_company_investor_company, idx_company_investor_investor
    - [x] Guardar en: `docs/database/er-diagram.md`

---

## Fase 1: Backend

### Configuración Inicial del Proyecto
- [x] Verificar y actualizar dependencias en `pyproject.toml`
    - [x] Verificar dependencias existentes: fastapi, uvicorn, pydantic, pydantic-settings
    - [x] Añadir dependencia de Supabase: `uv add supabase`
    - [x] Añadir dependencia de python-dotenv: `uv add python-dotenv`
    - [x] Ejecutar `uv sync` para instalar/actualizar dependencias
    - [x] Verificar que `uv run python --version` retorna Python 3.12+

- [x] Verificar estructura de carpetas del backend
    - [x] Verificar existencia de `src/backend/api/` (routers de endpoints)
    - [x] Crear `src/backend/services/` (lógica de negocio)
    - [x] Crear `src/backend/repositories/` (acceso a datos con Supabase)
    - [x] Crear `src/backend/schemas/` (schemas Pydantic para request/response)
    - [x] Verificar `src/backend/core/` existe (ya tiene configuración)
    - [x] Crear archivos `__init__.py` en carpetas nuevas si no existen

### Configuración de Base de Datos (Supabase)
- [x] Actualizar configuración para incluir credenciales de Supabase
    - [x] Actualizar `Settings` class en `src/backend/main.py` para incluir:
        - `supabase_url: str` - URL del proyecto Supabase
        - `supabase_key: str` - API Key de Supabase (service role key para backend)
    - [x] Crear archivo `.env.example` con template:
        ```
        SUPABASE_URL=https://your-project.supabase.co
        SUPABASE_KEY=your-service-role-key
        ENVIRONMENT=development
        CORS_ORIGINS=http://localhost:3000
        ```
    - [x] Verificar que `.env` está en `.gitignore`

- [x] Crear cliente de Supabase
    - [x] Crear `src/backend/core/database.py`:
        - Importar `create_client` de supabase
        - Función `get_supabase_client()` que retorna cliente Supabase:
            ```python
            from supabase import create_client, Client
            from backend.main import settings
            
            def get_supabase_client() -> Client:
                return create_client(settings.supabase_url, settings.supabase_key)
            ```
        - Dependency `get_db()` para FastAPI que retorna cliente:
            ```python
            def get_db() -> Client:
                return get_supabase_client()
            ```
    - [ ] Nota: Supabase client no requiere manejo de sesiones async como SQLAlchemy

### Validación del Schema de Base de Datos
- [x] Revisar schema de base de datos existente
    - [x] Revisar `scripts/database/01-top-saas-db-creation.sql`
    - [x] Documentar estructura de tablas y campos:
        - `company`: id, name, products, founding_year, total_funding, arr, valuation, employees, g2_rating, industry_id, location_id
        - `industry`: id, name
        - `location`: id, city, state, country
        - `investor`: id, name
        - `company_investor`: company_id, investor_id
    - [x] Identificar claves foráneas y relaciones para uso en queries

- [x] Validar conexión a Supabase
    - [x] Crear script de validación `scripts/validate_supabase_connection.py`:
        - Importar cliente Supabase de `core/database.py`
        - Ejecutar query simple: `client.table('company').select('id').limit(1).execute()`
        - Verificar que retorna datos exitosamente
        - Imprimir confirmación de conexión
    - [x] Ejecutar: `uv run python scripts/validate_supabase_connection.py`
    - [x] Verificar que se conecta correctamente a la base de datos

### Schemas Pydantic
### Schemas Pydantic
- [x] Crear schemas para Industry
    - [x] Crear `src/backend/schemas/industry.py`:
        - `IndustryRead(BaseModel)`: id (int), name (str)
        - `IndustryListResponse(BaseModel)`: industries (List[IndustryRead]), total (int)

- [x] Crear schemas para Location
    - [x] Crear `src/backend/schemas/location.py`:
        - `LocationRead(BaseModel)`: id (int), city (str), country (str), display_name (str)
        - Usar `@computed_field` o property para generar display_name: f"{city}, {country}"
        - `LocationListResponse(BaseModel)`: locations (List[LocationRead]), total (int)

- [x] Crear schemas para Company
    - [x] Crear `src/backend/schemas/company.py`:
        - `IndustryNested(BaseModel)`: id (int), name (str)
        - `LocationNested(BaseModel)`: id (int), city (str), country (str)
        - `CompanyRead(BaseModel)`:
            - id (int)
            - name (str)
            - industry (IndustryNested)
            - location (LocationNested)
            - products (Optional[str])
            - founding_year (Optional[int])
            - total_funding (Optional[int])
            - arr (Optional[int])
            - valuation (Optional[int])
            - employees (Optional[int])
            - g2_rating (Optional[float])
        - `CompanyListResponse(BaseModel)`: companies (List[CompanyRead]), total (int), filters_applied (Dict[str, Any])

### Health Check Endpoint
- [ ] Verificar implementación existente del health check
    - [ ] Revisar `src/backend/api/health.py` - endpoint ya implementado
    - [ ] Verificar que está registrado en `src/backend/main.py`
    - [ ] Probar manualmente: `curl http://localhost:8000/api/v1/health`
    - [ ] Verificar respuesta incluye: status, version, environment, timestamp

### Repository de Companies
- [x] Implementar CompanyRepository con Supabase
    - [x] Crear `src/backend/repositories/company_repository.py`:
        - Clase `CompanyRepository`:
            - Constructor: recibe `Client` (Supabase client)
            - Método `def get_all(industry_id: Optional[int] = None, location_id: Optional[int] = None) -> List[dict]`:
                - Crear query base: `client.table('company').select('*, industry(*), location(*)')`
                - Si `industry_id` no es None: añadir `.eq('industry_id', industry_id)`
                - Si `location_id` no es None: añadir `.eq('location_id', location_id)`
                - Ejecutar query: `response = query.execute()`
                - Retornar: `response.data` (lista de diccionarios)
    - [x] Manejar casos edge:
        - Ambos filtros aplicados: encadenar múltiples `.eq()`
        - Sin filtros: retornar todas las empresas
        - Filtros con IDs inexistentes: Supabase retorna lista vacía automáticamente
        - Manejo de errores: capturar excepciones de Supabase y propagar o loggear

### Repository de Industries
- [x] Implementar IndustryRepository con Supabase
    - [x] Crear `src/backend/repositories/industry_repository.py`:
        - Clase `IndustryRepository`:
            - Constructor: recibe `Client` (Supabase client)
            - Método `def get_all() -> List[dict]`:
                - Query: `client.table('industry').select('*').order('name')`
                - Ejecutar: `response = query.execute()`
                - Retornar: `response.data` (lista ordenada alfabéticamente por name)

### Repository de Locations
- [x] Implementar LocationRepository con Supabase
    - [x] Crear `src/backend/repositories/location_repository.py`:
        - Clase `LocationRepository`:
            - Constructor: recibe `Client` (Supabase client)
            - Método `def get_all() -> List[dict]`:
                - Query: `client.table('location').select('*').order('country').order('city')`
                - Ejecutar: `response = query.execute()`
                - Retornar: `response.data` (lista ordenada por país y luego ciudad)

### Service de Companies
- [x] Implementar CompanyService con Supabase
    - [x] Crear `src/backend/services/company_service.py`:
        - Clase `CompanyService`:
            - Constructor: recibe `Client` (Supabase client)
            - Método `def list_companies(industry_id: Optional[int], location_id: Optional[int]) -> CompanyListResponse`:
                - Crear instancia de `CompanyRepository(client)`
                - Llamar `companies_data = repository.get_all(industry_id, location_id)`
                - Transformar lista de diccionarios a lista de `CompanyRead`:
                    - Iterar sobre companies_data
                    - Para cada company dict, crear `CompanyRead` con datos nested de industry y location
                    - Manejar valores None/null en campos opcionales
                - Construir metadata: `filters_applied = {"industry_id": industry_id, "location_id": location_id}`
                - Retornar `CompanyListResponse(companies=companies_read, total=len(companies_read), filters_applied=filters_applied)`

### Service de Industries
- [x] Implementar IndustryService con Supabase
    - [x] Crear `src/backend/services/industry_service.py`:
        - Clase `IndustryService`:
            - Constructor: recibe `Client` (Supabase client)
            - Método `def list_industries() -> IndustryListResponse`:
                - Crear instancia de `IndustryRepository(client)`
                - Llamar `industries_data = repository.get_all()`
                - Transformar lista de diccionarios a `IndustryRead` usando Pydantic
                - Retornar `IndustryListResponse(industries=industries_read, total=len(industries_read))`

### Service de Locations
- [x] Implementar LocationService con Supabase
    - [x] Crear `src/backend/services/location_service.py`:
        - Clase `LocationService`:
            - Constructor: recibe `Client` (Supabase client)
            - Método `def list_locations() -> LocationListResponse`:
                - Crear instancia de `LocationRepository(client)`
                - Llamar `locations_data = repository.get_all()`
                - Transformar a `LocationRead` (con display_name = f"{city}, {country}")
                - Retornar `LocationListResponse(locations=locations_read, total=len(locations_read))`

### Router de Companies
- [x] Implementar router de empresas
    - [x] Crear `src/backend/api/companies.py`:
        - Crear `APIRouter` con prefix="/api/v1/companies", tags=["companies"]
        - Implementar endpoint `GET /`:
            - Query params: `industry_id: Optional[int] = None`, `location_id: Optional[int] = None`
            - Dependency: `client: Client = Depends(get_db)` (obtiene cliente Supabase)
            - Lógica:
                - Crear instancia de `CompanyService(client)`
                - Llamar `result = service.list_companies(industry_id, location_id)`
                - Retornar result
            - Response model: `CompanyListResponse`
            - Status code: 200
    - [x] Manejar errores:
        - Capturar excepciones de Supabase con try/except
        - Loggear error completo para debugging
        - Retornar `HTTPException(status_code=500, detail="Internal server error")`
    - [x] Registrar router en `main.py`

### Router de Industries
- [x] Implementar router de industrias
    - [x] Crear `src/backend/api/industries.py`:
        - Crear `APIRouter` con prefix="/api/v1/industries", tags=["industries"]
        - Implementar endpoint `GET /`:
            - Dependency: `client: Client = Depends(get_db)` (obtiene cliente Supabase)
            - Lógica: llamar `IndustryService(client).list_industries()`
            - Response model: `IndustryListResponse`
            - Status code: 200
    - [x] Manejar errores similares a companies endpoint
    - [x] Registrar router en `main.py`

### Router de Locations
- [x] Implementar router de ubicaciones
    - [x] Crear `src/backend/api/locations.py`:
        - Crear `APIRouter` con prefix="/api/v1/locations", tags=["locations"]
        - Implementar endpoint `GET /`:
            - Dependency: `client: Client = Depends(get_db)` (obtiene cliente Supabase)
            - Lógica: llamar `LocationService(client).list_locations()`
            - Response model: `LocationListResponse`
            - Status code: 200
    - [x] Manejar errores similares a companies endpoint
    - [x] Registrar router en `main.py`

### Configuración de CORS
- [ ] Verificar configuración de CORS existente
    - [ ] Revisar `src/backend/main.py` - CORS ya está configurado
    - [ ] Verificar que `cors_origins` incluye `http://localhost:3000`
    - [ ] Verificar que permite credentials, methods y headers necesarios
    - [ ] Documentar en `.env.example` el formato de `CORS_ORIGINS` (separado por comas)

### Logging
- [ ] Implementar logging básico
    - [ ] Crear `src/backend/core/logging_config.py`:
        - Configurar `logging` estándar de Python
        - Formato: timestamp, level, module, message
        - Handler: StreamHandler para desarrollo
    - [ ] Crear middleware de logging de requests
        - En `main.py`, añadir middleware que registre:
            - Método HTTP
            - Path
            - Status code
            - Tiempo de respuesta
    - [ ] Añadir logs en services para debugging:
        - Log al inicio de cada método: "Fetching companies with filters: {filters}"
        - Log de resultados: "Found {count} companies"

### Tests Unitarios - Services

#### Tests de CompanyService
- [ ] Crear tests para CompanyService
    - [ ] Crear `tests/services/test_company_service.py`:
        - Setup: Mock de `Client` (Supabase) y `CompanyRepository`
        - Test: `test_list_companies_without_filters()`:
            - Mock repository retorna lista de 100 dicts con datos de empresas
            - Verificar que service retorna `CompanyListResponse` con 100 empresas
            - Verificar `filters_applied` es `{"industry_id": None, "location_id": None}`
        - Test: `test_list_companies_with_industry_filter()`:
            - Mock repository retorna lista de 10 dicts de empresas de industria específica
            - Llamar service con `industry_id=1`
            - Verificar que retorna 10 empresas
            - Verificar `filters_applied` incluye `{"industry_id": 1}`
        - Test: `test_list_companies_with_location_filter()`:
            - Similar a anterior, con `location_id=2`
        - Test: `test_list_companies_with_both_filters()`:
            - Mock repository retorna lista de 3 dicts de empresas
            - Llamar con ambos filtros
            - Verificar que retorna 3 empresas con ambos filtros aplicados
        - Test: `test_list_companies_empty_result()`:
            - Mock repository retorna lista vacía
            - Verificar que service retorna `total=0` y lista vacía
        - Test: `test_list_companies_handles_null_values()`:
            - Mock repository retorna empresas con valores None en campos opcionales
            - Verificar que service maneja correctamente None sin errores

#### Tests de IndustryService
- [ ] Crear tests para IndustryService
    - [ ] Crear `tests/services/test_industry_service.py`:
        - Setup: Mock de `Client` (Supabase) y `IndustryRepository`
        - Test: `test_list_industries()`:
            - Mock repository retorna lista de 42 dicts de industrias
            - Verificar que service retorna `IndustryListResponse` con 42 industrias
            - Verificar que datos se transforman correctamente a `IndustryRead`

#### Tests de LocationService
- [ ] Crear tests para LocationService
    - [ ] Crear `tests/services/test_location_service.py`:
        - Setup: Mock de `Client` (Supabase) y `LocationRepository`
        - Test: `test_list_locations()`:
            - Mock repository retorna lista de 50 dicts de ubicaciones
            - Verificar que service retorna `LocationListResponse` con 50 ubicaciones
            - Verificar que `display_name` tiene formato "Ciudad, País"

### Tests Unitarios - Endpoints

#### Configuración de tests
- [ ] Configurar pytest para FastAPI con Supabase
    - [ ] Crear `tests/conftest.py`:
        - Fixture `mock_supabase_client`: retorna mock de Supabase Client
        - Fixture `client`: crea `TestClient` de FastAPI
        - Fixture `override_get_db`: sobreescribe dependency `get_db` con mock_supabase_client
        - Configurar app.dependency_overrides en fixture de client

#### Tests de Health Endpoint
- [ ] Verificar/actualizar tests para health endpoint
    - [ ] Crear o verificar `tests/api/test_health.py`:
        - Test: `test_health_check()`:
            - Request: `GET /api/v1/health`
            - Verificar status code: 200
            - Verificar response body incluye: status="healthy", version, environment, timestamp

#### Tests de Companies Endpoint
- [ ] Crear tests para companies endpoint
    - [ ] Crear `tests/api/test_companies.py`:
        - Setup: Mock de `get_db` dependency que retorna mock de Supabase Client
        - Test: `test_get_companies_without_filters()`:
            - Request: `GET /api/v1/companies`
            - Mock service retorna 100 empresas
            - Verificar status code: 200
            - Verificar estructura de response: `companies`, `total`, `filters_applied`
        - Test: `test_get_companies_with_industry_filter()`:
            - Request: `GET /api/v1/companies?industry_id=1`
            - Mock service retorna 10 empresas filtradas
            - Verificar status code: 200
            - Verificar que `filters_applied` incluye `industry_id=1`
        - Test: `test_get_companies_with_location_filter()`:
            - Request: `GET /api/v1/companies?location_id=2`
            - Similar a anterior
        - Test: `test_get_companies_with_both_filters()`:
            - Request: `GET /api/v1/companies?industry_id=1&location_id=2`
            - Verificar que ambos filtros se pasan correctamente
        - Test: `test_get_companies_invalid_filter()`:
            - Request: `GET /api/v1/companies?industry_id=9999`
            - Mock service retorna lista vacía (Supabase comportamiento)
            - Verificar status code: 200 (no error, solo vacío)
        - Test: `test_get_companies_supabase_error()`:
            - Mock service lanza excepción de Supabase
            - Verificar status code: 500
            - Verificar mensaje de error

#### Tests de Industries Endpoint
- [ ] Crear tests para industries endpoint
    - [ ] Crear `tests/api/test_industries.py`:
        - Setup: Mock de `get_db` dependency que retorna mock de Supabase Client
        - Test: `test_get_industries()`:
            - Request: `GET /api/v1/industries`
            - Mock service retorna lista de industrias
            - Verificar status code: 200
            - Verificar estructura: `industries`, `total`
        - Test: `test_get_industries_supabase_error()`:
            - Mock service lanza excepción de Supabase
            - Verificar status code: 500

#### Tests de Locations Endpoint
- [ ] Crear tests para locations endpoint
    - [ ] Crear `tests/api/test_locations.py`:
        - Setup: Mock de `get_db` dependency que retorna mock de Supabase Client
        - Test: `test_get_locations()`:
            - Request: `GET /api/v1/locations`
            - Mock service retorna lista de ubicaciones
            - Verificar status code: 200
            - Verificar estructura: `locations`, `total`
            - Verificar que `display_name` tiene formato correcto "Ciudad, País"
        - Test: `test_get_locations_supabase_error()`:
            - Mock service lanza excepción de Supabase
            - Verificar status code: 500

### Verificación de Coverage
- [ ] Configurar pytest-cov
    - [ ] Añadir `pytest-cov` a dependencias en `pyproject.toml`
    - [ ] Ejecutar: `uv run pytest --cov=src/backend --cov-report=html --cov-report=term`
    - [ ] Verificar que coverage es >= 60%
    - [ ] Revisar reporte HTML en `htmlcov/index.html`

### Validación de Calidad de Código
- [ ] Ejecutar linting y formateo
    - [ ] Ejecutar: `uv run ruff check src/backend`
    - [ ] Corregir warnings/errores reportados
    - [ ] Ejecutar: `uv run ruff format src/backend`
    - [ ] Verificar que todos los archivos están formateados

- [ ] Ejecutar type checking
    - [ ] Añadir `mypy` a dependencias: `uv add --dev mypy`
    - [ ] Crear `mypy.ini` con configuración:
        ```ini
        [mypy]
        python_version = 3.12
        warn_return_any = True
        warn_unused_configs = True
        disallow_untyped_defs = True
        ```
    - [ ] Ejecutar: `uv run mypy src/backend`
    - [ ] Corregir errores de tipos

### Documentación del Backend
- [ ] Actualizar README con instrucciones de backend
    - [ ] Sección "Backend Setup":
        - Requisitos: Python 3.12+, `uv` instalado, cuenta de Supabase
        - Instalación de dependencias: `cd src/backend && uv sync`
        - Configuración de `.env`:
            - Copiar `.env.example` a `.env`
            - Añadir `SUPABASE_URL` (desde dashboard de Supabase)
            - Añadir `SUPABASE_KEY` (service role key desde Supabase)
        - Comando de desarrollo: `uv run fastapi dev` o `./scripts/dev/run-backend.sh`
    - [ ] Sección "Backend Testing":
        - Comando de tests: `uv run pytest`
        - Comando de coverage: `uv run pytest --cov`
        - Nota: Tests usan mocks de Supabase, no requieren conexión real
    - [ ] Sección "Backend API Documentation":
        - URL de OpenAPI/Swagger: `http://localhost:8000/docs`
        - URL de ReDoc: `http://localhost:8000/redoc`
    - [ ] Sección "Backend Architecture":
        - Mención de uso de Supabase Python client
        - Patrón Repository → Service → Router
        - No usar ORM, acceso directo vía Supabase API

---

## Fase 2: Frontend

### Configuración Inicial del Proyecto
- [ ] Verificar configuración de Next.js
    - [ ] Revisar `src/frontend/package.json`:
        - Verificar dependencias: next, react, react-dom, typescript, tailwindcss
    - [ ] Revisar `src/frontend/tsconfig.json`:
        - Verificar paths alias: `@/*` → `./`
        - Verificar strict mode habilitado
    - [ ] Ejecutar `npm install` si es necesario

### Tipos TypeScript
- [ ] Crear definiciones de tipos
    - [ ] Crear `src/frontend/lib/types.ts`:
        - Interface `Industry`: id (number), name (string)
        - Interface `Location`: id (number), city (string), country (string), display_name (string)
        - Interface `Company`:
            - id (number)
            - name (string)
            - industry (Industry)
            - location (Location)
            - products (string | null)
            - founding_year (number | null)
            - total_funding (number | null)
            - arr (number | null)
            - valuation (number | null)
            - employees (number | null)
            - g2_rating (number | null)
        - Interface `CompanyListResponse`:
            - companies (Company[])
            - total (number)
            - filters_applied (Record<string, any>)
        - Interface `IndustryListResponse`: industries (Industry[]), total (number)
        - Interface `LocationListResponse`: locations (Location[]), total (number)
        - Interface `HealthResponse`: status (string), version (string), environment (string)

### Cliente API
- [ ] Implementar cliente API base
    - [ ] Crear `src/frontend/lib/api.ts`:
        - Definir `API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'`
        - Función `async fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T>`:
            - Construir URL completa: `${API_BASE_URL}${endpoint}`
            - Ejecutar `fetch` con options
            - Verificar response.ok, si no lanzar error con status y statusText
            - Parsear JSON: `const data = await response.json()`
            - Retornar data tipada
        - Manejo de errores: crear clase `APIError extends Error` con status code

### Funciones de Utilidad
- [ ] Implementar funciones de formateo
    - [ ] Crear `src/frontend/lib/utils.ts`:
        - Función `formatCurrency(value: number | null): string`:
            - Si value es null/undefined: retornar "N/A"
            - Si value >= 1_000_000_000_000 (trillion): retornar "$X.XT"
            - Si value >= 1_000_000_000 (billion): retornar "$X.XB"
            - Si value >= 1_000_000 (million): retornar "$X.XM"
            - Si value >= 1_000 (thousand): retornar "$X.XK"
            - Sino: retornar "$X,XXX"
        - Función `formatLocation(city: string, country: string): string`:
            - Retornar `${city}, ${country}`
        - Función `truncateText(text: string, maxLength: number): string`:
            - Si text.length <= maxLength: retornar text
            - Sino: retornar `${text.substring(0, maxLength)}...`
        - Función utilitaria `cn(...classes: any[])` para combinar clases de Tailwind (opcional, usar clsx/tailwind-merge)

### Componentes UI Base

#### Componente Select
- [ ] Crear componente Select
    - [ ] Crear `src/frontend/components/ui/Select.tsx`:
        - Props interface:
            - options: Array<{ value: string | number, label: string }>
            - value: string | number | undefined
            - onChange: (value: string | number) => void
            - placeholder: string
            - className: string (opcional)
        - Renderizar `<select>` HTML nativo con estilos Tailwind:
            - border, padding, focus:ring, rounded
        - Opción por defecto: `<option value="">{placeholder}</option>`
        - Mapear options: `<option key={opt.value} value={opt.value}>{opt.label}</option>`
        - Event handler: `onChange={(e) => props.onChange(e.target.value)}`
        - Accesibilidad: aria-label

#### Componente LoadingSpinner
- [ ] Crear componente LoadingSpinner
    - [ ] Crear `src/frontend/components/ui/LoadingSpinner.tsx`:
        - Renderizar `<div>` con animación de spinner usando Tailwind
        - Clases: `animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`
        - Props: size (opcional): "sm" | "md" | "lg"
        - Centrar spinner: flex, items-center, justify-center

#### Componente Table (base)
- [ ] Crear componente Table base
    - [ ] Crear `src/frontend/components/ui/Table.tsx`:
        - Componente `Table`: wrapper con overflow-x-auto
        - Componente `TableHeader`: thead con bg-gray-50, sticky top-0
        - Componente `TableBody`: tbody
        - Componente `TableRow`: tr con hover:bg-gray-50
        - Componente `TableHead`: th con text-left, padding, font-medium
        - Componente `TableCell`: td con padding, whitespace-nowrap (opcional)
        - Exportar todos como named exports

### Custom Hooks

#### Hook useCompanies
- [ ] Crear hook useCompanies
    - [ ] Crear `src/frontend/hooks/useCompanies.ts`:
        - Parámetros: `industryId?: number`, `locationId?: number`
        - State:
            - `companies: Company[] | null`
            - `loading: boolean` (inicial: true)
            - `error: Error | null`
        - useEffect con dependencias [industryId, locationId]:
            - Construir query params: `URLSearchParams`
            - Llamar `fetchAPI<CompanyListResponse>('/api/v1/companies?' + params)`
            - Actualizar state con data.companies
            - Catch error y actualizar state.error
            - Finally: setLoading(false)
        - Función `refetch()` para forzar recarga
        - Retornar: `{ companies, loading, error, refetch }`

#### Hook useIndustries
- [ ] Crear hook useIndustries
    - [ ] Crear `src/frontend/hooks/useIndustries.ts`:
        - State: `industries: Industry[] | null`, `loading: boolean`, `error: Error | null`
        - useEffect (solo al montar):
            - Llamar `fetchAPI<IndustryListResponse>('/api/v1/industries')`
            - Actualizar state con data.industries
        - Retornar: `{ industries, loading, error }`

#### Hook useLocations
- [ ] Crear hook useLocations
    - [ ] Crear `src/frontend/hooks/useLocations.ts`:
        - Similar a useIndustries
        - Llamar `fetchAPI<LocationListResponse>('/api/v1/locations')`
        - Retornar: `{ locations, loading, error }`

### Componente de Filtros
- [ ] Crear componente CompanyFilters
    - [ ] Crear `src/frontend/components/CompanyFilters.tsx`:
        - Usar 'use client' directive
        - Props:
            - onFilterChange: (filters: { industryId?: number, locationId?: number }) => void
        - State local:
            - selectedIndustryId: number | undefined
            - selectedLocationId: number | undefined
        - Usar hooks: `useIndustries()`, `useLocations()`
        - Renderizar dos componentes `Select`:
            - Select de industrias: options mapeadas desde industries, onChange actualiza state y llama onFilterChange
            - Select de ubicaciones: options mapeadas desde locations
        - Botón "Limpiar filtros":
            - onClick: resetea ambos selects a undefined y llama onFilterChange con filtros vacíos
        - Layout: flex row en desktop, column en mobile
        - Loading state: mostrar LoadingSpinner mientras cargan industrias/ubicaciones

### Componente de Tabla de Empresas
- [ ] Crear componente CompanyTable
    - [ ] Crear `src/frontend/components/CompanyTable.tsx`:
        - Usar 'use client' directive
        - Props:
            - companies: Company[]
            - loading: boolean
            - error: Error | null
        - Importar componentes base: Table, TableHeader, TableBody, TableRow, TableHead, TableCell
        - Importar utilidades: formatCurrency, truncateText
        - Renderizar:
            - Si loading: mostrar LoadingSpinner
            - Si error: mostrar mensaje de error con styling
            - Si companies.length === 0: mostrar "No se encontraron empresas" con ícono
            - Si companies existe: renderizar tabla
        - Estructura de tabla:
            - TableHeader con 8 columnas:
                1. Nombre
                2. Industria
                3. Ubicación
                4. Productos
                5. Año Fundación
                6. Inversión Total
                7. ARR
                8. Valoración
            - TableBody con map de companies:
                - TableRow con key={company.id}
                - TableCell para cada campo:
                    - Nombre: company.name (font-medium, text-gray-900)
                    - Industria: company.industry.name
                    - Ubicación: `${company.location.city}, ${company.location.country}`
                    - Productos: truncateText(company.products || '-', 80)
                    - Año: company.founding_year || '-'
                    - Inversión: formatCurrency(company.total_funding)
                    - ARR: formatCurrency(company.arr)
                    - Valoración: formatCurrency(company.valuation)
        - Estilos responsive:
            - overflow-x-auto en container
            - min-width en tabla para forzar scroll horizontal en mobile
            - sticky header con z-index

### Componente BackendStatus
- [ ] Crear componente BackendStatus
    - [ ] Crear `src/frontend/components/BackendStatus.tsx`:
        - Usar 'use client' directive
        - State: `health: HealthResponse | null`, `connected: boolean`
        - useEffect:
            - Función `checkHealth()` que llama `fetchAPI<HealthResponse>('/api/v1/health')`
            - setInterval cada 30 segundos para re-check
            - cleanup: clearInterval
        - Renderizar indicador:
            - Dot verde si connected, rojo si no
            - Texto: "Backend: {status}" o "Backend: Disconnected"
            - Versión y environment si está conectado
        - Styling: posición fixed bottom-right o en footer

### Página Principal
- [ ] Actualizar layout principal
    - [ ] Actualizar `src/frontend/app/layout.tsx`:
        - Metadata: title="Top SaaS Analytics", description="Dashboard de análisis de empresas SaaS"
        - HTML lang="es"
        - Body con Tailwind classes: bg-gray-50, min-h-screen
        - Importar globals.css

- [ ] Implementar página principal
    - [ ] Actualizar `src/frontend/app/page.tsx`:
        - Usar 'use client' directive
        - State:
            - selectedIndustryId: number | undefined
            - selectedLocationId: number | undefined
        - Hook: `const { companies, loading, error, refetch } = useCompanies(selectedIndustryId, selectedLocationId)`
        - Handler: `handleFilterChange(filters)`:
            - Actualizar state con nuevos filtros
            - Hook useCompanies se recargará automáticamente
        - Layout:
            - Header: título "Top SaaS Analytics" con logo placeholder
            - Section de filtros: `<CompanyFilters onFilterChange={handleFilterChange} />`
            - Indicador de resultados: "Mostrando {companies?.length || 0} empresas"
            - Section de tabla: `<CompanyTable companies={companies || []} loading={loading} error={error} />`
            - Footer con `<BackendStatus />`
        - Container: max-w-7xl, mx-auto, padding

### Variables de Entorno
- [ ] Configurar variables de entorno del frontend
    - [ ] Crear `src/frontend/.env.local.example`:
        ```
        NEXT_PUBLIC_API_URL=http://localhost:8000
        ```
    - [ ] Verificar que `.env.local` está en `.gitignore`
    - [ ] Documentar en README

### Estilos Globales
- [ ] Configurar estilos globales
    - [ ] Actualizar `src/frontend/app/globals.css`:
        - Importar Tailwind directives: @tailwind base, components, utilities
        - Definir custom scrollbar styles (opcional)
        - Definir estilos de tabla responsive
    - [ ] Verificar `tailwind.config.ts`:
        - Content: `./app/**/*.{js,ts,jsx,tsx}`, `./components/**/*.{js,ts,jsx,tsx}`
        - Theme: extender con colores personalizados si es necesario

### Pruebas Manuales de Integración
- [ ] Verificar integración frontend-backend
    - [ ] Iniciar backend: `cd src/backend && uv run fastapi dev`
    - [ ] Iniciar frontend: `cd src/frontend && npm run dev`
    - [ ] Probar en navegador `http://localhost:3000`:
        - Verificar que carga listado de 100 empresas
        - Verificar que dropdowns de filtros cargan opciones
        - Probar filtro por industria: seleccionar una industria y verificar que tabla se actualiza
        - Probar filtro por ubicación: seleccionar una ubicación y verificar que tabla se actualiza
        - Probar filtros combinados: aplicar ambos filtros
        - Probar botón "Limpiar filtros": verificar que resetea a listado completo
        - Verificar BackendStatus muestra "healthy"
        - Verificar responsive: probar en mobile (DevTools)
        - Verificar scroll horizontal en tabla en pantallas pequeñas

### Documentación del Frontend
- [ ] Actualizar README con instrucciones de frontend
    - [ ] Sección "Frontend Setup":
        - Requisitos: Node.js 18+, npm
        - Instalación de dependencias: `cd src/frontend && npm install`
        - Configuración de `.env.local`
        - Comando de desarrollo: `npm run dev` o `./scripts/dev/run-frontend.sh`
    - [ ] Sección "Frontend Structure":
        - Descripción de carpetas: app/, components/, lib/, hooks/
        - Convenciones de naming
    - [ ] Sección "Frontend Development":
        - Hot reload habilitado
        - Acceso: `http://localhost:3000`

---

## Fase 3: Refinamiento y Calidad

### Logging Avanzado en Backend
- [ ] Mejorar configuración de logging
    - [ ] Actualizar `src/backend/core/logging_config.py`:
        - Añadir formato JSON para logs (opcional, usar python-json-logger)
        - Configurar diferentes niveles por environment (DEBUG en dev, INFO en prod)
    - [ ] Añadir correlation_id en logs:
        - Middleware que genera UUID único por request
        - Almacenar en contexto de request
        - Incluir en todos los logs de esa request

- [ ] Añadir logs en puntos clave
    - [ ] Logs en repositories:
        - Log de queries ejecutadas (solo en DEBUG)
    - [ ] Logs en services:
        - Log de parámetros de entrada
        - Log de resultados (cantidad de registros)
    - [ ] Logs en endpoints:
        - Log de request recibido (método, path, query params)
        - Log de respuesta enviada (status code, tiempo de ejecución)

### Mejoras de UX en Frontend

#### Performance
- [ ] Optimizar renders de componentes
    - [ ] Añadir `React.memo` a CompanyTable para evitar re-renders innecesarios
    - [ ] Usar `useMemo` para memoizar cálculos costosos:
        - Lista de options en Select componentes
        - Filtrado/transformación de datos
    - [ ] Usar `useCallback` para memoizar handlers de eventos

- [ ] Optimizar imágenes y assets
    - [ ] Usar `next/image` si se añaden imágenes (logo, etc.)
    - [ ] Configurar lazy loading de componentes pesados (si aplica)

#### Feedback Visual
- [ ] Mejorar indicadores de estado
    - [ ] Añadir loading skeleton en tabla:
        - Mostrar estructura de tabla con placeholders animados mientras carga
    - [ ] Añadir animaciones suaves:
        - Transición fade-in al cargar datos
        - Transición de filtros (opcional con Framer Motion)
    - [ ] Añadir indicador de "X empresas encontradas" con filtros aplicados:
        - Mostrar mensaje descriptivo: "Mostrando {count} empresas de {industry} en {location}"

- [ ] Mejorar manejo de errores
    - [ ] Crear componente ErrorBoundary para capturar errores de React
    - [ ] Mostrar mensajes de error user-friendly:
        - Error de conexión: "No se pudo conectar con el servidor. Verifica tu conexión."
        - Error de datos: "Ocurrió un error al cargar los datos. Intenta recargar la página."
    - [ ] Añadir botón "Reintentar" en estados de error

#### Accesibilidad
- [ ] Validar accesibilidad WCAG AA
    - [ ] Verificar contraste de colores:
        - Headers de tabla
        - Texto sobre fondos
        - Estados de botones (hover, focus)
    - [ ] Añadir aria-labels apropiados:
        - Selects de filtros: "Filtrar por industria", "Filtrar por ubicación"
        - Botón limpiar filtros: "Limpiar todos los filtros"
        - Tabla: aria-label="Listado de empresas SaaS"
    - [ ] Verificar navegación por teclado:
        - Tab order lógico
        - Focus visible en elementos interactivos
        - Enter para activar botones

- [ ] Añadir indicadores para screen readers
    - [ ] Aria-live regions para anunciar cambios dinámicos:
        - Cuando se actualizan resultados de filtros
        - Cuando se cargan datos
    - [ ] Aria-busy en estados de loading

### Testing End-to-End (Opcional para MVP)
- [ ] Configurar Playwright (opcional)
    - [ ] Instalar Playwright: `npm install --save-dev @playwright/test`
    - [ ] Crear `playwright.config.ts` con configuración básica
    - [ ] Configurar base URL: `http://localhost:3000`

- [ ] Crear tests E2E básicos (opcional)
    - [ ] Crear `tests/e2e/companies.spec.ts`:
        - Test: "Debe cargar listado de empresas"
        - Test: "Debe filtrar por industria"
        - Test: "Debe filtrar por ubicación"
        - Test: "Debe limpiar filtros"
    - [ ] Ejecutar tests: `npx playwright test`

### Documentación Final

#### README Principal
- [ ] Actualizar README.md del proyecto
    - [ ] Sección "Descripción":
        - Descripción del proyecto
        - Problema que resuelve
        - Características principales
    - [ ] Sección "Arquitectura":
        - Diagrama de arquitectura (referencia a docs/architecture/)
        - Stack tecnológico completo
    - [ ] Sección "Requisitos":
        - Python 3.12+, uv
        - Node.js 18+, npm
        - PostgreSQL (Supabase)
    - [ ] Sección "Setup Completo":
        - Clone del repo
        - Setup de base de datos (referencias a scripts/)
        - Setup de backend (instalación, env vars, ejecutar)
        - Setup de frontend (instalación, env vars, ejecutar)
    - [ ] Sección "Desarrollo":
        - Scripts de desarrollo: `./scripts/dev/run-backend.sh`, `./scripts/dev/run-frontend.sh`
        - URLs de acceso: frontend (3000), backend API (8000), docs (8000/docs)
    - [ ] Sección "Testing":
        - Cómo ejecutar tests de backend
        - Coverage
    - [ ] Sección "Documentación":
        - Referencias a docs/ (ADRs, arquitectura, base de datos)
        - OpenAPI/Swagger docs
    - [ ] Sección "Estructura del Proyecto":
        - Árbol de directorios con explicación
    - [ ] Sección "Contribución":
        - Guías de estilo de código
        - Proceso de PR

#### Documentación de API
- [ ] Verificar documentación OpenAPI
    - [ ] Acceder a `http://localhost:8000/docs`
    - [ ] Verificar que todos los endpoints están documentados
    - [ ] Añadir descripciones detalladas a endpoints (docstrings en routers)
    - [ ] Añadir ejemplos de request/response en docstrings

#### Documentación de Componentes
- [ ] Documentar componentes principales del frontend
    - [ ] Crear `src/frontend/components/README.md`:
        - Descripción de cada componente principal
        - Props de cada componente
        - Ejemplos de uso
    - [ ] Añadir JSDoc comments en componentes complejos

### Checklist de Entrega del MVP
- [ ] Verificar checklist completo del planning.md
    - [ ] Backend:
        - [ ] Servidor corre en puerto 8000
        - [ ] Conexión a Supabase configurada correctamente
        - [ ] Health check funcional (endpoint existente verificado)
        - [ ] Endpoint /companies retorna 100 empresas
        - [ ] Filtros por industria y ubicación funcionan
        - [ ] Filtros combinados funcionan
        - [ ] Endpoint /industries retorna lista
        - [ ] Endpoint /locations retorna lista
        - [ ] CORS configurado (verificado)
        - [ ] Tests > 60% coverage
        - [ ] Linting y formateo sin errores
        - [ ] OpenAPI docs accesibles
    - [ ] Frontend:
        - [ ] Servidor corre en puerto 3000
        - [ ] Tabla muestra 100 empresas
        - [ ] Headers sticky funcionan
        - [ ] Dropdowns cargan opciones
        - [ ] Filtros actualizan tabla
        - [ ] Botón limpiar filtros funciona
        - [ ] Montos formateados correctamente
        - [ ] Valores NULL muestran "N/A"
        - [ ] Productos truncados apropiadamente
        - [ ] Hover effect en filas
        - [ ] Loading states funcionan
        - [ ] Error handling funciona
        - [ ] BackendStatus indica conexión
        - [ ] Responsive con scroll horizontal
        - [ ] Build sin errores
    - [ ] Integración:
        - [ ] Backend y frontend corren simultáneamente
        - [ ] Frontend se conecta correctamente
        - [ ] Filtros end-to-end funcionan
        - [ ] Performance < 2s carga inicial
        - [ ] Performance < 500ms filtrado
    - [ ] Documentación:
        - [ ] README actualizado
        - [ ] ADRs creados
        - [ ] Diagramas de arquitectura creados
        - [ ] Diagrama ER creado

### Preparación para Demo
- [ ] Crear script de demo
    - [ ] Script bash que:
        - Inicia backend en terminal 1
        - Inicia frontend en terminal 2
        - Espera a que ambos estén listos
        - Abre navegador en `http://localhost:3000`
    - [ ] Guardar en: `scripts/demo/start-demo.sh`

- [ ] Validar data de demo
    - [ ] Verificar que DB tiene 100 empresas cargadas
    - [ ] Verificar que hay datos variados para demostrar filtros
    - [ ] Verificar que no hay datos corruptos o NULL problemáticos

- [ ] Preparar escenarios de demo
    - [ ] Escenario 1: Exploración general (cargar página, ver todas las empresas)
    - [ ] Escenario 2: Filtrado por industria (seleccionar "CRM", ver empresas filtradas)
    - [ ] Escenario 3: Filtrado por ubicación (seleccionar "San Francisco, USA")
    - [ ] Escenario 4: Filtrado combinado (industria + ubicación)
    - [ ] Escenario 5: Limpiar filtros y volver a listado completo
    - [ ] Escenario 6: Responsive (cambiar tamaño de ventana, mostrar scroll horizontal)

---

## Notas Finales

### Dependencias entre Tareas
- **Fase 0** debe completarse antes de comenzar implementación
- **Backend** (Fase 1) debe estar funcional antes de comenzar Frontend (Fase 2)
- **Tests** deben ejecutarse después de implementar cada módulo
- **Documentación** debe actualizarse continuamente durante desarrollo

### Criterios de Aceptación Global
- ✅ Todos los endpoints backend responden correctamente
- ✅ Frontend muestra datos correctamente en formato tabular
- ✅ Filtros funcionan sin errores
- ✅ Tests pasan con coverage >= 60%
- ✅ Linting y formateo sin warnings
- ✅ Documentación completa y actualizada
- ✅ Performance cumple con métricas definidas (<2s carga inicial, <500ms filtrado)

### Próximos Pasos Post-MVP
- Evaluar feedback de usuarios
- Priorizar features adicionales según necesidades
- Considerar optimizaciones de performance si es necesario
- Planear escalabilidad si dataset crece

---

**Generado:** Noviembre 6, 2025  
**Basado en:** `.specs/features/planning.md`  
**Estado:** ✅ Listo para ejecución
