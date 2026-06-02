# TresDev — Portal de juegos y proyectos

Portal construido desde cero con HTML, CSS y JS puro, sin frameworks ni dependencias.
Hecho por Omar, Juan Esteban y Juan David Figueroa Uran — tres colegas de Medellín, Colombia.

🔗 **En vivo:** https://poeta2475.github.io/python_prueba/

## El equipo

| Persona | Rol |
|---|---|
| **Omar** | Desarrollador principal · arquitectura, código y contenido |
| **Juan Esteban Figueroa Uran** | Colega & colaborador · ideas, diseño y retroalimentación |
| **Juan David Figueroa Uran** | Colega & colaborador · pruebas, perspectiva y motivación |

## Páginas

| Archivo | Descripción |
|---|---|
| `index.html` | Home: hero del equipo, juego destacado, proyectos, blog preview, CTA |
| `juegos.html` | Catálogo de juegos disponibles y próximamente |
| `juego.html` | Blackjack completo con apuestas, side bet Lucky Ladies y modo nocturno |
| `proyectos.html` | Proyectos con stack tecnológico y sección de créditos del equipo |
| `blog.html` | Blog con filtros por categoría y búsqueda en tiempo real |
| `articulo.html` | Lector de artículo individual con artículos relacionados |
| `recursos.html` | Recursos útiles y herramientas favoritas |
| `nosotros.html` | Sobre el equipo, valores, historia y habilidades |
| `signup.html` | Registro con validación y medidor de contraseña |
| `login.html` | Inicio de sesión |
| `recuperar.html` | Recuperación de contraseña |
| `legal.html` | Términos, privacidad y cookies |
| `404.html` | Página de error personalizada |

## Lógica

- **Autenticación** (`js/store.js`): registro, login y sesión persistente en `localStorage` (demo).
- **Blog** (`js/blog-data.js`): 6 artículos sobre código, CSS y juegos firmados por los tres integrantes del equipo. API `NexaBlog` con `.all()`, `.bySlug()` y `.formatDate()`.
- **Blackjack** (`juego.html`): baraja Fisher-Yates, As 1/11, dealer H17 real, Lucky Ladies, animaciones de cartas.
- **Tema** (`js/theme.js`): script bloqueante en `<head>` que lee `localStorage` antes del primer pintado — cero flash.
- **Animaciones**: `IntersectionObserver` para scroll-reveal, botones magnéticos, efecto spotlight, aurora de fondo.

## Arquitectura

```
styles.css          → estilos globales, componentes y temas
js/theme.js         → anti-flash: aplica data-theme antes del primer pintado
js/store.js         → capa de datos: usuarios, sesión (localStorage)
js/ui.js            → toasts y validadores reutilizables
js/main.js          → scroll-reveal, micro-interacciones, navbar
js/auth.js          → login / signup
js/blog-data.js     → contenido del blog (6 artículos, 3 autores)
assets/             → favicon.svg, og-image.svg
```

## Accesibilidad

- Skip-link, `aria-*` completos, foco visible en todos los controles.
- `prefers-reduced-motion`: desactiva animaciones de cartas y confetti.
- Menú móvil funcional, totalmente responsive desde 360 px.

## Desarrollo local

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```
