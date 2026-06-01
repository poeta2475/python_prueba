/* OmarDev — Contenido del blog (datos)
 * Notas personales sobre código, juegos y proyectos. Cada artículo
 * tiene su cuerpo en HTML simple y se sirve client-side.
 */
(function (global) {
  'use strict';

  const ARTICLES = [
    {
      slug: 'por-que-sin-frameworks',
      tag: 'Reflexión',
      title: 'Por qué construí mi portal sin frameworks',
      excerpt:
        'React, Vue, Svelte… todos geniales. Pero para un portal personal decidí volver a lo básico. Esto fue lo que aprendí.',
      author: 'Omar',
      date: '2026-05-20',
      read: 6,
      emoji: '🧱',
      body: `
        <p>Cuando empecé este portal tenía la tentación de montar React, un bundler y diez dependencias antes de escribir una sola línea de contenido. En vez de eso, abrí un <code>index.html</code> en blanco y empecé a escribir. Esta es mi defensa de hacerlo así.</p>
        <h2>Entiendes lo que escribes</h2>
        <p>Sin una capa de abstracción encima, cada cosa que pasa en la pantalla la programé yo. Si una animación falla, sé exactamente dónde mirar. No hay magia escondida en <code>node_modules</code>.</p>
        <h2>Carga instantánea</h2>
        <p>El sitio entero son tres archivos: un HTML, un CSS y un puñado de JS. No hay JavaScript de 300 KB que descargar antes de ver el primer texto. En móvil con datos lentos, eso se nota muchísimo.</p>
        <h2>Cero mantenimiento de dependencias</h2>
        <p>No tengo que actualizar paquetes cada semana ni preocuparme por vulnerabilidades en librerías que ni uso. El código de hoy va a funcionar igual dentro de cinco años.</p>
        <h2>¿Cuándo SÍ usar un framework?</h2>
        <p>Para un portal personal, vanilla sobra. Pero si mañana construyo algo con estado complejo, formularios encadenados o cientos de componentes, ahí un framework gana. La herramienta correcta depende del problema.</p>
        <h2>El consejo</h2>
        <p>Antes de instalar algo, pregúntate si lo necesitas de verdad. Aprender los fundamentos de HTML, CSS y JS te hace mejor developer pase lo que pase con las modas. <a href="proyectos.html">Mira cómo está hecho este portal</a>.</p>
      `,
    },
    {
      slug: 'logica-blackjack',
      tag: 'Tutorial',
      title: 'Cómo programé la lógica del dealer en mi Blackjack',
      excerpt:
        'Barajar cartas, repartir, decidir cuándo el dealer pide… La lógica de un casino cabe en menos código del que crees.',
      author: 'Omar',
      date: '2026-05-12',
      read: 8,
      emoji: '🃏',
      body: `
        <p>El primer juego del portal es un Blackjack completo. Detrás de las animaciones bonitas hay reglas muy claras que se traducen directo a código. Te cuento cómo lo armé.</p>
        <h2>Paso 1: la baraja</h2>
        <p>Una baraja son 52 cartas: cuatro palos por trece valores. Las genero con dos bucles anidados y luego las mezclo con el algoritmo de <strong>Fisher-Yates</strong>, que reordena el array en una sola pasada sin sesgos.</p>
        <h2>Paso 2: contar la mano</h2>
        <p>Aquí está el truco: el As vale 1 u 11. Sumo todas las cartas tratando los Ases como 11 y, si me paso de 21, voy bajando Ases a 1 hasta que la mano vuelva a ser válida. Unas pocas líneas y queda resuelto.</p>
        <h2>Paso 3: la lógica del dealer</h2>
        <p>El dealer no piensa: obedece una regla fija. Pide carta mientras su mano sume menos de 17 y se planta en 17 o más. Es un simple <code>while</code> — la "inteligencia" del casino es pura disciplina.</p>
        <h2>Paso 4: resolver la ronda</h2>
        <p>Comparo las manos: si el jugador se pasó, pierde; si el dealer se pasa, gana el jugador; si no, gana quien esté más cerca de 21. El Blackjack natural (As + figura) paga 3 a 2.</p>
        <h2>Lo que aprendí</h2>
        <p>Un juego se siente complejo, pero casi siempre es un conjunto de reglas pequeñas y claras encadenadas. Empieza por las reglas, no por los gráficos. <a href="juego.html">Juega el resultado final aquí</a>.</p>
      `,
    },
    {
      slug: 'animaciones-css-puro',
      tag: 'CSS',
      title: 'Animaciones suaves con CSS puro (sin librerías)',
      excerpt:
        'Las cartas que vuelan, los reveals al hacer scroll, los botones magnéticos: todo con CSS y un poquito de JS.',
      author: 'Omar',
      date: '2026-05-03',
      read: 7,
      emoji: '✨',
      body: `
        <p>No necesitas una librería de animaciones para que un sitio se sienta vivo. Casi todo lo de este portal se mueve con <code>@keyframes</code> y <code>transition</code>. Estos son mis trucos favoritos.</p>
        <h2>Anima transform y opacity, nada más</h2>
        <p>El navegador puede animar <code>transform</code> y <code>opacity</code> en la GPU sin recalcular el layout. Animar <code>width</code> o <code>top</code> en cambio provoca reflows y se ve a tirones. Esta única regla resuelve el 90% del rendimiento.</p>
        <h2>Reveal al hacer scroll</h2>
        <p>Con un <code>IntersectionObserver</code> detecto cuándo un elemento entra en pantalla y le agrego una clase. El CSS hace el resto: pasa de <code>opacity:0; translateY(20px)</code> a su posición final. Cero librerías.</p>
        <h2>El detalle que lo cambia todo</h2>
        <p>La curva de easing. Un <code>cubic-bezier</code> con un pequeño rebote hace que un movimiento se sienta natural en vez de robótico. Vale la pena jugar con los valores hasta que "se sienta bien".</p>
        <h2>Respeta a quien no quiere movimiento</h2>
        <p>Siempre envuelvo las animaciones grandes en <code>@media (prefers-reduced-motion: reduce)</code>. Accesibilidad no es opcional: hay gente a la que el movimiento le marea.</p>
        <p>Abre las herramientas de desarrollo y curiosea el CSS del sitio — está todo a la vista.</p>
      `,
    },
    {
      slug: 'modo-oscuro-sin-parpadeo',
      tag: 'Tutorial',
      title: 'Modo oscuro sin el molesto parpadeo blanco',
      excerpt:
        '¿Te ha pasado que la página carga en blanco y un segundo después salta a oscuro? Así eliminé ese flash para siempre.',
      author: 'Omar',
      date: '2026-04-22',
      read: 5,
      emoji: '🌗',
      body: `
        <p>El modo oscuro está de moda, pero hay un bug clásico: la página aparece en claro durante un instante y luego "salta" a oscuro. Feo y evitable. Aquí va la solución.</p>
        <h2>La causa del parpadeo</h2>
        <p>Si aplicas el tema con un script que carga al final, el navegador ya pintó la página en claro antes de que tu código corra. Ese medio segundo es el flash.</p>
        <h2>La solución: un script bloqueante en el head</h2>
        <p>Pongo un script pequeñito en el <code>&lt;head&gt;</code>, <strong>sin defer</strong>, que lee la preferencia de <code>localStorage</code> y pone el atributo <code>data-theme</code> en el <code>&lt;html&gt;</code> antes del primer pintado. El navegador ya pinta con el tema correcto.</p>
        <h2>Persistir la elección</h2>
        <p>Cuando el usuario cambia de tema, guardo su elección en <code>localStorage</code>. La próxima visita arranca exactamente como la dejó, sin pedir nada al servidor.</p>
        <h2>Y si nunca eligió</h2>
        <p>Respeto su sistema operativo con <code>prefers-color-scheme</code>. Si tiene el móvil en oscuro, el sitio arranca oscuro. Detalles así hacen que algo se sienta cuidado.</p>
        <p>Prueba el botón de tema arriba: el sitio entero cambia sin recargar y sin parpadear.</p>
      `,
    },
    {
      slug: 'localstorage-sin-backend',
      tag: 'JavaScript',
      title: 'Cuentas de usuario sin servidor con localStorage',
      excerpt:
        'Login, registro y sesiones en un sitio 100% estático en GitHub Pages. Spoiler: localStorage da para mucho.',
      author: 'Omar',
      date: '2026-04-10',
      read: 7,
      emoji: '🔐',
      body: `
        <p>Este portal vive en GitHub Pages, que solo sirve archivos estáticos — no hay base de datos ni servidor. Aun así tiene registro, login y sesión persistente. El secreto es <code>localStorage</code>.</p>
        <h2>Qué es localStorage</h2>
        <p>Es un almacén clave-valor que el navegador guarda por dominio y conserva entre visitas. Guardas un string, lo recuperas más tarde. Perfecto para preferencias y datos pequeños.</p>
        <h2>Guardar "usuarios"</h2>
        <p>Mantengo un array de usuarios serializado con <code>JSON.stringify</code>. Al registrarse, agrego un usuario; al iniciar sesión, busco por correo y comparo. Todo en el navegador del visitante.</p>
        <h2>Importante: esto es una demo</h2>
        <p>Sé honesto con sus límites: <strong>no es seguro para datos reales</strong>. Cualquiera puede leer su propio <code>localStorage</code>. Sirve para guardar progreso de un juego o un tema, no para contraseñas de verdad. En producción, eso va en un servidor con hashing serio.</p>
        <h2>Cuándo es la herramienta correcta</h2>
        <p>Para un portafolio, un juego o una app personal sin datos sensibles, es ideal: cero costo, cero infraestructura, despliegue gratis. Conoce sus límites y te rinde muchísimo.</p>
        <p>Si te interesa el detalle, todo el código está en el <a href="proyectos.html">proyecto del portal</a>.</p>
      `,
    },
    {
      slug: 'que-viene-despues',
      tag: 'Bitácora',
      title: 'Qué viene después del Blackjack',
      excerpt:
        'El primer juego ya está en vivo. Estos son los proyectos que tengo en la mira para los próximos meses.',
      author: 'Omar',
      date: '2026-05-28',
      read: 4,
      emoji: '🚀',
      body: `
        <p>El Blackjack fue el arranque del portal y ya es completamente jugable. Pero la idea nunca fue quedarme en un solo juego. Esto es lo que hay en el horizonte.</p>
        <h2>🎲 Un juego de dados</h2>
        <p>El segundo juego del portal. Algo con dados y decisiones de estrategia. Estoy en la fase de diseñar las reglas — la parte más divertida y la que más cuesta.</p>
        <h2>🧩 Un puzzle de lógica</h2>
        <p>Quiero construir algo más cerebral, de resolver pasos en vez de apostar. Todavía es una idea en el cuaderno, pero me ronda hace rato.</p>
        <h2>🧰 Una herramienta web</h2>
        <p>No todo tienen que ser juegos. Tengo ganas de hacer una utilidad pequeña y útil, de esas que usas a diario, hecha desde cero como el resto del sitio.</p>
        <h2>🤖 Un experimento con IA</h2>
        <p>El campo me fascina. En algún momento quiero conectar una API de inteligencia artificial a un proyecto del portal y ver hasta dónde llega.</p>
        <h2>Sin prisa, pero sin pausa</h2>
        <p>Cada cosa toma su tiempo cuando se hace bien y en ratos libres. Lo importante es que siempre hay algo nuevo cocinándose. <a href="proyectos.html">Sigue el avance en la página de proyectos</a>.</p>
      `,
    },
  ];

  global.NexaBlog = {
    all() {
      return ARTICLES.slice().sort((a, b) => b.date.localeCompare(a.date));
    },
    bySlug(slug) {
      return ARTICLES.find((a) => a.slug === slug) || null;
    },
    formatDate(iso) {
      return new Date(iso + 'T00:00:00').toLocaleDateString('es-CO', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    },
  };
})(window);
