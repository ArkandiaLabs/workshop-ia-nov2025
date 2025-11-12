# 3. Sin paginación en el MVP

Fecha: Noviembre 11 de 2025

## Status

Aceptada.

## Contexto

El endpoint `GET /api/v1/companies` debe retornar empresas con posibilidad de filtros. Con un dataset de 100 empresas y payload estimado de 50-100KB, debemos decidir si implementar paginación o retornar todas las empresas.

## Decisión

No implementamos paginación en el MVP. El endpoint `GET /api/v1/companies` retorna todas las empresas que cumplen los filtros aplicados (o todas si no hay filtros).

Response incluye metadata para futura paginación:
```json
{
  "companies": [...],
  "total": 100,
  "filters_applied": {"industry_id": null, "location_id": null}
}
```

## Consecuencias

**Positivas:**
- Desarrollo más rápido del MVP (menos complejidad en frontend/backend)
- Payload de ~50-100KB es manejable para navegadores modernos
- UX simplificada: usuario ve todas las empresas sin navegación adicional
- Filtros server-side reducen cantidad de datos cuando sea necesario

**Negativas:**
- No escalable si dataset crece significativamente (>500 empresas)
- Carga inicial puede ser lenta en conexiones lentas
- Frontend debe manejar renderizado de lista completa

**Plan de migración futura:**
- Si dataset crece a >500 empresas, refactorizar a paginación offset-based
- Backend: añadir `?page=1&limit=20` sin romper contratos actuales
- Frontend: añadir componente de paginación y estado de página

**Alternativas descartadas:**
- **Paginación offset-based**: Sobre-ingeniería para 100 empresas, complejidad prematura
- **Cursor-based pagination**: Ideal para feeds infinitos, no aplica a este caso de uso
- **Load more / Infinite scroll**: Requiere más desarrollo para beneficio marginal en MVP
