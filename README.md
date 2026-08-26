# Hermanos Jota — E-commerce (Sprint 1 y 2)

Proyecto final de Full Stack Developer — ITBA Educación Ejecutiva.

## Integrantes

- Joaquin Cofino - JoaquinCofino
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
```

Cada página carga solo los scripts que necesita, en orden: `products-data.js` →
`api.js` → script de la página → `main.js`.

## Datos del catálogo

`js/data/products-data.js` contiene los 11 productos reales de Hermanos Jota
(nombre, categoría, precio, imagen, descripción, flag `destacado`) armados a
partir de las fotos de producto y la paleta/tipografía del Manual de Marca.
