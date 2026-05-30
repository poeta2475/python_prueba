/* NexaPy Analytics — Contenido del blog (datos)
 * Artículos reales servidos client-side. Cada uno tiene cuerpo en HTML simple.
 */
(function (global) {
  'use strict';

  const ARTICLES = [
    {
      slug: 'kpis-pyme-colombia',
      tag: 'Estrategia',
      title: '7 KPIs que toda pyme colombiana debería medir',
      excerpt:
        'Si solo miras las ventas, estás manejando a ciegas. Estos son los indicadores que de verdad mueven la aguja de tu negocio.',
      author: 'Daniela Castaño',
      date: '2026-05-20',
      read: 8,
      emoji: '📊',
      body: `
        <p>En Colombia, ocho de cada diez pymes cierran antes de los cinco años. Una causa silenciosa: tomar decisiones por intuición en lugar de datos. La buena noticia es que no necesitas un equipo de analistas para empezar — solo medir lo correcto.</p>
        <h2>1. Margen de contribución</h2>
        <p>No es lo mismo vender mucho que ganar mucho. El margen de contribución te dice cuánto te queda de cada venta después de los costos variables. Si vendes a $100.000 y te cuesta $70.000 producirlo, tu margen es del 30%. <strong>Mídelo por producto</strong>: te sorprenderá descubrir cuáles te hacen perder dinero.</p>
        <h2>2. Costo de adquisición de cliente (CAC)</h2>
        <p>¿Cuánto inviertes en marketing y ventas para conseguir un cliente nuevo? Divide tu gasto comercial mensual entre los clientes ganados. Si gastas $2.000.000 y consigues 20 clientes, tu CAC es de $100.000.</p>
        <h2>3. Valor de vida del cliente (LTV)</h2>
        <p>Cuánto te deja un cliente durante toda su relación contigo. La regla de oro: tu LTV debe ser al menos <strong>3 veces tu CAC</strong>. Si gastas más en conseguir clientes de lo que te dejan, el modelo no es sostenible.</p>
        <h2>4. Tasa de conversión</h2>
        <p>De cada 100 personas que llegan a tu tienda o web, ¿cuántas compran? Subir del 2% al 3% puede significar un 50% más de ventas sin gastar un peso adicional en publicidad.</p>
        <h2>5. Flujo de caja proyectado</h2>
        <p>El 60% de las pymes que quiebran eran rentables en el papel — murieron por falta de liquidez. Proyecta tu caja a 90 días y anticipa los meses difíciles.</p>
        <h2>6. Ticket promedio</h2>
        <p>Cuánto gasta en promedio cada cliente por compra. Pequeñas mejoras (ventas cruzadas, paquetes) impactan directo en tus ingresos.</p>
        <h2>7. Rotación de inventario</h2>
        <p>Si vendes productos, el inventario parado es dinero congelado. Mide cuántas veces vendes y repones tu stock al año.</p>
        <h2>El siguiente paso</h2>
        <p>Medir estos siete indicadores en una hoja de cálculo es agotador y propenso a errores. Con NexaPy, los conectas una vez y los ves actualizados en tiempo real en un dashboard. <a href="signup.html">Pruébalo gratis 14 días</a>.</p>
      `,
    },
    {
      slug: 'excel-a-dashboards',
      tag: 'Tutorial',
      title: 'De Excel a dashboards en vivo: la guía definitiva',
      excerpt:
        'Excel es genial para empezar, pero llega un punto en que te frena. Te mostramos cómo dar el salto sin perder tus datos.',
      author: 'Valentina Mora',
      date: '2026-05-12',
      read: 6,
      emoji: '🚀',
      body: `
        <p>Casi todas las empresas empiezan con Excel, y está bien. Pero cuando tu archivo tiene 12 pestañas, fórmulas que solo entiende una persona y se rompe cada vez que alguien lo abre, es hora de evolucionar.</p>
        <h2>Señales de que superaste Excel</h2>
        <ul>
          <li>Varias personas editan el mismo archivo y se pisan los cambios.</li>
          <li>Pasas más tiempo armando el reporte que analizándolo.</li>
          <li>Los datos llegan tarde: para cuando el reporte está listo, ya no sirve.</li>
          <li>Una fórmula mal copiada arruina todo el análisis.</li>
        </ul>
        <h2>Paso 1: identifica tus fuentes</h2>
        <p>Haz una lista de dónde viven tus datos: el software contable, la tienda en línea, el CRM, las hojas de cálculo. NexaPy se conecta a más de 200 fuentes, así que probablemente las tuyas ya estén soportadas.</p>
        <h2>Paso 2: conecta, no copies</h2>
        <p>El error clásico es seguir exportando y pegando. En su lugar, conecta la fuente una sola vez. A partir de ahí los datos fluyen solos y se actualizan en tiempo real.</p>
        <h2>Paso 3: construye tu primer dashboard</h2>
        <p>Empieza simple: ventas del mes, comparado con el anterior. Agrega un gráfico de tendencia y tus tres productos más vendidos. Con arrastrar y soltar, lo tienes en minutos.</p>
        <h2>Paso 4: comparte y automatiza</h2>
        <p>Invita a tu equipo con permisos por rol y programa que el reporte llegue cada lunes a las 8 a.m. al correo de la gerencia. Sin que nadie mueva un dedo.</p>
        <p>¿Listo para dejar atrás el caos de las hojas de cálculo? <a href="signup.html">Empieza gratis</a>.</p>
      `,
    },
    {
      slug: 'flujo-caja-ia',
      tag: 'IA',
      title: 'Predice tu flujo de caja con inteligencia artificial',
      excerpt:
        'Anticipar los meses difíciles deja de ser adivinanza. Así funcionan los modelos predictivos aplicados a tu liquidez.',
      author: 'Mateo Gil',
      date: '2026-05-03',
      read: 10,
      emoji: '🤖',
      body: `
        <p>"¿Tendré con qué pagar la nómina en tres meses?" Es la pregunta que quita el sueño a todo dueño de empresa. La inteligencia artificial no tiene una bola de cristal, pero sí puede darte una respuesta sorprendentemente precisa.</p>
        <h2>Qué es la predicción de flujo de caja</h2>
        <p>Es usar tu historial de ingresos y gastos para estimar, con un margen de confianza, cómo se verá tu caja en las próximas semanas o meses. Los modelos detectan patrones que el ojo humano no ve: estacionalidad, ciclos de cobro, tendencias.</p>
        <h2>Qué necesitas para empezar</h2>
        <ul>
          <li><strong>Historial:</strong> al menos 6-12 meses de movimientos.</li>
          <li><strong>Consistencia:</strong> que los datos estén categorizados (ventas, nómina, proveedores).</li>
          <li><strong>Una herramienta:</strong> NexaPy trae los modelos pre-entrenados, no necesitas saber de ciencia de datos.</li>
        </ul>
        <h2>Cómo lo lee la IA</h2>
        <p>El modelo aprende, por ejemplo, que en diciembre tus ventas suben un 40% pero tus clientes pagan a 60 días, así que el ingreso real llega en febrero. Con eso, te avisa con anticipación de un posible bache de liquidez en enero.</p>
        <h2>De la predicción a la acción</h2>
        <p>Saber no basta; hay que actuar. Con una alerta temprana puedes negociar plazos con proveedores, adelantar cobros o asegurar una línea de crédito antes de necesitarla con urgencia.</p>
        <h2>Un ejemplo real</h2>
        <p>Una distribuidora en Barranquilla usó las predicciones de NexaPy y detectó que cada inicio de trimestre tenía déficit. Ajustaron sus ciclos de cobro y eliminaron por completo los sobregiros bancarios, ahorrando millones en intereses.</p>
        <p>La IA predictiva viene incluida desde el plan Professional. <a href="signup.html">Actívala gratis</a>.</p>
      `,
    },
    {
      slug: 'caso-retailpro',
      tag: 'Caso de éxito',
      title: 'Cómo RetailPro aumentó sus ventas un 23% en seis meses',
      excerpt:
        'La historia de una cadena de tiendas que pasó de reportes mensuales a decisiones diarias basadas en datos.',
      author: 'Laura Patiño',
      date: '2026-04-22',
      read: 5,
      emoji: '🏆',
      body: `
        <p>RetailPro opera 14 tiendas de ropa en cinco ciudades de Colombia. Hasta 2025, su gerencia tomaba decisiones con reportes que llegaban a mitad del mes siguiente. Para cuando veían un problema, ya era tarde.</p>
        <h2>El reto</h2>
        <p>Cada tienda enviaba su Excel los primeros días del mes. El equipo central consolidaba todo a mano — un proceso de cinco días lleno de errores. Las decisiones de inventario y promociones siempre iban un mes atrasadas.</p>
        <h2>La solución</h2>
        <p>Conectaron sus puntos de venta a NexaPy. En una semana tenían un dashboard único con las ventas de las 14 tiendas <strong>actualizándose cada hora</strong>.</p>
        <h2>Los resultados en seis meses</h2>
        <ul>
          <li><strong>+23%</strong> en ventas totales.</li>
          <li><strong>-31%</strong> en inventario estancado, al detectar productos de baja rotación a tiempo.</li>
          <li><strong>5 días → 0</strong>: la consolidación manual desapareció.</li>
          <li>Las promociones ahora se lanzan según lo que vende cada ciudad, no por corazonada.</li>
        </ul>
        <h2>En palabras de su Head of Data</h2>
        <blockquote class="article-quote">"Antes discutíamos sobre qué había pasado el mes pasado. Ahora discutimos qué vamos a hacer mañana. Ese cambio lo es todo."</blockquote>
        <p>¿Quieres resultados parecidos? <a href="signup.html">Empieza tu prueba gratuita</a> o <a href="index.html#contact">habla con nuestro equipo</a>.</p>
      `,
    },
    {
      slug: 'seguridad-datos-empresa',
      tag: 'Seguridad',
      title: 'Seguridad de datos: lo que toda empresa colombiana debe saber',
      excerpt:
        'La Ley 1581 de Habeas Data no es opcional. Te explicamos en simple cómo proteger los datos de tus clientes.',
      author: 'Andrés Ramírez',
      date: '2026-04-10',
      read: 7,
      emoji: '🔒',
      body: `
        <p>Manejar datos de clientes en Colombia conlleva una responsabilidad legal real. La Ley 1581 de 2012 (Habeas Data) establece cómo debes tratar la información personal, y las multas por incumplir pueden ser severas.</p>
        <h2>Tus obligaciones básicas</h2>
        <ul>
          <li><strong>Autorización:</strong> necesitas permiso explícito para usar los datos de una persona.</li>
          <li><strong>Finalidad:</strong> solo puedes usarlos para lo que informaste.</li>
          <li><strong>Seguridad:</strong> debes protegerlos contra accesos no autorizados.</li>
          <li><strong>Derechos:</strong> la persona puede pedir conocer, actualizar o eliminar sus datos.</li>
        </ul>
        <h2>Buenas prácticas mínimas</h2>
        <p>Cifra la información sensible, limita quién accede a qué (permisos por rol), mantén un registro de accesos y nunca compartas datos con terceros sin autorización.</p>
        <h2>Cómo ayuda una plataforma seria</h2>
        <p>NexaPy cifra tus datos en reposo (AES-256) y en tránsito (TLS 1.3), está certificada bajo ISO 27001 y SOC 2, y te da control granular de permisos. Cumplir la ley deja de ser una carga manual.</p>
        <p>Lee más en nuestro <a href="legal.html#gdpr">centro legal</a> o <a href="signup.html">crea tu cuenta segura</a>.</p>
      `,
    },
    {
      slug: 'novedades-mayo',
      tag: 'Changelog',
      title: 'Novedades de NexaPy: edición de mayo',
      excerpt:
        'Nuevos tipos de gráficos, un 40% más de velocidad en consultas y mejoras en el editor visual.',
      author: 'Equipo de Producto',
      date: '2026-05-28',
      read: 4,
      emoji: '✨',
      body: `
        <p>Cada semana mejoramos NexaPy escuchando a nuestros clientes. Este es el resumen de lo que lanzamos en mayo.</p>
        <h2>🎨 Nuevos gráficos</h2>
        <p>Agregamos gráficos de embudo (funnel) y de dona (donut) al panel. Perfectos para visualizar conversiones y distribuciones de un vistazo.</p>
        <h2>⚡ 40% más rápido</h2>
        <p>Optimizamos nuestro motor de consultas. Los dashboards con millones de filas ahora cargan notablemente más rápido.</p>
        <h2>🤝 Mejoras de colaboración</h2>
        <p>Ahora puedes mencionar a un compañero con @ directamente en un comentario sobre los datos, y le llega una notificación.</p>
        <h2>🔌 Nuevas integraciones</h2>
        <p>Sumamos conectores nativos para Siigo, Alegra y World Office — los favoritos de la contabilidad en Colombia.</p>
        <h2>🌗 Modo claro</h2>
        <p>Por pedido popular, toda la plataforma ahora tiene modo claro además del oscuro. Cámbialo con un clic.</p>
        <p>¿Tienes una idea para mejorar NexaPy? Escríbenos a <a href="mailto:hola@nexapy.co">hola@nexapy.co</a>.</p>
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
