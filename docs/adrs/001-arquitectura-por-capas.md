# 1. Arquitectura por capas con Supabase

Fecha: Noviembre 11 de 2025

## Status

Aceptada.

## Contexto

El proyecto Top SaaS Analytics Platform requiere una arquitectura que garantice separación de responsabilidades, facilite testing y mantenimiento, y permita desarrollo paralelo del equipo. Se necesita integración con Supabase (PostgreSQL) para persistencia de datos.

## Decisión

Adoptamos arquitectura por capas con el siguiente flujo:

**Backend (Python/FastAPI):**
- **Routers** (API Layer): Endpoints REST, validación de requests
- **Services** (Business Logic): Lógica de negocio y transformación de datos
- **Repositories** (Data Access): Operaciones de base de datos usando Supabase Python Client
- **Supabase Client**: Cliente nativo de Supabase en lugar de ORM (SQLAlchemy)

**Frontend (TypeScript/Next.js):**
- **Pages/Components**: UI y presentación
- **Hooks**: Estado y side effects
- **Services**: Llamadas a API backend
- **Types**: Contratos de datos TypeScript

**Justificación de Supabase Python Client vs ORM:**
- Cliente oficial optimizado para PostgreSQL de Supabase
- API REST-like simplificada (`.table().select()`)
- Reduce complejidad de setup (sin migraciones, sin mapeo ORM)
- Integración directa con características de Supabase (RLS, Auth)

## Consecuencias

**Positivas:**
- Testing simplificado con mocks por capa
- Desarrollo paralelo: frontend/backend/database trabajando simultáneamente
- Código mantenible y extensible
- Curva de aprendizaje reducida vs SQLAlchemy

**Negativas:**
- No se aprovechan features avanzadas de ORM (lazy loading, relaciones complejas)
- Queries escritas como strings/métodos encadenados vs type-safe ORM
- Dependencia directa de API de Supabase

**Alternativas descartadas:**
- SQLAlchemy ORM: Mayor complejidad para MVP
- Arquitectura monolítica: Dificulta testing y mantenibilidad
- DDD completo: Sobre-ingeniería para dataset de 100 empresas
