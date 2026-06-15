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
├── Blog/
│   ├── index.html              # Listado de artículos
│   └── *.html                  # Artículos individuales
├── Assets/
│   ├── CSS/
│   │   ├── styles.css          # Hoja principal (todas las páginas)
│   │   ├── service-page.css    # Compartida por 4 páginas de Servicios
│   │   ├── infraestructura-telecom.css   # Variante propia
│   │   ├── videovigilancia-styles.css    # Variante propia
│   │   └── post-styles.css     # Artículos del blog
│   ├── JS/script.js            # Menú, banner cookies + carga condicional
│   │                           # de Google Analytics (RGPD), año del footer,
│   │                           # página activa en navegación, animaciones
│   └── Imagenes/               # Logos, favicon e imágenes (WebP)
├── sitemap.xml
├── robots.txt
└── CNAME                       # Dominio de GitHub Pages (www.satekor.es)
```

**Notas técnicas:**

- Sitio 100% estático servido con GitHub Pages; sin proceso de build.
- Google Analytics solo se carga tras aceptar el banner de cookies (gestión en `script.js`).
- Las rutas públicas (`/Servicios/`, `/Blog/`) no deben renombrarse: están indexadas y referenciadas en `sitemap.xml` y los canonicals.
