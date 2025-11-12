---
mode: agent
---

Necesito reestructurar las carpetas de tests en este proyecto para que tanto backend como frontend tengan sus propias carpetas de tests dentro de sus respectivos directorios `src`.

# Contexto actual
* Existe una carpeta `tests` en la raíz del proyecto (fuera de src)
* Dentro de src tenemos:
 * backend (proyecto Python/FastAPI)
 * frontend (proyecto Next.js/TypeScript)

# Estructura objetivo
* Backend: `src/backend/tests/`
* Frontend: `src/frontend/__tests__/`

# Tareas a realizar
* Crear la nueva estructura de tests solicitada
* Eliminar la estructura actual que no aplica
* Actualiza el archivo `pyproject.toml` con las nuevas rutas de tests
* Actualiza los archivos `tasks.md` con TODAS las referencias de rutas de tests
* Actualiza los archivos `copilot-instructions.md` y `README` con las nuevas rutas de tests
* Actualiza rutas de coverage en el `.gitignore`