# Tasks: Gráfico de Empresas por Industria en Dashboard

**Feature**: 001-industry-chart  
**Branch**: `001-industry-chart`  
**Input**: Design documents from `/specs/001-industry-chart/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests NO son requeridos explícitamente en la especificación, pero se incluirán siguiendo la constitución (Testing Obligatorio NON-NEGOTIABLE).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `src/backend/` (api/, services/, repositories/, schemas/, core/, tests/)
- **Frontend**: `src/frontend/` (app/, components/, lib/, hooks/, __tests__/)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and basic structure

- [ ] T001 Instalar dependencia Recharts en frontend: `cd src/frontend && npm install recharts@^2.10.0`
- [ ] T002 Verificar que servidor backend está corriendo en http://localhost:8000
- [ ] T003 Verificar que servidor frontend está corriendo en http://localhost:3000

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [P] Crear schema Pydantic IndustryStatItem en src/backend/schemas/industry_stats.py
- [ ] T005 [P] Crear schema Pydantic IndustryStatsResponse en src/backend/schemas/industry_stats.py
- [ ] T006 [P] Crear interfaces TypeScript IndustryStatItem e IndustryStatsResponse en src/frontend/lib/types.ts
- [ ] T007 Crear IndustryStatsRepository en src/backend/repositories/industry_stats_repository.py con método get_stats()
- [ ] T008 Crear IndustryStatsService en src/backend/services/industry_stats_service.py que usa repository
- [ ] T009 Extender router en src/backend/api/industries.py con endpoint GET /stats

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visualizar distribución de empresas por industria (Priority: P1) 🎯 MVP

**Goal**: Mostrar gráfico básico con distribución de empresas por industria al cargar dashboard

**Independent Test**: Acceder a http://localhost:3000, verificar que se muestra gráfico con barras por industria

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Test unitario para repository en src/backend/tests/repositories/test_industry_stats_repository.py (happy path: retorna lista de stats)
- [ ] T011 [P] [US1] Test unitario para service en src/backend/tests/services/test_industry_stats_service.py (happy path: calcula porcentajes correctamente)
- [ ] T012 [P] [US1] Test de endpoint en src/backend/tests/api/test_industry_stats.py (GET /api/v1/industries/stats retorna 200 con datos válidos)

### Implementation for User Story 1

- [ ] T013 [US1] Implementar query SQL en IndustryStatsRepository.get_stats() con GROUP BY por industry_id
- [ ] T014 [US1] Implementar cálculo de porcentajes en IndustryStatsService.get_stats()
- [ ] T015 [US1] Implementar endpoint handler en src/backend/api/industries.py que inyecta service y retorna IndustryStatsResponse
- [ ] T016 [P] [US1] Crear función fetchIndustryStats() en src/frontend/lib/api.ts que llama a /api/v1/industries/stats
- [ ] T017 [P] [US1] Crear componente IndustryChartContainer (Server Component) en src/frontend/components/IndustryChartContainer.tsx que fetch datos
- [ ] T018 [US1] Crear componente IndustryChart (Client Component) en src/frontend/components/IndustryChart.tsx con Recharts BarChart básico
- [ ] T019 [US1] Integrar IndustryChartContainer en dashboard src/frontend/app/page.tsx
- [ ] T020 [US1] Agregar manejo de estado de loading mientras se obtienen datos
- [ ] T021 [US1] Agregar manejo de error si fetch falla (mostrar mensaje de error)
- [ ] T022 [US1] Agregar manejo de empty state si stats.length === 0 (mostrar "No hay datos disponibles")

### Tests de Componentes Frontend US1

- [ ] T023 [P] [US1] Test para IndustryChart.tsx en src/frontend/__tests__/components/IndustryChart.test.tsx (renderiza gráfico con datos mock)
- [ ] T024 [P] [US1] Test para IndustryChartContainer.tsx en src/frontend/__tests__/components/IndustryChartContainer.test.tsx (fetch y pasa datos a IndustryChart)

**Checkpoint**: User Story 1 completo - Dashboard muestra gráfico básico de industrias

---

## Phase 4: User Story 2 - Interactuar con el gráfico para ver detalles (Priority: P2)

**Goal**: Agregar tooltips interactivos que muestren detalles al pasar cursor sobre barras

**Independent Test**: Con gráfico visible (US1), pasar cursor sobre barras y verificar tooltips con nombre, count y porcentaje

### Tests for User Story 2

- [ ] T025 [P] [US2] Test para tooltips en src/frontend/__tests__/components/IndustryChart.test.tsx (simular hover y verificar tooltip aparece)

### Implementation for User Story 2

- [ ] T026 [US2] Agregar componente Tooltip de Recharts a IndustryChart.tsx con custom content
- [ ] T027 [US2] Implementar CustomTooltip que muestra nombre, company_count y percentage formateado
- [ ] T028 [US2] Agregar estilos Tailwind al tooltip para legibilidad (fondo, padding, border)
- [ ] T029 [US2] Verificar que tooltip se actualiza instantáneamente al cambiar de barra (<100ms)

**Checkpoint**: User Story 2 completo - Tooltips interactivos funcionando

---

## Phase 5: User Story 3 - Visualizar gráfico responsive en dispositivos móviles (Priority: P3)

**Goal**: Adaptar gráfico a diferentes tamaños de pantalla (320px-2560px)

**Independent Test**: Usar DevTools responsive mode, probar breakpoints mobile/tablet/desktop, verificar legibilidad

### Tests for User Story 3

- [ ] T030 [P] [US3] Test de responsive en src/frontend/__tests__/components/IndustryChart.test.tsx (renderiza correctamente en diferentes viewports)

### Implementation for User Story 3

- [ ] T031 [P] [US3] Envolver IndustryChart en ResponsiveContainer de Recharts con width="100%" height="100%"
- [ ] T032 [P] [US3] Agregar clases Tailwind responsive al contenedor del gráfico (h-96 sm:h-80 md:h-96 lg:h-[500px])
- [ ] T033 [US3] Ajustar configuración de BarChart para mobile (layout, margin, fontSize de etiquetas)
- [ ] T034 [US3] Rotar etiquetas del eje X 45° en mobile si hay muchas industrias
- [ ] T035 [US3] Probar en dispositivos reales o DevTools: 320px, 768px, 1024px, 1920px
- [ ] T036 [US3] Verificar que no hay scroll horizontal en ningún breakpoint

**Checkpoint**: User Story 3 completo - Gráfico totalmente responsive

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T037 [P] Agregar título descriptivo al gráfico: "Distribución de Empresas por Industria"
- [ ] T038 [P] Agregar labels a ejes X e Y del gráfico
- [ ] T039 [P] Elegir paleta de colores accesible para barras (contraste WCAG AA)
- [ ] T040 Agregar test de edge case: industrias sin empresas (backend debe filtrarlas)
- [ ] T041 Agregar test de edge case: solo 1 industria con 100% (debe mostrar correctamente)
- [ ] T042 [P] Documentar en README.md cómo probar el gráfico localmente
- [ ] T043 Ejecutar linting backend: `cd src/backend && uv run ruff format . && uv run ruff check .`
- [ ] T044 Ejecutar type checking backend: `cd src/backend && uv run mypy .`
- [ ] T045 Ejecutar todos los tests backend: `cd src/backend && uv run pytest`
- [ ] T046 Verificar coverage backend ≥60%: `cd src/backend && uv run pytest --cov=backend --cov-report=html`
- [ ] T047 Ejecutar linting frontend: `cd src/frontend && npm run lint`
- [ ] T048 Ejecutar type checking frontend: `cd src/frontend && npm run type-check` (si está configurado)
- [ ] T049 Ejecutar todos los tests frontend: `cd src/frontend && npm test`
- [ ] T050 Verificar coverage frontend ≥60%: `cd src/frontend && npm test -- --coverage`
- [ ] T051 Probar manualmente todos los escenarios de quickstart.md
- [ ] T052 Tomar screenshots del gráfico para documentación

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): DEPENDS on User Story 1 (needs base chart component)
  - User Story 3 (P3): DEPENDS on User Story 1 (needs base chart component), can run parallel with US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - MVP STANDALONE
- **User Story 2 (P2)**: REQUIRES User Story 1 complete (extends IndustryChart.tsx)
- **User Story 3 (P3)**: REQUIRES User Story 1 complete (wraps IndustryChart.tsx), can be parallel with US2

### Within Each User Story

**User Story 1 (P1)**:
1. Tests primero (T010, T011, T012) - pueden correr en paralelo [P]
2. Backend implementation (T013 → T014 → T015) - secuencial
3. Frontend API client (T016) - paralelo con backend [P]
4. Frontend components (T017, T018) - paralelo [P]
5. Integration (T019 → T020 → T021 → T022) - secuencial
6. Frontend tests (T023, T024) - paralelo [P]

**User Story 2 (P2)**:
1. Test primero (T025) [P]
2. Implementation (T026 → T027 → T028 → T029) - secuencial

**User Story 3 (P3)**:
1. Test primero (T030) [P]
2. Responsive setup (T031, T032) - paralelo [P]
3. Fine-tuning (T033 → T034) - secuencial
4. Testing manual (T035 → T036) - secuencial

### Parallel Opportunities

**Phase 2 (Foundational)**:
- T004, T005, T006 pueden correr en paralelo (diferentes archivos)

**Phase 3 (User Story 1)**:
- T010, T011, T012 (tests) en paralelo
- T016, T017, T018 (frontend files) en paralelo después de backend ready

**Phase 4 (User Story 2)**:
- T025 (test) puede escribirse mientras se planea implementation

**Phase 5 (User Story 3)**:
- T030 (test), T031, T032 pueden iniciarse en paralelo

**Phase 6 (Polish)**:
- T037, T038, T039, T042 (docs/styles) en paralelo
- T043-T050 (linting/testing) pueden correr en paralelo en diferentes terminales

---

## Parallel Example: User Story 1

```bash
# Fase 1: Escribir tests en paralelo
Terminal 1: Editar src/backend/tests/repositories/test_industry_stats_repository.py (T010)
Terminal 2: Editar src/backend/tests/services/test_industry_stats_service.py (T011)
Terminal 3: Editar src/backend/tests/api/test_industry_stats.py (T012)

# Fase 2: Backend implementation (secuencial)
T013 → T014 → T015

# Fase 3: Frontend en paralelo
Terminal 1: Editar src/frontend/lib/api.ts (T016)
Terminal 2: Crear src/frontend/components/IndustryChartContainer.tsx (T017)
Terminal 3: Crear src/frontend/components/IndustryChart.tsx (T018)

# Fase 4: Integration (secuencial)
T019 → T020 → T021 → T022

# Fase 5: Frontend tests en paralelo
Terminal 1: Crear src/frontend/__tests__/components/IndustryChart.test.tsx (T023)
Terminal 2: Crear src/frontend/__tests__/components/IndustryChartContainer.test.tsx (T024)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (instalar Recharts)
2. Complete Phase 2: Foundational (schemas, service, repository, endpoint)
3. Complete Phase 3: User Story 1 (gráfico básico funcional)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

**Timeline estimate**: ~4-6 horas (1 dev)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (~2 horas)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!) (~3 horas)
3. Add User Story 2 → Test independently → Deploy/Demo (~1.5 horas)
4. Add User Story 3 → Test independently → Deploy/Demo (~2 horas)
5. Polish & finalize → Full feature complete (~1.5 horas)

**Total timeline estimate**: ~10-12 horas (1 dev)

### Parallel Team Strategy

With 2-3 developers:

1. **Dev A**: Backend (Phase 2 foundational + tests US1)
2. **Dev B**: Frontend components US1 (después de Phase 2)
3. **Dev C**: Tests + US2/US3 (después de US1)

**Timeline estimate**: ~6-8 horas (team of 3)

---

## Task Count Summary

- **Total tasks**: 52
- **Setup (Phase 1)**: 3 tasks
- **Foundational (Phase 2)**: 6 tasks (BLOCKING)
- **User Story 1 (P1)**: 15 tasks (MVP)
- **User Story 2 (P2)**: 5 tasks
- **User Story 3 (P3)**: 7 tasks
- **Polish (Phase 6)**: 16 tasks

**Parallelizable tasks**: 18 tasks marked with [P]

---

## Validation Checklist

Before marking feature as complete:

### Backend
- [ ] Endpoint `/api/v1/industries/stats` responde 200 OK
- [ ] Response tiene estructura correcta (IndustryStatsResponse)
- [ ] Porcentajes suman ~100% (tolerancia de redondeo)
- [ ] Stats ordenados por company_count DESC
- [ ] Endpoint responde en <1 segundo con 1000+ empresas
- [ ] Todos los tests backend pasan con coverage ≥60%
- [ ] Linting (ruff) y type checking (mypy) sin errores

### Frontend
- [ ] Gráfico visible en dashboard http://localhost:3000
- [ ] Todas las industrias con empresas aparecen
- [ ] Etiquetas legibles y colores diferenciados
- [ ] Tooltips funcionan al hover con información completa
- [ ] Responsive en 320px, 768px, 1920px sin scroll horizontal
- [ ] Loading state funciona mientras se obtienen datos
- [ ] Error state funciona si backend falla
- [ ] Empty state funciona si no hay datos
- [ ] Sin errores en DevTools Console
- [ ] Carga en <3 segundos
- [ ] Todos los tests frontend pasan con coverage ≥60%
- [ ] Linting (ESLint) sin errores

### Integration
- [ ] Frontend obtiene datos de backend correctamente
- [ ] Manejo de errores robusto (backend down, timeout, etc.)
- [ ] Manejo de casos edge (sin datos, 1 industria, muchas industrias)
- [ ] Constitution checks cumplidos (arquitectura por capas, types, <500 líneas por archivo)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD)
- Commit after each completed user story (minimum)
- Stop at any checkpoint to validate story independently
- **NO CACHE** implementation anywhere (per user requirement)
- All files must be <500 lines (constitution requirement)
- Coverage target ≥60% (constitution requirement)
- Type safety mandatory: Pydantic + TypeScript (constitution requirement)

---

## Quick Commands Reference

### Backend
```bash
cd src/backend

# Run specific test file
uv run pytest tests/api/test_industry_stats.py -v

# Run all tests
uv run pytest

# Check coverage
uv run pytest --cov=backend --cov-report=html

# Linting & formatting
uv run ruff format .
uv run ruff check .

# Type checking
uv run mypy .

# Start dev server
uv run fastapi dev
```

### Frontend
```bash
cd src/frontend

# Install Recharts
npm install recharts@^2.10.0

# Run specific test file
npm test -- IndustryChart

# Run all tests
npm test

# Check coverage
npm test -- --coverage

# Linting
npm run lint

# Type checking (if configured)
npm run type-check

# Start dev server
npm run dev
```

### Manual Testing
```bash
# Test endpoint directly
curl http://localhost:8000/api/v1/industries/stats

# With location filter
curl "http://localhost:8000/api/v1/industries/stats?location_id=5"

# Open dashboard
open http://localhost:3000
```
