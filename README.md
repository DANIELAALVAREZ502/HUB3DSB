# 🎬 CINE 3DS-B

**La película de mi año en código** · Portal de los 9 módulos del tercer año de
Desarrollo de Software “B”, presentado como una cartelera de cine.

- **Autora:** Daniela Álvarez
- **Correo:** 6439050@clases.edu.sv
- **Institución:** INDEL · 3.° BTV Desarrollo de Software “B” · 2026
- **Sitio en vivo:** https://danielaalvarez502.github.io/HUB3DSB/
- **Repositorio:** https://github.com/DANIELAALVAREZ502/HUB3DSB

---

## ✨ Qué incluye

- **Cartelera de 9 funciones**: los 5 módulos del Prof. Javier Mineros y los 4 del
  Prof. Arcides Canales, con género cinematográfico, tagline y póster generado con CSS.
- **Ficha completa por módulo**: resumen, lo aprendido, programas, herramientas,
  proyectos, recursos, evidencia real y dato clave.
- **Buscador y filtros** por docente, en tiempo real y sin acentos.
- **Progreso guardado**: botón “Función vista” y contador de entradas coleccionadas
  en `localStorage`.
- **8 producciones destacadas**: SignVoice AI, Etiqueta Clara, Golden Rose,
  Conejitos Mágicos, Dashboard Power BI, Laboratorio Arduino, CRUD .NET MAUI y
  Laboratorio Python.
- **Capturas reales** de los proyectos, con visor ampliado (lightbox).
- **Línea de tiempo del rodaje** y **trivia de 5 preguntas** con puntaje.
- **Modo oscuro / claro**, menú móvil y animaciones con `IntersectionObserver`.
- Diseño responsive, sin frameworks y sin dependencias de JavaScript.

---

## 🎞 Los 9 módulos

| # | Módulo | Docente | Proyectos / evidencias |
|---|---|---|---|
| 01 | 3.0 · Orientación de estudiantes | Javier Mineros | Actividades y portafolio de Classroom |
| 02 | 3.2 · Mantenimiento y aseguramiento | Javier Mineros | Manual de mantenimiento e instalación |
| 03 | 3.3 · Administración de Bases de Datos | Javier Mineros | SQL de cafetería y taller vehicular, dashboard Power BI |
| 04 | 3.4 · Documentación de Sistemas | Javier Mineros | ERS, manual técnico, manual de usuario y pruebas |
| 05 | 3.8 · Proyecto innovador | Javier Mineros | SignVoice AI, Etiqueta Clara, HUB 3DS-B, Palabra del Día |
| 06 | 4 · Empresa cooperativa | Arcides Canales | Golden Rose en PrestaShop y contabilidad |
| 07 | 3 · Inglés técnico | Arcides Canales | Glosario, diálogos de soporte y presentación oral |
| 08 | 2 · Componentes para móviles | Arcides Canales | Prácticas 7 a 11 en .NET MAUI, SQLite y CRUD |
| 09 | BTVD 3.1 · Aplicaciones de software | Arcides Canales | Conejitos Mágicos, Arduino, juego espacial, ASP.NET |

---

## 🛠 Tecnologías del sitio

`HTML5` · `CSS3` (grid, gradientes, `color-mix`, animaciones) · `JavaScript`
(`dialog`, `IntersectionObserver`, `localStorage`, `matchMedia`) · Google Fonts
(Bebas Neue, DM Sans, Space Mono).

Sin frameworks, sin build step, sin dependencias.

---

## 📁 Estructura

```text
HUB3DSB/
├── index.html          # Página única
├── css/
│   └── style.css       # Tema cine, responsive y modo claro
├── js/
│   └── main.js         # Render, filtros, fichas, progreso y trivia
├── data/
│   ├── modulos.js      # Contenido de los 9 módulos
│   └── proyectos.js    # 8 producciones destacadas
├── img/
│   ├── goldenrose.jpg
│   ├── powerbi.jpg
│   ├── arduino.jpg
│   ├── python-tkinter.jpg
│   └── favicon.svg
└── README.md
```

---

## 🚀 Ver en local

Abre `index.html` en el navegador, o levanta un servidor sencillo:

```bash
python -m http.server 5500
```

Luego visita `http://localhost:5500`.

---

## 🎟 Créditos

Contenido académico y evidencias: **Daniela Álvarez**.
Guion del año: **Prof. Javier Mineros** y **Prof. Arcides Canales**.
Diseño y desarrollo del portal: **Daniela Álvarez**, con apoyo de OpenCode.

> “Del aula a la pantalla grande.”
