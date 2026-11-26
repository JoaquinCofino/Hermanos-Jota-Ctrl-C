# Hermanos Jota — E-commerce

**Entrega 4 (Sprints 7 y 8)** — Proyecto final de Full Stack Developer — ITBA Educación Ejecutiva.

Aplicación cliente-servidor de la mueblería Hermanos Jota: un **frontend en React** que consume una **API REST propia hecha con Node.js y Express**, conectada a **MongoDB Atlas** con **Mongoose**.

Esta entrega consolida el trabajo de los dos últimos sprints:
- **Sprint 7 (Autenticación, Roles y Pedidos):** Registro y login de usuarios con contraseñas encriptadas (`bcryptjs`), emisión y verificación de JSON Web Tokens (JWT), control de acceso por roles (`cliente` y `admin`), endpoints y persistencia de pedidos, y gestión global de sesión con `AuthContext` y rutas protegidas (`ProtectedRoute`).
- **Sprint 8 (Despliegue a Producción):** Publicación del backend en **Render**, despliegue del frontend en **Vercel**, base de datos en la nube en **MongoDB Atlas**, orquestación mediante variables de entorno y documentación final del proyecto.

## Links

| Recurso | URL |
|---|---|
| Frontend (Vercel) | [hermanos-jota-ctrl-c.vercel.app](https://hermanos-jota-ctrl-c.vercel.app/) |
| Backend / API (Render) | [hermanos-jota-ctrl-c-v2.onrender.com/api/productos](https://hermanos-jota-ctrl-c-v2.onrender.com/api/productos) |
| Repositorio | [github.com/JoaquinCofino/Hermanos-Jota-Ctrl-C](https://github.com/JoaquinCofino/Hermanos-Jota-Ctrl-C) |

> **Aviso:** El backend está en el plan gratis de Render: la primera carga puede tardar un minuto en despertar si el servicio estuvo suspendido por inactividad (más de 15 minutos). Las peticiones siguientes responden de forma inmediata.

## Integrantes

| Integrante | GitHub | Aportes principales |
|---|---|---|
| Joaquín Cofiño | [@JoaquinCofino](https://github.com/JoaquinCofino) | Fetch y cliente de la API (`GET`, `POST`, `PUT`, `DELETE`) con estados de carga y error, formularios de alta y edición, eliminación desde el detalle, Navbar, ProductList, ProductCard, navegación con React Router, página de carrito y buscador del catálogo |
| Lorenzo Fares | [@lorenzofares](https://github.com/lorenzofares) | Estructura base, datos y rutas del backend, adaptación de DetalleProducto por `_id`, Footer, assets, página de contacto con validación y mapa |
| Juan Cruz Romero Huisi | [@juanrohu](https://github.com/juanrohu) | Conexión a MongoDB con Mongoose (`db.js` y `seed.js`), modelos y controladores CRUD, variables de entorno (`.env` / `.gitignore`), CORS, middleware de logging y mejoras visuales de UI |
| Gonzalo Daniele | [@GonzaloDaniele](https://github.com/GonzaloDaniele) | ProductDetail, manejador de 404 y de errores del backend, documentación (`README`) |
| Fausto Tica | [@faustotica](https://github.com/faustotica) | ContactForm, estado del carrito y `CartContext`, flujo de confirmación de compra y pedidos, página 404, configuración de despliegue y documentación final (`README`) |

## Tecnologías usadas

- **Frontend:** React 19, React Router DOM (v6), Context API (`AuthContext`, `CartContext`), CSS3, Fetch API.
- **Backend:** Node.js, Express, CORS, JSON Web Tokens (`jsonwebtoken`), encriptación de contraseñas (`bcryptjs`).
- **Base de datos:** MongoDB Atlas mediante ODM Mongoose.
- **Despliegue:** Vercel (Frontend) y Render (Backend).

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior (incluye npm).

## Instalación y ejecución en local

1. Clonar el repositorio:

```bash
git clone https://github.com/JoaquinCofino/Hermanos-Jota-Ctrl-C.git
cd Hermanos-Jota-Ctrl-C
```

El proyecto tiene dos aplicaciones independientes. Hay que levantar **las dos**, cada una en su propia terminal.

### 1. Backend (API) — puerto 4000

Crear un archivo `.env` en `backend/` a partir de [`backend/.env.example`](backend/.env.example) (ignorado por Git mediante `.gitignore` para no exponer credenciales):

```env
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<base>
JWT_SECRET=<clave_secreta_para_firmar_tokens>
PORT=4000
```

Instalar dependencias, sembrar la base de datos y levantar el servidor:

```bash
cd backend
npm install
npm run seed     # solo la primera vez: carga categorías y catálogo inicial en MongoDB
npm run dev      # con nodemon (recarga automática al guardar cambios)
# o bien: npm start (ejecución directa con node)
```

> **Ojo:** `npm run seed` reinicia las colecciones cargadas desde `backend/data/productos.js`, por lo que reescribe modificaciones previas en los productos sembrados.

La API queda disponible en `http://localhost:4000/api/productos`.

### 2. Frontend (React) — puerto 3000

Crear opcionalmente un archivo `.env` en `client/` a partir de [`client/.env.example`](client/.env.example) si se desea apuntar a una URL externa. En desarrollo local por defecto no hace falta: el `"proxy"` de `client/package.json` redirige automáticamente `/api` a `http://localhost:4000`.

Instalar dependencias e iniciar la aplicación:

```bash
cd client
npm install
npm start
```

Se abrirá automáticamente el navegador en `http://localhost:3000`. Si el backend no está corriendo, la interfaz muestra un aviso con opción para reintentar.

## Despliegue y variables de entorno

```
 Navegador ──▶ Vercel (Frontend React) ──fetch (JSON + JWT)──▶ Render (API Express) ──▶ MongoDB Atlas
```

### Variables de entorno necesarias

| Variable | Dónde se configura | Para qué sirve |
|---|---|---|
| `MONGO_URI` | Render (y `backend/.env` en local) | Cadena de conexión a la base de datos en MongoDB Atlas |
| `JWT_SECRET` | Render (y `backend/.env` en local) | Clave secreta para firmar y verificar tokens de autenticación JWT |
| `PORT` | Opcional (`4000` en local) | Puerto donde escucha Express (en Render se asigna de forma automática) |
| `NODE_ENV` | Render (`production`) | Oculta el stack trace de depuración en respuestas de error de la API |
| `REACT_APP_API_URL` | Vercel (Production y Preview) | URL pública del backend en Render (sin barra al final) |

> **Nota sobre variables en Vercel:** Las variables que comienzan con `REACT_APP_` se incrustan en el bundle compilado de JavaScript al momento del build. Si se modifica `REACT_APP_API_URL` en Vercel, es necesario realizar un **Redeploy** para que impacte el cambio.

### Servicios de producción

- **MongoDB Atlas:** Se configura en *Network Access* con la regla `0.0.0.0/0` (*Allow access from anywhere*) para habilitar la conexión desde las IPs dinámicas de Render.
- **Render (Backend):** Web Service apuntando al repositorio:
  - **Root Directory:** `backend`
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
- **Vercel (Frontend):** Conectado al repositorio con configuración en `vercel.json` para reescribir todas las rutas hacia `/index.html`, evitando errores 404 al recargar o ingresar de forma directa a rutas de React Router.

## API

### Productos y Categorías

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| `GET` | `/api` | Mensaje de estado y bienvenida de la API | Público |
| `GET` | `/api/productos` | Obtiene el listado completo de productos (JSON) | Público |
| `GET` | `/api/productos/:id` | Obtiene un producto individual por su `_id` de MongoDB | Público |
| `POST` | `/api/productos` | Da de alta un nuevo producto (`201`) | Admin (JWT) |
| `PUT` | `/api/productos/:id` | Modifica un producto existente por su `_id` (`200`) | Admin (JWT) |
| `DELETE` | `/api/productos/:id` | Elimina un producto por su `_id` (`200`) | Admin (JWT) |
| `GET` | `/api/categorias` | Lista las categorías disponibles | Público |

### Usuarios, Autenticación y Pedidos

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| `POST` | `/api/usuarios/registro` | Registra un nuevo usuario con contraseña encriptada (`bcryptjs`) | Público |
| `POST` | `/api/usuarios/login` | Autentica credenciales y devuelve token JWT con datos del usuario | Público |
| `GET` | `/api/usuarios/perfil` | Retorna los datos del usuario logueado | Privado (JWT) |
| `POST` | `/api/pedidos` | Genera un nuevo pedido asociado al usuario autenticado | Privado (JWT) |
| `GET` | `/api/pedidos` | Obtiene el historial de pedidos del usuario logueado | Privado (JWT) |
| cualquier otra | — | Retorna `404` con `{ "message": "Ruta no encontrada: ..." }` | Público |

Cada petición recibida se registra en consola a través del middleware de logging:
`[26/11/2026, 14:05] [GET] /api/productos`.

### Modelos de datos (Mongoose)

- **`Product` (`backend/models/Products.js`):** `nombre` (String, obligatorio), `categoria` (String / ref Categoria, obligatorio), `precio` (Number, obligatorio, `min: 0`), `stock` (Number, `default: 0`), `imagenUrl` (String), `descripcion` (String), `destacado` (Boolean) y `fabricacion` (`[{ label, value }]`).
- **`Categoria` (`backend/models/Categoria.js`):** `nombre` (String, único, obligatorio) y `descripcion` (String).
- **`Usuario` (`backend/models/Usuario.js`):** `nombre` (String, obligatorio), `email` (String, único, obligatorio), `password` (String, con hash seguro) y `rol` (String, enum `cliente` o `admin`).
- **`Pedido` (`backend/models/Pedido.js`):** referencia a `usuario`, arreglo de `items` (producto, cantidad, precio unitario), `total` calculado en servidor, `fecha` y `estado`.

Los errores se gestionan en un manejador centralizado que responde en formato JSON con el código de estado correspondiente (o `500` por defecto).

## Páginas del frontend

| URL | Página | Acceso |
|---|---|---|
| `/` | Inicio: presentación de la mueblería y destacados | Público |
| `/productos` | Catálogo completo con selector de categorías y buscador en tiempo real | Público |
| `/productos/:id` | Detalle del producto (con botones de edición/eliminación para admin) | Público |
| `/login` | Formulario de inicio de sesión | Público |
| `/registro` | Formulario de registro de nuevas cuentas | Público |
| `/perfil` | Información de perfil de la cuenta activa | Requiere autenticación |
| `/mis-pedidos` | Historial de compras realizadas por el usuario | Requiere autenticación |
| `/admin/crear-producto` | Formulario protegido para dar de alta productos | Requiere rol Admin |
| `/admin/editar-producto/:id` | Formulario protegido para modificar productos existentes | Requiere rol Admin |
| `/carrito` | Carrito de compras: cantidades, subtotales, vaciado y confirmación | Público |
| `/contacto` | Formulario con validación en tiempo real, horarios y mapa interactivo | Público |
| cualquier otra | Vista personalizada de error 404 con enlace al inicio | Público |

## Arquitectura

```
┌─────────────────────────────────┐      /api/... (JSON + JWT)     ┌─────────────────────────────────┐
│     client/ (React, :3000)      │ ─────────────────────────────▶ │    backend/ (Express, :4000)    │
│                                 │ ◀───────────────────────────── │                                 │
│ AuthContext / CartContext / App │    Respuesta JSON y estados    │ logger ➔ express.json() ➔ cors  │
│ gestión de estado, auth y rutas │       de carga y errores       │ ➔ authMiddleware ➔ Router ➔ DB  │
└─────────────────────────────────┘                                └─────────────────────────────────┘
```

### Estructura del Backend (`backend/`)

```
backend/
├── server.js                      # Configuración de Express, CORS, middlewares y montaje de rutas
├── seed.js                        # Script para poblar categorías y productos iniciales
├── imagenes-a-webp.js             # Utilidad para optimizar imágenes a formato .webp
├── utils/
│   └── db.js                      # Conexión a MongoDB Atlas vía Mongoose
├── models/
│   ├── Products.js                # Esquema y modelo Product
│   ├── Categoria.js               # Esquema y modelo Categoria
│   ├── Usuario.js                 # Esquema y modelo Usuario con hash de contraseñas
│   └── Pedido.js                  # Esquema y modelo Pedido
├── controller/
│   └── productsController.js      # Controladores CRUD de productos (GET, POST, PUT, DELETE)
├── routes/
│   ├── productos-routes.js        # Rutas de /api/productos
│   ├── categorias.js              # Rutas de /api/categorias
│   ├── usuarios.js                # Rutas de /api/usuarios (registro, login, perfil)
│   └── pedidos.js                 # Rutas de /api/pedidos
├── middlewares/
│   ├── logger.js                  # Registro de solicitudes en consola
│   └── auth.js                    # Middlewares verificarToken y soloAdmin
└── data/
    └── productos.js               # Datos semilla iniciales
```

### Estructura del Frontend (`client/`)

```
client/src/
├── index.js                       # Punto de entrada de React con BrowserRouter
├── App.jsx                        # Definición de rutas principales y carga de catálogo
├── context/
│   ├── AuthContext.jsx            # Sesión global: login, logout, token JWT y rol
│   └── CartContext.jsx            # Carrito global: agregar, cantidades y persistencia
├── hooks/
│   └── useFormulario.js           # Custom hook reutilizable para formularios y validaciones
├── services/
│   └── api.js                     # Cliente HTTP centralizado (fetch con Bearer token)
├── utils/
│   ├── formatearPrecio.js         # Formateador monetario (pesos argentinos)
│   └── validaciones.js            # Reglas de validación para campos
├── pages/
│   ├── Catalogo/                  # Catálogo con filtrado por categoría y búsqueda
│   ├── DetalleProducto/           # Vista por ID con acciones de carrito y administración
│   ├── Login/                     # Vista de inicio de sesión
│   ├── Registro/                  # Vista de creación de usuario
│   ├── Perfil/                    # Perfil del usuario autenticado
│   ├── MisPedidos/                # Historial de compras del usuario
│   ├── AdminProducto/             # Creación y edición de productos (rutas protegidas)
│   ├── Carrito/                   # Resumen del carrito y checkout
│   └── NoEncontrado/              # Página personalizada para rutas no encontradas (404)
└── components/
    ├── Navbar/                    # Barra de navegación con estado de auth y badge de carrito
    ├── ProtectedRoute/            # Wrapper para restringir rutas privadas o de admin
    ├── AuthForm/                  # Formularios compartidos de autenticación
    ├── ProductList/               # Cuadrícula de productos
    ├── ProductCard/               # Tarjeta individual de producto
    ├── ProductDetail/             # Detalle y especificaciones con botón de compra
    ├── ProductForm/               # Formulario controlado de alta y edición
    ├── ContactForm/               # Formulario de contacto con validaciones y mapa
    ├── EstadoPeticion/            # Estados de carga y error con reintento
    ├── Aviso/                     # Cartel de confirmación temporal
    └── Footer/                    # Pie de página institucional
```

## Decisiones tomadas

- **React Router para la navegación:** Cada vista tiene su propia URL, lo que permite utilizar el historial del navegador, recargar cualquier página y compartir enlaces directos.
- **Autenticación con JWT y Context API:** Las contraseñas se almacenan con hash mediante `bcryptjs`. Los endpoints sensibles en el backend están protegidos por `verificarToken` y `soloAdmin`. En el frontend, `AuthContext` mantiene la sesión en memoria y `ProtectedRoute` protege las vistas privadas y de administrador.
- **Carrito centralizado en `CartContext` con persistencia en `localStorage`:** Permite agregar productos, modificar unidades y calcular totales desde cualquier componente sin perder los ítems al recargar o navegar entre páginas.
- **Proxy en desarrollo y CORS en producción:** `client/package.json` incluye `"proxy": "http://localhost:4000"` para omitir problemas de origen en local, mientras que el backend aplica `cors()` para autorizar peticiones desde el frontend alojado en Vercel.
- **Cliente HTTP desacoplado en `services/api.js`:** Los componentes no manipulan URLs directas; todas las peticiones `fetch` se resuelven en un módulo centralizado que adjunta el encabezado `Authorization: Bearer <token>` cuando corresponde y maneja respuestas de error (401, 404, 500).
- **Imágenes optimizadas en `.webp`:** El catálogo utiliza imágenes en formato `.webp` ubicadas en `client/public/assets` para optimizar los tiempos de carga en producción.

## Versión anterior (Sprint 1 y 2)

Los archivos de la raíz (`index.html`, `productos.html`, `producto.html`, `carrito.html`, `contacto.html`, `css/` y `js/`) corresponden a la primera versión del proyecto desarrollada exclusivamente con HTML, CSS y JavaScript sin frameworks. Se conservan en el repositorio como referencia histórica de la evolución del proyecto.
