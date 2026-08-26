# Hermanos Jota — E-commerce (Sprint 1 y 2)

Proyecto final de Full Stack Developer — ITBA Educación Ejecutiva.

## Integrantes

- Nombre Apellido — @usuario-github
- Nombre Apellido — @usuario-github
- Nombre Apellido — @usuario-github
- Nombre Apellido — @usuario-github
- Nombre Apellido — @usuario-github

## Descripción de la funcionalidad

Sitio 100% cliente (HTML, CSS y JavaScript, sin frameworks ni backend) que simula la
experiencia de compra de la mueblería Hermanos Jota:

- **Inicio** (`index.html`): header con logo y navegación, banner principal y 3-4
  productos destacados cargados dinámicamente desde el catálogo.
- **Catálogo** (`productos.html`): grilla completa de productos con buscador en vivo
  por nombre/categoría; cada tarjeta enlaza al detalle del producto.
- **Detalle de producto** (`producto.html`): imagen grande, descripción, precio y
  botón "Añadir al carrito" que suma al contador simulado del header.
- **Contacto** (`contacto.html`): formulario con validación del lado del cliente
  (nombre, email, mensaje) y confirmación de envío vía DOM, sin backend real.

Los productos se gestionan de forma local en un array de objetos JS; la "carga" del
catálogo se simula como una petición asíncrona con `setTimeout` / `async-await`,
cumpliendo el requisito de simular una petición de datos sin backend.

## Stack

- **HTML5 semántico** — estructura de las 4 páginas requeridas.
- **CSS3** — Flexbox + Grid, mobile-first, sin frameworks (sin Bootstrap/Tailwind).
- **JavaScript vanilla (ES6+)** — manipulación de DOM, eventos, `fetch` simulado con
  Promesas.
- **Sin build step**: no hay bundler, no hay `npm install` para correr el sitio. Se
  abre directamente o se sirve como archivos estáticos.

La única tecnología "externa" a HTML/CSS/JS es la de **arquitectura/infraestructura**:
Git + GitHub y GitHub Actions para el despliegue automático. El código del sitio en sí
no depende de ninguna de ellas.

## Estructura del repositorio

```
hermanos-jota/
├── index.html              # Página de inicio (hero + destacados)
├── productos.html           # Catálogo completo + buscador
├── producto.html            # Detalle de un producto (?id=slug)
├── contacto.html             # Formulario de contacto
├── css/
│   ├── variables.css        # Tokens de marca (colores, tipografía)
│   ├── base.css              # Header, footer, layout compartido
│   └── productos.css         # Grilla y tarjetas de producto
├── js/
│   ├── data/
│   │   └── products-data.js # Array de objetos: el "catálogo"
│   ├── api.js                 # Simula fetch async (setTimeout/Promise)
│   ├── catalog.js             # Render + búsqueda en productos.html
│   ├── home.js                 # Render de destacados en index.html
│   ├── product-detail.js      # Render de producto.html
│   ├── contact.js              # Validación del formulario
│   └── main.js                  # Carrito simulado (localStorage) + header
├── assets/
│   └── img/
│       ├── brand/logo.svg
│       └── productos/*.png
└── .github/workflows/deploy.yml  # Auto-deploy a GitHub Pages
```

Cada página carga solo los scripts que necesita, en orden: `products-data.js` →
`api.js` → script de la página → `main.js`.

## Cómo correrlo localmente

No requiere instalación. Basta con un servidor estático simple (necesario porque
`fetch`/módulos y rutas relativas fallan si abrís el `.html` con `file://`):

```bash
# Opción 1: extensión "Live Server" de VS Code
# Opción 2: servidor de Python
python3 -m http.server 5500
# Opción 3: paquete npx (no es dependencia del proyecto, solo una utilidad)
npx serve .
```

## Despliegue automático (sync con GitHub)

El repo incluye `.github/workflows/deploy.yml`: cada `push` a `main` dispara un
Action que publica el sitio en **GitHub Pages**, sin build step (se sube tal cual).

Pasos para activarlo la primera vez:

1. `Settings → Pages → Source: GitHub Actions` en el repo de GitHub.
2. Hacer push a `main`. El workflow corre solo y en ~1 minuto el sitio queda
   publicado en `https://<usuario-u-org>.github.io/<repo>/`.
3. Cada push posterior a `main` vuelve a desplegar automáticamente.

Alternativa más simple (sin Actions): `Settings → Pages → Source: Deploy from a
branch → main`. Funciona igual de bien para un sitio estático sin build, pero no
deja registro de cada despliegue ni permite agregar pasos (linter, validador de
HTML, etc.) más adelante.

## Workflow de Git para el equipo (5 integrantes)

- `main` — siempre desplegable, protegida (requiere PR + al menos 1 review).
- `develop` — rama de integración del sprint.
- `feature/<nombre>-<algo>` — una rama por feature/persona, sale de `develop`.

Flujo sugerido:

```
feature/juan-catalogo → PR → develop → (al cierre del sprint) → PR → main
```

Reglas mínimas para evitar conflictos con 5 personas tocando HTML/CSS/JS:

- Cada persona trabaja principalmente en "su" página/archivo (ej: una persona en
  `productos.html` + `catalog.js`, otra en `contacto.html` + `contact.js`) para
  minimizar conflictos de merge.
- Commits chicos y descriptivos (`feat:`, `fix:`, `style:`, `docs:`).
- PR obligatorio para mergear a `develop` y a `main` (cumple el requisito de
  "historial de commits de todos los integrantes" con trazabilidad real).
- `products-data.js` es un archivo compartido y sensible a conflictos: agregar
  productos ahí se coordina en el canal del equipo antes de mergear.

## Datos del catálogo

`js/data/products-data.js` contiene los 11 productos reales de Hermanos Jota
(nombre, categoría, precio, imagen, descripción, flag `destacado`) armados a
partir de las fotos de producto y la paleta/tipografía del Manual de Marca.
