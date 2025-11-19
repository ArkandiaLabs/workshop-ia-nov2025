# Research: Gráfico de Empresas por Industria en Dashboard

**Feature**: 001-industry-chart  
**Date**: 2025-11-18  
**Purpose**: Resolver clarificaciones técnicas y establecer decisiones de diseño antes de implementación

## Research Questions Resolved

### 1. Librería de Gráficos para React/Next.js

**Question**: ¿Qué librería de gráficos usar que sea compatible con React 19 y Next.js 15 App Router?

**Decision**: **Recharts 2.10+**

**Rationale**:
- **Compatibilidad**: Totalmente compatible con React 19 y Next.js 15 (usa componentes de React puros)
- **Developer Experience**: API declarativa simple, fácil de usar y mantener
- **Performance**: Renderizado eficiente con SVG, lazy loading nativo
- **Customización**: Altamente personalizable con Tailwind CSS
- **TypeScript**: Excelente soporte de tipos out-of-the-box
- **Tamaño**: ~100KB gzipped (razonable para la funcionalidad)
- **Mantenimiento**: Activamente mantenido, comunidad grande

**Alternatives Considered**:
- **Chart.js + react-chartjs-2**: Más pesado (~180KB), renderizado Canvas menos flexible para responsive
- **Victory**: API más compleja, mayor curva de aprendizaje, menos usado en Next.js
- **Nivo**: Excelente pero más pesado (~200KB), overkill para este caso de uso simple
- **D3.js directo**: Demasiado bajo nivel, requiere más código custom, dificulta mantenimiento

**Implementation Notes**:
- Usar `BarChart` de Recharts para visualización principal
- Componente será Client Component (`'use client'`) para interactividad (tooltips)
- Wrapper Server Component para data fetching inicial

---

### 2. Endpoint de Agregación en Backend

**Question**: ¿Extender endpoint existente `/api/v1/industries` o crear uno nuevo para stats?

**Decision**: **Extender endpoint existente con nuevo path `/api/v1/industries/stats`**

**Rationale**:
- **Consistencia**: Mantiene agrupación lógica de recursos relacionados con industrias
- **RESTful**: Sigue convención REST de sub-recursos (`/industries/stats`)
- **Mantenibilidad**: Un solo router para toda la lógica de industrias
- **Escalabilidad**: Fácil agregar más stats en el futuro (ej: `/industries/stats/trends`)
- **Separación de concerns**: Service y Repository separados para lógica de agregación

**Alternatives Considered**:
- **Crear `/api/v1/stats/industries`**: Fragmenta la API, menos intuitivo para consumidores
- **Agregar parámetro query `?stats=true`**: Menos explícito, mezcla respuestas diferentes en mismo endpoint
- **Crear nuevo router `/api/v1/industry-stats`**: Redundante, aumenta complejidad sin beneficio

**Implementation Notes**:
```python
# En api/industries.py
@router.get("/stats", response_model=IndustryStatsResponse)
async def get_industry_stats(
    location_id: Optional[int] = None,
    service: IndustryStatsService = Depends(get_industry_stats_service)
) -> IndustryStatsResponse:
    """Get aggregated company count by industry"""
    return await service.get_stats(location_id=location_id)
```

---

### 3. Estructura de Datos para Respuesta del Endpoint

**Question**: ¿Qué estructura de datos retornar para maximizar usabilidad y minimizar procesamiento en frontend?

**Decision**: **Retornar lista de objetos con cálculos pre-computados**

**Rationale**:
- **Backend hace el trabajo pesado**: Agregación y cálculo de porcentajes en BD
- **Frontend simple**: Solo mapea datos directamente a componente de gráfico
- **Performance**: Una query SQL con GROUP BY en vez de múltiples queries
- **Type Safety**: Schemas Pydantic claros y validados

**Data Structure**:
```typescript
// Frontend types
interface IndustryStatItem {
  id: number
  name: string
  company_count: number
  percentage: number  // Pre-calculado en backend
}

interface IndustryStatsResponse {
  stats: IndustryStatItem[]
  total_companies: number
  total_industries: number
}
```

```python
# Backend schemas
class IndustryStatItem(BaseModel):
    id: int
    name: str
    company_count: int
    percentage: float  # Calculado: (company_count / total_companies) * 100

class IndustryStatsResponse(BaseModel):
    stats: list[IndustryStatItem]
    total_companies: int
    total_industries: int
```

**Alternatives Considered**:
- **Solo counts, frontend calcula porcentajes**: Duplica lógica, más propenso a errores
- **Retornar raw SQL results**: Menos type-safe, más procesamiento en frontend
- **Nested objects por industria**: Más complejo de parsear, sin beneficio real

**SQL Query Approach**:
```sql
-- Conceptual (implementado en repository con Supabase client)
SELECT 
    i.id,
    i.name,
    COUNT(c.id) as company_count,
    (COUNT(c.id)::float / (SELECT COUNT(*) FROM companies WHERE ...)) * 100 as percentage
FROM industries i
LEFT JOIN companies c ON c.industry_id = i.id
WHERE c.id IS NOT NULL  -- Solo industrias con empresas
GROUP BY i.id, i.name
ORDER BY company_count DESC
```

---

### 4. Handling de Filtros del Dashboard

**Question**: ¿Cómo integrar el gráfico con filtros existentes del dashboard sin implementar caché?

**Decision**: **Pasar filtros como query params al endpoint, re-fetch completo en cada cambio**

**Rationale**:
- **Sin caché**: Cumple requisito explícito del usuario
- **Simplicidad**: No requiere state management complejo
- **Consistencia**: Misma estrategia que otros componentes del dashboard
- **Real-time data**: Siempre muestra datos actuales

**Implementation Notes**:
- Endpoint acepta `location_id` opcional como query param
- Frontend pasa filtros actuales al hacer fetch
- Re-fetch automático cuando cambian filtros (useEffect dependency)
- Loading state mientras se obtienen nuevos datos

```typescript
// Frontend hook pattern
const { data, isLoading, error } = useIndustryStats({
  locationId: currentLocationFilter  // del state del dashboard
})

useEffect(() => {
  // Re-fetch cuando cambian filtros
}, [currentLocationFilter])
```

**Trade-offs Accepted**:
- ❌ Más requests al backend (pero <1s según performance goals)
- ✅ Sin complejidad de caché invalidation
- ✅ Datos siempre frescos
- ✅ Más fácil de debuggear

**Alternatives Considered**:
- **React Query con caché**: Viola requisito de no-caché del usuario
- **SWR con revalidación**: Mismo problema, añade caché
- **Redux/Zustand para state**: Overkill para esta feature simple

---

### 5. Responsive Design Strategy

**Question**: ¿Cómo hacer el gráfico responsive en 320px-2560px sin perder legibilidad?

**Decision**: **Breakpoints con Tailwind + responsive config de Recharts**

**Rationale**:
- **Tailwind breakpoints**: `sm`, `md`, `lg`, `xl` para ajustar contenedor
- **Recharts ResponsiveContainer**: Ajusta automáticamente al width del padre
- **Aspect ratio dinámico**: Altura se ajusta según ancho
- **Font scaling**: Tailwind classes para tamaños de texto responsive

**Breakpoint Strategy**:
```tsx
// Mobile (320px-640px): Gráfico vertical (alto), etiquetas rotadas
<div className="h-96 sm:h-80">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={stats} layout="horizontal">
      {/* Etiquetas del eje X rotadas 45° */}
    </BarChart>
  </ResponsiveContainer>
</div>

// Tablet (641px-1024px): Gráfico balanceado
<div className="h-80 md:h-96">
  {/* Etiquetas normales */}
</div>

// Desktop (1025px+): Gráfico horizontal amplio
<div className="h-96 lg:h-[500px]">
  {/* Más spacing, tooltips más ricos */}
</div>
```

**Alternatives Considered**:
- **CSS Grid manual**: Más código, menos flexible
- **Media queries custom**: Reinventa lo que Tailwind ya provee
- **Chart.js responsive**: Menos control fino que Recharts

---

### 6. Error Handling y Empty States

**Question**: ¿Cómo manejar casos de error y ausencia de datos?

**Decision**: **Error boundaries + fallback UI con mensajes claros**

**Rationale**:
- **User experience**: Nunca mostrar gráfico roto o error técnico
- **Debuggability**: Log errors para debugging, mostrar mensaje amigable al usuario
- **Graceful degradation**: Siempre mostrar algo útil

**Implementation Strategy**:

```tsx
// Caso 1: Loading
if (isLoading) {
  return <div className="animate-pulse">Cargando datos...</div>
}

// Caso 2: Error de red/API
if (error) {
  return (
    <div className="text-red-600">
      No se pudieron cargar los datos. 
      <button onClick={retry}>Reintentar</button>
    </div>
  )
}

// Caso 3: Sin datos (0 empresas o 0 industrias)
if (!stats || stats.length === 0) {
  return (
    <div className="text-gray-500">
      No hay datos disponibles para mostrar.
    </div>
  )
}

// Caso 4: Success - mostrar gráfico
return <IndustryChart data={stats} />
```

**Edge Cases Handled**:
- Backend retorna 500: mostrar error genérico + log
- Backend retorna []: mostrar "No hay datos"
- Backend timeout: mostrar error de timeout + retry
- Industria sin empresas: filtrada en SQL (no aparece en gráfico)

---

## Technology Decisions Summary

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Chart Library** | Recharts 2.10+ | React 19 compatible, declarativo, TypeScript-first |
| **Endpoint** | `/api/v1/industries/stats` | RESTful, mantiene agrupación lógica |
| **Data Structure** | Pre-computed percentages | Backend hace trabajo pesado, frontend simple |
| **Caching** | None (per user requirement) | Real-time data, no cache invalidation complexity |
| **Responsive** | Tailwind breakpoints + ResponsiveContainer | Built-in, battle-tested, easy to maintain |
| **Error Handling** | Error boundaries + fallback UI | Graceful degradation, good UX |

---

## Next Steps (Phase 1)

1. **data-model.md**: Documentar schemas Pydantic y TypeScript interfaces
2. **contracts/**: Generar OpenAPI spec para `/api/v1/industries/stats`
3. **quickstart.md**: Pasos para probar localmente (backend + frontend)
4. **Update agent context**: Agregar Recharts a lista de tecnologías frontend

---

## References

- [Recharts Documentation](https://recharts.org/)
- [Next.js 15 Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [FastAPI Aggregation Patterns](https://fastapi.tiangolo.com/advanced/sql-databases/)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
