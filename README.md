# Hermanos Jota — E-commerce (Sprint 3 y 4)

Proyecto final de Full Stack Developer — ITBA Educación Ejecutiva.

Aplicación cliente-servidor de la mueblería Hermanos Jota: un **frontend en React** que
consume una **API REST propia hecha con Node.js y Express**. El frontend ya no usa datos
locales: pide el catálogo al backend con `fetch` y lo muestra dinámicamente.

## Integrantes

| Integrante | GitHub | Aportes principales |
|---|---|---|
| Joaquín Cofiño | [@JoaquinCofino](https://github.com/JoaquinCofino) | Fetch a la API con estados de carga y error, Navbar, ProductList, ProductCard, navegación con React Router, página de carrito, buscador del catálogo |
| Lorenzo Fares | [@lorenzofares](https://github.com/lorenzofares) | Estructura base, datos y rutas del backend, Footer, assets, página de contacto con validación y mapa |
| Juan Cruz Romero Huisi | [@juanrohu](https://github.com/juanrohu) | Middleware de logging |
| Gonzalo Daniele | [@GonzaloDaniele](https://github.com/GonzaloDaniele) | ProductDetail, manejador de 404 y de errores del backend |
| Fausto Tica | [@faustotica](https://github.com/faustotica) | ContactForm, estado del carrito en App |

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

## Publicación (Vercel)

Frontend y backend se publican juntos en un solo proyecto de [Vercel](https://vercel.com),
con una sola URL:

- `vercel.json` (en la raíz) usa [Vercel Services](https://vercel.com/docs/services) con dos
  servicios: `backend` (Express, carpeta `backend/`) y `client` (create-react-app, carpeta
  `client/`). Cada uno se compila por separado.
- Las peticiones a `/api/...` van a `backend`, que recibe la ruta completa
  (`/api/productos`); todo lo demás va a `client`. Dentro de `client`, cualquier ruta
  devuelve `index.html` para que React Router funcione al recargar o entrar por un link.
- `backend/server.js` exporta la app de Express para Vercel. En local sigue levantando el
  servidor con `app.listen` como siempre.

Para publicar: importar el repo en Vercel dejando el *Root Directory* en la raíz. No hace
falta configurar variables de entorno. Cada push a la rama configurada vuelve a publicar.

## API

| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/api` | Mensaje de bienvenida |
| `GET` | `/api/productos` | Array con todos los productos (JSON) |
| `GET` | `/api/productos/:id` | Un producto por id (ej. `/api/productos/sofa-patagonia`). Si no existe: `404` con `{ "mensaje": "Producto no encontrado" }` |
| cualquier otra | — | `404` con `{ "message": "Ruta no encontrada: ..." }` |

Cada request se registra en consola con fecha, método y URL, por ejemplo:
`[01/10/2026, 14:05] [GET] /api/productos`.

Los errores se resuelven en un **manejador centralizado**: responde en JSON con el status del
error (o `500` si no tiene) y, fuera de producción, incluye el `stack` para depurar.

## Páginas del frontend

| URL | Página |
|---|---|
| `/` | Inicio: presentación y productos destacados |
| `/productos` | Catálogo completo con buscador (por nombre, categoría, descripción o material) |
| `/productos/:id` | Detalle de un producto (ej. `/productos/sofa-patagonia`) |
| `/carrito` | Carrito: cantidades, subtotales, total, quitar y vaciar |
| `/contacto` | Formulario de contacto con validación, mapa, horarios y datos de contacto |
| cualquier otra | Página "no encontrada" |

## Arquitectura

```
 ┌───────────────────────────┐   GET /api/productos   ┌───────────────────────────┐
 │  client/ (React, :3000)   │ ─────────────────────▶ │ backend/ (Express, :4000) │
 │                           │ ◀───────────────────── │                           │
 │  App.jsx guarda el estado │   JSON (productos)     │  logger → express.json()  │
 │  y define las rutas       │                        │  → router → 404 → errores │
 └───────────────────────────┘                        └───────────────────────────┘
```

### Backend (`/backend`)

```
backend/
├── server.js                   # Crea la app, registra middlewares, rutas y manejo de errores
├── data/productos.js           # Array de objetos con los 11 productos del catálogo
├── routes/productos-routes.js  # express.Router: GET / y GET /:id
└── middlewares/logger.js       # Middleware global: loguea fecha, método y URL
```

Orden en `server.js`: `logger` → `express.json()` (para futuras peticiones POST) → rutas de
`/api/productos` → manejador de 404 → manejador de errores centralizado.

### Frontend (`/client`)

```
client/src/
├── index.js                  # Monta la app dentro de <BrowserRouter>
├── App.jsx                   # Estado global (productos, carga, error, carrito) y <Routes>
├── services/api.js           # obtenerProductos(): fetch a /api/productos
├── utils/formatearPrecio.js  # Formato de precios en pesos argentinos
├── pages/
│   ├── Catalogo/             # Catálogo con buscador (filtra la lista con useState)
│   ├── DetalleProducto/      # Lee el :id de la URL con useParams y muestra ProductDetail
│   ├── Carrito/              # Lista del carrito agrupada por producto, con total
│   └── NoEncontrado/         # Página para rutas inexistentes
└── components/
    ├── Navbar/               # Links con NavLink y contador del carrito (por props)
    ├── ProductList/          # Recorre los productos con .map() y key={producto.id}
    ├── ProductCard/          # Tarjeta de un producto; es un Link a /productos/:id
    ├── ProductDetail/        # Detalle de un producto con botón "Añadir al carrito"
    ├── EstadoPeticion/       # Muestra "cargando" o el error del fetch con "Reintentar"
    ├── ContactForm/          # Formulario controlado con useState y validación, mapa y datos
    └── Footer/
```

**Flujo de datos:**

1. Al montarse, `App` llama a `obtenerProductos()` dentro de un `useEffect` y maneja los
   tres estados de la petición: **cargando**, **éxito** (guarda los productos) y **error**.
   `EstadoPeticion` muestra el mensaje que corresponde en cada página.
2. `App` pasa los productos por props a `ProductList`, que renderiza un `ProductCard` por
   producto. En `/productos`, `Catalogo` guarda el texto del buscador en un `useState` y le
   pasa a la lista solo los productos que coinciden (sin distinguir mayúsculas ni tildes).
3. Cada `ProductCard` es un `Link` a `/productos/:id`. En esa ruta, `DetalleProducto` toma el
   id de la URL con `useParams`, busca el producto y muestra `ProductDetail`; si el id no
   existe, muestra "Producto no encontrado" (renderizado condicional).
4. El botón "Añadir al carrito" de `ProductDetail` llama a un callback de `App`, que suma el
   producto al estado `carrito`. La `Navbar` recibe la cantidad por props y la muestra.
5. La página `/carrito` recibe el carrito y los productos por props, agrupa las unidades y
   usa callbacks de `App` para sumar, restar, quitar y vaciar.

## Decisiones tomadas

- **React Router para la navegación.** Cada página tiene su propia URL, así funcionan el
  botón "atrás" del navegador, recargar la página y compartir el link de un producto. Se usa
  la versión 6 porque funciona con create-react-app sin configuración extra.
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
- **Los productos se piden una sola vez.** El fetch está en `App`, que no se desmonta al
  cambiar de página; todas las rutas usan la misma lista sin volver a pedirla.
- **El estado vive en `App` y baja por props.** Productos y carrito se guardan en el
  componente padre; los hijos reciben datos y callbacks.
- **El carrito guarda ids y se persiste en `localStorage`.** Cada id repetido es una unidad;
  la página del carrito los agrupa y toma precio e imagen de los productos de la API. Al
  guardarse en el navegador, el carrito no se pierde al recargar.
- **Rutas de imagen absolutas.** La API devuelve `assets/img/...`; `services/api.js` las
  convierte en `/assets/img/...` para que carguen también dentro de `/productos/:id`.
- **Ids legibles (`"sofa-patagonia"`)** en lugar de números, igual que en la versión
  anterior del sitio, para que las URLs sean descriptivas.
- **Imágenes en `client/public/assets`.** Las sirve el propio servidor de React, así el
  backend solo devuelve datos.

## Versión anterior (Sprint 1 y 2)

Los archivos de la raíz (`index.html`, `productos.html`, `producto.html`, `carrito.html`,
`contacto.html`, `css/` y `js/`) corresponden al sitio original en HTML, CSS y JavaScript
sin frameworks. Se mantienen como referencia; la aplicación actual está en `/client` y
`/backend`.
