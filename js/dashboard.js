/* NexaPy Analytics — Dashboard demo funcional
 * Genera un dataset determinista, calcula KPIs reales, dibuja gráficos en SVG
 * y gestiona una tabla con búsqueda, orden y paginación. Todo client-side.
 */
(function () {
  'use strict';
  const Store = window.NexaStore;
  const { toast } = window.NexaUI;

  // ── Guard de sesión ──────────────────────────────────────────
  const session = Store.requireSession('login.html');
  if (!session) return;

  // Personaliza cabecera
  const hi = document.getElementById('userGreeting');
  if (hi) hi.textContent = 'Hola, ' + session.name.split(' ')[0];
  const avatar = document.getElementById('userAvatar');
  if (avatar) avatar.textContent = session.name.slice(0, 1).toUpperCase();

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    Store.endSession();
    location.href = 'index.html';
  });

  // ── Generador de datos determinista (PRNG con semilla) ───────
  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const CHANNELS = ['Búsqueda orgánica', 'Anuncios pagados', 'Email', 'Redes sociales', 'Referidos', 'Directo'];
  const COUNTRIES = ['México', 'Colombia', 'España', 'Argentina', 'Chile', 'Perú', 'EE. UU.'];
  const PRODUCTS = ['Plan Starter', 'Plan Professional', 'Plan Enterprise', 'Add-on IA', 'Soporte Premium'];

  // Construye N días de datos hacia atrás desde hoy
  function buildSeries(days) {
    const rng = mulberry32(20260530);
    const out = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const weekday = d.getDay();
      const weekendFactor = weekday === 0 || weekday === 6 ? 0.72 : 1;
      const trend = 1 + (days - i) / (days * 4); // crecimiento suave
      const noise = 0.8 + rng() * 0.5;
      const visits = Math.round(900 * weekendFactor * trend * noise);
      const conv = 0.03 + rng() * 0.03;
      const orders = Math.round(visits * conv);
      const aov = 60 + rng() * 90; // ticket promedio
      const revenue = Math.round(orders * aov);
      out.push({ date: d, visits, orders, revenue, conv });
    }
    return out;
  }

  // Genera transacciones individuales para la tabla
  function buildTransactions(series) {
    const rng = mulberry32(99887766);
    const rows = [];
    let id = 1000;
    series.slice(-14).forEach((day) => {
      const n = Math.max(3, Math.round(day.orders / 6));
      for (let k = 0; k < n; k++) {
        const amount = Math.round(40 + rng() * 480);
        rows.push({
          id: 'TX-' + ++id,
          date: day.date,
          customer: 'Cliente ' + Math.floor(rng() * 9000 + 1000),
          product: PRODUCTS[Math.floor(rng() * PRODUCTS.length)],
          channel: CHANNELS[Math.floor(rng() * CHANNELS.length)],
          country: COUNTRIES[Math.floor(rng() * COUNTRIES.length)],
          amount,
          status: rng() > 0.12 ? 'Completado' : rng() > 0.5 ? 'Pendiente' : 'Reembolsado',
        });
      }
    });
    return rows;
  }

  // ── Estado y formato ─────────────────────────────────────────
  let rangeDays = 30;
  const fmtMoney = (n) => '$' + Math.round(n).toLocaleString('es-MX');
  const fmtNum = (n) => Math.round(n).toLocaleString('es-MX');
  const fmtPct = (n) => (n * 100).toFixed(2) + '%';
  const fmtDate = (d) => d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });

  // ── KPIs ─────────────────────────────────────────────────────
  function renderKPIs(series) {
    const half = Math.floor(series.length / 2);
    const prev = series.slice(0, half);
    const curr = series.slice(half);
    const sum = (arr, key) => arr.reduce((a, b) => a + b[key], 0);

    const kpis = [
      { id: 'kpiRevenue', label: 'Ingresos', value: fmtMoney(sum(curr, 'revenue')), prev: sum(prev, 'revenue'), now: sum(curr, 'revenue'), money: true },
      { id: 'kpiVisits', label: 'Visitas', value: fmtNum(sum(curr, 'visits')), prev: sum(prev, 'visits'), now: sum(curr, 'visits') },
      { id: 'kpiOrders', label: 'Pedidos', value: fmtNum(sum(curr, 'orders')), prev: sum(prev, 'orders'), now: sum(curr, 'orders') },
      {
        id: 'kpiConv',
        label: 'Conversión',
        value: fmtPct(sum(curr, 'orders') / sum(curr, 'visits')),
        prev: sum(prev, 'orders') / sum(prev, 'visits'),
        now: sum(curr, 'orders') / sum(curr, 'visits'),
      },
    ];

    kpis.forEach((k) => {
      const card = document.getElementById(k.id);
      if (!card) return;
      const change = k.prev ? ((k.now - k.prev) / k.prev) * 100 : 0;
      const positive = change >= 0;
      card.querySelector('.kpi-value').textContent = k.value;
      const badge = card.querySelector('.kpi-change');
      badge.textContent = (positive ? '▲ ' : '▼ ') + Math.abs(change).toFixed(1) + '%';
      badge.className = 'kpi-change ' + (positive ? 'positive' : 'negative');
    });
  }

  // ── Gráfico de líneas (SVG) ──────────────────────────────────
  function renderLineChart(series) {
    const svg = document.getElementById('revenueChart');
    if (!svg) return;
    const W = 720, H = 240, pad = { l: 8, r: 8, t: 16, b: 24 };
    const data = series.map((d) => d.revenue);
    const max = Math.max(...data) * 1.1;
    const min = 0;
    const x = (i) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
    const y = (v) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);

    let line = '', area = '';
    data.forEach((v, i) => {
      line += (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ',' + y(v).toFixed(1) + ' ';
    });
    area = line + 'L' + x(data.length - 1).toFixed(1) + ',' + (H - pad.b) + ' L' + x(0).toFixed(1) + ',' + (H - pad.b) + ' Z';

    // gridlines horizontales
    let grid = '';
    for (let g = 0; g <= 4; g++) {
      const gy = pad.t + (g / 4) * (H - pad.t - pad.b);
      grid += '<line x1="' + pad.l + '" y1="' + gy + '" x2="' + (W - pad.r) + '" y2="' + gy + '" class="grid-line"/>';
      grid += '<text x="' + (W - pad.r) + '" y="' + (gy - 4) + '" class="axis-label" text-anchor="end">' + fmtMoney(max * (1 - g / 4)) + '</text>';
    }
    // etiquetas X (cada ~6)
    let xlabels = '';
    const stepX = Math.ceil(data.length / 6);
    series.forEach((d, i) => {
      if (i % stepX === 0) {
        xlabels += '<text x="' + x(i) + '" y="' + (H - 6) + '" class="axis-label" text-anchor="middle">' + fmtDate(d.date) + '</text>';
      }
    });

    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.innerHTML =
      '<defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#6366f1" stop-opacity="0.35"/>' +
      '<stop offset="100%" stop-color="#6366f1" stop-opacity="0"/></linearGradient></defs>' +
      grid +
      '<path d="' + area + '" fill="url(#rev)"/>' +
      '<path d="' + line + '" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round"/>' +
      xlabels;
  }

  // ── Gráfico de barras por canal ──────────────────────────────
  function renderChannelChart(transactions) {
    const wrap = document.getElementById('channelChart');
    if (!wrap) return;
    const totals = {};
    CHANNELS.forEach((c) => (totals[c] = 0));
    transactions.forEach((t) => {
      if (t.status !== 'Reembolsado') totals[t.channel] += t.amount;
    });
    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const max = Math.max(...entries.map((e) => e[1])) || 1;
    wrap.innerHTML = entries
      .map(
        ([name, val]) =>
          '<div class="bar-row"><span class="bar-name">' + name + '</span>' +
          '<div class="bar-track"><div class="bar-fill" style="width:' + ((val / max) * 100).toFixed(1) + '%"></div></div>' +
          '<span class="bar-val">' + fmtMoney(val) + '</span></div>'
      )
      .join('');
  }

  // ── Tabla: búsqueda + orden + paginación ─────────────────────
  const TableState = { rows: [], filtered: [], sortKey: 'date', sortDir: -1, page: 1, perPage: 8, query: '' };

  function applyTable() {
    const q = TableState.query.toLowerCase();
    TableState.filtered = TableState.rows.filter(
      (r) =>
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        r.product.toLowerCase().includes(q) ||
        r.channel.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
    const { sortKey, sortDir } = TableState;
    TableState.filtered.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === 'date') { av = av.getTime(); bv = bv.getTime(); }
      if (typeof av === 'string') return av.localeCompare(bv) * sortDir;
      return (av - bv) * sortDir;
    });
    renderTable();
  }

  function renderTable() {
    const tbody = document.getElementById('txBody');
    if (!tbody) return;
    const total = TableState.filtered.length;
    const pages = Math.max(1, Math.ceil(total / TableState.perPage));
    TableState.page = Math.min(TableState.page, pages);
    const start = (TableState.page - 1) * TableState.perPage;
    const slice = TableState.filtered.slice(start, start + TableState.perPage);

    if (!slice.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Sin resultados para “' + TableState.query + '”.</td></tr>';
    } else {
      const statusClass = (s) =>
        s === 'Completado' ? 'st-ok' : s === 'Pendiente' ? 'st-warn' : 'st-bad';
      tbody.innerHTML = slice
        .map(
          (r) =>
            '<tr><td><code>' + r.id + '</code></td>' +
            '<td>' + fmtDate(r.date) + '</td>' +
            '<td>' + r.customer + '</td>' +
            '<td>' + r.product + '</td>' +
            '<td>' + r.country + '</td>' +
            '<td class="num">' + fmtMoney(r.amount) + '</td>' +
            '<td><span class="status ' + statusClass(r.status) + '">' + r.status + '</span></td></tr>'
        )
        .join('');
    }

    const info = document.getElementById('tableInfo');
    if (info) {
      info.textContent = total
        ? 'Mostrando ' + (start + 1) + '–' + Math.min(start + TableState.perPage, total) + ' de ' + total
        : '0 resultados';
    }
    const pageLabel = document.getElementById('pageLabel');
    if (pageLabel) pageLabel.textContent = TableState.page + ' / ' + pages;
    document.getElementById('prevPage')?.toggleAttribute('disabled', TableState.page <= 1);
    document.getElementById('nextPage')?.toggleAttribute('disabled', TableState.page >= pages);
  }

  // ── Inicialización + cableado de controles ───────────────────
  function refresh() {
    const series = buildSeries(rangeDays);
    const tx = buildTransactions(series);
    renderKPIs(series);
    renderLineChart(series);
    renderChannelChart(tx);
    TableState.rows = tx;
    TableState.page = 1;
    applyTable();
  }

  // Filtro de rango
  document.querySelectorAll('.range-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.range-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      rangeDays = +btn.dataset.range;
      refresh();
    });
  });

  // Búsqueda
  const search = document.getElementById('tableSearch');
  if (search) {
    let t;
    search.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        TableState.query = search.value.trim();
        TableState.page = 1;
        applyTable();
      }, 150);
    });
  }

  // Orden por cabecera
  document.querySelectorAll('th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (TableState.sortKey === key) TableState.sortDir *= -1;
      else { TableState.sortKey = key; TableState.sortDir = 1; }
      document.querySelectorAll('th[data-sort]').forEach((h) => h.classList.remove('sorted-asc', 'sorted-desc'));
      th.classList.add(TableState.sortDir === 1 ? 'sorted-asc' : 'sorted-desc');
      applyTable();
    });
  });

  // Paginación
  document.getElementById('prevPage')?.addEventListener('click', () => {
    if (TableState.page > 1) { TableState.page--; renderTable(); }
  });
  document.getElementById('nextPage')?.addEventListener('click', () => {
    TableState.page++; renderTable();
  });

  // Exportar CSV (de la vista filtrada)
  document.getElementById('exportCsv')?.addEventListener('click', () => {
    const headers = ['ID', 'Fecha', 'Cliente', 'Producto', 'País', 'Importe', 'Estado'];
    const lines = [headers.join(',')];
    TableState.filtered.forEach((r) => {
      lines.push([r.id, r.date.toISOString().slice(0, 10), r.customer, r.product, r.country, r.amount, r.status].join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nexapy-transacciones.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('CSV exportado (' + TableState.filtered.length + ' filas).', 'success');
  });

  refresh();
})();
