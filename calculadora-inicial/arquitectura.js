// Referencias a los elementos de la interfaz
const contadorDiv = document.getElementById("contador");
const contadorInput = contadorDiv.querySelector("input");
const tablaMemoria = document.getElementById("tabla-memoria");
const btnSiguiente = document.getElementById("siguiente");
const btnReiniciar = document.getElementById("reiniciar");
const regDirecciones = document.getElementById("reg-direcciones");
const regDireccionesInput = document.getElementById("reg-direcciones-input");
const regDatos = document.getElementById("reg-datos");
const regDatosInput = document.getElementById("reg-datos-input");
const regInstrucciones = document.getElementById("reg-instrucciones");
const regInstruccionesInput = document.getElementById("reg-instrucciones-input");
const decodificador = document.getElementById("decodificador");
const decodificadorInput = document.getElementById("decodificador-input");
const regEntradas = document.getElementById("reg-entrada");
const regEntradasInput = document.getElementById("reg-entrada-input");
const acumulador = document.getElementById("acumulador");
const acumuladorInput = document.getElementById("acumulador-input");

// Elementos para métricas
const metricsContainer = document.createElement("div");
metricsContainer.id = "metrics-container";
metricsContainer.style.marginTop = "15px";
metricsContainer.style.padding = "10px";
metricsContainer.style.backgroundColor = "#f5f5f5";
metricsContainer.style.borderRadius = "5px";
metricsContainer.style.border = "1px solid #ddd";

const cycleCounterSpan = document.createElement("span");
cycleCounterSpan.id = "cycle-counter";
cycleCounterSpan.textContent = "Ciclos: 0";
cycleCounterSpan.style.display = "block";
cycleCounterSpan.style.marginBottom = "5px";
cycleCounterSpan.style.fontWeight = "bold";

const cyclePerInstructionSpan = document.createElement("span");
cyclePerInstructionSpan.id = "cpi-counter";
cyclePerInstructionSpan.textContent = "CPI: 0";
cyclePerInstructionSpan.style.display = "block";
cyclePerInstructionSpan.style.marginBottom = "5px";

// Añadir elementos al contenedor de métricas
metricsContainer.appendChild(cycleCounterSpan);
metricsContainer.appendChild(cyclePerInstructionSpan);
btnReiniciar.parentNode.insertBefore(metricsContainer, btnReiniciar.nextSibling);

// Variables para métricas
let ciclosTotal = 0;
let instruccionesCompletadas = 0;
let programaTerminado = false;

let paso = 0;
let contador = 0;
const operaciones = {
  "0011": "+",
  "0110": "M",
};


btnSiguiente.addEventListener("click", () => {
  if (programaTerminado) {
    alert("El programa ha terminado. Presiona 'Reiniciar' para comenzar de nuevo.");
    return;
  }

  ciclosTotal++;
  cycleCounterSpan.textContent = `Ciclos: ${ciclosTotal}`;
  const todasLasFilas = tablaMemoria.querySelectorAll("tr");
  todasLasFilas.forEach((fila) => (fila.style.border = "none"));

  if (paso === 0) {
    contadorDiv.classList.add("active");
    contadorInput.value = contador.toString(2).padStart(4, "0");
  } else if (paso === 1) {
    contadorDiv.classList.remove("active");
    regDirecciones.classList.add("active");
    regDireccionesInput.value = contador.toString(2).padStart(4, "0");
  } else if (paso === 2) {
    contadorDiv.classList.remove("active");
    regDirecciones.classList.remove("active");
    contador++;
    contadorDiv.classList.add("active");
    contadorInput.value = contador.toString(2).padStart(4, "0");
  } else if (paso === 3) {
    contadorDiv.classList.remove("active");
    regDirecciones.classList.add("active");
    tablaMemoria.classList.add("active");
    buscarFilaPorDireccion(regDireccionesInput.value).style.border =
      "3px solid red";
  } else if (paso === 4) {
    regDirecciones.classList.remove("active");
    tablaMemoria.classList.remove("active");
    buscarFilaPorDireccion(regDireccionesInput.value).style.border = "none";
    regDatos.classList.add("active");
    regDatosInput.value = buscarFilaPorDireccion(regDireccionesInput.value)
      .querySelector("td:nth-child(2)")
      .textContent.trim();
  } else if (paso === 5) {
    regDatos.classList.remove("active");
    regInstrucciones.classList.add("active");
    regInstruccionesInput.value = regDatosInput.value;
  } else if (paso === 6) {
    regInstrucciones.classList.remove("active");
    decodificador.classList.add("active");
    const instruccion = regInstruccionesInput.value.slice(0, 4);
    const operacion = operaciones[instruccion];
    decodificadorInput.value = operacion;
  } else if (paso === 7) {
    decodificador.classList.remove("active");
    regDirecciones.classList.add("active");
    regDireccionesInput.value = regInstruccionesInput.value.slice(4);
  } else if (paso === 8) {
    tablaMemoria.classList.add("active");
    buscarFilaPorDireccion(regDireccionesInput.value).style.border =
      "3px solid red";
  } else if (paso === 9) {
    const fila = buscarFilaPorDireccion(regDireccionesInput.value);
    fila.style.border = "none";
    tablaMemoria.classList.remove("active");
    regDirecciones.classList.remove("active");
    regDatos.classList.add("active");
    regDatosInput.value = fila
      .querySelector("td:nth-child(2)")
      .textContent.trim();
  } else if (paso === 10) {
    regDatos.classList.remove("active");
    buscarFilaPorDireccion(regDireccionesInput.value).style.border = "none";
    regEntradas.classList.add("active");
    regEntradasInput.value = regDatosInput.value.slice(4);
  } else if (paso === 11) {
    regEntradas.classList.remove("active");
    acumulador.classList.add("active");
    acumuladorInput.value = (
      parseInt(regEntradasInput.value, 2) + 
      parseInt(acumuladorInput.value || "0", 2)
    ).toString(2).padStart(4, "0");
    instruccionesCompletadas++;
    cyclePerInstructionSpan.textContent = `CPI: ${(ciclosTotal / instruccionesCompletadas).toFixed(2)}`;
  } else if (paso === 12) {
    acumulador.classList.remove("active");
    contadorDiv.classList.add("active");
    regDirecciones.classList.add("active");
    setTimeout(() => {
      regDireccionesInput.value = contadorInput.value;
    }, 300);
  } else if (paso === 13) {
    regDirecciones.classList.remove("active");
    contadorDiv.classList.remove("active");
    contador++;
    contadorDiv.classList.add("active");
    contadorInput.value = contador.toString(2).padStart(4, "0");
  } else if (paso === 14) {
    contadorDiv.classList.remove("active");
    regDirecciones.classList.add("active");
    tablaMemoria.classList.add("active");
    buscarFilaPorDireccion(regDireccionesInput.value).style.border =
      "3px solid red";
  } else if (paso === 15) {
    regDirecciones.classList.remove("active");
    tablaMemoria.classList.remove("active");
    buscarFilaPorDireccion(regDireccionesInput.value).style.border = "none";

    regDatos.classList.add("active");
    regDatosInput.value = buscarFilaPorDireccion(regDireccionesInput.value)
      .querySelector("td:nth-child(2)")
      .textContent.trim();
  } else if (paso === 16) {
    regDatos.classList.remove("active");
    regInstrucciones.classList.add("active");
    regInstruccionesInput.value = regDatosInput.value;
  } else if (paso === 17) {
    regInstrucciones.classList.remove("active");
    decodificador.classList.add("active");
    const instruccion = regInstruccionesInput.value.slice(0, 4);
    const operacion = operaciones[instruccion];
    decodificadorInput.value = operacion;
  } else if (paso === 18) {
    decodificador.classList.remove("active");
    regDirecciones.classList.add("active");
    regDireccionesInput.value = regInstruccionesInput.value.slice(4);
  } else if (paso === 19) {
    tablaMemoria.classList.add("active");
    buscarFilaPorDireccion(regDireccionesInput.value).style.border =
      "3px solid red";
  } else if (paso === 20) {
    const fila = buscarFilaPorDireccion(regDireccionesInput.value);
    fila.style.border = "none";
    tablaMemoria.classList.remove("active");
    regDirecciones.classList.remove("active");
    regDatos.classList.add("active");
    regDatosInput.value = fila
      .querySelector("td:nth-child(2)")
      .textContent.trim();
  } else if (paso === 21) {
    regDatos.classList.remove("active");
    buscarFilaPorDireccion(regDireccionesInput.value).style.border = "none";
    regEntradas.classList.add("active");
    regEntradasInput.value = regDatosInput.value.slice(4);
  } else if (paso === 22) {
    regEntradas.classList.remove("active");
    acumulador.classList.add("active");
    acumuladorInput.value = (
      parseInt(acumuladorInput.value, 2) + parseInt(regEntradasInput.value, 2)
    ).toString(2).padStart(4, "0");
    instruccionesCompletadas++;
    cyclePerInstructionSpan.textContent = `CPI: ${(ciclosTotal / instruccionesCompletadas).toFixed(2)}`;
  } else if (paso === 23) {
    acumulador.classList.remove("active");
    contadorDiv.classList.add("active");
    regDirecciones.classList.add("active");
    setTimeout(() => {
      regDireccionesInput.value = contadorInput.value;
    }, 300);
  } else if (paso === 24) {
    regDirecciones.classList.remove("active");
    contadorDiv.classList.remove("active");
    contador++;
    contadorDiv.classList.add("active");
    contadorInput.value = contador.toString(2).padStart(4, "0");
  } else if (paso === 25) {
    contadorDiv.classList.remove("active");
    regDirecciones.classList.add("active");
    tablaMemoria.classList.add("active");
    buscarFilaPorDireccion(regDireccionesInput.value).style.border =
      "3px solid red";
  } else if (paso === 26) {
    regDirecciones.classList.remove("active");
    tablaMemoria.classList.remove("active");
    buscarFilaPorDireccion(regDireccionesInput.value).style.border = "none";

    regDatos.classList.add("active");
    regDatosInput.value = buscarFilaPorDireccion(regDireccionesInput.value)
      .querySelector("td:nth-child(2)")
      .textContent.trim();
  } else if (paso === 27) {
    regDatos.classList.remove("active");
    regInstrucciones.classList.add("active");
    regInstruccionesInput.value = regDatosInput.value;
  } else if (paso === 28) {
    regInstrucciones.classList.remove("active");
    decodificador.classList.add("active");
    const instruccion = regInstruccionesInput.value.slice(0, 4);
    const operacion = operaciones[instruccion];
    decodificadorInput.value = operacion;
  } else if (paso === 29) {
    decodificador.classList.remove("active");
    regDirecciones.classList.add("active");
    regDireccionesInput.value = regInstruccionesInput.value.slice(4);
  } else if (paso === 30) {
    regDirecciones.classList.remove("active");
    tablaMemoria.classList.add("active");
    buscarFilaPorDireccion(regDireccionesInput.value).style.border =
      "3px solid red";
    tablaMemoria.classList.remove("active");
    regDatos.classList.add("active");
    acumulador.classList.add("active");
    regDatosInput.value = acumuladorInput.value;
  } else if (paso === 31) {
    acumulador.classList.remove("active");
    regDirecciones.classList.add("active");
    const fila = buscarFilaPorDireccion(regDireccionesInput.value);
    fila.style.border = "3px solid red";
    fila.querySelector("td:nth-child(2)").textContent =
      regDatosInput.value.padStart(8, "0");
    instruccionesCompletadas++;
    cyclePerInstructionSpan.textContent = `CPI: ${(ciclosTotal / instruccionesCompletadas).toFixed(2)}`;
    programaTerminado = true;
  }
  paso++;
});

btnReiniciar.addEventListener("click", () => {
  paso = 0;
  contador = 0;
  acumuladorInput.value = "";
  contadorInput.value = "";
  regDireccionesInput.value = "";
  regDatosInput.value = "";
  regInstruccionesInput.value = "";
  regEntradasInput.value="";
  decodificadorInput.value = "";
  ciclosTotal = 0;
  instruccionesCompletadas = 0;
  programaTerminado = false;
  
  // Actualizar contadores
  cycleCounterSpan.textContent = `Ciclos: ${ciclosTotal}`;
  cyclePerInstructionSpan.textContent = `CPI: 0`;
  
  // Limpiar clases y bordes
  const filas = tablaMemoria.querySelectorAll("tr");
  filas.forEach((fila) => (fila.style.border = "none"));
    
  const elementosActivos = document.querySelectorAll(".active");
  elementosActivos.forEach((elemento) => elemento.classList.remove("active"));

  let celdaUltima = tablaMemoria.querySelector("tr:nth-child(7) td:nth-child(2)");
  if (celdaUltima) {
    celdaUltima.textContent = "00000000"; // Restablecer valor al reiniciar
  }

  alert("El programa se ha reiniciado. Presiona 'Siguiente paso' para empezar de nuevo.");
});

function buscarFilaPorDireccion(direccion) {
  const filas = document.querySelectorAll("#tabla-memoria table tr");

  for (let i = 1; i < filas.length; i++) {
    const celdaDireccion = filas[i].querySelector("td:first-child");
    if (celdaDireccion && celdaDireccion.textContent.trim() === direccion) {
      return filas[i];
    }
  }

  return null;
}