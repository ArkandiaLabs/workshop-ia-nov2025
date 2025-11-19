# Quickstart: Gráfico de Empresas por Industria en Dashboard

**Feature**: 001-industry-chart  
**Branch**: `001-industry-chart`  
**Prerequisites**: Backend y frontend configurados y corriendo localmente

## 🎯 Objetivo

Probar localmente el nuevo gráfico de distribución de empresas por industria en el dashboard.

---

## 📋 Prerequisites Checklist

Antes de comenzar, asegúrate de tener:

- [x] Python 3.12+ instalado
- [x] Node.js 18+ instalado
- [x] `uv` instalado (gestor de paquetes Python)
- [x] Repositorio clonado y branch `001-industry-chart` activo
- [x] Variables de entorno configuradas:
  - Backend: `.env` con credenciales de Supabase
  - Frontend: `.env.local` con `NEXT_PUBLIC_API_URL`
- [x] Base de datos Supabase con datos de empresas e industrias

---

## 🚀 Quick Start (5 minutos)

### 1. Activar Branch de Feature

```bash
# Cambiar a branch de feature
git checkout 001-industry-chart

# Verificar que estás en el branch correcto
git branch --show-current
# Output: 001-industry-chart
```

### 2. Backend Setup

```bash
# Terminal 1: Backend
cd src/backend

# Instalar nueva dependencia (si es necesario)
uv sync

# Verificar que el endpoint existe
# (Después de implementación, verificar con):
uv run python -c "from api.industries import router; print([r.path for r in router.routes])"
# Debería incluir: /stats

# Iniciar servidor backend
uv run fastapi dev

# Servidor corriendo en http://localhost:8000
```

**Verificar Backend**:
```bash
# En otra terminal, probar endpoint manualmente
curl http://localhost:8000/api/v1/industries/stats

# Output esperado (ejemplo):
# {
#   "stats": [
#     {"id": 1, "name": "Software", "company_count": 42, "percentage": 35.25},
#     {"id": 2, "name": "E-commerce", "company_count": 30, "percentage": 25.21}
#   ],
#   "total_companies": 119,
#   "total_industries": 8
# }
```

### 3. Frontend Setup

```bash
# Terminal 2: Frontend (nueva terminal)
cd src/frontend

# Instalar nueva dependencia (Recharts)
npm install recharts@^2.10.0

# Verificar instalación
npm list recharts
# Output: recharts@2.10.x

# Iniciar servidor frontend
npm run dev

# Aplicación corriendo en http://localhost:3000
```

**Verificar Frontend**:
1. Abrir navegador en http://localhost:3000
2. Deberías ver el dashboard con el nuevo gráfico de industrias
3. El gráfico debe mostrar barras/columnas con conteo por industria

---

## ✅ Verification Tests (10 minutos)

### Test 1: Visualización Básica (P1 - MVP)

**Objetivo**: Verificar que el gráfico se renderiza correctamente.

1. **Abrir dashboard**: http://localhost:3000
2. **Verificar que aparece**:
   - ✅ Gráfico de barras/columnas visible
   - ✅ Etiquetas de industrias en eje X o Y
   - ✅ Valores numéricos visibles
   - ✅ Colores diferenciados por barra

**Criterio de éxito**: Gráfico se carga en <3 segundos y muestra todas las industrias con empresas.

### Test 2: Tooltips Interactivos (P2)

**Objetivo**: Verificar interactividad del gráfico.

1. **Pasar cursor** sobre una barra del gráfico
2. **Verificar tooltip aparece** con:
   - ✅ Nombre de la industria
   - ✅ Número exacto de empresas
   - ✅ Porcentaje del total (ej: "35.25%")
3. **Mover cursor** a otra barra
4. **Verificar tooltip se actualiza** instantáneamente

**Criterio de éxito**: Tooltip aparece en <100ms y muestra información completa.

### Test 3: Responsive Design (P3)

**Objetivo**: Verificar adaptación a diferentes pantallas.

1. **Abrir DevTools** (F12 o Cmd+Option+I)
2. **Activar modo responsive** (Toggle device toolbar)
3. **Probar breakpoints**:
   - ✅ Mobile (320px): Gráfico ajustado, etiquetas legibles
   - ✅ Tablet (768px): Gráfico balanceado
   - ✅ Desktop (1920px): Gráfico amplio con buen spacing
4. **Rotar** de portrait a landscape
5. **Verificar** que el gráfico se reajusta automáticamente

**Criterio de éxito**: Gráfico legible en todos los tamaños sin scroll horizontal.

### Test 4: Filtros del Dashboard (si aplican)

**Objetivo**: Verificar que el gráfico responde a filtros.

**Si el dashboard tiene filtros de ubicación**:
1. **Aplicar filtro** de ubicación (ej: seleccionar "San Francisco")
2. **Verificar** que el gráfico se actualiza
3. **Confirmar** que solo muestra industrias de esa ubicación
4. **Quitar filtro** y verificar que vuelve a mostrar todos

**Si no hay filtros**: Skip este test.

**Criterio de éxito**: Gráfico se actualiza en <3 segundos al cambiar filtros.

---

## 🐛 Troubleshooting

### Problema 1: Backend no inicia

**Síntoma**: `ModuleNotFoundError` o `ImportError`

**Solución**:
```bash
cd src/backend
uv sync  # Reinstalar dependencias
uv run fastapi dev
```

### Problema 2: Endpoint retorna 404

**Síntoma**: `curl http://localhost:8000/api/v1/industries/stats` retorna 404

**Verificar**:
1. ¿El backend está corriendo?
2. ¿El endpoint está registrado en `main.py`?
3. ¿La ruta es correcta? (debe ser `/api/v1/industries/stats`)

**Solución**:
```bash
# Ver todas las rutas registradas
curl http://localhost:8000/docs
# Buscar "industries/stats" en la documentación Swagger
```

### Problema 3: Gráfico no aparece en frontend

**Síntoma**: Dashboard se carga pero no se ve el gráfico

**Verificar en DevTools Console (F12)**:
1. ¿Hay errores de JavaScript?
2. ¿La request a `/api/v1/industries/stats` falló?
3. ¿Recharts está instalado? (`npm list recharts`)

**Solución**:
```bash
# Reinstalar dependencias
cd src/frontend
npm install
npm run dev
```

### Problema 4: Gráfico vacío o "No hay datos"

**Síntoma**: Componente se renderiza pero muestra mensaje de sin datos

**Verificar**:
1. ¿Hay empresas en la base de datos?
   ```bash
   # Probar endpoint manualmente
   curl http://localhost:8000/api/v1/industries/stats
   ```
2. ¿La respuesta tiene `stats: []`?
3. Si es así, agregar datos de prueba en Supabase

**Solución**: Ejecutar scripts de datos en `scripts/database/` si la BD está vacía.

### Problema 5: CORS Error

**Síntoma**: Error en consola del navegador: "CORS policy blocked"

**Solución**:
```python
# Verificar configuración CORS en src/backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Debe incluir frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 Expected Results

### Ejemplo de Dashboard con Gráfico

**URL**: http://localhost:3000

**Elementos visibles**:
1. Header del dashboard
2. Backend Status (✅ healthy)
3. **NUEVO**: Gráfico de "Empresas por Industria"
   - Título: "Distribución de Empresas por Industria"
   - Eje X: Nombres de industrias (Software, E-commerce, Fintech, etc.)
   - Eje Y: Cantidad de empresas (0, 10, 20, 30, 40, 50...)
   - Barras de colores con alturas proporcionales

**Comportamiento esperado**:
- Gráfico se carga automáticamente al entrar al dashboard
- Tooltips aparecen al hacer hover
- Responsive en mobile/tablet/desktop
- Sin errores en consola del navegador

---

## 🧪 Manual Testing Checklist

Marca cada item después de probarlo:

**Backend**:
- [ ] Endpoint `/api/v1/industries/stats` responde 200 OK
- [ ] Response tiene estructura correcta (`stats`, `total_companies`, `total_industries`)
- [ ] Porcentajes suman ~100% (puede haber diferencia por redondeo)
- [ ] Stats están ordenados por `company_count` descendente
- [ ] Endpoint responde en <1 segundo

**Frontend**:
- [ ] Gráfico visible en dashboard
- [ ] Todas las industrias con empresas aparecen
- [ ] Etiquetas legibles
- [ ] Colores diferenciados
- [ ] Tooltips funcionan al hover
- [ ] Responsive en 320px, 768px, 1920px
- [ ] Sin errores en DevTools Console
- [ ] Carga en <3 segundos

**Integration**:
- [ ] Frontend obtiene datos de backend correctamente
- [ ] Filtros del dashboard se aplican al gráfico (si aplican)
- [ ] Manejo de errores funciona (probar desconectando backend)
- [ ] Manejo de sin datos funciona (probar con BD vacía)

---

## 📝 Next Steps

Después de verificar que todo funciona:

1. **Run tests**:
   ```bash
   # Backend
   cd src/backend
   uv run pytest tests/api/test_industry_stats.py -v
   
   # Frontend
   cd src/frontend
   npm test -- IndustryChart
   ```

2. **Check code quality**:
   ```bash
   # Backend
   cd src/backend
   uv run ruff format .
   uv run ruff check .
   uv run mypy .
   
   # Frontend
   cd src/frontend
   npm run lint
   ```

3. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat(dashboard): add industry distribution chart with Recharts"
   ```

4. **Create Pull Request** hacia branch principal

---

## 📖 Additional Resources

- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **OpenAPI Contract**: `specs/001-industry-chart/contracts/industry-stats-endpoint.yaml`
- **Data Model**: `specs/001-industry-chart/data-model.md`
- **Research Decisions**: `specs/001-industry-chart/research.md`
- **Recharts Docs**: https://recharts.org/en-US/api
- **Next.js Data Fetching**: https://nextjs.org/docs/app/building-your-application/data-fetching

---

## 🎉 Success Criteria

Has completado exitosamente el quickstart cuando:

✅ Backend endpoint `/api/v1/industries/stats` responde correctamente  
✅ Frontend muestra gráfico de industrias en dashboard  
✅ Tooltips aparecen al hacer hover sobre barras  
✅ Gráfico es responsive en mobile/tablet/desktop  
✅ Todos los tests manuales están marcados como completados  
✅ No hay errores en consola del navegador ni terminal de backend  

**¡Felicidades!** 🎊 La feature está funcionando localmente y lista para testing más exhaustivo.
