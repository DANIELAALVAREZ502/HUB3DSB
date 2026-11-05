/* ============================================================
   CINE 3DS-B · Lógica de la cartelera
   Render, filtros, fichas, progreso, proyectos, trivia y tema.
   ============================================================ */

(() => {
  "use strict";

  /* ---------- Utilidades ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const normalizar = (texto) =>
    String(texto)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const CLAVE_VISTOS = "cine3dsb-vistos-v1";
  const CLAVE_TEMA   = "cine3dsb-tema";

  const ICONOS = {
    m30: "🎓", m32: "🛠️", m33: "🗄️", m34: "📄", m38: "🚀",
    m4: "🌹", m3en: "🎤", m2: "📱", m31: "🎮"
  };

  const etiquetaModulo = (m) => (m.id === "m31" ? "BTVD 3.1" : `Módulo ${m.codigo}`);

  const IMAGENES = {
    goldenrose: { src: "img/goldenrose.jpg", alt: "Tienda online Golden Rose en PrestaShop" },
    powerbi:    { src: "img/powerbi.jpg",    alt: "Dashboard de Power BI con gráficos de medallistas" },
    arduino:    { src: "img/arduino.jpg",    alt: "Circuito contador binario con Arduino y LEDs en Tinkercad" },
    laboratoriopython: { src: "img/python-tkinter.jpg", alt: "Aplicación de Python con interfaz Tkinter" }
  };

  /* ---------- Estado ---------- */
  let filtroActivo = "todos";
  let busqueda = "";
  let vistos = cargarVistos();

  function cargarVistos() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE_VISTOS) || "[]");
      return Array.isArray(guardado) ? guardado : [];
    } catch {
      return [];
    }
  }

  function guardarVistos() {
    try { localStorage.setItem(CLAVE_VISTOS, JSON.stringify(vistos)); } catch { /* modo privado */ }
  }

  const estaVisto = (id) => vistos.includes(id);

  function alternarVisto(id) {
    if (estaVisto(id)) vistos = vistos.filter((v) => v !== id);
    else vistos.push(id);
    guardarVistos();
    actualizarProgreso();
    marcarTarjetas();
    return estaVisto(id);
  }

  /* ---------- Render de la cartelera ---------- */
  const gridCartelera = $("#gridCartelera");
  const resultado     = $("#resultado");
  const vacio         = $("#vacio");

  function renderCartelera() {
    const q = normalizar(busqueda.trim());

    const lista = MODULOS.filter((m) => {
      const coincideDocente = filtroActivo === "todos" || m.docenteKey === filtroActivo;
      if (!coincideDocente) return false;
      if (!q) return true;

      const corpus = normalizar([
        m.codigo, m.nombre, m.corto, m.genero, m.tagline, m.docente, m.resumen,
        m.dato, m.evidencia,
        ...(m.aprendido || []),
        ...(m.programas || []),
        ...(m.herramientas || []),
        ...(m.proyectos || []).flatMap((p) => [p.nombre, p.detalle])
      ].join(" "));

      return corpus.includes(q);
    });

    gridCartelera.innerHTML = lista.map((m, i) => tarjetaModulo(m, i)).join("");

    vacio.hidden = lista.length !== 0;

    const total = MODULOS.length;
    resultado.textContent = lista.length === total
      ? `Cartelera completa · ${total} módulos`
      : `${lista.length} de ${total} módulos en pantalla`;

    const btnLimpiar = $("#limpiarBusqueda");
    if (btnLimpiar) btnLimpiar.hidden = !busqueda;
  }

  function tarjetaModulo(m, i) {
    const visto = estaVisto(m.id);
    const tags = (m.herramientas || []).slice(0, 3);

    return `
      <article class="peli${visto ? " is-visto" : ""}" data-id="${m.id}" style="--c1:${m.c1};--c2:${m.c2};animation-delay:${Math.min(i * 55, 420)}ms">
        <div class="peli__arte" aria-hidden="true">
          <div class="peli__perf peli__perf--top"></div>
          <div class="peli__perf peli__perf--bot"></div>
          <span class="peli__num">${m.codigo}</span>
          <span class="peli__genero">${m.genero}</span>
          <span class="peli__icono">${ICONOS[m.id] || "🎬"}</span>
          <span class="peli__franja">CINE 3DS-B · ESTRENO 2026</span>
          <span class="peli__visto">✓ Visto</span>
        </div>

        <div class="peli__cuerpo">
          <p class="peli__codigo">${etiquetaModulo(m)}</p>
          <h3 class="peli__nombre">“${m.nombre}”</h3>
          <p class="peli__docente">Prof. ${m.docente}</p>
          <p class="peli__tagline">“${m.tagline}”</p>
          <div class="peli__tags">
            ${tags.map((t) => `<span>${t}</span>`).join("")}
          </div>
          <p class="peli__cuenta">${m.proyectos.length} ${m.proyectos.length === 1 ? "proyecto" : "proyectos"} · ${m.programas.length} programas</p>
          <div class="peli__pie">
            <button class="peli__abrir" type="button" data-modulo="${m.id}">
              Ver ficha <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function marcarTarjetas() {
    $$(".peli", gridCartelera).forEach((card) => {
      card.classList.toggle("is-visto", estaVisto(card.dataset.id));
    });
  }

  /* ---------- Progreso ---------- */
  function actualizarProgreso() {
    const num  = $("#progresoNum");
    const fill = $("#progresoFill");
    const barra = $(".progreso__barra");
    const total = MODULOS.length;
    const hechos = vistos.filter((id) => MODULOS.some((m) => m.id === id)).length;

    if (num) num.textContent = hechos;
    if (fill) fill.style.width = `${(hechos / total) * 100}%`;
    if (barra) barra.setAttribute("aria-valuenow", String(hechos));
  }

  /* ---------- Diálogo de módulo ---------- */
  const dlgModulo      = $("#dlgModulo");
  const fichaContenido = $("#fichaContenido");

  function abrirModulo(id) {
    const m = MODULOS.find((x) => x.id === id);
    if (!m || !dlgModulo) return;

    const visto = estaVisto(m.id);

    fichaContenido.innerHTML = `
      <div class="ficha__hero" style="--c1:${m.c1};--c2:${m.c2}">
        <p class="ficha__funcion">${etiquetaModulo(m)} · ${m.docente} · ${m.genero}</p>
        <h2 class="ficha__nombre" id="fichaTitulo">${m.nombre}</h2>
        <p class="ficha__tagline">“${m.tagline}”</p>
        <div class="ficha__meta">
          <span>${m.docente}</span>
          <span>${m.plataforma}</span>
          <span>${m.genero}</span>
        </div>
      </div>

      <div class="ficha__cuerpo">
        <p class="ficha__resumen">${m.resumen}</p>

        <div class="ficha__stats">
          <div><small>Módulo</small><strong>${m.codigo}</strong></div>
          <div><small>Docente</small><strong>${m.docente}</strong></div>
          <div><small>Proyectos</small><strong>${m.proyectos.length}</strong></div>
          <div><small>Programas</small><strong>${m.programas.length}</strong></div>
        </div>

        <section class="ficha__bloque">
          <h4>Lo que aprendí</h4>
          <ul class="ficha__lista">
            ${(m.aprendido || []).map((a) => `<li>${a}</li>`).join("")}
          </ul>
        </section>

        <div class="ficha__cols">
          <section class="ficha__bloque">
            <h4>Programas</h4>
            <div class="ficha__pills ficha__pills--azul">
              ${(m.programas || []).map((p) => `<span>${p}</span>`).join("")}
            </div>
          </section>

          <section class="ficha__bloque">
            <h4>Herramientas y tecnologías</h4>
            <div class="ficha__pills">
              ${(m.herramientas || []).map((h) => `<span>${h}</span>`).join("")}
            </div>
          </section>
        </div>

        <section class="ficha__bloque">
          <h4>Proyectos y prácticas</h4>
          <div class="ficha__proyectos">
            ${(m.proyectos || []).map((p) => `
              <div class="ficha__proyecto">
                <strong>${p.nombre}</strong>
                <span>${p.detalle}</span>
              </div>
            `).join("")}
          </div>
        </section>

        <section class="ficha__bloque">
          <h4>Recursos para repasar</h4>
          <div class="ficha__links">
            ${(m.recursos || []).map((r) => `
              <a class="ficha__link" href="${r.url}" target="_blank" rel="noopener">
                ${r.nombre} <span aria-hidden="true">↗</span>
              </a>
            `).join("")}
          </div>
        </section>

        <div class="ficha__evidencia">
          <strong>Evidencia en mis carpetas</strong>
          ${m.evidencia}
        </div>

        <div class="ficha__dato">
          <strong>Dato de la película</strong>
          ${m.dato}
        </div>

        <div class="ficha__acciones">
          <button class="ficha__visto${visto ? " is-on" : ""}" type="button" data-visto="${m.id}" aria-pressed="${visto}">
            <span aria-hidden="true">🎟</span> <span data-texto-visto>${visto ? "Módulo visto" : "Marcar como visto"}</span>
          </button>
          <span class="ficha__nota">Se guarda en este navegador.</span>
        </div>
      </div>
    `;

    abrirDialogo(dlgModulo);
  }

  function abrirDialogo(dlg) {
    if (!dlg) return;
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  }

  function cerrarDialogo(dlg) {
    if (!dlg) return;
    if (typeof dlg.close === "function" && dlg.open) dlg.close();
    else dlg.removeAttribute("open");
    document.body.style.overflow = "";
  }

  /* ---------- Producciones ---------- */
  const gridProducciones = $("#gridProducciones");

  function renderProducciones() {
    if (!gridProducciones) return;

    gridProducciones.innerHTML = PROYECTOS.map((p, i) => {
      const img = IMAGENES[p.id];
      return `
        <article class="prod" style="--c1:${p.c1};--c2:${p.c2}">
          <div class="prod__media">
            ${img
              ? `<img src="${img.src}" alt="${img.alt}" loading="lazy" width="640" height="400">`
              : `<span class="prod__icono" aria-hidden="true">${p.icono}</span>`}
            <span class="prod__badge">${p.categoria}</span>
            ${img ? `<button class="prod__zoom" type="button" data-zoom="${p.id}" aria-label="Ampliar imagen de ${p.titulo}">⤢</button>` : ""}
          </div>

          <div class="prod__cuerpo">
            <p class="prod__meta">${p.anio} · ${p.duracion} · ${p.docente}</p>
            <h3 class="prod__titulo">${p.titulo}</h3>
            <p class="prod__sinopsis">${p.sinopsis}</p>
            <div class="prod__stack">
              ${p.stack.slice(0, 4).map((s) => `<span>${s}</span>`).join("")}
            </div>
            <button class="prod__abrir" type="button" data-proyecto="${p.id}">
              Ver producción <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>
      `;
    }).join("");
  }

  const dlgProyecto      = $("#dlgProyecto");
  const proyectoContenido = $("#proyectoContenido");

  function abrirProyecto(id) {
    const p = PROYECTOS.find((x) => x.id === id);
    if (!p || !dlgProyecto) return;
    const img = IMAGENES[p.id];

    proyectoContenido.innerHTML = `
      <div class="proyecto__media" style="--c1:${p.c1};--c2:${p.c2}">
        ${img
          ? `<img src="${img.src}" alt="${img.alt}">`
          : `<span class="prod__icono" aria-hidden="true">${p.icono}</span>`}
      </div>
      <div class="proyecto__cuerpo">
        <h3 id="proyectoTitulo">${p.titulo}</h3>
        <div class="proyecto__meta">
          <span>${p.categoria}</span>
          <span>${p.genero}</span>
          <span>${p.anio}</span>
          <span>${p.docente}</span>
        </div>
        <p class="proyecto__texto">${p.sinopsis}</p>

        <div class="proyecto__ficha">
          <div><small>Mi rol</small><p>${p.rol}</p></div>
          <div><small>Dato de producción</small><p>${p.dato}</p></div>
        </div>

        <div class="ficha__bloque">
          <h4>Reparto técnico</h4>
          <div class="ficha__pills">
            ${p.stack.map((s) => `<span>${s}</span>`).join("")}
          </div>
        </div>
      </div>
    `;

    abrirDialogo(dlgProyecto);
  }

  /* ---------- Lightbox ---------- */
  const lightbox    = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxCap = $("#lightboxCap");

  function abrirImagen(id, titulo) {
    const img = IMAGENES[id];
    if (!img || !lightbox) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCap.textContent = titulo;
    abrirDialogo(lightbox);
  }

  /* ---------- Trivia ---------- */
  const PREGUNTAS = [
    /* ---- Módulo 3.0 · Orientación ---- */
    {
      id: "m30-classroom",
      modulo: "Módulo 3.0",
      pregunta: "¿Qué plataforma se usa para entregar las actividades de orientación?",
      opciones: ["Google Classroom", "PrestaShop", "Arduino IDE", "SSMS"],
      correcta: "Google Classroom",
      explicacion: "Las tareas y presentaciones de orientación se entregan en Google Classroom."
    },
    {
      id: "m30-portafolio",
      modulo: "Módulo 3.0",
      pregunta: "¿Para qué sirve el portafolio digital?",
      opciones: [
        "Para organizar evidencias y dar seguimiento a los aprendizajes",
        "Para instalar SQL Server",
        "Para programar en C#",
        "Para simular circuitos"
      ],
      correcta: "Para organizar evidencias y dar seguimiento a los aprendizajes",
      explicacion: "El portafolio reúne las evidencias del año y permite ver el avance."
    },
    {
      id: "m30-proyecto-vida",
      modulo: "Módulo 3.0",
      pregunta: "¿Qué se define en el proyecto de vida?",
      opciones: ["Metas personales y académicas", "Las tablas de una base de datos", "Los pines del Arduino", "El carrito de compras"],
      correcta: "Metas personales y académicas",
      explicacion: "El proyecto de vida ordena metas y decisiones para el futuro cercano."
    },

    /* ---- Módulo 3.2 · Mantenimiento ---- */
    {
      id: "m32-preventivo",
      modulo: "Módulo 3.2",
      pregunta: "¿Qué tipo de mantenimiento previene fallas antes de que ocurran?",
      opciones: ["Preventivo", "Correctivo", "Correctivo de emergencia", "Ninguno"],
      correcta: "Preventivo",
      explicacion: "El mantenimiento preventivo revisa, limpia y actualiza para evitar fallas."
    },
    {
      id: "m32-respaldo",
      modulo: "Módulo 3.2",
      pregunta: "¿Qué es un respaldo o copia de seguridad?",
      opciones: [
        "Una copia de los datos para poder recuperarlos",
        "Un programa para editar fotos",
        "Una tabla de SQL",
        "Un tipo de conexión a internet"
      ],
      correcta: "Una copia de los datos para poder recuperarlos",
      explicacion: "El respaldo permite recuperar la información si algo falla."
    },
    {
      id: "m32-tareas",
      modulo: "Módulo 3.2",
      pregunta: "¿Qué herramienta de Windows permite revisar procesos y consumo del equipo?",
      opciones: ["Administrador de tareas", "PrestaShop", "Canva", "Tkinter"],
      correcta: "Administrador de tareas",
      explicacion: "El Administrador de tareas muestra procesos, memoria, CPU y disco."
    },
    {
      id: "m32-manual",
      modulo: "Módulo 3.2",
      pregunta: "¿Qué documento reúne los pasos para conservar el equipo?",
      opciones: ["Manual de mantenimiento", "Manual de usuario", "Acta de notas", "Carátula"],
      correcta: "Manual de mantenimiento",
      explicacion: "El manual de mantenimiento describe limpieza, revisiones y respaldos."
    },

    /* ---- Módulo 3.3 · Bases de Datos ---- */
    {
      id: "m33-tsql",
      modulo: "Módulo 3.3",
      pregunta: "¿Qué lenguaje de consultas se usa en SQL Server?",
      opciones: ["T-SQL", "HTML", "XAML", "CSS"],
      correcta: "T-SQL",
      explicacion: "SQL Server usa Transact-SQL (T-SQL) para crear y consultar datos."
    },
    {
      id: "m33-primaria",
      modulo: "Módulo 3.3",
      pregunta: "¿Qué llave identifica de forma única cada fila de una tabla?",
      opciones: ["Llave primaria", "Llave foránea", "Índice de texto", "Columna opcional"],
      correcta: "Llave primaria",
      explicacion: "La llave primaria no se repite y distingue cada registro."
    },
    {
      id: "m33-join",
      modulo: "Módulo 3.3",
      pregunta: "¿Qué operación combina datos de dos tablas relacionadas?",
      opciones: ["JOIN", "PRINT", "COMMIT", "DROP"],
      correcta: "JOIN",
      explicacion: "JOIN une filas de dos o más tablas usando una relación en común."
    },
    {
      id: "m33-ssms",
      modulo: "Módulo 3.3",
      pregunta: "¿Qué herramienta de Microsoft administra SQL Server?",
      opciones: ["SSMS", "Photoshop", "Tinkercad", "PrestaShop"],
      correcta: "SSMS",
      explicacion: "SQL Server Management Studio (SSMS) permite crear bases y ejecutar consultas."
    },
    {
      id: "m33-normalizacion",
      modulo: "Módulo 3.3",
      pregunta: "¿Qué proceso organiza las tablas para reducir datos repetidos?",
      opciones: ["Normalización", "Compilación", "Impresión", "Maquetación"],
      correcta: "Normalización",
      explicacion: "La normalización evita redundancia y mantiene la integridad de los datos."
    },

    /* ---- Módulo 3.4 · Documentación ---- */
    {
      id: "m34-ers",
      modulo: "Módulo 3.4",
      pregunta: "¿Qué significa ERS?",
      opciones: [
        "Especificación de Requerimientos de Software",
        "Equipo de Redes y Servidores",
        "Entrada Rápida del Sistema",
        "Evaluación de Resultados"
      ],
      correcta: "Especificación de Requerimientos de Software",
      explicacion: "La ERS describe qué debe hacer el sistema antes de programarlo."
    },
    {
      id: "m34-manual-usuario",
      modulo: "Módulo 3.4",
      pregunta: "¿Qué manual explica al usuario final cómo usar el sistema?",
      opciones: ["Manual de usuario", "Manual técnico", "Manual de mantenimiento", "Acta de reunión"],
      correcta: "Manual de usuario",
      explicacion: "El manual de usuario explica pantallas, pasos y funciones del sistema."
    },
    {
      id: "m34-casos",
      modulo: "Módulo 3.4",
      pregunta: "¿Qué diagrama UML muestra actores y acciones del sistema?",
      opciones: ["Casos de uso", "Diagrama de pastel", "Mapa mental", "Cronograma"],
      correcta: "Casos de uso",
      explicacion: "Los casos de uso muestran qué hace cada actor dentro del sistema."
    },
    {
      id: "m34-drawio",
      modulo: "Módulo 3.4",
      pregunta: "¿Qué herramienta sirve para dibujar diagramas y arquitectura?",
      opciones: ["draw.io / diagrams.net", "Tkinter", "Arduino IDE", "PrestaShop"],
      correcta: "draw.io / diagrams.net",
      explicacion: "draw.io permite crear diagramas de flujo, UML y arquitectura."
    },

    /* ---- Módulo 3.8 · Proyecto innovador ---- */
    {
      id: "m38-mvp",
      modulo: "Módulo 3.8",
      pregunta: "¿Qué significa MVP en un proyecto innovador?",
      opciones: ["Producto Mínimo Viable", "Máquina Virtual Portátil", "Manual de Ventas y Pagos", "Módulo Visual Principal"],
      correcta: "Producto Mínimo Viable",
      explicacion: "El MVP es la versión más pequeña que ya resuelve el problema principal."
    },
    {
      id: "m38-signvoice",
      modulo: "Módulo 3.8",
      pregunta: "¿Qué proyecto traduce lenguaje de señas con visión artificial?",
      opciones: ["SignVoice AI", "Golden Rose", "Conejitos Mágicos", "Focus 25"],
      correcta: "SignVoice AI",
      explicacion: "SignVoice AI reconoce señas y las convierte en texto."
    },
    {
      id: "m38-ocr",
      modulo: "Módulo 3.8",
      pregunta: "¿Qué tecnología usa Etiqueta Clara para leer etiquetas?",
      opciones: ["OCR", "Bluetooth", "GPS", "Realidad virtual"],
      correcta: "OCR",
      explicacion: "El OCR reconoce texto dentro de una imagen, como una etiqueta de producto."
    },
    {
      id: "m38-git",
      modulo: "Módulo 3.8",
      pregunta: "¿Qué herramienta se usa para controlar versiones del proyecto?",
      opciones: ["Git", "Canva", "Excel", "Tinkercad"],
      correcta: "Git",
      explicacion: "Git guarda el historial de cambios y permite trabajar en equipo."
    },

    /* ---- Módulo 4 · Empresa cooperativa ---- */
    {
      id: "m4-prestashop",
      modulo: "Módulo 4",
      pregunta: "¿Con qué plataforma se construyó la tienda Golden Rose?",
      opciones: ["PrestaShop", "Arduino IDE", "Power BI", "Figma"],
      correcta: "PrestaShop",
      explicacion: "Golden Rose es la tienda online de la cooperativa, montada en PrestaShop."
    },
    {
      id: "m4-cooperativa",
      modulo: "Módulo 4",
      pregunta: "¿Qué principio organiza una empresa cooperativa?",
      opciones: ["Cooperación y trabajo asociativo", "Competencia individual", "Trabajo sin roles", "Ventas sin registro"],
      correcta: "Cooperación y trabajo asociativo",
      explicacion: "La cooperativa se basa en la ayuda mutua, los roles y las decisiones compartidas."
    },
    {
      id: "m4-excel",
      modulo: "Módulo 4",
      pregunta: "¿Qué archivo se usó para llevar la contabilidad de Golden Rose?",
      opciones: ["Excel", "Tinkercad", "PowerPoint", "SQLite"],
      correcta: "Excel",
      explicacion: "La contabilidad se organizó en una hoja de cálculo de Excel."
    },
    {
      id: "m4-pitch",
      modulo: "Módulo 4",
      pregunta: "¿Qué es un pitch?",
      opciones: [
        "Una presentación breve para convencer sobre una idea",
        "Un tipo de base de datos",
        "Un lenguaje de programación",
        "Un componente de Arduino"
      ],
      correcta: "Una presentación breve para convencer sobre una idea",
      explicacion: "El pitch resume el problema, la solución y el valor de la empresa."
    },

    /* ---- Módulo 3 · Inglés técnico ---- */
    {
      id: "m3en-troubleshooting",
      modulo: "Módulo 3",
      pregunta: "¿Qué significa “troubleshooting” en inglés técnico?",
      opciones: ["Resolución de problemas", "Instalación de juegos", "Ventas por internet", "Diseño de logos"],
      correcta: "Resolución de problemas",
      explicacion: "Troubleshooting es el proceso de diagnosticar y resolver fallas."
    },
    {
      id: "m3en-mouse",
      modulo: "Módulo 3",
      pregunta: "¿Cómo se dice “ratón” en inglés?",
      opciones: ["Mouse", "Keyboard", "Screen", "Printer"],
      correcta: "Mouse",
      explicacion: "Mouse es ratón; keyboard es teclado y screen es pantalla."
    },
    {
      id: "m3en-roleplay",
      modulo: "Módulo 3",
      pregunta: "¿Qué actividad practica diálogos de atención al usuario?",
      opciones: ["Role-play", "Normalización", "Compilación", "Soldadura"],
      correcta: "Role-play",
      explicacion: "El role-play simula una conversación real de soporte técnico."
    },

    /* ---- Módulo 2 · Componentes móviles ---- */
    {
      id: "m2-csharp",
      modulo: "Módulo 2",
      pregunta: "¿Qué lenguaje se usa para programar una app con .NET MAUI?",
      opciones: ["C#", "PHP", "Ruby", "Kotlin"],
      correcta: "C#",
      explicacion: ".NET MAUI se programa con C# y se diseña con XAML."
    },
    {
      id: "m2-xaml",
      modulo: "Módulo 2",
      pregunta: "¿Con qué se diseña la interfaz en .NET MAUI?",
      opciones: ["XAML", "T-SQL", "Markdown", "Power BI"],
      correcta: "XAML",
      explicacion: "XAML describe la interfaz: botones, etiquetas, layouts y estilos."
    },
    {
      id: "m2-stack",
      modulo: "Módulo 2",
      pregunta: "¿Qué layout apila los controles uno debajo de otro?",
      opciones: ["StackLayout", "Grid", "AbsoluteLayout", "SQLite"],
      correcta: "StackLayout",
      explicacion: "StackLayout coloca los elementos en fila o columna."
    },
    {
      id: "m2-sqlite",
      modulo: "Módulo 2",
      pregunta: "¿Qué base de datos local se usa en las prácticas de MAUI?",
      opciones: ["SQLite", "Oracle", "MongoDB", "Access"],
      correcta: "SQLite",
      explicacion: "SQLite guarda los datos dentro del dispositivo, sin necesitar un servidor."
    },
    {
      id: "m2-mvvm",
      modulo: "Módulo 2",
      pregunta: "¿Qué patrón separa la vista de la lógica en las apps?",
      opciones: ["MVVM", "OCR", "ERS", "JOIN"],
      correcta: "MVVM",
      explicacion: "MVVM separa Modelo, Vista y ViewModel para ordenar el código."
    },
    {
      id: "m2-await",
      modulo: "Módulo 2",
      pregunta: "¿Qué palabra clave espera una tarea asíncrona en C#?",
      opciones: ["await", "print", "select", "join"],
      correcta: "await",
      explicacion: "await espera el resultado de una tarea sin bloquear la aplicación."
    },

    /* ---- BTVD 3.1 · Aplicaciones de software ---- */
    {
      id: "m31-arduino",
      modulo: "BTVD 3.1",
      pregunta: "¿Qué placa se usó en el proyecto de Arduino?",
      opciones: ["Arduino Uno", "Raspberry Pi", "ESP32", "Arduino Mega"],
      correcta: "Arduino Uno",
      explicacion: "El contador binario con LEDs se armó con Arduino Uno."
    },
    {
      id: "m31-tinkercad",
      modulo: "BTVD 3.1",
      pregunta: "¿Qué simulador se usó para probar el circuito?",
      opciones: ["Tinkercad", "PrestaShop", "Power BI", "Word"],
      correcta: "Tinkercad",
      explicacion: "Tinkercad permite armar y simular circuitos con Arduino antes del montaje físico."
    },
    {
      id: "m31-tkinter",
      modulo: "BTVD 3.1",
      pregunta: "¿Qué librería de Python sirve para interfaces de escritorio?",
      opciones: ["Tkinter", "Pandas", "Pytest", "Requests"],
      correcta: "Tkinter",
      explicacion: "Tkinter permite crear ventanas, botones y formularios en Python."
    },
    {
      id: "m31-conejitos",
      modulo: "BTVD 3.1",
      pregunta: "¿Cómo se llama el videojuego educativo de la feria?",
      opciones: ["Conejitos Mágicos", "SignVoice AI", "La Vaca", "Focus 25"],
      correcta: "Conejitos Mágicos",
      explicacion: "Conejitos Mágicos es el videojuego con cuentos, valores y mini-juegos."
    },
    {
      id: "m31-aspnet",
      modulo: "BTVD 3.1",
      pregunta: "¿Qué práctica conectó ASP.NET con SQL Server?",
      opciones: ["Práctica 6", "Práctica 2", "Práctica 10", "Práctica 4"],
      correcta: "Práctica 6",
      explicacion: "La Práctica 6 trabajó un CRUD web conectado a SQL Server."
    }
  ];

  let indice = 0;
  let puntaje = 0;
  let respondida = false;
  let terminada = false;
  let orden = [];

  const quizNum       = $("#quizNum");
  const quizTexto     = $("#quizTexto");
  const quizOpciones  = $("#quizOpciones");
  const quizFeedback  = $("#quizFeedback");
  const quizProgreso  = $("#quizProgreso");
  const quizScore     = $("#quizScore");
  const quizTotal     = $("#quizTotal");
  const quizSiguiente = $("#quizSiguiente");
  const quizPregunta  = $("#quizPregunta");
  const quizModulo    = $("#quizModulo");

  const CLAVE_QUIZ = "cine3dsb-quiz-ultimo";
  const PREGUNTAS_POR_RONDA = 5;

  function barajar(arr) {
    const copia = arr.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function leerUltimoQuiz() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE_QUIZ) || "[]");
      return Array.isArray(guardado) ? guardado : [];
    } catch {
      return [];
    }
  }

  function mismoConjunto(a, b) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return [...a].sort((x, y) => x - y).join("|") === [...b].sort((x, y) => x - y).join("|");
  }

  function elegirPreguntas() {
    const total = Math.min(PREGUNTAS_POR_RONDA, PREGUNTAS.length);
    const banco = PREGUNTAS.map((_, i) => i);
    const anterior = leerUltimoQuiz();
    let seleccion = barajar(banco).slice(0, total);
    let intentos = 0;

    // Evita que al recargar aparezca exactamente la misma ronda.
    while (mismoConjunto(seleccion, anterior) && intentos < 15) {
      seleccion = barajar(banco).slice(0, total);
      intentos += 1;
    }

    try { localStorage.setItem(CLAVE_QUIZ, JSON.stringify(seleccion)); } catch { /* modo privado */ }
    return seleccion;
  }

  function iniciarQuiz() {
    indice = 0;
    puntaje = 0;
    respondida = false;
    terminada = false;
    orden = elegirPreguntas();

    if (quizScore) quizScore.textContent = "0";
    if (quizTotal) quizTotal.textContent = String(orden.length);
    if (quizFeedback) { quizFeedback.textContent = ""; quizFeedback.className = "quiz__feedback"; }
    if (quizSiguiente) { quizSiguiente.disabled = true; quizSiguiente.textContent = "Siguiente →"; }

    pintarPregunta();
  }

  function pintarPregunta() {
    if (!quizTexto || !quizOpciones) return;

    const pregunta = PREGUNTAS[orden[indice]];
    const total = orden.length;
    respondida = false;

    quizPregunta.classList.remove("quiz__pregunta--final");
    if (quizNum) quizNum.textContent = `Pregunta ${indice + 1} de ${total}`;
    if (quizModulo) quizModulo.textContent = pregunta.modulo;
    quizTexto.textContent = pregunta.pregunta;
    quizFeedback.textContent = "";
    quizFeedback.className = "quiz__feedback";
    quizProgreso.textContent = `${indice} de ${total} respondidas`;
    quizSiguiente.disabled = true;
    quizSiguiente.textContent = indice === total - 1 ? "Ver resultado →" : "Siguiente →";

    const opciones = barajar(pregunta.opciones);
    quizOpciones.innerHTML = opciones.map((op, i) => `
      <button class="quiz__opcion" type="button" data-opcion="${op}">
        <span class="quiz__letra">${String.fromCharCode(65 + i)}</span>
        <span>${op}</span>
      </button>
    `).join("");
  }

  function responder(opcion, boton) {
    if (respondida) return;
    respondida = true;

    const pregunta = PREGUNTAS[orden[indice]];
    const esCorrecta = opcion === pregunta.correcta;

    $$(".quiz__opcion", quizOpciones).forEach((btn) => {
      btn.disabled = true;
      if (btn.dataset.opcion === pregunta.correcta) btn.classList.add("correcta");
    });

    if (!esCorrecta) boton.classList.add("incorrecta");

    if (esCorrecta) {
      puntaje += 1;
      quizScore.textContent = String(puntaje);
      quizFeedback.textContent = `✓ ${pregunta.explicacion}`;
      quizFeedback.className = "quiz__feedback ok";
    } else {
      quizFeedback.textContent = `✕ Casi. La respuesta era “${pregunta.correcta}”. ${pregunta.explicacion}`;
      quizFeedback.className = "quiz__feedback no";
    }

    quizProgreso.textContent = `${indice + 1} de ${orden.length} respondidas`;
    quizSiguiente.disabled = false;
    quizSiguiente.focus({ preventScroll: true });
  }

  function siguientePregunta() {
    if (!respondida) return;

    if (indice < orden.length - 1) {
      indice += 1;
      pintarPregunta();
      return;
    }

    terminarQuiz();
  }

  function terminarQuiz() {
    terminada = true;
    quizPregunta.classList.add("quiz__pregunta--final");
    quizNum.textContent = "Función terminada";
    if (quizModulo) quizModulo.textContent = "CINE 3DS-B";
    quizTexto.textContent = `¡Cortina! Acertaste ${puntaje} de ${orden.length}.`;
    quizOpciones.innerHTML = "";
    quizProgreso.textContent = `${orden.length} de ${orden.length} respondidas`;
    quizSiguiente.disabled = true;
    quizSiguiente.textContent = "Fin de la función";

    const aprobado = Math.ceil(orden.length * 0.6);
    let mensaje;
    if (puntaje === orden.length) mensaje = "🏆 Nivel director de cine. Te sabes todo el guion.";
    else if (puntaje >= aprobado) mensaje = "🎬 Buena función. Te faltó repasar un par de escenas.";
    else mensaje = "🍿 Toca volver a la cartelera y ver la película otra vez.";

    quizFeedback.textContent = mensaje;
    quizFeedback.className = puntaje >= aprobado ? "quiz__feedback ok" : "quiz__feedback no";
  }

  /* ---------- Contadores del hero ---------- */
  function animarContadores() {
    $$("[data-contador]").forEach((el) => {
      const destino = Number(el.dataset.contador) || 0;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = String(destino);
        return;
      }
      const inicio = performance.now();
      const duracion = 1100;
      function paso(ahora) {
        const t = Math.min((ahora - inicio) / duracion, 1);
        const suave = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(destino * suave));
        if (t < 1) requestAnimationFrame(paso);
      }
      requestAnimationFrame(paso);
    });
  }

  /* ---------- Tema ---------- */
  function aplicarTema(claro) {
    document.body.classList.toggle("claro", claro);
    const icono = $("#temaIcono");
    if (icono) icono.textContent = claro ? "☀" : "☾";
    const btn = $("#btnTema");
    if (btn) btn.setAttribute("aria-label", claro ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
  }

  function iniciarTema() {
    let guardado = null;
    try { guardado = localStorage.getItem(CLAVE_TEMA); } catch { /* nada */ }
    const prefiereClaro = window.matchMedia("(prefers-color-scheme: light)").matches;
    aplicarTema(guardado ? guardado === "claro" : prefiereClaro);
  }

  /* ---------- Reveal ---------- */
  function iniciarReveal() {
    const elementos = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    elementos.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 60, 240)}ms`;
      obs.observe(el);
    });
  }

  /* ---------- Eventos ---------- */
  function conectarEventos() {
    // Buscador
    const buscador = $("#buscador");
    if (buscador) {
      buscador.addEventListener("input", (e) => {
        busqueda = e.target.value;
        renderCartelera();
      });
    }

    const limpiar = $("#limpiarBusqueda");
    if (limpiar) {
      limpiar.addEventListener("click", () => {
        busqueda = "";
        if (buscador) { buscador.value = ""; buscador.focus(); }
        renderCartelera();
      });
    }

    // Filtros
    $$(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$(".chip").forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        filtroActivo = chip.dataset.filtro;
        renderCartelera();
      });
    });

    // Cartelera: abrir ficha
    gridCartelera.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-modulo]");
      if (btn) abrirModulo(btn.dataset.modulo);
    });

    // Producciones: abrir proyecto o ampliar imagen
    if (gridProducciones) {
      gridProducciones.addEventListener("click", (e) => {
        const zoom = e.target.closest("[data-zoom]");
        if (zoom) {
          const p = PROYECTOS.find((x) => x.id === zoom.dataset.zoom);
          abrirImagen(zoom.dataset.zoom, p ? p.titulo : "");
          return;
        }
        const btn = e.target.closest("[data-proyecto]");
        if (btn) abrirProyecto(btn.dataset.proyecto);
      });
    }

    // Ficha: marcar como vista
    fichaContenido.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-visto]");
      if (!btn) return;
      const activo = alternarVisto(btn.dataset.visto);
      btn.classList.toggle("is-on", activo);
      btn.setAttribute("aria-pressed", String(activo));
      const texto = btn.querySelector("[data-texto-visto]");
      if (texto) texto.textContent = activo ? "Módulo visto" : "Marcar como visto";
    });

    // Botones de cierre
    $$("[data-cerrar]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dlg = document.getElementById(btn.dataset.cerrar);
        cerrarDialogo(dlg);
      });
    });

    // Clic en el fondo del diálogo
    [dlgModulo, dlgProyecto, lightbox].forEach((dlg) => {
      if (!dlg) return;
      dlg.addEventListener("click", (e) => {
        if (e.target === dlg) cerrarDialogo(dlg);
      });
      dlg.addEventListener("close", () => { document.body.style.overflow = ""; });
    });

    // Quiz
    if (quizOpciones) {
      quizOpciones.addEventListener("click", (e) => {
        const btn = e.target.closest(".quiz__opcion");
        if (btn) responder(btn.dataset.opcion, btn);
      });
    }
    if (quizSiguiente) quizSiguiente.addEventListener("click", siguientePregunta);

    const reiniciar = $("#quizReiniciar");
    if (reiniciar) reiniciar.addEventListener("click", iniciarQuiz);

    // Tema
    const btnTema = $("#btnTema");
    if (btnTema) {
      btnTema.addEventListener("click", () => {
        const claro = !document.body.classList.contains("claro");
        aplicarTema(claro);
        try { localStorage.setItem(CLAVE_TEMA, claro ? "claro" : "oscuro"); } catch { /* nada */ }
      });
    }

    // Menú móvil
    const btnMenu = $("#btnMenu");
    const navLinks = $("#navLinks");
    if (btnMenu && navLinks) {
      btnMenu.addEventListener("click", () => {
        const abierto = navLinks.classList.toggle("is-open");
        btnMenu.setAttribute("aria-expanded", String(abierto));
      });
      navLinks.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
          navLinks.classList.remove("is-open");
          btnMenu.setAttribute("aria-expanded", "false");
        }
      });
      document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !btnMenu.contains(e.target)) {
          navLinks.classList.remove("is-open");
          btnMenu.setAttribute("aria-expanded", "false");
        }
      });
    }

    // Cerrar con Escape en navegadores sin cierre nativo
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        [dlgModulo, dlgProyecto, lightbox].forEach((dlg) => {
          if (dlg && dlg.open) cerrarDialogo(dlg);
        });
      }
    });
  }

  /* ---------- Arranque ---------- */
  function iniciar() {
    if (!Array.isArray(MODULOS)) {
      console.error("No se cargaron los módulos.");
      return;
    }

    iniciarTema();
    renderCartelera();
    renderProducciones();
    actualizarProgreso();
    iniciarReveal();
    conectarEventos();
    iniciarQuiz();
    animarContadores();

    console.info(
      `%c🎬 CINE 3DS-B %c${MODULOS.length} funciones · ${PROYECTOS.length} producciones`,
      "background:#8b5cf6;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:700",
      "background:#38bdf8;color:#041022;padding:4px 8px;border-radius:0 4px 4px 0;font-weight:700"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
