# Módulo de Garantías

Este módulo permite gestionar las garantías de productos en el sistema de automuelles_pedidos.

## Estructura del Módulo

```
Garantias/
├── Pages/
│   ├── Garantias.jsx          # Página principal con lista de garantías
│   ├── GestionarGarantia.jsx  # Página para gestionar una garantía individual
│   └── Historial.jsx          # Historial de garantías procesadas
├── Routes/
│   └── GarantiasRoutes.jsx    # Configuración de rutas del módulo
├── components/
│   └── navbar.jsx             # Barra de navegación del módulo
└── assets/
    ├── Garantias.css          # Estilos para la página principal
    ├── GestionarGarantia.css  # Estilos para gestionar garantía
    ├── Historial.css          # Estilos para el historial
    └── navbar.css             # Estilos para la barra de navegación
```

## Características

### 1. Página Principal (Garantias.jsx)
- Muestra todas las garantías registradas en formato de tarjetas
- Cada tarjeta muestra información básica: documento, transacción, cliente, producto y fecha
- Botón "Gestionar" para acceder a los detalles de cada garantía

### 2. Gestionar Garantía (GestionarGarantia.jsx)
- Muestra detalles completos de una garantía específica
- Permite agregar observaciones sobre el proceso de garantía
- Botones para guardar cambios o cancelar

### 3. Historial (Historial.jsx)
- Tabla con todas las garantías históricas
- Filtros por estado (Pendiente/Completado)
- Botón para ver detalles de cada garantía

### 4. Navegación (navbar.jsx)
- Inicio: Regresa a la página principal de garantías
- Gestión: Acceso rápido a la lista de garantías
- Historial: Muestra el historial completo
- Opciones: Menú desplegable con perfil, historial y cerrar sesión

## Rutas del Módulo

El módulo está integrado en la aplicación principal con las siguientes rutas:

- `/Garantias` - Página principal
- `/Garantias/gestionar-garantia` - Gestionar una garantía individual
- `/Garantias/historial` - Ver historial de garantías

## Integración con App.jsx

El módulo está protegido con el rol "Garantias" mediante el componente `ProtectedRoute`:

```jsx
<Route
    path="/Garantias/*"
    element={
        <ProtectedRoute role="Garantias">
            <GarantiasRoutes />
        </ProtectedRoute>
    }
/>
```

## APIs Requeridas

El módulo espera que el backend proporcione las siguientes APIs:

- `GET /api/garantias` - Obtener lista de garantías
- `POST /api/garantia-details` - Obtener detalles de una garantía específica
- `POST /api/actualizar-garantia` - Actualizar una garantía
- `GET /api/garantias-historial` - Obtener historial de garantías
- `POST /api/logout` - Cerrar sesión

## Estilos

Todos los estilos siguen el mismo patrón visual del resto de la aplicación:
- Uso de Bootstrap 5.3.7 para componentes base
- Colores principales: azul (#0d6efd) para acciones primarias
- Diseño responsivo con sidebar fijo de 70px
- Tarjetas con efecto hover y sombras sutiles

## Dependencias

- React 19.1.0
- React Router DOM 7.6.2
- Axios 1.9.0
- Bootstrap 5.3.7
- Lucide React 0.515.0 (para iconos)

## Uso

1. El usuario debe tener el rol "Garantias" asignado para acceder al módulo
2. Al ingresar, verá la lista de garantías pendientes
3. Puede hacer clic en "Gestionar" para ver/editar una garantía
4. Puede acceder al historial desde el menú de navegación
5. Puede cerrar sesión desde el menú de opciones
