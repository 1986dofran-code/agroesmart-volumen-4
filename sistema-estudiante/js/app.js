const formRegistro = document.querySelector("#formRegistro");
const tablaRegistros = document.querySelector("#tablaRegistros");
const mensaje = document.querySelector("#mensaje");
const reporteTexto = document.querySelector("#reporteTexto");
const diagnosticoLista = document.querySelector("#diagnosticoLista");

let registros = [];

formRegistro.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const fecha = document.querySelector("#fecha").value;
  const leche = Number(document.querySelector("#leche").value);
  const maiz = Number(document.querySelector("#maiz").value);
  const animales = Number(document.querySelector("#animales").value);
  const nota = document.querySelector("#nota").value;

  if (!fecha || leche < 0 || maiz < 0 || animales <= 0) {
    mensaje.textContent = "Revisa los datos: falta informacion o hay valores invalidos.";
    return;
  }

  registros.push({ fecha, leche, maiz, animales, nota });
  mensaje.textContent = "Registro agregado correctamente.";
  formRegistro.reset();
  renderizar();
});

document.querySelector("#btnDemo").addEventListener("click", function () {
  registros = [
    { fecha: "2026-05-01", leche: 18, maiz: 42, animales: 6, nota: "Dia normal" },
    { fecha: "2026-05-02", leche: 4, maiz: 25, animales: 6, nota: "Baja produccion" },
    { fecha: "2026-05-03", leche: 21, maiz: 48, animales: 7, nota: "Mejoro el pasto" }
  ];
  renderizar();
  agregarDiagnostico("Se cargaron datos de demostracion.");
});

document.querySelector("#btnLimpiar").addEventListener("click", function () {
  registros = [];
  renderizar();
  agregarDiagnostico("Se limpiaron los registros.");
});

document.querySelector("#btnTema").addEventListener("click", function () {
  document.body.classList.toggle("tema-oscuro");
});

document.querySelector("#btnExportCSV").addEventListener("click", function () {
  alert("Exportacion pendiente de implementar en la mejora avanzada.");
});

document.querySelector("#btnExportJSON").addEventListener("click", function () {
  alert("Exportacion pendiente de implementar en la mejora avanzada.");
});

function renderizar() {
  renderizarTabla();
  renderizarIndicadores();
  renderizarReporte();
}

function renderizarTabla() {
  if (registros.length === 0) {
    tablaRegistros.innerHTML = '<tr><td colspan="7">Sin registros.</td></tr>';
    return;
  }

  tablaRegistros.innerHTML = registros.map(function (registro, indice) {
    const lecheAnimal = registro.leche / registro.animales;
    const estado = registro.leche < 5 || registro.maiz < 10 ? "Revisar" : "Normal";

    return `
      <tr>
        <td>${registro.fecha}</td>
        <td>${registro.leche} L</td>
        <td>${registro.maiz} kg</td>
        <td>${registro.animales}</td>
        <td>${lecheAnimal.toFixed(1)} L</td>
        <td>${estado}</td>
        <td><button onclick="eliminarRegistro(${indice})">Eliminar</button></td>
      </tr>
    `;
  }).join("");
}

function renderizarIndicadores() {
  const totalLeche = registros.reduce((suma, item) => suma + item.leche, 0);
  const totalMaiz = registros.reduce((suma, item) => suma + item.maiz, 0);
  const promedio = registros.length ? totalLeche / registros.length : 0;
  const alertas = registros.filter((item) => item.leche < 5 || item.maiz < 10).length;

  document.querySelector("#kpiLeche").textContent = `${totalLeche.toFixed(1)} L`;
  document.querySelector("#kpiMaiz").textContent = `${totalMaiz.toFixed(1)} kg`;
  document.querySelector("#kpiPromedio").textContent = `${promedio.toFixed(1)} L`;
  document.querySelector("#kpiAlertas").textContent = alertas;
}

function renderizarReporte() {
  if (registros.length === 0) {
    reporteTexto.textContent = "Aun no hay informacion suficiente para generar recomendaciones.";
    return;
  }

  const alertas = registros.filter((item) => item.leche < 5 || item.maiz < 10).length;
  reporteTexto.textContent = alertas > 0
    ? "Hay registros que requieren revision. Analiza alimento, agua y estado sanitario."
    : "La produccion se mantiene estable segun los datos registrados.";
}

function eliminarRegistro(indice) {
  registros.splice(indice, 1);
  renderizar();
}

function agregarDiagnostico(texto) {
  const li = document.createElement("li");
  li.textContent = texto;
  diagnosticoLista.prepend(li);
}

renderizar();
