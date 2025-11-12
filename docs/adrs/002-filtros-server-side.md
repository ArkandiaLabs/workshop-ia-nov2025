# 2. Filtros server-side vs client-side

Fecha: Noviembre 11 de 2025

## Status

Aceptada.

## Contexto

El dashboard de análisis de empresas SaaS requiere funcionalidad de filtrado por industria y ubicación. Con un dataset de 100 empresas, debemos decidir si implementar filtros en el cliente (JavaScript) o en el servidor (SQL/API).

## Decisión

Implementamos filtros server-side mediante query parameters en el endpoint `GET /api/v1/companies`:

```
GET /api/v1/companies?industry_id=5&location_id=12
```

El backend ejecuta queries SQL filtradas directamente en PostgreSQL:
```sql
SELECT * FROM company 
WHERE industry_id = 5 AND location_id = 12
```

Filtros opcionales y combinables (industria sola, ubicación sola, ambos, o ninguno).

## Consecuencias

**Positivas:**
- Queries optimizadas con índices de base de datos (`idx_company_industry`, `idx_company_location`)
- Transferencia reducida de datos sobre la red (solo empresas filtradas)
- Escalabilidad: si el dataset crece a 10K empresas, no afecta performance del frontend
- Backend controla lógica de filtrado (seguridad, validación)
- Facilita auditoría y logging de filtros aplicados

**Negativas:**
- Requiere request HTTP por cada cambio de filtro (latencia de red)
- No permite filtrado instantáneo client-side sin round-trip

**Alternativas descartadas:**
- **Filtros client-side**: Enviar todas las empresas y filtrar con JavaScript. Ineficiente a escala, sobrecarga de red, lógica duplicada.
- **Híbrido**: Fetch inicial de todas, filtros en cliente. Complejo de sincronizar, pierde ventajas de ambos enfoques.
