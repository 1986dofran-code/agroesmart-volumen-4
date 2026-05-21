const formRegistro = document.querySelector("#formRegistro");
const tablaRegistros = document.querySelector("#tablaRegistros");
const mensaje = document.querySelector("#mensaje");
const reporteTexto = document.querySelector("#reporteTexto");
const diagnosticoLista = document.querySelector("#diagnosticoLista");
const grafico = document.querySelector("#grafico");
const contextoGrafico = grafico.getContext("2d");

let registros = [];

const datosGuardados = localStorage.getItem("agrosmart-registros");
if (datosGuardados) {
  try {
    const registrosParseados = JSON.parse(datosGuardados);
    if (Array.isArray(registrosParseados)) {
      registros = registrosParseados;
    }
  } catch (error) {
    console.warn("Error cargando datos guardados:", error);
  }
}

formRegistro.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const fecha = document.querySelector("#fecha").value;
  const lecheTexto = document.querySelector("#leche").value;
  const maizTexto = document.querySelector("#maiz").value;
  const animalesTexto = document.querySelector("#animales").value;
  const leche = Number(lecheTexto);
  const maiz = Number(maizTexto);
  const animales = Number(animalesTexto);
  const nota = document.querySelector("#nota").value.trim();

  if (
    !fecha ||
    lecheTexto === "" ||
    maizTexto === "" ||
    animalesTexto === "" ||
    !Number.isFinite(leche) ||
    !Number.isFinite(maiz) ||
    !Number.isInteger(animales) ||
    leche < 0 ||
    maiz < 0 ||
    animales <= 0
  ) {
    mensaje.textContent = "Revisa los datos: falta informacion o hay valores invalidos.";
    return;
  }

  if (registros.some(function (registro) { return registro.fecha === fecha; })) {
    mensaje.textContent = "Ya existe un registro para esa fecha.";
    return;
  }

  registros.push({ fecha, leche, maiz, animales, nota });
  guardarRegistros();
  mensaje.textContent = "Registro agregado correctamente.";
  formRegistro.reset();
  renderizar();
  agregarDiagnostico(`Registro creado para la fecha ${fecha}.`);
});

document.querySelector("#btnDemo").addEventListener("click", function () {
  registros = [
    { fecha: "2026-05-01", leche: 18, maiz: 42, animales: 6, nota: "Dia normal" },
    { fecha: "2026-05-02", leche: 4, maiz: 25, animales: 6, nota: "Baja produccion" },
    { fecha: "2026-05-03", leche: 21, maiz: 48, animales: 7, nota: "Mejoro el pasto" }
  ];
  guardarRegistros();
  renderizar();
  agregarDiagnostico("Se cargaron datos de demostracion.");
});

document.querySelector("#btnLimpiar").addEventListener("click", function () {
  registros = [];
  guardarRegistros();
  renderizar();
  agregarDiagnostico("Se limpiaron los registros.");
});

document.querySelector("#btnTema").addEventListener("click", function () {
  document.body.classList.toggle("tema-oscuro");
  dibujarGrafico();
  agregarDiagnostico("Se cambio el tema visual.");
});

document.querySelector("#btnExportCSV").addEventListener("click", function () {
  if (registros.length === 0) {
    mensaje.textContent = "No hay registros para exportar.";
    return;
  }

  const encabezado = ["fecha", "leche", "maiz", "animales", "nota"];
  const filas = registros.map(function (registro) {
    return encabezado.map(function (campo) {
      return prepararCSV(registro[campo]);
    }).join(",");
  });

  descargarArchivo("agrosmart-registros.csv", [encabezado.join(","), ...filas].join("\n"), "text/csv");
  agregarDiagnostico("Se exportaron los registros en CSV.");
});

document.querySelector("#btnExportJSON").addEventListener("click", function () {
  if (registros.length === 0) {
    mensaje.textContent = "No hay registros para exportar.";
    return;
  }

  descargarArchivo("agrosmart-registros.json", JSON.stringify(registros, null, 2), "application/json");
  agregarDiagnostico("Se exportaron los registros en JSON.");
});

function renderizar() {
  renderizarTabla();
  renderizarIndicadores();
  renderizarReporte();
  dibujarGrafico();
}

function renderizarTabla() {
  tablaRegistros.innerHTML = "";

  if (registros.length === 0) {
    tablaRegistros.innerHTML = '<tr><td colspan="7">Sin registros.</td></tr>';
    return;
  }

  registros.forEach(function (registro, indice) {
    const lecheAnimal = registro.leche / registro.animales;
    const estado = registro.leche < 5 || registro.maiz < 10 ? "Revisar" : "Normal";
    const fila = document.createElement("tr");
    const datos = [
      registro.fecha,
      `${registro.leche.toFixed(1)} L`,
      `${registro.maiz.toFixed(1)} kg`,
      registro.animales,
      `${lecheAnimal.toFixed(1)} L`
    ];

    datos.forEach(function (dato) {
      const celda = document.createElement("td");
      celda.textContent = dato;
      fila.appendChild(celda);
    });

    const celdaEstado = document.createElement("td");
    const etiquetaEstado = document.createElement("span");
    etiquetaEstado.className = `estado estado-${estado.toLowerCase()}`;
    etiquetaEstado.textContent = estado;
    celdaEstado.appendChild(etiquetaEstado);
    fila.appendChild(celdaEstado);

    const celdaAccion = document.createElement("td");
    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", function () {
      eliminarRegistro(indice);
    });
    celdaAccion.appendChild(botonEliminar);
    fila.appendChild(celdaAccion);

    tablaRegistros.appendChild(fila);
  });
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
  guardarRegistros();
  renderizar();
  agregarDiagnostico("Se elimino un registro de la tabla.");
}

function guardarRegistros() {
  localStorage.setItem("agrosmart-registros", JSON.stringify(registros));
}

function agregarDiagnostico(texto) {
  const li = document.createElement("li");
  li.textContent = texto;
  diagnosticoLista.prepend(li);
}

function dibujarGrafico() {
  const ancho = grafico.width;
  const alto = grafico.height;
  const estilos = getComputedStyle(document.body);
  const colorTexto = estilos.getPropertyValue("--text").trim();
  const colorLinea = estilos.getPropertyValue("--line").trim();
  const colorLeche = estilos.getPropertyValue("--accent").trim();
  const colorMaiz = estilos.getPropertyValue("--warning").trim();
  const margen = 36;
  const maximo = Math.max(10, ...registros.map((item) => Math.max(item.leche, item.maiz)));

  contextoGrafico.clearRect(0, 0, ancho, alto);
  contextoGrafico.fillStyle = estilos.getPropertyValue("--panel").trim();
  contextoGrafico.fillRect(0, 0, ancho, alto);
  contextoGrafico.strokeStyle = colorLinea;
  contextoGrafico.lineWidth = 1;
  contextoGrafico.beginPath();
  contextoGrafico.moveTo(margen, margen);
  contextoGrafico.lineTo(margen, alto - margen);
  contextoGrafico.lineTo(ancho - margen, alto - margen);
  contextoGrafico.stroke();

  contextoGrafico.fillStyle = colorTexto;
  contextoGrafico.font = "13px Arial";

  if (registros.length === 0) {
    contextoGrafico.fillText("Sin datos para graficar.", margen + 12, alto / 2);
    return;
  }

  const espacio = (ancho - margen * 2) / registros.length;
  const anchoBarra = Math.min(34, espacio / 3);

  registros.forEach(function (registro, indice) {
    const baseX = margen + espacio * indice + espacio / 2;
    dibujarBarra(baseX - anchoBarra, registro.leche, maximo, colorLeche, margen, alto, anchoBarra);
    dibujarBarra(baseX + 3, registro.maiz, maximo, colorMaiz, margen, alto, anchoBarra);
    contextoGrafico.fillStyle = colorTexto;
    contextoGrafico.fillText(registro.fecha.slice(5), baseX - 18, alto - 12);
  });

  contextoGrafico.fillStyle = colorLeche;
  contextoGrafico.fillText("Leche", margen + 8, 22);
  contextoGrafico.fillStyle = colorMaiz;
  contextoGrafico.fillText("Maiz", margen + 68, 22);
}

function dibujarBarra(x, valor, maximo, color, margen, alto, anchoBarra) {
  const altoDisponible = alto - margen * 2;
  const altura = (valor / maximo) * altoDisponible;
  contextoGrafico.fillStyle = color;
  contextoGrafico.fillRect(x, alto - margen - altura, anchoBarra, altura);
}

function prepararCSV(valor) {
  const texto = String(valor ?? "");
  return `"${texto.replaceAll('"', '""')}"`;
}

function descargarArchivo(nombre, contenido, tipo) {
  const blob = new Blob([contenido], { type: `${tipo};charset=utf-8` });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}

renderizar();
