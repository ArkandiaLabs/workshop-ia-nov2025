<!--
SYNC IMPACT REPORT
==================
Version Change: 0.0.0 → 1.0.0
Bump Rationale: Initial constitution creation (MAJOR: First governance document)

Modified Principles:
- N/A (Initial version)

Added Sections:
- Principios Fundamentales (6 principios)
- Estándares de Calidad y Seguridad
- Flujo de Desarrollo y Revisión

Removed Sections:
- N/A (Initial version)

Templates Status:
✅ plan-template.md - Compatible (constitution checks can be applied)
✅ spec-template.md - Compatible (requirements align with principles)
✅ tasks-template.md - Compatible (task categorization matches principles)
⚠️ No command templates found to update

Follow-up TODOs:
- None - All placeholders filled

Last Updated: 2025-11-18
-->

# Workshop IA - Top SaaS Constitution

## Principios Fundamentales

### I. Arquitectura por Capas (NON-NEGOTIABLE)

**Backend DEBE seguir estrictamente**: Routers → Services → Repositories → Database/Models

**Justificación**: La separación de responsabilidades garantiza código testeable, mantenible y escalable. Ninguna lógica de negocio puede residir en routers o endpoints; DEBE extraerse a servicios.

**Reglas concretas**:
- Routers SOLO validan parámetros y delegan a servicios
- Services contienen toda la lógica de negocio
- Repositories encapsulan acceso a datos (Supabase/DB)
- Schemas Pydantic para validación de entrada/salida
- PROHIBIDO: exponer modelos de BD directamente en respuestas

**Frontend DEBE seguir**: Pages/Components → Hooks → Services/API Clients → Types

**Reglas concretas**:
- Server Components por defecto, Client Components solo cuando sea necesario
- Lógica de negocio extraída a hooks personalizados o servicios
- API clients centralizados en `lib/`
- Tipos TypeScript explícitos para todas las respuestas de API

### II. Testing Obligatorio (NON-NEGOTIABLE)

**Cada nueva funcionalidad DEBE incluir**:
- 1 prueba de comportamiento esperado (happy path)
- 1 prueba de caso límite
- 1 prueba de fallo/excepción

**Coverage mínimo**: 60% en backend y frontend

**Estructura de tests**:
- Backend: `src/backend/tests/` que refleje estructura del código
- Frontend: `src/frontend/__tests__/` que refleje estructura del código

**Frameworks obligatorios**:
- Backend: pytest con `TestClient` de FastAPI
- Frontend: Vitest/Jest con React Testing Library

**Justificación**: Los tests son la única garantía de que el código funciona correctamente y previenen regresiones. Sin tests, el código es inmantenible.

### III. Modularidad y Límite de Tamaño

**PROHIBIDO**: Archivos con más de 500 líneas de código

**Obligatorio**: Cuando un archivo se acerca al límite, DEBE refactorizarse:
- Dividir en módulos más pequeños
- Extraer funciones auxiliares
- Separar en archivos independientes

**Organización**:
- Backend: por feature/dominio (routers, services, repositories, schemas, models, core)
- Frontend: por responsabilidad (app/pages, components, lib, hooks, types)

**Justificación**: Los archivos pequeños son más fáciles de entender, probar, revisar y mantener. La modularidad reduce el acoplamiento y aumenta la reutilización.

### IV. Type Safety Obligatorio

**Backend Python**:
- Type hints OBLIGATORIOS en todas las funciones y métodos
- `mypy` en modo strict DEBE pasar sin errores
- Pydantic BaseModel para validación de datos
- Docstrings estilo Google o NumPy para funciones públicas

**Frontend TypeScript**:
- Tipos explícitos para props, estados y retornos de función
- PROHIBIDO: uso de `any` (usar `unknown` si el tipo es incierto)
- Interfaces para objetos, types para unions/intersections
- Optional chaining (`?.`) y nullish coalescing (`??`)

**Justificación**: Los tipos explícitos previenen errores en tiempo de compilación, mejoran la documentación del código y facilitan el refactoring seguro.

### V. Convenciones de Nombres Consistentes

**Backend Python**:
- `snake_case`: funciones, variables, módulos
- `PascalCase`: clases
- `UPPER_SNAKE_CASE`: constantes
- Prefijo `_`: métodos/atributos privados

**Frontend TypeScript**:
- `camelCase`: variables, funciones, métodos
- `PascalCase`: componentes React, clases, interfaces/types
- `UPPER_SNAKE_CASE`: constantes
- Prefijo `use`: custom hooks (ej: `useCompanies`, `useAuth`)

**Nombres descriptivos obligatorios**: `is_user_authenticated`, `calculateTotalRevenue` (NO: `check`, `calc`)

**Justificación**: Las convenciones consistentes facilitan la lectura del código y reducen la carga cognitiva al cambiar entre archivos.

### VI. Imports y Estructura de Archivos

**Backend Python**:
- Imports absolutos desde raíz del proyecto
- Agrupar imports: standard library, third-party, local
- Un import por línea

**Frontend TypeScript**:
- Alias de importación: `@/components`, `@/lib`
- EVITAR: imports relativos profundos (`../../../lib/utils`)
- Imports consistentes en todo el proyecto

**Justificación**: Los imports organizados facilitan la comprensión de dependencias y previenen ciclos de importación.

## Estándares de Calidad y Seguridad

### Seguridad (NON-NEGOTIABLE)

**PROHIBIDO**:
- Secretos, API keys o credenciales en código fuente
- Credentials en archivos commiteados (`.env`, `.env.local` NUNCA en git)
- Exposición de modelos de BD directamente en APIs

**OBLIGATORIO**:
- Variables de entorno para secretos (backend: `.env`, frontend: `.env.local`)
- Validación y sanitización de TODAS las entradas de usuario
- CORS configurado explícitamente en backend
- Autenticación/autorización robusta (OAuth2 con JWT para backend, NextAuth.js para frontend)
- Middleware de protección de rutas en frontend

**Justificación**: La seguridad no es opcional. Un solo error puede comprometer todo el sistema y los datos de usuarios.

### Linting y Formateo

**Backend Python** (checks pre-commit):
- `uv run ruff format .` - formateo automático
- `uv run ruff check .` - linting
- `uv run mypy .` - type checking
- `uv run pytest` - tests

**Frontend TypeScript** (checks pre-commit):
- `npm run lint` - ESLint
- `npm run format` - Prettier (si está configurado)
- `npm run type-check` - TypeScript compiler
- `npm test` - tests

**Pipeline CI DEBE ejecutar**:
- Linting y formateo
- Type checking
- Tests con coverage
- Escaneo de dependencias (`safety` para Python, `npm audit` para Node)

**Justificación**: El código debe pasar todos los checks automáticos antes de revisión humana. Los humanos no deben revisar estilo, solo lógica.

### Performance y Escalabilidad

**Backend**:
- `async/await` OBLIGATORIO para operaciones I/O
- Paginación en endpoints que retornen listas grandes
- Caché estratégico con `@lru_cache` o Redis
- Lifespan events para inicialización/cleanup

**Frontend**:
- Server Components para reducir JavaScript client-side
- Code splitting con `next/dynamic`
- Optimización de imágenes con `next/image`
- ISR (Incremental Static Regeneration) para caché estratégico

**Justificación**: La performance no es un añadido posterior, es un requisito desde el diseño.

### Diseño de APIs

**Backend FastAPI**:
- Principios RESTful
- `APIRouter` con prefijos `/api/v1/{resource}`
- `response_model` y `status_code` en decoradores
- OpenAPI/Swagger automático en `/docs` y `/redoc`
- Versionado en ruta (preferir `/api/v1/`, `/api/v2/`)

**Frontend Next.js**:
- Route Handlers en `app/api/`
- Funciones nombradas exportadas (`GET`, `POST`, `PUT`, `DELETE`)
- Validación con Zod
- `NextResponse` con códigos HTTP apropiados

**Justificación**: Las APIs consistentes y bien documentadas facilitan la integración y el mantenimiento.

## Flujo de Desarrollo y Revisión

### Commits Convencionales

**Formato OBLIGATORIO**:
- `feat(scope): descripción` - nuevas funcionalidades
- `fix(scope): descripción` - correcciones
- `docs(scope): descripción` - documentación
- `test(scope): descripción` - pruebas
- `refactor(scope): descripción` - refactorizaciones

**Ejemplos válidos**:
- `feat(companies): add filtering by industry and location`
- `fix(auth): correct JWT token validation logic`
- `test(companies): add tests for filtering endpoints`

### Pull Requests

**Checklist OBLIGATORIO en descripción del PR**:
- ✓ Linting/format ejecutado y pasando
- ✓ Type checks ejecutados y pasando
- ✓ Tests ejecutados y pasando
- ✓ Coverage mantenido o mejorado (≥60%)
- ✓ Documentación actualizada

**Descripción DEBE incluir**:
- **Qué hace el cambio** (contexto y motivación)
- **Cómo probarlo localmente** (pasos de reproducción)
- **Screenshots/videos** (si hay cambios visuales)

**Revisión humana OBLIGATORIA** para:
- Cambios en `src/backend/` y `src/frontend/`
- Cambios en `infrastructure/`
- Cambios en configuración de seguridad

### Gestión de Dependencias

**Backend (uv)**:
- `uv add <package>` para instalar
- `uv sync` para sincronizar
- Mantener `pyproject.toml` y `uv.lock` actualizados
- Preferir librerías bien mantenidas y con licencia clara

**Frontend (npm)**:
- Versiones exactas o rangos semánticos conservadores
- `npm audit` regular
- Justificar nuevas dependencias en PR

**Justificación**: Las dependencias descontroladas aumentan la superficie de ataque y dificultan el mantenimiento.

### Documentación

**OBLIGATORIO mantener actualizado**:
- README.md con instrucciones de setup
- ADRs en `docs/adrs/` para decisiones arquitectónicas
- Diagramas C4 en `docs/architecture/`
- Diseño de BD en `docs/database/`

**Comentarios en código**:
- SOLO cuando la lógica no sea auto-explicativa
- Backend: docstrings para funciones públicas
- Frontend: JSDoc para funciones complejas

**Justificación**: El código se lee más veces de las que se escribe. La documentación es esencial para nuevos desarrolladores.

## Governance

Esta constitución **supersede todas las demás prácticas** del repositorio y es aplicable a todo el código en `src/backend/` y `src/frontend/`.

### Verificación de Cumplimiento

- Todos los PRs DEBEN verificar cumplimiento de estos principios
- Revisores DEBEN rechazar código que viole principios NON-NEGOTIABLE
- Violaciones DEBEN justificarse en sección "Complexity Tracking" de documentación técnica

### Enmiendas

Cambios a esta constitución requieren:
- Documentación del cambio propuesto
- Aprobación del equipo técnico
- Plan de migración para código existente que se vea afectado
- Actualización de archivos de instrucciones (`.github/instructions/`)

### Versionado de Constitución

- **MAJOR**: Cambios incompatibles hacia atrás en principios/governance
- **MINOR**: Nuevos principios/secciones o expansión material de guías
- **PATCH**: Clarificaciones, correcciones de redacción, refinamientos no-semánticos

### Archivos de Referencia

- **Instrucciones globales**: `.github/copilot-instructions.md`
- **Reglas de codificación**: `.github/instructions/coding-rules.instructions.md`
- **Backend específico**: `.github/instructions/backend.instructions.md`
- **Frontend específico**: `.github/instructions/frontend.instructions.md`

**Versión**: 1.0.0 | **Ratificado**: 2025-11-18 | **Última Enmienda**: 2025-11-18
