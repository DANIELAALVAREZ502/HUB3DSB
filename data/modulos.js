/* ============================================================
   CINE 3DS-B · Cartelera de módulos
   Contenido basado en los módulos, proyectos y evidencias
   del tercer año de Desarrollo de Software "B" (INDEL 2026).
   ============================================================ */

const MODULOS = [
  {
    id: "m30",
    funcion: "01",
    codigo: "3.0",
    nombre: "Orientación de estudiantes al proceso educativo del tercer año",
    corto: "Orientación",
    genero: "Documental",
    tagline: "El prólogo de un año épico.",
    docente: "Javier Mineros",
    docenteKey: "javier",
    plataforma: "3.° BTV en Desarrollo de Software “B”",
    c1: "#38bdf8",
    c2: "#6366f1",
    resumen: "Un espacio para ubicarte en el último año: conocer el perfil de la especialidad, ordenar tus metas y encontrar un ritmo de estudio que funcione.",
    aprendido: [
      "Reconocer el perfil de salida de Desarrollo de Software y las áreas que se trabajan en tercer año.",
      "Organizar metas personales y académicas con un plan realista.",
      "Usar el portafolio y Classroom para dar seguimiento a las entregas.",
      "Aplicar hábitos de estudio, organización del tiempo y trabajo en equipo."
    ],
    programas: ["Google Classroom", "Google Docs", "Canva", "Google Forms"],
    herramientas: ["Portafolio digital", "Planificación", "Proyecto de vida", "Hábitos de estudio"],
    proyectos: [
      { nombre: "Actividades de orientación", detalle: "Presentaciones, diagnósticos y reflexiones subidas a Classroom." }
    ],
    recursos: [
      { nombre: "Centro de ayuda de Classroom", url: "https://support.google.com/edu/classroom/?hl=es" },
      { nombre: "Canva Design School", url: "https://www.canva.com/design-school/" }
    ],
    evidencia: "Actividades y presentaciones de orientación en Classroom.",
    dato: "Tener claro el rumbo hace que cada entrega tenga sentido."
  },
  {
    id: "m32",
    funcion: "02",
    codigo: "3.2",
    nombre: "Mantenimiento y aseguramiento de la operación del sistema informático",
    corto: "Mantenimiento",
    genero: "Acción",
    tagline: "Mantener el sistema vivo, cueste lo que cueste.",
    docente: "Javier Mineros",
    docenteKey: "javier",
    plataforma: "3.° BTV en Desarrollo de Software “B”",
    c1: "#22d3ee",
    c2: "#2563eb",
    resumen: "Cómo mantener un equipo funcionando, seguro y respaldado: diagnóstico, limpieza, actualizaciones, copias de seguridad y documentación de incidentes.",
    aprendido: [
      "Diferenciar mantenimiento preventivo y correctivo.",
      "Revisar hardware, software, actualizaciones y espacio de almacenamiento.",
      "Crear respaldos y aplicar medidas básicas de seguridad.",
      "Documentar fallas, soluciones y recomendaciones en un manual."
    ],
    programas: ["Windows 10/11", "Windows Defender", "Administrador de tareas", "Utilitarios de respaldo"],
    herramientas: ["Mantenimiento preventivo", "Mantenimiento correctivo", "Respaldos", "PowerShell / CMD", "Documentación técnica"],
    proyectos: [
      { nombre: "Manual de mantenimiento", detalle: "Procedimientos para conservar el equipo y prevenir fallas." },
      { nombre: "Manual de instalación", detalle: "Pasos para instalar y dejar listo el sistema." }
    ],
    recursos: [
      { nombre: "Soporte de Windows", url: "https://support.microsoft.com/es-es/windows" },
      { nombre: "Microsoft Learn · Windows", url: "https://learn.microsoft.com/es-es/windows/" }
    ],
    evidencia: "MANUAL DE MANTENIMIENTO.pdf y MANUAL DE INSTALACION.pdf.",
    dato: "Un respaldo a tiempo vale más que una reparación de emergencia."
  },
  {
    id: "m33",
    funcion: "03",
    codigo: "3.3",
    nombre: "Administración de Bases de Datos",
    corto: "Bases de Datos",
    genero: "Misterio",
    tagline: "Todo dato esconde una historia.",
    docente: "Javier Mineros",
    docenteKey: "javier",
    plataforma: "3.° BTV en Desarrollo de Software “B”",
    c1: "#a855f7",
    c2: "#6366f1",
    resumen: "Diseñar, crear y administrar bases de datos relacionales: del modelo entidad-relación a las consultas, los usuarios y los respaldos.",
    aprendido: [
      "Modelar datos con tablas, llaves primarias y foráneas.",
      "Crear y modificar estructuras con SQL.",
      "Consultar, insertar, actualizar y eliminar datos.",
      "Aplicar normalización, permisos y respaldos."
    ],
    programas: ["SQL Server 2025", "SQL Server Management Studio", "MySQL / phpMyAdmin", "Power BI"],
    herramientas: ["T-SQL", "Modelo relacional", "Normalización", "JOIN", "Usuarios y permisos", "Respaldo y restauración"],
    proyectos: [
      { nombre: "Taller de servicio vehicular", detalle: "Base de datos para gestionar clientes, vehículos y servicios." },
      { nombre: "Base de datos de cafetería", detalle: "Modelo y consultas para productos, ventas y control." },
      { nombre: "Dashboard de medallistas", detalle: "Visualización de datos deportivos en Power BI." }
    ],
    recursos: [
      { nombre: "Documentación de SQL Server", url: "https://learn.microsoft.com/es-es/sql/sql-server/" },
      { nombre: "Documentación de MySQL", url: "https://dev.mysql.com/doc/" },
      { nombre: "W3Schools SQL", url: "https://www.w3schools.com/sql/" }
    ],
    evidencia: "TallerServicioVehicular.sql, BDCAFETERIA.sql, CAFETERIAPROYECTO.sql y MYSQLPROYECTO.sql.",
    dato: "Una base de datos ordenada cuenta una historia; una desordenada solo guarda ruido."
  },
  {
    id: "m34",
    funcion: "04",
    codigo: "3.4",
    nombre: "Elaboración de documentación de Sistemas informáticos",
    corto: "Documentación",
    genero: "Drama",
    tagline: "Sin guion, no hay película.",
    docente: "Javier Mineros",
    docenteKey: "javier",
    plataforma: "3.° BTV en Desarrollo de Software “B”",
    c1: "#818cf8",
    c2: "#7c3aed",
    resumen: "Documentar un sistema como se hace en la industria: requerimientos, arquitectura, manuales, pruebas y evidencias de que funciona.",
    aprendido: [
      "Levantar y redactar requerimientos funcionales y no funcionales.",
      "Modelar casos de uso y arquitectura del sistema.",
      "Escribir manuales técnicos, de usuario y de instalación.",
      "Registrar pruebas, errores y soluciones."
    ],
    programas: ["Microsoft Word", "PDF", "draw.io / diagrams.net", "Visual Studio Code", "Git / GitHub"],
    herramientas: ["ERS", "UML", "Casos de uso", "Manual técnico", "Manual de usuario", "Markdown", "Pruebas"],
    proyectos: [
      { nombre: "Sistema Mecánica", detalle: "ERS, arquitectura y manuales de un sistema de gestión." },
      { nombre: "Editor de texto en C#", detalle: "Aplicación de escritorio con interfaz y funciones de edición." }
    ],
    recursos: [
      { nombre: "draw.io", url: "https://www.drawio.com/" },
      { nombre: "Guía de Markdown", url: "https://www.markdownguide.org/" },
      { nombre: "Microsoft Learn", url: "https://learn.microsoft.com/es-es/" }
    ],
    evidencia: "ERS_SistemaMecanica, MANUAL TECNICO Y ARQUITECTURA, MANUAL DE USUARIO y Manual Prueba y Error.",
    dato: "Sin documentación, el software no se puede mantener ni defender."
  },
  {
    id: "m38",
    funcion: "05",
    codigo: "3.8",
    nombre: "Proyecto innovador de Desarrollo de Software",
    corto: "Proyecto innovador",
    genero: "Ciencia ficción",
    tagline: "La idea que se convirtió en realidad.",
    docente: "Javier Mineros",
    docenteKey: "javier",
    plataforma: "3.° BTV en Desarrollo de Software “B”",
    c1: "#f472b6",
    c2: "#a855f7",
    resumen: "El módulo donde todo se junta: idea, investigación, arquitectura, desarrollo, pruebas y presentación de un producto que resuelve un problema real.",
    aprendido: [
      "Convertir una idea en un proyecto con alcance y objetivos claros.",
      "Dividir el trabajo en etapas y usar Git para integrar avances.",
      "Construir un MVP funcional y probarlo con usuarios.",
      "Presentar y defender el proyecto en la feria."
    ],
    programas: ["Visual Studio Code", "Visual Studio 2022", "Git / GitHub", "SQL Server", "Figma / Excalidraw", "Power BI"],
    herramientas: ["Ideación", "Factibilidad", "Arquitectura", "MVP", "Pruebas", "Trabajo en equipo", "Presentación"],
    proyectos: [
      { nombre: "SignVoice AI", detalle: "Traductor de lenguaje de señas con visión artificial." },
      { nombre: "Etiqueta Clara", detalle: "App en Python que lee etiquetas de productos con OCR." },
      { nombre: "HUB 3DS-B", detalle: "Este portal: la película de todo el año." },
      { nombre: "Palabra del Día", detalle: "Juego web construido con TypeScript y Vite." }
    ],
    recursos: [
      { nombre: "GitHub Docs", url: "https://docs.github.com/es" },
      { nombre: "Figma Learn", url: "https://help.figma.com/" },
      { nombre: "MDN Web Docs", url: "https://developer.mozilla.org/es/" }
    ],
    evidencia: "SignVoice AI, PROYECTOETIQUETACLARA, HUB3DSB y PROYECTOREMEDIAL.",
    dato: "Un proyecto innovador no es el más grande: es el que resuelve mejor un problema."
  },
  {
    id: "m4",
    funcion: "06",
    codigo: "4",
    nombre: "Puesta en marcha de la empresa en asociatividad cooperativa",
    corto: "Empresa cooperativa",
    genero: "Comedia",
    tagline: "Todos para uno y uno para todos.",
    docente: "Arcides Canales",
    docenteKey: "arcides",
    plataforma: "3DS-B-2026 “B”",
    c1: "#fbbf24",
    c2: "#f472b6",
    resumen: "Del modelo de negocio a la tienda online: cómo se organiza una cooperativa, cómo se calculan costos y cómo se presenta una idea al mercado.",
    aprendido: [
      "Comprender los principios del cooperativismo y el trabajo asociativo.",
      "Diseñar un modelo de negocio y un plan de empresa.",
      "Calcular costos, precios y presupuesto básico.",
      "Crear y administrar una tienda online con PrestaShop."
    ],
    programas: ["PrestaShop", "Excel / Google Sheets", "Word / Google Docs", "Canva"],
    herramientas: ["Modelo de negocio", "Plan de empresa", "Costos", "Presupuesto", "Roles", "Pitch", "Comercio electrónico"],
    proyectos: [
      { nombre: "Golden Rose", detalle: "Tienda online de la cooperativa con catálogo y carrito." },
      { nombre: "Contabilidad Golden Rose", detalle: "Control de costos, productos y ventas." },
      { nombre: "Documento de PrestaShop", detalle: "Configuración, módulos y puesta en marcha." }
    ],
    recursos: [
      { nombre: "Documentación de PrestaShop", url: "https://docs.prestashop-project.org/" },
      { nombre: "Capacitación de Excel", url: "https://support.microsoft.com/es-es/excel" },
      { nombre: "Canva", url: "https://www.canva.com/" }
    ],
    evidencia: "foto de mi pagina.jpg, CONTABILIDADGOLDENROSE.xlsx y DOCUMENTO DE PRESTASHOP.",
    dato: "Una cooperativa se construye con confianza, roles claros y cuentas transparentes."
  },
  {
    id: "m3en",
    funcion: "07",
    codigo: "3",
    nombre: "Conversación de inglés sobre mantenimiento de sistemas informáticos",
    corto: "Inglés técnico",
    genero: "Musical",
    tagline: "Hablar inglés también es un arte.",
    docente: "Arcides Canales",
    docenteKey: "arcides",
    plataforma: "3DS-B-2026 “B”",
    c1: "#38bdf8",
    c2: "#8b5cf6",
    resumen: "Comunicar en inglés lo que haces: describir equipos, explicar fallas, dar instrucciones y atender a un usuario en un contexto técnico.",
    aprendido: [
      "Usar vocabulario de hardware, software y soporte.",
      "Dar y seguir instrucciones técnicas en inglés.",
      "Describir problemas y soluciones con frases claras.",
      "Practicar conversaciones de atención al usuario."
    ],
    programas: ["Google Classroom", "Google Meet", "Navegador web", "Glosario digital"],
    herramientas: ["Technical vocabulary", "Role-play", "Reading", "Listening", "Troubleshooting", "Customer service"],
    proyectos: [
      { nombre: "Glosario técnico", detalle: "Palabras clave de hardware, software y soporte." },
      { nombre: "Diálogos de soporte", detalle: "Conversaciones para resolver fallas paso a paso." },
      { nombre: "Presentación oral", detalle: "Explicar un sistema o procedimiento en inglés." }
    ],
    recursos: [
      { nombre: "Cambridge Dictionary", url: "https://dictionary.cambridge.org/es/" },
      { nombre: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish/" },
      { nombre: "Microsoft Learn en inglés", url: "https://learn.microsoft.com/en-us/" }
    ],
    evidencia: "Actividades, glosario y tareas de Classroom.",
    dato: "If you can explain it in English, you can work anywhere."
  },
  {
    id: "m2",
    funcion: "08",
    codigo: "2",
    nombre: "Desarrollo de componentes para dispositivos móviles",
    corto: "Apps móviles",
    genero: "Tecnología",
    tagline: "Pequeñas pantallas, grandes ideas.",
    docente: "Arcides Canales",
    docenteKey: "arcides",
    plataforma: "3DS-B-2026 “B”",
    c1: "#a855f7",
    c2: "#22d3ee",
    resumen: "Crear aplicaciones multiplataforma con .NET MAUI: pantallas, layouts, controles, navegación, datos y emuladores.",
    aprendido: [
      "Diseñar interfaces con XAML y layouts Stack, Grid, Flex y Absolute.",
      "Usar controles, data binding y MVVM.",
      "Navegar entre páginas y pasar datos.",
      "Guardar información con SQLite y operaciones asíncronas."
    ],
    programas: ["Visual Studio 2022", ".NET MAUI", "Android Emulator", "SQLite", "Git"],
    herramientas: ["C#", "XAML", "Layouts", "Controles", "MVVM", "Data Binding", "CRUD", "Async/Await"],
    proyectos: [
      { nombre: "Práctica 7 y 7.2", detalle: "Navegación entre páginas y ejercicios de interfaz." },
      { nombre: "Práctica 8", detalle: "Layouts, controles y calculadora." },
      { nombre: "Práctica 9", detalle: "Controles, MatchGame y mini apps." },
      { nombre: "Práctica 10", detalle: "Juegos y proyectos de feria." },
      { nombre: "Práctica 11", detalle: "DataBinding, CRUD SQLite y Async." },
      { nombre: "Autoevaluación 9", detalle: "Suma, edades, conversor y quiz." }
    ],
    recursos: [
      { nombre: ".NET MAUI Docs", url: "https://learn.microsoft.com/es-es/dotnet/maui/" },
      { nombre: "Microsoft Learn · MAUI", url: "https://learn.microsoft.com/es-es/training/paths/build-apps-with-dotnet-maui/" },
      { nombre: "SQLite Docs", url: "https://www.sqlite.org/docs.html" }
    ],
    evidencia: "PRACTICA7, PRACTICA8, PRACTICA9, PRACTICA 10, PRACTICA11 y AUTOEVALUACION PRACT9.",
    dato: "Una buena app se siente bien en cualquier pantalla."
  },
  {
    id: "m31",
    funcion: "09",
    codigo: "3.1",
    nombre: "Desarrollo de aplicaciones de software para la solución de problemas",
    corto: "Apps y soluciones",
    genero: "Aventura",
    tagline: "De un problema a una app.",
    docente: "Arcides Canales",
    docenteKey: "arcides",
    plataforma: "3DS-B-2026 “B”",
    c1: "#22d3ee",
    c2: "#8b5cf6",
    resumen: "Resolver problemas con software: aplicaciones web, videojuegos, hardware y scripts que salen del aula y se prueban con usuarios.",
    aprendido: [
      "Descomponer un problema y diseñar una solución.",
      "Programar con Python, C# y lógica de videojuegos.",
      "Integrar hardware con Arduino y simuladores.",
      "Publicar y documentar una aplicación."
    ],
    programas: ["Python", "Visual Studio Code", "Arduino IDE", "Tinkercad", "PrestaShop", "Git"],
    herramientas: ["Lógica", "Funciones", "POO", "Archivos", "Tkinter", "Videojuegos", "Arduino", "Pruebas"],
    proyectos: [
      { nombre: "Conejitos Mágicos", detalle: "Videojuego educativo con cuentos, valores y mini-juegos." },
      { nombre: "Juego espacial", detalle: "Práctica de videojuego con .NET MAUI." },
      { nombre: "Aprendo Jugando", detalle: "App educativa con actividades interactivas." },
      { nombre: "Proyecto Arduino", detalle: "Contador binario con LEDs en Tinkercad." },
      { nombre: "Práctica 6 ASP.NET", detalle: "CRUD web conectado a SQL Server." }
    ],
    recursos: [
      { nombre: "Documentación de Python", url: "https://docs.python.org/es/3/" },
      { nombre: "Documentación de Arduino", url: "https://docs.arduino.cc/" },
      { nombre: "Tinkercad", url: "https://www.tinkercad.com/" }
    ],
    evidencia: "FERIAJUEGO, juegoespacialpract8, AprendoJugandoPRACT9, proyectoarduino y PRACTICA6.",
    dato: "Todo gran sistema empezó con un problema pequeño."
  }
];
