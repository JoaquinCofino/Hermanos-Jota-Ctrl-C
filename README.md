# Hermanos Jota — E-commerce

Proyecto final de Full Stack Developer — ITBA Educación Ejecutiva.

Aplicación cliente-servidor de la mueblería Hermanos Jota: un **frontend en React** que
consume una **API REST propia hecha con Node.js y Express**, conectada a **MongoDB** con
**Mongoose**. El frontend pide el catálogo al backend con `fetch` y permite listar, crear,
editar y eliminar productos.

## Integrantes

| Integrante | GitHub | Aportes principales |
|---|---|---|
| Joaquín Cofiño | [@JoaquinCofino](https://github.com/JoaquinCofino) | Fetch y cliente de la API (`GET`, `POST`, `PUT`, `DELETE`) con estados de carga y error, formularios de alta y edición, eliminación desde el detalle, Navbar, ProductList, ProductCard, navegación con React Router, página de carrito y buscador del catálogo |
| Lorenzo Fares | [@lorenzofares](https://github.com/lorenzofares) | Estructura base, datos y rutas del backend, adaptación de DetalleProducto por `_id`, Footer, assets, página de contacto con validación y mapa |
| Juan Cruz Romero Huisi | [@juanrohu](https://github.com/juanrohu) | Conexión a MongoDB con Mongoose (`db.js` y `seed.js`), modelo `Product`, controlador CRUD (`productsController`), variables de entorno (`.env` / `.gitignore`), CORS, middleware de logging y mejoras visuales de UI |
| Gonzalo Daniele | [@GonzaloDaniele](https://github.com/GonzaloDaniele) | ProductDetail, manejador de 404 y de errores del backend, documentación (`README`) |
| Fausto Tica | [@faustotica](https://github.com/faustotica) | ContactForm, estado del carrito en App y botón de efectuar compra |

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior (incluye npm)

## Instalación y ejecución

El proyecto tiene dos aplicaciones independientes. Hay que levantar **las dos**, cada una en
su propia terminal.

### 1. Backend (API) — puerto 4000

Crear un archivo `.env` en `backend/` (ignorado por Git mediante `.gitignore` para no exponer
credenciales) con la cadena de conexión a MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<base>
PORT=4000
```

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
con una sola URL ([hermanos-jota-ctrl-c.vercel.app](https://hermanos-jota-ctrl-c.vercel.app/)):

- `vercel.json` (en la raíz) usa [Vercel Services](https://vercel.com/docs/services) con dos
  servicios: `backend` (Express, carpeta `backend/`) y `client` (create-react-app, carpeta
  `client/`). Cada uno se compila por separado.
- Las peticiones a `/api/...` van a `backend`, que recibe la ruta completa
  (`/api/productos`); todo lo demás va a `client`. Dentro de `client`, cualquier ruta
  devuelve `index.html` para que React Router funcione al recargar o entrar por un link.
- `backend/server.js` exporta la app de Express para Vercel. En local sigue levantando el
  servidor con `app.listen` como siempre.

Para publicar: importar el repo en Vercel dejando el *Root Directory* en la raíz y configurar
la variable de entorno `MONGO_URI`. Cada push a la rama configurada vuelve a publicar.

## Publicación (Render)

El backend (`/backend`) también se puede publicar por separado como un Web Service en
[Render](https://render.com):

- En Render se configura `backend` como *Root Directory*, `npm install` como *Build Command*,
  `npm start` como *Start Command* y la variable de entorno `MONGO_URI` con la URI de MongoDB
  Atlas.
- En el frontend (`client`) se configura la variable de entorno `REACT_APP_API_URL` con la URL
  del servicio en Render (por ejemplo, `https://<servicio>.onrender.com`), que
  `client/src/services/api.js` usa como base para todas las peticiones a `/api/productos`.

## API

| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/api` | Mensaje de bienvenida |
| `GET` | `/api/productos` | Array con todos los productos (JSON) |
| `GET` | `/api/productos/:id` | Un producto por `_id` de MongoDB. Si no existe: `404` con `{ "mensaje": "Producto no encontrado" }` |
| `POST` | `/api/productos` | Crea un producto en MongoDB y devuelve el documento creado (`201`) |
| `PUT` | `/api/productos/:id` | Actualiza un producto por `_id` y devuelve el documento actualizado (`200`) |
| `DELETE` | `/api/productos/:id` | Elimina un producto por `_id` y devuelve `{ "mensaje": "Producto eliminado correctamente" }` |
| cualquier otra | — | `404` con `{ "message": "Ruta no encontrada: ..." }` |

Cada request se registra en consola con fecha, método y URL, por ejemplo:
`[01/10/2026, 14:05] [GET] /api/productos`.

El modelo `Product` (`backend/models/Products.js`) define el esquema en Mongoose con
validaciones: `nombre` (`String`, obligatorio), `categoria` (`String`, obligatorio), `precio`
(`Number`, obligatorio, `min: 0`), `stock` (`Number`, `default: 0`), `imagenUrl` (`String`),
`descripcion` (`String`), `destacado` (`Boolean`) y `fabricacion` (`[{ label, value }]`).

Los errores se resuelven en un **manejador centralizado**: responde en JSON con el status del
error (o `500` si no tiene) y, fuera de producción, incluye el `stack` para depurar.

## Páginas del frontend

| URL | Página |
|---|---|
| `/` | Inicio: presentación y productos destacados |
| `/productos` | Catálogo completo con buscador (por nombre, categoría, descripción o material) |
| `/productos/:id` | Detalle de un producto, con botones para editar y eliminar |
| `/admin/crear-producto` | Formulario controlado para crear un producto nuevo |
| `/admin/editar-producto/:id` | Formulario controlado para editar un producto existente |
| `/carrito` | Carrito: cantidades, subtotales, total, quitar y vaciar |
| `/contacto` | Formulario de contacto con validación, mapa, horarios y datos de contacto |
| cualquier otra | Página "no encontrada" |

## Arquitectura

```
 ┌───────────────────────────┐   /api/productos       ┌───────────────────────────┐
 │  client/ (React, :3000)   │ ─────────────────────▶ │ backend/ (Express, :4000) │
 │                           │ ◀───────────────────── │                           │
 │  App.jsx guarda el estado │   JSON (productos)     │  logger → express.json()  │
 │  y define las rutas       │                        │  → router → MongoDB       │
 └───────────────────────────┘                        └───────────────────────────┘
```

### Backend (`/backend`)

```
backend/
├── server.js                        # Crea la app, conecta a la DB, registra rutas y errores
├── utils/db.js                      # Conexión a MongoDB Atlas con Mongoose (MONGO_URI)
├── models/Products.js               # Esquema y modelo Product de Mongoose
├── controller/productsController.js # Controladores CRUD (GET, POST, PUT, DELETE)
├── routes/productos-routes.js       # express.Router de /api/productos
├── middlewares/logger.js            # Middleware global: loguea fecha, método y URL
└── data/productos.js                # Array de objetos con los 11 productos del catálogo
```

Orden en `server.js`: `cors()` → `logger` → `express.json()` → rutas de `/api/productos` →
manejador de 404 → manejador de errores centralizado.

### Frontend (`/client`)

```
client/src/
├── index.js                  # Monta la app dentro de <BrowserRouter>
├── App.jsx                   # Estado global (productos, carga, error, carrito) y <Routes>
├── services/api.js           # obtenerProductos, crearProducto, actualizarProducto y eliminarProducto
├── utils/formatearPrecio.js  # Formato de precios en pesos argentinos
├── pages/
│   ├── Catalogo/             # Catálogo con buscador (filtra la lista con useState) y botón "+ Nuevo producto"
│   ├── DetalleProducto/      # Lee el :id con useParams, muestra ProductDetail y botones Editar / Eliminar
│   ├── AdminProducto/        # CrearProducto (/admin/crear-producto) y EditarProducto (/admin/editar-producto/:id)
│   ├── Carrito/              # Lista del carrito agrupada por producto, con total
│   └── NoEncontrado/         # Página para rutas inexistentes
└── components/
    ├── Navbar/               # Links con NavLink y contador del carrito (por props)
    ├── ProductList/          # Recorre los productos con .map() y key={producto.id}
    ├── ProductCard/          # Tarjeta de un producto; es un Link a /productos/:id
    ├── ProductDetail/        # Detalle de un producto con botón "Añadir al carrito"
    ├── ProductForm/          # Formulario controlado reutilizable para crear y editar productos
    ├── Aviso/                # Banner de confirmación tras crear, editar o eliminar un producto
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
6. En `/admin/crear-producto` y `/admin/editar-producto/:id`, `ProductForm` envía los datos a
   la API (`POST` o `PUT`), actualiza el estado en `App` y redirige con `useNavigate` al
   detalle del producto. En `/productos/:id`, el botón "Eliminar" envía `DELETE` a la API,
   quita el producto de `App` y redirige a `/productos`.

## Decisiones tomadas

- **React Router para la navegación.** Cada página tiene su propia URL, así funcionan el
  botón "atrás" del navegador, recargar la página y compartir el link de un producto. Se usa
  la versión 6 porque funciona con create-react-app sin configuración extra.
- **Proxy en desarrollo y CORS en producción.** `client/package.json` tiene
  `"proxy": "http://localhost:4000"` para desarrollo local, y el backend habilita `cors()` para
  aceptar peticiones cuando el frontend en Vercel consume la API publicada en Render.
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
- **Imágenes en `client/public/assets`.** Las sirve el propio servidor de React, así el
  backend solo devuelve datos.
- **Persistencia en MongoDB con Mongoose.** La conexión está abstraída en
  `backend/utils/db.js` usando `process.env.MONGO_URI` (`.env`), el esquema y sus validaciones
  en `backend/models/Products.js` y el CRUD en `backend/controller/productsController.js`.
- **CRUD desde el frontend.** `services/api.js` agrega `crearProducto` (`POST`),
  `actualizarProducto` (`PUT`) y `eliminarProducto` (`DELETE`), normalizando `_id` e
  `imagenUrl` de MongoDB, y `App` actualiza la lista en memoria tras cada operación.
- **Sobre eliminar desde el frontend.** Lo que borra de la base de datos es la ruta `DELETE`
  del backend (`productsController.js`), no `services/api.js`, y la consigna la pide.
  `api.js` solo hace el pedido HTTP. Pasarlo a una ruta separada de React no cambia nada,
  porque igual tiene que llamar al backend. Lo que lo protege de verdad es un login en el
  backend, que se implementa en el siguiente sprint.

## Versión anterior (Sprint 1 y 2)

Los archivos de la raíz (`index.html`, `productos.html`, `producto.html`, `carrito.html`,
`contacto.html`, `css/` y `js/`) corresponden al sitio original en HTML, CSS y JavaScript
sin frameworks. Se mantienen como referencia; la aplicación actual está en `/client` y
`/backend`.
