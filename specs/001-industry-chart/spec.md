# Feature Specification: Gráfico de Empresas por Industria en Dashboard

**Feature Branch**: `001-industry-chart`  
**Created**: 2025-11-18  
**Status**: Draft  
**Input**: User description: "Agregar gráfico al dashboard donde se muestre un chart de empresas por industria"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualizar distribución de empresas por industria (Priority: P1)

Los usuarios del dashboard necesitan entender rápidamente cómo se distribuyen las empresas SaaS entre las diferentes industrias para identificar sectores con mayor concentración de empresas.

**Why this priority**: Es la funcionalidad core que entrega valor inmediato - permite a los usuarios visualizar la distribución de empresas por industria de forma clara y rápida, facilitando el análisis de mercado.

**Independent Test**: Puede ser probado completamente accediendo al dashboard y verificando que se muestre un gráfico con el conteo de empresas por cada industria, sin necesidad de interacción adicional.

**Acceptance Scenarios**:

1. **Given** el usuario accede al dashboard, **When** la página carga completamente, **Then** se muestra un gráfico que presenta la cantidad de empresas agrupadas por industria
2. **Given** existen empresas en la base de datos distribuidas en múltiples industrias, **When** el gráfico se renderiza, **Then** cada industria aparece con su conteo correcto de empresas
3. **Given** el gráfico está visible en el dashboard, **When** el usuario lo visualiza, **Then** puede identificar claramente qué industrias tienen más o menos empresas

---

### User Story 2 - Interactuar con el gráfico para ver detalles (Priority: P2)

Los usuarios necesitan ver detalles adicionales al interactuar con el gráfico, como el número exacto de empresas y el porcentaje que representa cada industria del total.

**Why this priority**: Mejora la experiencia del usuario al proporcionar información detallada bajo demanda, pero el gráfico básico (P1) ya entrega valor sin esta interacción.

**Independent Test**: Con el gráfico ya funcional (P1), se puede probar pasando el cursor sobre diferentes secciones del gráfico y verificando que aparezcan tooltips con información detallada.

**Acceptance Scenarios**:

1. **Given** el gráfico de industrias está visible, **When** el usuario pasa el cursor sobre una barra/sección del gráfico, **Then** aparece un tooltip mostrando el nombre de la industria y el número exacto de empresas
2. **Given** el tooltip está visible, **When** el usuario lo lee, **Then** puede ver el porcentaje que representa esa industria del total de empresas
3. **Given** el usuario mueve el cursor entre diferentes industrias, **When** cambia de una a otra, **Then** el tooltip se actualiza instantáneamente mostrando la información correspondiente

---

### User Story 3 - Visualizar gráfico responsive en dispositivos móviles (Priority: P3)

Los usuarios que acceden al dashboard desde dispositivos móviles o tablets necesitan ver el gráfico correctamente adaptado a pantallas pequeñas.

**Why this priority**: Mejora la accesibilidad y experiencia en mobile, pero la funcionalidad principal ya está disponible en desktop (P1 y P2).

**Independent Test**: Con el gráfico funcionando en desktop, se puede probar accediendo desde un dispositivo móvil o usando las herramientas de desarrollo del navegador para simular diferentes tamaños de pantalla.

**Acceptance Scenarios**:

1. **Given** el usuario accede al dashboard desde un dispositivo móvil, **When** la página carga, **Then** el gráfico se adapta al ancho de la pantalla sin requerir scroll horizontal
2. **Given** el gráfico está visible en mobile, **When** el usuario lo visualiza, **Then** las etiquetas e información se muestran legibles sin superposición
3. **Given** el usuario rota el dispositivo de vertical a horizontal, **When** cambia la orientación, **Then** el gráfico se reajusta automáticamente al nuevo espacio disponible

---

### Edge Cases

- ¿Qué sucede cuando una industria no tiene empresas asignadas? El gráfico no debe mostrar industrias con valor cero.
- ¿Cómo maneja el sistema el caso de una industria con cientos de empresas versus otra con solo 1-2? El gráfico debe usar escala apropiada para mostrar ambos casos.
- ¿Qué se muestra si no hay datos de empresas o industrias disponibles? Debe mostrarse un mensaje indicando "No hay datos disponibles" en lugar del gráfico.
- ¿Cómo se comporta el gráfico si hay más de 20 industrias? El gráfico debe manejar scrolling o paginación para evitar saturación visual.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE obtener los datos de conteo de empresas por industria desde el endpoint existente del backend `/api/v1/industries` o crear uno nuevo si es necesario
- **FR-002**: El sistema DEBE agrupar y contar empresas por cada industria única en la base de datos
- **FR-003**: El sistema DEBE renderizar un gráfico visual (barras o pastel) mostrando la distribución de empresas por industria
- **FR-004**: El sistema DEBE mostrar etiquetas claras para cada industria en el gráfico con su nombre correspondiente
- **FR-005**: El sistema DEBE actualizar el gráfico automáticamente cuando cambian los filtros aplicados en el dashboard (si aplican filtros de ubicación u otros)
- **FR-006**: El sistema DEBE mostrar tooltips informativos al pasar el cursor sobre elementos del gráfico, incluyendo nombre de industria, cantidad de empresas y porcentaje del total
- **FR-007**: El gráfico DEBE ser responsive y adaptarse correctamente a diferentes tamaños de pantalla (desktop, tablet, mobile)
- **FR-008**: El sistema DEBE manejar el caso de ausencia de datos mostrando un mensaje apropiado en lugar de un gráfico vacío
- **FR-009**: El gráfico NO DEBE implementar caché de datos (según requisito del usuario)

### Key Entities

- **Industry**: Representa una categoría de negocio SaaS. Atributos clave: id (identificador único), name (nombre de la industria), company_count (cantidad de empresas en esa industria - calculado, no persistido)
- **Company**: Representa una empresa SaaS. Se relaciona con Industry mediante industry_id. Se cuenta por industria para generar el gráfico

### Assumptions

- Se asume que existe un endpoint en el backend que puede proveer datos de empresas agrupadas por industria, o será necesario crear uno
- Se asume uso de una librería de gráficos en el frontend (como Recharts, Chart.js, o similar compatible con React/Next.js)
- Se asume que el dashboard ya existe y tiene una sección donde se puede agregar este nuevo componente de gráfico
- Los filtros existentes del dashboard (si los hay) deben aplicarse también al gráfico, pero sin implementar caché adicional
- Los datos se obtienen en tiempo real en cada carga de página o cambio de filtros

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los usuarios pueden visualizar la distribución completa de empresas por industria en menos de 3 segundos después de cargar el dashboard
- **SC-002**: El gráfico muestra correctamente todas las industrias que tienen al menos una empresa asociada
- **SC-003**: Los tooltips con información detallada aparecen instantáneamente (menos de 100ms) al pasar el cursor sobre cualquier elemento del gráfico
- **SC-004**: El gráfico se adapta correctamente a pantallas con ancho mínimo de 320px (móviles) hasta 2560px (monitores 4K) sin pérdida de legibilidad
- **SC-005**: El tiempo de respuesta del endpoint que provee los datos es menor a 1 segundo incluso con 1000+ empresas distribuidas en múltiples industrias
