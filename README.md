# NexaPy Analytics

Landing page + demo funcional de una plataforma SaaS de análisis de datos.
Sitio estático (HTML/CSS/JS puro, sin dependencias) desplegado en GitHub Pages.

🔗 **En vivo:** https://poeta2475.github.io/python_prueba/

## Qué incluye

| Página | Descripción |
|---|---|
| `index.html` | Landing: hero, características, métricas, proceso, precios, testimonios, FAQ, contacto, newsletter |
| `signup.html` | Registro con validación y medidor de fuerza de contraseña |
| `login.html` | Inicio de sesión con verificación de credenciales |
| `dashboard.html` | Panel demo: KPIs, gráficos SVG, tabla con búsqueda/orden/paginación/export CSV |
| `404.html` | Página de error personalizada |

## Lógica real (no es solo maquetación)

- **Autenticación cliente** (`js/store.js`): registro, login, sesión y persistencia en `localStorage`. Las contraseñas se guardan hasheadas (demo; en producción iría en servidor con bcrypt/argon2).
- **Guard de sesión**: `dashboard.html` redirige a login si no hay sesión; las páginas de auth redirigen al panel si ya la hay.
- **Dashboard con datos**: generador determinista (PRNG con semilla) produce series temporales; se calculan KPIs reales con comparación periodo-a-periodo, se dibujan gráficos en SVG y se gestiona una tabla interactiva.
- **Validación de formularios** (`js/ui.js`): email, longitud, requeridos, con mensajes por campo y notificaciones tipo toast.
- **Contacto y newsletter**: guardan leads/suscripciones en `localStorage`.

## Arquitectura

```
index / login / signup / dashboard / 404   (HTML)
styles.css        → estilos globales + componentes
dashboard.css     → estilos del panel
js/store.js       → capa de datos (localStorage): usuarios, sesión, leads
js/ui.js          → toasts + validadores reutilizables
js/main.js        → interacciones de la landing
js/auth.js        → login / signup
js/dashboard.js   → KPIs, gráficos y tabla del panel
```

## Accesibilidad y UX

- Skip-link, `aria-*`, foco visible, soporte de `prefers-reduced-motion`.
- Menú móvil funcional, navegación con scroll-spy, totalmente responsive.

## Desarrollo local

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Despliegue

Automático vía GitHub Actions (`.github/workflows/deploy-pages.yml`) en cada push a la rama.
