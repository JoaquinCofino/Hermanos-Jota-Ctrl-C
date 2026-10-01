# Hermanos Jota — E-commerce (Sprint 3 y 4)

Proyecto final de Full Stack Developer — ITBA Educación Ejecutiva.

Aplicación cliente-servidor de la mueblería Hermanos Jota: un **frontend en React** que
consume una **API REST propia hecha con Node.js y Express**. El frontend ya no usa datos
locales: pide el catálogo al backend con `fetch` y lo muestra dinámicamente.

## Integrantes

| Integrante | GitHub | Aportes principales |
|---|---|---|
| Joaquín Cofiño | [@JoaquinCofino](https://github.com/JoaquinCofino) | Fetch a la API con estados de carga y error, Navbar, ProductList, ProductCard, detalle por renderizado condicional |
| Lorenzo Fares | [@lorenzofares](https://github.com/lorenzofares) | Estructura base, datos y rutas del backend, Footer, assets |
| Juan Cruz Romero Huisi | [@juanrohu](https://github.com/juanrohu) | Middleware de logging |
| Gonzalo Daniele | [@GonzaloDaniele](https://github.com/GonzaloDaniele) | ProductDetail |
| Fausto Tica | [@faustotica](https://github.com/faustotica) | ContactForm |

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior (incluye npm)

## Instalación y ejecución

El proyecto tiene dos aplicaciones independientes. Hay que levantar **las dos**, cada una en
su propia terminal.

### 1. Backend (API) — puerto 4000

```bash
cd backend
npm install
npm run dev      # con nodemon (se reinicia al guardar)
# o: npm start   # sin nodemon
```

La API queda en `http://localhost:4000`. El puerto se puede cambiar con la variable de
entorno `PORT`.

### 2. Frontend (React) — puerto 3000

```bash
cd client
npm install
npm start
```

Se abre `http://localhost:3000`. Si el backend no está corriendo, la app muestra un mensaje
de error con un botón para reintentar.

### Tests del frontend

```bash
cd client
npm test
```

## API

| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/` | Mensaje de bienvenida |
| `GET` | `/api/productos` | Array con todos los productos (JSON) |
| `GET` | `/api/productos/:id` | Un producto por id (ej. `/api/productos/sofa-patagonia`). Si no existe: `404` con `{ "mensaje": "Producto no encontrado" }` |

Cada request se registra en consola con fecha, método y URL, por ejemplo:
`[01/10/2026, 14:05] [GET] /api/productos`.

## Arquitectura

```
 ┌───────────────────────────┐   GET /api/productos   ┌───────────────────────────┐
 │  client/ (React, :3000)   │ ─────────────────────▶ │ backend/ (Express, :4000) │
 │                           │ ◀───────────────────── │                           │
 │  App.jsx guarda el estado │   JSON (productos)     │  logger → express.json()  │
 │  y decide qué vista ver   │                        │  → router /api/productos  │
 └───────────────────────────┘                        └───────────────────────────┘
```

### Backend (`/backend`)

```
backend/
├── server.js                   # Crea la app, registra middlewares y monta las rutas
├── data/productos.js           # Array de objetos con los 11 productos del catálogo
├── routes/productos-routes.js  # express.Router: GET / y GET /:id
└── middlewares/logger.js       # Middleware global: loguea fecha, método y URL
```

Orden de los middlewares en `server.js`: `logger` → `express.json()` (para futuras
peticiones POST) → rutas de `/api/productos`.

### Frontend (`/client`)

```
client/src/
├── App.jsx                   # Estado global: productos, carga, error y vista actual
├── services/api.js           # obtenerProductos(): fetch a /api/productos
├── utils/formatearPrecio.js  # Formato de precios en pesos argentinos
└── components/
    ├── Navbar/               # Logo, navegación y contador del carrito (por props)
    ├── ProductList/          # Recorre los productos con .map() y key={producto.id}
    ├── ProductCard/          # Tarjeta de un producto; al hacer click lo selecciona
    ├── ProductDetail/        # Vista de detalle de un producto
    ├── ContactForm/          # Formulario de contacto controlado con useState
    └── Footer/
```

**Flujo de datos:**

1. Al montarse, `App` llama a `obtenerProductos()` dentro de un `useEffect` y maneja los
   tres estados de la petición: **cargando**, **éxito** (guarda los productos) y **error**.
2. `App` pasa los productos por props a `ProductList`, que renderiza un `ProductCard` por
   producto.
3. Al hacer click en una tarjeta, `ProductCard` avisa a `App` con el callback
   `onSeleccionar(id)`, y `App` guarda ese id en el estado `productoSeleccionadoId`.
4. Si hay un producto seleccionado, `App` muestra `ProductDetail` en lugar de la lista
   (renderizado condicional). El botón "Volver al catálogo" limpia la selección.
5. La `Navbar` cambia la vista (`inicio`, `catalogo` o `contacto`) llamando a
   `onNavegar`, otro callback que recibe por props.

## Decisiones tomadas

- **Navegación con estado y renderizado condicional, sin React Router.** La consigna pide
  mostrar distintas vistas con renderizado condicional; una variable de estado `vista` en
  `App` alcanza para tres secciones y evita agregar dependencias.
- **Proxy de desarrollo en lugar de CORS.** `client/package.json` tiene
  `"proxy": "http://localhost:4000"`, así el frontend llama a `/api/productos` como si
  fuera del mismo origen y el backend no necesita configurar CORS.
- **El fetch está aislado en `services/api.js`.** Los componentes no conocen la URL de la
  API; si cambia, se modifica en un solo lugar.
- **Se chequea `respuesta.ok`.** `fetch` solo falla ante errores de red, así que una
  respuesta 404 o 500 se convierte explícitamente en error para mostrarla en la UI.
- **`AbortController` en el `useEffect`.** Cancela la petición si el componente se desmonta
  (o cuando `StrictMode` ejecuta el efecto dos veces en desarrollo), evitando actualizar
  estado de un componente que ya no está.
- **El estado vive en `App` y baja por props.** Productos, vista seleccionada y carrito se
  guardan en el componente padre; los hijos reciben datos y callbacks.
- **Ids legibles (`"sofa-patagonia"`)** en lugar de números, igual que en la versión
  anterior del sitio, para que las URLs de la API sean descriptivas.
- **Imágenes en `client/public/assets`.** Las sirve el propio servidor de React, así el
  backend solo devuelve datos.

## Pendientes antes de la entrega

- [ ] Manejador de 404 para rutas inexistentes y manejador de errores centralizado en
      `backend/server.js`.
- [ ] Carrito de compras como estado en `App.jsx`, conectado al contador de la `Navbar` y
      al botón "Añadir al carrito" de `ProductDetail`.
- [ ] Renderizar `<ContactForm />` en la vista de contacto de `App.jsx`.

## Versión anterior (Sprint 1 y 2)

Los archivos de la raíz (`index.html`, `productos.html`, `producto.html`, `carrito.html`,
`contacto.html`, `css/` y `js/`) corresponden al sitio original en HTML, CSS y JavaScript
sin frameworks. Se mantienen como referencia; la aplicación actual está en `/client` y
`/backend`.
