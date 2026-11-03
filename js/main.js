
const contenedor = document.getElementById("contenedor-modulos");
const buscador = document.getElementById("buscador");
const totalModulos = document.getElementById("total-modulos");
const botonTema = document.getElementById("tema");

function mostrarModulos(texto = "") {

    contenedor.innerHTML = "";

    const filtrados = modulos.filter(modulo =>
        modulo.nombre.toLowerCase().includes(texto.toLowerCase())
    );

    totalModulos.textContent = modulos.length.toString().padStart(2, "0");

    filtrados.forEach((modulo, index) => {

        const tarjeta = document.createElement("article");

        tarjeta.className = "tarjeta-modulo";

        tarjeta.innerHTML = `
            <div class="modulo-icono">⌘</div>

            <h3>${modulo.nombre}</h3>

            <p>${modulo.resumen || "Espacio reservado para la descripción del módulo."}</p>

            <span class="modulo-tag">
                MÓDULO ${String(index + 1).padStart(2, "0")}
            </span>
        `;

        contenedor.appendChild(tarjeta);
    });

    if (filtrados.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron módulos.</p>";
    }
}

buscador.addEventListener("input", () => {
    mostrarModulos(buscador.value);
});

botonTema.addEventListener("click", () => {
    document.body.classList.toggle("light");

    botonTema.textContent =
        document.body.classList.contains("light") ? "☀" : "☾";
});

mostrarModulos();
