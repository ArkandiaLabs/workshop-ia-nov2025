# Workshop IA - Noviembre 2025

Proyecto full-stack para workshop de Inteligencia Artificial usando FastAPI (Backend) y Next.js (Frontend).

## 🏗️ Estructura del Proyecto

```
workshop-ia-nov2025/
├── src/
│   ├── backend/          # API FastAPI (Python 3.12+, uv)
│   │   └── tests/        # Pruebas unitarias backend
│   └── frontend/         # App Next.js 16 (TypeScript, React 19)
│       └── __tests__/    # Pruebas unitarias frontend
├── scripts/
│   ├── database/         # Scripts SQL y dataset
│   └── dev/              # Scripts de desarrollo (run-backend.sh, run-frontend.sh)
├── docs/adrs/            # Decisiones arquitectónicas
└── .specs/               # Especificaciones y planning
```

## 🚀 Quick Start

### Requisitos
- **Backend**: Python 3.12+ y `uv`
- **Frontend**: Node.js 18+ y `npm`

### ⚠️ Configuración Inicial (una sola vez)

```bash
# Backend
cd src/backend
cp .env.example .env
uv sync

# Frontend (en otra terminal)
cd src/frontend
cp .env.local.example .env.local
npm install
```

### 🎯 Ejecutar la Aplicación

**Usa terminales separadas para cada servidor:**

**Terminal 1 - Backend (http://localhost:8000):**
```bash
./scripts/dev/run-backend.sh
```

**Terminal 2 - Frontend (http://localhost:3000):**
```bash
./scripts/dev/run-frontend.sh
```

### 📍 URLs Importantes
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/v1/health

## ✅ Verificación

Abre http://localhost:3000 y verifica que el componente "Backend Status" muestre:
- Status: **healthy** ✅
- Version: **1.0.0**
- Environment: **development**
- Auto-refresh cada 30 segundos

**Troubleshooting:** Si no ves status "healthy", verifica que ambos servidores estén corriendo y las variables de entorno configuradas correctamente.

## 🛠️ Stack Tecnológico

| Backend | Frontend |
|---------|----------|
| Python 3.12 + FastAPI | TypeScript + Next.js 16 |
| uv (gestor de paquetes) | npm |
| Pydantic (validación) | React 19 (App Router) |
| Ruff + MyPy (calidad) | Tailwind CSS |
| Uvicorn (servidor ASGI) | SWR (data fetching) |

## � Backend Setup

### Requisitos
- Python 3.12+
- `uv` instalado ([instrucciones](https://docs.astral.sh/uv/))
- Cuenta de Supabase (para credenciales de base de datos)

### Instalación

1. **Navegar a carpeta backend:**
   ```bash
   cd src/backend
   ```

2. **Instalar dependencias:**
   ```bash
   uv sync
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   Editar `.env` e incluir:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-service-role-key
   ```
   (Obtener credenciales del dashboard de Supabase)

4. **Iniciar servidor de desarrollo:**
   ```bash
   ./scripts/dev/run-backend.sh
   # o manualmente:
   uv run fastapi dev
   ```
   Servidor disponible en: **http://localhost:8000**

### Estructura Backend

```
src/backend/
├── api/              # Routers de endpoints (REST)
├── services/         # Lógica de negocio
├── repositories/     # Acceso a datos (Supabase)
├── schemas/          # Validación (Pydantic)
├── core/             # Configuración, database
├── tests/            # Pruebas unitarias
└── main.py           # Punto de entrada FastAPI
```

### Arquitectura Backend

**Patrón por capas:**
```
HTTP Request
    ↓
Routers (api/) → valida query params
    ↓
Services (services/) → lógica de negocio
    ↓
Repositories (repositories/) → consultas a Supabase
    ↓
Schemas (schemas/) → transformación de datos
    ↓
HTTP Response
```

**Base de datos:** PostgreSQL (Supabase)
- Sin ORM: usamos Supabase Python client directamente
- Queries simples y eficientes
- Fácil testing con mocks

## 🧪 Backend Testing

### Ejecutar tests

```bash
cd src/backend

# Todos los tests
uv run pytest

# Con reporte de cobertura
uv run pytest --cov=backend --cov-report=html

# Tests específicos
uv run pytest tests/api/test_companies.py -v
```

### Estructura de tests

```
src/backend/tests/
├── conftest.py              # Fixtures compartidas (mock clients, TestClient)
├── api/
│   ├── test_health.py       # Tests endpoint health
│   ├── test_companies.py    # Tests CRUD companies
│   ├── test_industries.py   # Tests listar industries
│   └── test_locations.py    # Tests listar locations
└── services/                # Tests de servicios (si es necesario)
```

### Cobertura de tests

**Requisito mínimo:** 60%  
**Actual:** 99% ✅

Ejecutar:
```bash
uv run pytest --cov=backend --cov-report=html
# Abre: htmlcov/index.html
```

### Fixtures de test

**conftest.py proporciona:**
- `mock_supabase_client`: Mock de cliente Supabase
- `client`: TestClient de FastAPI con dependencias sobrescritas
- Limpieza automática después de cada test

Ejemplo de test:
```python
def test_get_companies(client: TestClient, mock_supabase_client: MagicMock) -> None:
    # Mock del repositorio
    mock_query = MagicMock()
    mock_query.select.return_value = mock_query
    mock_query.execute.return_value = MagicMock(data=[...])
    mock_supabase_client.table.return_value = mock_query
    
    # Request HTTP
    response = client.get("/api/v1/companies")
    
    # Assertions
    assert response.status_code == 200
```

## 📖 Backend API Documentation

### OpenAPI/Swagger

**URL:** http://localhost:8000/docs

Todos los endpoints están documentados automáticamente con:
- Descripción y propósito
- Parámetros (query, path, body)
- Esquemas de request/response
- Ejemplo de respuesta

### ReDoc

**URL:** http://localhost:8000/redoc

Documentación interactiva alternativa.

### Health Check

**Endpoint:** `GET /api/v1/health`

**Respuesta:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2024-11-11T12:00:00Z"
}
```

### Endpoints de Datos

#### Get Companies
```
GET /api/v1/companies?industry_id=1&location_id=2
```

**Query params:**
- `industry_id` (opcional): Filtrar por industria
- `location_id` (opcional): Filtrar por ubicación

**Response:**
```json
{
  "companies": [
    {
      "id": 1,
      "name": "Company Name",
      "industry": { "id": 1, "name": "Software" },
      "location": { "id": 1, "city": "San Francisco", "country": "USA" },
      "products": "Product A, Product B",
      "founding_year": 2020,
      "total_funding": 1000000,
      "arr": 100000,
      "valuation": 5000000,
      "employees": 50,
      "g2_rating": 4.8
    }
  ],
  "total": 100,
  "filters_applied": {
    "industry_id": 1,
    "location_id": 2
  }
}
```

#### Get Industries
```
GET /api/v1/industries
```

**Response:**
```json
{
  "industries": [
    { "id": 1, "name": "Software" },
    { "id": 2, "name": "SaaS" }
  ],
  "total": 42
}
```

#### Get Locations
```
GET /api/v1/locations
```

**Response:**
```json
{
  "locations": [
    {
      "id": 1,
      "city": "San Francisco",
      "country": "USA",
      "display_name": "San Francisco, USA"
    }
  ],
  "total": 50
}
```

## ✅ Validación de Calidad de Código

### Linting y Formateo

```bash
cd src/backend

# Formateo automático
uv run ruff format .

# Linting (revisar issues)
uv run ruff check .
```

### Type Checking

```bash
cd src/backend

# Verificar tipos con mypy
uv run mypy .
```

**Configuración:** `mypy.ini` (strict mode habilitado)

### Pre-commit Checks

Antes de hacer commit, ejecutar:
```bash
cd src/backend
uv run ruff format .
uv run ruff check .
uv run mypy .
uv run pytest
```

---

## �📋 Comandos Útiles

### Backend (desde `src/backend/`)
```bash
# Desarrollo
uv run fastapi dev                  # Iniciar servidor

# Formateo y linting
uv run ruff format .                # Formateo automático
uv run ruff check .                 # Linting
uv run mypy .                       # Type checking

# Tests
uv run pytest                       # Todos los tests
uv run pytest -v                    # Verbose
uv run pytest --cov                 # Con cobertura
uv run pytest tests/api/test_companies.py  # Test específico

# Dependencias
uv add <package>                    # Instalar paquete
uv sync                             # Sincronizar ambiente
```

### Frontend (desde `src/frontend/`)
```bash
npm run dev                   # Desarrollo
npm run build                 # Build producción
npm run lint                  # Linting
npm test                      # Tests
```

## 🏛️ Arquitectura

**Backend (Patrón por capas):**
- `api/` → Routers (endpoints HTTP)
- `services/` → Lógica de negocio
- `repositories/` → Acceso a datos
- `schemas/` → Validación (Pydantic)

**Frontend (Next.js App Router):**
- `app/` → Pages y layouts
- `components/` → Componentes React
- `lib/` → Utilidades, tipos, API client

## 🔐 Variables de Entorno

Copiar archivos de ejemplo y configurar:
- **Backend**: `src/backend/.env.example` → `.env`
- **Frontend**: `src/frontend/.env.local.example` → `.env.local`

## 📝 Convenciones de Código

**Reglas generales:**
- Máximo **500 líneas por archivo**
- Type hints/tipos explícitos obligatorios
- Coverage mínimo: **60%**

**Python:** `snake_case` (funciones/vars), `PascalCase` (clases), docstrings Google  
**TypeScript:** `camelCase` (funciones/vars), `PascalCase` (componentes), prefijo `use` (hooks)

Ver [`.github/instructions/coding-rules.instructions.md`](.github/instructions/coding-rules.instructions.md) para detalles completos.

## 🧪 Testing

**Estructura de tests:**
- **Backend**: `src/backend/tests/` (mirrors backend structure)
- **Frontend**: `src/frontend/__tests__/` (mirrors frontend structure)

### Backend
```bash
cd src/backend
uv run pytest                 # Run all tests
uv run pytest --cov           # Run with coverage report
```

### Frontend
```bash
cd src/frontend
npm test                      # Run all tests
```

## 📖 Documentación

- [Instrucciones Generales (Copilot)](.github/copilot-instructions.md)
- [Reglas de Codificación](.github/instructions/coding-rules.instructions.md)
- [Instrucciones Frontend](.github/instructions/frontend.instructions.md)
- [Instrucciones Backend](.github/instructions/backend.instructions.md)

## 📄 License

Este proyecto es parte del Workshop IA - Noviembre 2025 de Manuel Zapata.

---

**Workshop IA - Noviembre 2025** | [Manuel Zapata](https://manuelzapata.gumroad.com/l/workshop-guiado-ai)
