---
applyTo: "**/*"
---

# Reglas de codificación para este repositorio

Eres un desarrollador senior full-stack especializado en Python/FastAPI (backend) y TypeScript/Next.js (frontend). Sigue estas reglas generales en todo el repositorio.

## Estructura y modularidad del código
- **Nunca crees un archivo con más de 500 líneas de código.** Si se acerca a este límite, refactoriza dividiéndolo en módulos, funciones auxiliares o archivos separados.
- **Organiza el código en módulos claramente separados**, agrupados por funcionalidad o responsabilidad:
  - **Backend (Python)**: routers, services, repositories, schemas, models, core
  - **Frontend (TypeScript)**: components, app/pages, lib, hooks, types
- **Usa importaciones claras y consistentes:**
  - **Python**: agrupa imports (standard library, third-party, local) y usa imports absolutos desde la raíz del proyecto
  - **TypeScript**: usa alias de importación (ej. `@/components`, `@/lib`) y evita imports relativos profundos
- **Aplica separación de responsabilidades**: la lógica de negocio no debe estar en routers/endpoints ni en componentes de UI.

## Pruebas y fiabilidad
- **Siempre crea pruebas unitarias para cada nueva funcionalidad** (funciones, clases, endpoints, componentes).
- **Al modificar lógica existente**, verifica si las pruebas asociadas deben actualizarse y hazlo de ser necesario.
- **Las pruebas deben vivir dentro de cada proyecto:**
  - **Backend**: `src/backend/tests/` que refleje la estructura del código backend
  - **Frontend**: `src/frontend/__tests__/` que refleje la estructura del código frontend
  - Cada nueva pieza de lógica debe tener al menos:
    - Una prueba de uso esperado (happy path)
    - Una prueba de caso límite
    - Una prueba de fallo o excepción
- **Frameworks de testing:**
  - **Backend Python**: pytest para unit/integration tests, TestClient de FastAPI para endpoints
  - **Frontend TypeScript**: Vitest o Jest para unit tests, React Testing Library para componentes
- **Coverage mínimo del 60%** en ambos proyectos.

## Calidad de código y formato
- **Siempre ejecuta linting y formateo antes de hacer commit:**
  - **Backend Python**: 
    - `ruff check` y `ruff format` para linting y formateo
    - `mypy` para verificación de tipos
    - `uv run pytest` para ejecutar tests
  - **Frontend TypeScript**: 
    - `npm run lint` (ESLint)
    - `npm run format` (Prettier)
    - `npm run type-check` (TypeScript compiler)
    - `npm test` para ejecutar tests
- **Asegúrate de que linting, type checks y pruebas pasen localmente antes de abrir un PR.**

## Convenciones de código por lenguaje

### Python (Backend)
- Escribe código Python moderno e idiomático (Python 3.11+):
  - Type hints obligatorios en todas las funciones y métodos
  - Usa `async/await` para operaciones I/O
  - Preferir comprehensions y funciones built-in
  - Usa `pathlib` en lugar de `os.path`
- Convenciones de nombres (PEP 8):
  - `snake_case` para funciones, variables y módulos
  - `PascalCase` para clases
  - `UPPER_SNAKE_CASE` para constantes
  - Prefijo `_` para métodos/atributos privados
- Usa Pydantic BaseModel para validación de datos
- Docstrings estilo Google o NumPy para funciones públicas

### TypeScript (Frontend)
- Escribe TypeScript moderno e idiomático (ES2022+):
  - Tipos explícitos para parámetros de función, props y estados
  - Evitar `any`; usar `unknown` cuando el tipo sea incierto
  - Preferir `interface` para objetos, `type` para unions/intersections
  - Usar optional chaining (`?.`) y nullish coalescing (`??`)
- Convenciones de nombres:
  - `camelCase` para variables, funciones y métodos
  - `PascalCase` para componentes React, clases e interfaces/types
  - `UPPER_SNAKE_CASE` para constantes
  - Prefijo `use` para custom hooks
  - Prefijo `I` opcional para interfaces (o sin prefijo, según preferencia del equipo)
- Componentes React: preferir function components con hooks
- Usa JSDoc para funciones complejas cuando sea útil

## Gestión de dependencias
- **Backend Python**: usar `uv` como gestor de paquetes
  - `uv add <package>` para instalar dependencias
  - `uv sync` para sincronizar entorno
  - Mantener `pyproject.toml` y `uv.lock` actualizados
- **Frontend TypeScript**: usar `npm` (o `pnpm`/`yarn` si está configurado)
  - Especificar versiones exactas o rangos semánticos conservadores
  - Ejecutar `npm audit` regularmente

## Principios generales
- **Usa Inyección de Dependencias (DI)**:
  - **Python/FastAPI**: usar `Depends()` para inyección de servicios, repos, DB sessions
  - **TypeScript/Next.js**: pasar dependencias como props o usar Context API
- **Manejo de errores**:
  - **Python**: usar excepciones solo para casos excepcionales; `HTTPException` para errores HTTP en FastAPI
  - **TypeScript**: preferir tipos de resultado (`Result<T, E>`) o manejo explícito con try/catch
- **Logging**:
  - **Python**: usar `logging` estándar o `loguru`; incluir `correlation_id` en logs
  - **TypeScript**: usar `console.error/warn` con contexto; considerar servicios de observabilidad en producción
- **Prioriza la consistencia**: sigue las convenciones ya establecidas en el repositorio.

## Seguridad
- **Nunca commitear secretos, API keys o credenciales** en el código.
- Usar variables de entorno:
  - **Backend**: archivo `.env` (nunca commiteado), acceso vía `pydantic-settings`
  - **Frontend**: `.env.local` para Next.js (nunca commiteado), prefijo `NEXT_PUBLIC_` solo para variables públicas
- Validar y sanitizar todas las entradas de usuario.
- Implementar autenticación/autorización robusta (JWT, OAuth2, etc.).
- Configurar CORS explícitamente en backend.

## CI/CD
- Configurar pre-commit hooks (Husky para frontend, pre-commit para backend).
- Pipeline de CI debe ejecutar:
  - Linting y formateo
  - Type checking
  - Tests con coverage
  - Escaneo de dependencias (safety/snyk)
- Revisión humana obligatoria para cambios en `src/` e `infrastructure/`.

## Documentación
- Mantener README.md actualizado con instrucciones de setup y desarrollo.
- Documentar decisiones arquitectónicas en `/docs/adrs/`.
- Comentarios en código solo cuando la lógica no sea auto-explicativa.
- Documentar APIs:
  - **Backend**: OpenAPI/Swagger automático en `/docs`
  - **Frontend**: Storybook para componentes UI (opcional pero recomendado)
