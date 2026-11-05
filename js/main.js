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
      <article class="peli${visto ? " is-visto" : ""}" data-id="${m.id}" style="animation-delay:${Math.min(i * 55, 420)}ms">
        <div class="peli__arte" style="--c1:${m.c1};--c2:${m.c2}" aria-hidden="true">
          <div class="peli__perf peli__perf--top"></div>
          <div class="peli__perf peli__perf--bot"></div>
          <span class="peli__num">${m.codigo}</span>
          <span class="peli__genero">${m.genero}</span>
          <span class="peli__icono">${ICONOS[m.id] || "🎬"}</span>
          <span class="peli__franja">CINE 3DS-B · ESTRENO 2026</span>
          <span class="peli__visto">✓ Visto</span>
        </div>

        <div class="peli__cuerpo">
          <p class="peli__codigo">MÓDULO ${m.codigo} · ${m.docente.toUpperCase()}</p>
          <h3 class="peli__nombre">${m.corto}</h3>
          <p class="peli__oficial">${m.nombre}</p>
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
        <p class="ficha__funcion">Módulo ${m.codigo} · ${m.docente} · ${m.genero}</p>
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
    {
      pregunta: "¿Qué lenguaje se usa para programar una app con .NET MAUI?",
      opciones: ["C#", "PHP", "Ruby", "Kotlin"],
      correcta: "C#",
      explicacion: "Correcto: .NET MAUI se programa con C# y se diseña con XAML."
    },
    {
      pregunta: "¿Qué herramienta se usa para administrar SQL Server?",
      opciones: ["SSMS", "Photoshop", "Tinkercad", "PrestaShop"],
      correcta: "SSMS",
      explicacion: "SQL Server Management Studio (SSMS) es el entorno para crear bases y ejecutar consultas."
    },
    {
      pregunta: "¿Qué documento describe los requerimientos de un sistema?",
      opciones: ["ERS", "CV", "Factura", "Nómina"],
      correcta: "ERS",
      explicacion: "La Especificación de Requerimientos de Software (ERS) es la base de la documentación."
    },
    {
      pregunta: "¿Con qué plataforma se construyó la tienda Golden Rose?",
      opciones: ["PrestaShop", "Arduino IDE", "Power BI", "Figma"],
      correcta: "PrestaShop",
      explicacion: "Golden Rose es la tienda online de la cooperativa, montada en PrestaShop."
    },
    {
      pregunta: "¿Qué placa se usó en el proyecto de Arduino?",
      opciones: ["Arduino Uno", "Raspberry Pi", "ESP32", "Arduino Mega"],
      correcta: "Arduino Uno",
      explicacion: "El contador binario con LEDs se armó con Arduino Uno y se simuló en Tinkercad."
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

  function barajar(arr) {
    const copia = arr.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function iniciarQuiz() {
    indice = 0;
    puntaje = 0;
    respondida = false;
    terminada = false;
    orden = barajar(PREGUNTAS.map((_, i) => i));

    if (quizScore) quizScore.textContent = "0";
    if (quizTotal) quizTotal.textContent = String(PREGUNTAS.length);
    if (quizFeedback) { quizFeedback.textContent = ""; quizFeedback.className = "quiz__feedback"; }
    if (quizSiguiente) { quizSiguiente.disabled = true; quizSiguiente.textContent = "Siguiente →"; }

    pintarPregunta();
  }

  function pintarPregunta() {
    if (!quizTexto || !quizOpciones) return;

    const pregunta = PREGUNTAS[orden[indice]];
    respondida = false;

    quizPregunta.classList.remove("quiz__pregunta--final");
    if (quizNum) quizNum.textContent = `Pregunta ${indice + 1} de ${PREGUNTAS.length}`;
    quizTexto.textContent = pregunta.pregunta;
    quizFeedback.textContent = "";
    quizFeedback.className = "quiz__feedback";
    quizProgreso.textContent = `${indice} de ${PREGUNTAS.length} respondidas`;
    quizSiguiente.disabled = true;
    quizSiguiente.textContent = indice === PREGUNTAS.length - 1 ? "Ver resultado →" : "Siguiente →";

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

    quizProgreso.textContent = `${indice + 1} de ${PREGUNTAS.length} respondidas`;
    quizSiguiente.disabled = false;
    quizSiguiente.focus({ preventScroll: true });
  }

  function siguientePregunta() {
    if (!respondida) return;

    if (indice < PREGUNTAS.length - 1) {
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
    quizTexto.textContent = `¡Cortina! Acertaste ${puntaje} de ${PREGUNTAS.length}.`;
    quizOpciones.innerHTML = "";
    quizProgreso.textContent = `${PREGUNTAS.length} de ${PREGUNTAS.length} respondidas`;
    quizSiguiente.disabled = true;
    quizSiguiente.textContent = "Fin de la función";

    let mensaje;
    if (puntaje === PREGUNTAS.length) mensaje = "🏆 Nivel director de cine. Te sabes todo el guion.";
    else if (puntaje >= 3) mensaje = "🎬 Buena función. Te faltó repasar un par de escenas.";
    else mensaje = "🍿 Toca volver a la cartelera y ver la película otra vez.";

    quizFeedback.textContent = mensaje;
    quizFeedback.className = puntaje >= 3 ? "quiz__feedback ok" : "quiz__feedback no";
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
