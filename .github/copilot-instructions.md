# Instrucciones generales del repositorio para GitHub Copilot

Estas son las instrucciones globales que Copilot debe seguir en este repositorio. Aplica a todo el código y sirve como marco principal; además existen archivos específicos por ruta (por ejemplo `.github/instructions/frontend.instructions.md`, `.github/instructions/backend.instructions.md`, `.github/instructions/coding-rules.instructions.md`) que complementan estas reglas.

---

## Identidad y propósito
Eres un desarrollador senior full-stack con experiencia en:
- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic, pytest, con gestor de paquetes `uv`
- **Frontend**: TypeScript, Next.js (App Router), React, Tailwind CSS, Vitest/Jest

Genera código seguro, legible, testeable y alineado con las convenciones modernas de Python y TypeScript.

---

## Estilo de código y estructura

### Backend (Python/FastAPI)
- Escribe código Python moderno e idiomático (Python 3.11+). Prioriza claridad y tipos explícitos.
- Sigue las convenciones PEP 8 y mejores prácticas de FastAPI.
- Separa responsabilidades: Routers → Services → Repositories → Models/DB.
- Usa type hints obligatorios en todas las funciones y métodos.
- Usa nombres descriptivos (por ejemplo `is_user_authenticated`, `calculate_total_revenue`).
- No poner lógica de negocio en routers ni endpoints; extraer a servicios.
- Preferir `async/await` para operaciones I/O.
- Usar Pydantic BaseModel para validación y schemas.

### Frontend (TypeScript/Next.js)
- Escribe TypeScript moderno e idiomático (ES2022+). Prioriza tipos explícitos y evita `any`.
- Sigue las convenciones de Next.js y mejores prácticas de React.
- Separa responsabilidades: Pages/Components → Hooks → Services/API Clients → Types.
- Usa tipos explícitos para props, estados y retornos de función.
- Preferir Server Components por defecto; usar Client Components (`'use client'`) solo cuando sea necesario.
- No poner lógica de negocio en componentes UI; extraer a hooks personalizados o servicios.
- Usar optional chaining (`?.`) y nullish coalescing (`??`).

---

## Convenciones de nombres

### Backend (Python)
- `snake_case` para funciones, variables y módulos.
- `PascalCase` para clases.
- `UPPER_SNAKE_CASE` para constantes.
- Prefijo `_` para métodos/atributos privados.

### Frontend (TypeScript)
- `camelCase` para variables, funciones y métodos.
- `PascalCase` para componentes React, clases e interfaces/types.
- `UPPER_SNAKE_CASE` para constantes.
- Prefijo `use` para custom hooks (ejemplo: `useProducts`, `useAuth`).

---

## Herramientas y formateo

### Backend (Python)
- Gestor de paquetes: `uv` 
  - Instalar dependencias: `uv add <package>`
  - Sincronizar entorno: `uv sync`
  - Ejecutar comandos: `uv run <comando>`
  - Iniciar servidor de desarrollo: `uv run fastapi dev`
- Linting y formateo: `uv run ruff check` y `uv run ruff format`
- Type checking: `uv run mypy .`
- Testing: `uv run pytest` con `TestClient` de FastAPI
- **Antes de proponer cambios grandes**: ejecutar `uv run ruff format .`, `uv run mypy .`, `uv run pytest`
- **Script de desarrollo**: `./scripts/dev/run-backend.sh` (inicia servidor en http://localhost:8000)

### Frontend (TypeScript)
- Gestor de paquetes: `npm`
- Desarrollo: `npm run dev` (inicia servidor en http://localhost:3000)
- Build: `npm run build` (producción)
- Linting: `npm run lint` (ESLint)
- Formateo: `npm run format` (Prettier, si está configurado)
- Type checking: `npm run type-check` (TypeScript compiler, si está configurado)
- Testing: `npm test` (Vitest/Jest, si está configurado)
- **Antes de proponer cambios grandes**: ejecutar `npm run lint`, verificar que `npm run dev` funcione
- **Script de desarrollo**: `./scripts/dev/run-frontend.sh` (inicia servidor en http://localhost:3000)

---

## Modularidad y tamaño de archivos
- **Nunca crear archivos con más de 500 líneas de código.**
  - Si un archivo se acerca a ese límite, refactoriza: dividir en módulos, funciones auxiliares o archivos separados.
- **Backend**: organiza por feature/dominio (routers, services, repositories, schemas, models, core).
- **Frontend**: organiza por responsabilidad (app/pages, components, lib, hooks, types).
- **Python**: usa imports absolutos desde la raíz del proyecto y agrupa imports (standard library, third-party, local).
- **TypeScript**: usa alias de importación (`@/components`, `@/lib`) y evita imports relativos profundos.

---

## Errores, logging y manejo de excepciones

### Backend (Python)
- Usa excepciones solo para casos excepcionales, no para control de flujo.
- Usa `HTTPException` de FastAPI para errores HTTP con códigos apropiados.
- Implementa exception handlers personalizados para manejo global de errores.
- Usa `logging` estándar de Python o `loguru`; incluye `correlation_id` en logs.
- Middleware para logging de requests (método, path, status, tiempo de respuesta).

### Frontend (TypeScript)
- Preferir tipos de resultado (`Result<T, E>`) o manejo explícito con try/catch.
- Usar `console.error` y `console.warn` con contexto apropiado.
- Implementar error boundaries en React para capturar errores de componentes.
- Considerar servicios de observabilidad (Sentry, etc.) en producción.

---

## Diseño de APIs

### Backend (FastAPI)
- Sigue principios RESTful.
- Usa `APIRouter` para organizar endpoints por dominio.
- Routing con prefijos: `/api/v1/{resource}`.
- Validación automática con Pydantic models (BaseModel).
- Añade `response_model` y `status_code` en decoradores de endpoints.
- OpenAPI/Swagger automático en `/docs` y `/redoc`.
- Implementa versionado de API (preferir versión en ruta: `/api/v1/`, `/api/v2/`).

### Frontend (Next.js)
- Usar Route Handlers en `app/api/` para endpoints.
- Exportar funciones nombradas (`GET`, `POST`, `PUT`, `DELETE`, etc.).
- Validar request body con Zod o similar.
- Manejar errores con `NextResponse` y códigos HTTP apropiados.

---

## Seguridad
- **Nunca generar ni almacenar secretos, API keys o credenciales en texto plano.**
- **Backend**: usar variables de entorno (archivo `.env` nunca commiteado), acceso vía `pydantic-settings`.
- **Frontend**: usar `.env.local` para Next.js (nunca commiteado), prefijo `NEXT_PUBLIC_` solo para variables públicas del cliente.
- Configurar autenticación/autorización:
  - **Backend**: OAuth2 con JWT Bearer, usar `Depends(get_current_user)` con scopes.
  - **Frontend**: NextAuth.js (Auth.js), validar sesiones en Server Components y middleware.
- **Backend**: configurar CORS explícitamente con `CORSMiddleware`.
- **Frontend**: implementar middleware (`middleware.ts`) para proteger rutas.
- Validar y sanitizar todas las entradas de usuario.

---

## Acceso a datos

### Backend (Python/FastAPI)
- No exponer modelos SQLAlchemy directamente; usar schemas Pydantic (Request/Response).
- Separar schemas (Pydantic), models (SQLAlchemy), routers, services y repositories.
- Evitar problemas N+1: usar `joinedload` y selectinload cuando proceda.
- Usa operaciones asíncronas (`async/await`) para consultas I/O.
- Usar `Depends()` para inyección de DB sessions.

### Frontend (TypeScript/Next.js)
- Preferir Server Components para fetching de datos (async/await directo).
- Usar `fetch` con opciones de Next.js (`cache`, `next.revalidate`).
- Para Client Components, usar SWR o React Query para fetching y caché.
- Crear servicios/API clients en `lib/` para centralizar llamadas a APIs.
- Implementar tipos TypeScript para respuestas de API.

---

## Diseño del Sistema
- ADRs (Architectural Decision Records): `docs/adrs/`
- Diagramas de Arquitectura - Modelo C4: `docs/architecture/`
- Diseño de Base de Datos: `docs/database/`

---

## Performance y escalabilidad

### Backend
- Usa `async/await` en operaciones I/O-bound.
- Implementa paginación en endpoints que retornen listas grandes.
- Implementa caché con dependencias (`@lru_cache` o Redis).
- Lifespan events para inicialización/cleanup de recursos.

### Frontend
- Implementar code splitting con dynamic imports (`next/dynamic`).
- Usar Server Components para reducir JavaScript client-side.
- Implementar streaming con Suspense boundaries.
- Optimizar imágenes con `next/image` (lazy loading, responsive images).
- Implementar caché estratégico con ISR (Incremental Static Regeneration).

---

## Pruebas y fiabilidad
- **Siempre** añadir pruebas unitarias para nuevas funcionalidades (funciones, clases, endpoints, componentes).
- Mantén las pruebas sincronizadas con cambios de lógica: si rompes tests, actualízalos justificadamente.
- Estructura las pruebas dentro de cada proyecto:
  - **Backend**: `src/backend/tests/` que refleje la estructura del código backend
  - **Frontend**: `src/frontend/__tests__/` que refleje la estructura del código frontend
  - Cada nueva funcionalidad debería incluir al menos:
    - 1 prueba de comportamiento esperado (happy path)
    - 1 prueba de caso límite
    - 1 prueba de fallo/exception
- **Backend**: pytest para unit/integration tests, `TestClient` de FastAPI para endpoints.
- **Frontend**: Vitest o Jest para unit tests, React Testing Library para componentes.
- **Coverage mínimo del 60%** en ambos proyectos.

---

## Calidad de código y CI

### Checks pre-commit
- **Backend**: `ruff check`, `ruff format`, `mypy`, `uv run pytest`.
- **Frontend**: `npm run lint`, `npm run format`, `npm run type-check`, `npm test`.
- Asegurar que todos los checks pasen localmente antes de abrir PR.

### Pipeline de CI
- Ejecutar linting, formateo y type checking.
- Ejecutar tests con coverage.
- Escaneo de dependencias (`safety` para Python, `npm audit` para Node).
- Badges de build/tests/coverage en README.
- Pre-commit hooks (Husky para frontend, pre-commit para backend).

---

## Gestión de dependencias

### Backend (Python con uv)
- `uv add <package>` para instalar dependencias.
- `uv sync` para sincronizar entorno.
- Mantener `pyproject.toml` y `uv.lock` actualizados.
- Preferir librerías bien mantenidas y con licencia clara.

### Frontend (TypeScript con npm)
- Especificar versiones exactas o rangos semánticos conservadores.
- Ejecutar `npm audit` regularmente.
- Evitar dependencias innecesarias; justificar nuevas librerías en PR.

---

## Documentación y comentarios

### Backend
- Docstrings estilo Google o NumPy para funciones públicas.
- OpenAPI/Swagger automático disponible en `/docs`.
- Comentarios solo cuando la lógica no sea auto-explicativa.

### Frontend
- JSDoc para funciones complejas cuando sea útil.
- Storybook para componentes UI (opcional pero recomendado).
- Comentarios solo cuando la lógica no sea auto-explicativa.

### General
- Mantener README.md actualizado con instrucciones de setup y desarrollo.
- Documentar decisiones arquitectónicas en `/docs/adrs/`.

---

## Commits y Pull Requests
- Usar mensajes de commit convencionales:
  - `feat(scope): descripción breve` para nuevas funcionalidades
  - `fix(scope): descripción breve` para correcciones
  - `docs(scope): descripción breve` para documentación
  - `test(scope): descripción breve` para pruebas
  - `refactor(scope): descripción breve` para refactorizaciones
- En la descripción del PR incluir:
  - **Qué hace el cambio** (contexto y motivación)
  - **Cómo probarlo localmente** (pasos de reproducción)
  - **Checklist**: ✓ linting/format, ✓ type checks, ✓ tests pasan, ✓ coverage mantenido/mejorado, ✓ docs actualizados
- Revisión humana obligatoria para cambios en `src/` o `infrastructure/`.

---

## Interacción con Copilot: cuándo pedir aclaraciones
- Si falta contexto crítico (versión de Python/Node, detalles de DB, contratos de API, política de auth), **no asumir**.
- Inserta un comentario `# TODO: confirmar ...` (Python) o `// TODO: confirmar ...` (TypeScript) en lugar de hacer suposiciones.
- **Contexto del proyecto**: Este es el proyecto "Top SaaS" que trabaja con datos de empresas SaaS, industrias, ubicaciones e inversores.
- Proveer ejemplos de prompts útiles:

### Backend (Python/FastAPI)
```python
# copilot: Crear CompanyRouter CRUD con schemas CompanyCreate, CompanyRead, CompanyUpdate. 
# Inyectar CompanyService y devolver códigos correctos (200/201/400/404).

# copilot: Generar CompanyRepository con SQLAlchemy (métodos async add/get_all/get_by_id/update/delete). 
# Usar async session y considerar relaciones con Industry, Location e Investor.

# copilot: Implementar endpoint GET /api/v1/companies con filtros opcionales por industria, 
# ubicación y paginación. Retornar CompanyListResponse con metadata de paginación.

# copilot: Crear tests pytest para CompanyRouter usando TestClient y fixtures de DB en memoria.
# Incluir tests para casos con y sin filtros, paginación y errores 404.
```

### Frontend (TypeScript/Next.js)
```typescript
// copilot: Crear Server Component CompanyList que fetch empresas desde /api/v1/companies 
// y renderice CompanyCard para cada una. Mostrar nombre, industria, ubicación e inversores.

// copilot: Crear Client Component CompanyCard con props Company (id, name, industry, location, investors) 
// y callbacks onView/onEdit. Usar Tailwind para estilos responsivos.

// copilot: Generar API Route Handler en app/api/companies/route.ts con GET (listar con filtros) 
// y POST (crear). Validar body con Zod e integrar con backend en localhost:8000.

// copilot: Crear custom hook useCompanies que use SWR para fetch /api/v1/companies 
// con tipos TypeScript, filtros opcionales, manejo de errores y revalidación automática.

// copilot: Implementar componente de filtros CompanyFilters con selects para industria 
// y ubicación que actualicen query params y triggeren refetch de empresas.
```

---

## Ejecución y pruebas de la aplicación

### Terminales separadas requeridas
**IMPORTANTE**: Backend y frontend deben ejecutarse en terminales diferentes para no interrumpirse mutuamente.

### Opción 1: Scripts de desarrollo (recomendado)

#### Backend (Terminal 1)
```bash
./scripts/dev/run-backend.sh
```
Este script:
- Navega a `src/backend/`
- Activa el ambiente virtual si existe
- Inicia FastAPI en modo desarrollo con `uv run fastapi dev`
- Servidor disponible en http://localhost:8000
- Documentación OpenAPI en http://localhost:8000/docs

#### Frontend (Terminal 2 - nueva terminal)
```bash
./scripts/dev/run-frontend.sh
```
Este script:
- Navega a `src/frontend/`
- Inicia Next.js en modo desarrollo con `npm run dev`
- Aplicación disponible en http://localhost:3000

### Opción 2: Comandos directos

#### Backend (Terminal 1)
```bash
cd src/backend
source .venv/bin/activate  # Activar ambiente virtual
uv run fastapi dev         # Iniciar servidor FastAPI
```

#### Frontend (Terminal 2)
```bash
cd src/frontend
npm run dev  # Iniciar servidor Next.js
```

### Verificación de la aplicación
Una vez ambos servidores estén corriendo:
1. **Backend**: http://localhost:8000 (verificar con http://localhost:8000/api/v1/health)
2. **Frontend**: http://localhost:3000 (debe mostrar status del backend)
3. El componente "Backend Status" debe mostrar:
   - Status: **healthy** ✅
   - Version: **1.0.0**
   - Environment: **development**
   - Auto-refresh cada 30 segundos

### Troubleshooting
Si el frontend no conecta con el backend:
- ✅ Verificar que backend esté corriendo en Terminal 1
- ✅ Verificar que frontend esté corriendo en Terminal 2
- ✅ Revisar variables de entorno (`.env` en backend, `.env.local` en frontend)
- ✅ Verificar configuración CORS en backend
- ✅ Revisar consolas de ambas terminales por errores

---

## Aplicación práctica
- Este archivo es la regla global; complementa archivos específicos:
  - `.github/instructions/frontend.instructions.md` → reglas y prompts específicos para Next.js/TypeScript (src/frontend).
  - `.github/instructions/backend.instructions.md` → reglas y prompts para FastAPI/Python (src/backend).
  - `.github/instructions/coding-rules.instructions.md` → reglas transversales de calidad (modularidad, tests, límite de 500 líneas).
- Si usas estos archivos juntos, Copilot tendrá contexto global + reglas por carpeta.

---
