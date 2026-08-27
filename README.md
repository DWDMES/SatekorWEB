## Copyright and License Notice

This repository contains the source code for the official website of **SATEKOR IBERICA SL**.

**Visibility vs. Licensing:** Please note that while this repository is public (primarily for deployment via GitHub Pages and transparency), the code contained herein is **proprietary** to SATEKOR Telecomunicaciones and is **not** distributed under an open-source license.

---

**© 2025 SATEKOR Telecomunicaciones. All Rights Reserved.**

---

**Permissions:**

*   You **may** view and fork this repository for informational or educational purposes *only*.
*   You **may not** copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, or substantial portions of the Software.
*   You **may not** use this code, in whole or in part, for any commercial or non-commercial project without explicit prior written permission from SATEKOR Telecomunicaciones.

**Inquiries:** For any questions regarding the use or licensing of this code, please contact SATEKOR Telecomunicaciones at [info@satekor.es](mailto:info@satekor.es).

## Aviso de Copyright y Licencia

Este repositorio contiene el código fuente del sitio web oficial de **SATEKOR IBERICA SL**.

**Visibilidad vs. Licencia:** Aunque este repositorio es público (principalmente para su despliegue a través de GitHub Pages y por transparencia), el código contenido en él es **propiedad exclusiva** de SATEKOR Telecomunicaciones y **no** se distribuye bajo ninguna licencia de código abierto (open source).

---

**© 2025 SATEKOR IBERICA SL. Todos los Derechos Reservados.**

---

**Permisos:**

*   **Puede** ver y bifurcar (fork) este repositorio únicamente con fines informativos o educativos.
*   **No puede** copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software, ni partes sustanciales del mismo.
*   **No puede** utilizar este código, en todo o en parte, para ningún proyecto comercial o no comercial sin el permiso explícito y por escrito de SATEKOR Telecomunicaciones.

**Consultas:** Para cualquier pregunta sobre el uso o licencia de este código, por favor contacte con SATEKOR Telecomunicaciones en [info@satekor.es](mailto:info@satekor.es).
---

## Estructura del Proyecto

```
SatekorWEB/
├── index.html                  # Página principal (servicios, clientes, FAQ)
├── contacto.html               # Página de contacto (formulario, mapa)
├── politica-privacidad.html    # Legal (noindex)
├── politica-cookies.html       # Legal (noindex)
├── terminos-uso.html           # Legal (noindex)
├── Servicios/                  # Una página por servicio (6)
├── Zonas/                      # Landing por municipio (SEO local, 7)
├── Blog/
│   ├── index.html              # Listado de artículos
│   └── *.html                  # Artículos individuales
├── _plantillas/                # Bloques comunes a todas las páginas
│   ├── cabecera.html           # Logo, botón de llamada y navegación
│   ├── pie.html
│   ├── cookies.html            # Banner de consentimiento
│   ├── flotantes.html          # Botones de WhatsApp y "volver arriba"
│   └── fuentes.html            # @font-face y precarga de Poppins
├── _herramientas/
│   ├── construir.py            # Vuelca _plantillas/ en las páginas
│   ├── construir-sprite.py     # Regenera el sprite de iconos
│   └── generar-og.py           # Regenera la imagen para compartir en redes
├── Assets/
│   ├── CSS/
│   │   ├── styles.css          # Hoja principal (todas las páginas)
│   │   ├── service-page.css    # Compartida por 4 páginas de Servicios
│   │   ├── infraestructura-telecom.css   # Variante propia
│   │   ├── videovigilancia-styles.css    # Variante propia
│   │   └── post-styles.css     # Artículos del blog
│   ├── JS/script.js            # Menú, banner cookies + carga condicional
│   │                           # de Google Analytics (RGPD), año del footer,
│   │                           # página activa, animaciones y formulario
│   ├── Fuentes/                # Poppins en woff2, servida desde el dominio
│   ├── Iconos/sprite.svg       # Los ~88 iconos que usa el sitio
│   └── Imagenes/               # Logos, favicon, og:image e imágenes (WebP)
├── sitemap.xml
├── robots.txt
└── CNAME                       # Dominio de GitHub Pages (www.satekor.es)
```

**Cómo ver el sitio en local:**

```bash
python3 -m http.server 8000   # y abrir http://localhost:8000
```

Hay que servirlo por HTTP, no vale abrir los `.html` con doble clic: con
`file://` el navegador considera cada archivo un origen distinto y bloquea por
CORS el sprite de iconos (`<use href="...">`), así que los iconos no aparecen.

**Notas técnicas:**

- Sitio 100% estático servido con GitHub Pages; sin proceso de build ni dependencias
  en producción.
- **Sin recursos de terceros:** ni Google Fonts ni el CDN de Font Awesome. La
  tipografía se sirve desde `Assets/Fuentes/` y los iconos desde un sprite SVG
  propio. Además de cargar antes, evita transferir la IP del visitante a terceros
  antes de que acepte las cookies.
- **Bloques comunes:** la cabecera, el pie, el banner de cookies, los botones
  flotantes y las fuentes viven en `_plantillas/`. Las páginas los delimitan con
  marcas `<!-- @plantilla inicio: nombre -->` … `<!-- @plantilla fin: nombre -->`.
  Tras editar una plantilla hay que ejecutar:

  ```bash
  python3 _herramientas/construir.py
  ```

  Un workflow de GitHub Actions falla si alguna página se queda desincronizada.
  Dentro de las plantillas, `{{BASE}}` es el prefijo hasta la raíz del sitio.
- **Iconos:** para usar uno nuevo, escribe
  `<svg class="icon" viewBox="…"><use href="…/Assets/Iconos/sprite.svg#nombre"></use></svg>`
  y ejecuta `python3 _herramientas/construir-sprite.py` (necesita npm).
- **Formulario de contacto:** envía por correo a través de Web3Forms. La clave va
  en `CLAVE_FORMULARIO`, al principio del bloque del formulario en `script.js`;
  mientras esté vacía, el envío sigue haciéndose por WhatsApp.
- Google Analytics solo se carga tras aceptar el banner de cookies (gestión en `script.js`).
- Al tocar CSS o JS hay que subir el parámetro `?v=` de todas las páginas, o los
  visitantes recurrentes seguirán con la versión cacheada.
- Las rutas públicas (`/Servicios/`, `/Blog/`, `/Zonas/`) no deben renombrarse:
  están indexadas y referenciadas en `sitemap.xml` y los canonicals.
