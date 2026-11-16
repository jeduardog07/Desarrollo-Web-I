// EJERCICIO COMPLEMENTARIO 2
// Consumo de la API "JSearch" (OpenWeb Ninja) de RapidAPI con Fetch API y async/await
// Endpoint 1 (listado): /search      -> ofertas de trabajo
// Endpoint 2 (detalle): /job-details -> detalle de la oferta seleccionada

// Llave de RapidAPI (plan gratuito Basic)
const API_KEY = "d1a27e7edfmshaf7bca891410c72p18a03bjsnf9afa3af234a";
const API_HOST = "jsearch.p.rapidapi.com";
const BASE_URL = `https://${API_HOST}`;

const opcionesFetch = {
  method: "GET",
  headers: {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": API_HOST,
  },
};

// REFERENCIAS A ELEMENTOS HTML
const inputBusqueda = document.getElementById("idBusqueda");
const buttonBuscar = document.getElementById("idBtnBuscar");
const estado = document.getElementById("idEstado");
const listado = document.getElementById("idListado");
const detalle = document.getElementById("idDetalle");

// El plan gratuito tiene pocas peticiones al mes: se guardan las respuestas ya obtenidas
const cacheBusquedas = new Map();
const cacheDetalles = new Map();

// FUNCIONES DE APOYO PARA CREAR ELEMENTOS
const crearElemento = function (etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) {
    elemento.setAttribute("class", clase);
  }
  if (texto !== undefined) {
    elemento.textContent = texto;
  }
  return elemento;
};

const limpiar = function (contenedor) {
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
};

// MENSAJES DE ESTADO (carga y error)
const mostrarCargando = function (mensaje) {
  limpiar(estado);
  const caja = crearElemento("div", "d-flex align-items-center gap-2");
  const spinner = crearElemento("div", "spinner-border spinner-border-sm");
  spinner.setAttribute("aria-hidden", "true");
  caja.appendChild(spinner);
  caja.appendChild(crearElemento("span", "", mensaje));
  estado.appendChild(caja);
};

const mostrarError = function (mensaje) {
  limpiar(estado);
  estado.appendChild(crearElemento("div", "alert alert-danger mb-0", mensaje));
};

const mostrarInfo = function (mensaje) {
  limpiar(estado);
  estado.appendChild(crearElemento("div", "alert alert-secondary mb-0", mensaje));
};

const limpiarEstado = function () {
  limpiar(estado);
};

// PETICION GENERICA A LA API
const pedirDatos = async function (endpoint) {
  if (API_KEY === "TU_API_KEY_AQUI") {
    throw new Error("Falta configurar la llave de RapidAPI (API_KEY) en ejercicio2.js");
  }

  const respuesta = await fetch(`${BASE_URL}${endpoint}`, opcionesFetch);

  if (!respuesta.ok) {
    if (respuesta.status === 401 || respuesta.status === 403) {
      throw new Error("La llave no es valida o no esta suscrita a la API (plan Basic)");
    }
    if (respuesta.status === 429) {
      throw new Error("Se supero el limite de solicitudes del plan gratuito");
    }
    throw new Error(`La API respondio con el error ${respuesta.status}`);
  }

  return await respuesta.json();
};

// La API responde { status, data: [...] }
const obtenerLista = function (datos) {
  if (Array.isArray(datos)) {
    return datos;
  }
  return datos && Array.isArray(datos.data) ? datos.data : [];
};

// ENDPOINT 1: LISTADO DE RECURSOS (/search)
const buscarEmpleos = async function () {
  const texto = inputBusqueda.value.trim();

  if (texto === "") {
    mostrarError("Escriba el cargo o tema que desea buscar");
    return;
  }

  limpiar(listado);
  buttonBuscar.disabled = true;
  mostrarCargando("Buscando ofertas...");

  try {
    let empleos = cacheBusquedas.get(texto);

    if (!empleos) {
      const datos = await pedirDatos(
        `/search?query=${encodeURIComponent(texto)}&page=1&num_pages=1`
      );
      empleos = obtenerLista(datos);
      cacheBusquedas.set(texto, empleos);
    }

    if (empleos.length === 0) {
      mostrarInfo("No se encontraron ofertas para esa busqueda");
      return;
    }

    empleos.forEach((empleo) => {
      listado.appendChild(crearTarjeta(empleo));
    });
    limpiarEstado();
  } catch (error) {
    mostrarError(`No se pudo cargar el listado. ${error.message}`);
  } finally {
    buttonBuscar.disabled = false;
  }
};

const ubicacionDe = function (empleo) {
  return [empleo.job_city, empleo.job_state, empleo.job_country]
    .filter((parte) => parte)
    .join(", ");
};

const crearTarjeta = function (empleo) {
  const tarjeta = crearElemento("button", "tarjeta");
  tarjeta.setAttribute("type", "button");

  tarjeta.appendChild(crearElemento("span", "titulo-oferta", empleo.job_title || "Sin titulo"));
  tarjeta.appendChild(crearElemento("span", "empresa", empleo.employer_name || "Empresa no indicada"));
  tarjeta.appendChild(crearElemento("span", "ubicacion", ubicacionDe(empleo) || "Ubicacion no indicada"));

  tarjeta.onclick = () => {
    marcarActiva(tarjeta);
    cargarDetalle(empleo.job_id);
  };

  return tarjeta;
};

const marcarActiva = function (tarjetaActiva) {
  document.querySelectorAll(".tarjeta").forEach((tarjeta) => {
    tarjeta.classList.remove("activa");
  });
  tarjetaActiva.classList.add("activa");
};

// ENDPOINT 2: DETALLE DE UN RECURSO (/job-details?job_id=ID)
const cargarDetalle = async function (id) {
  limpiar(detalle);
  mostrarCargando("Cargando detalle de la oferta...");

  try {
    let empleo = cacheDetalles.get(id);

    if (!empleo) {
      const datos = await pedirDatos(`/job-details?job_id=${encodeURIComponent(id)}`);
      empleo = obtenerLista(datos)[0];
      if (empleo) {
        cacheDetalles.set(id, empleo);
      }
    }

    if (!empleo) {
      throw new Error("No se encontro informacion de la oferta");
    }

    mostrarDetalle(empleo);
    limpiarEstado();
  } catch (error) {
    limpiar(detalle);
    detalle.appendChild(
      crearElemento("p", "text-secondary mb-0", "No se pudo mostrar el detalle.")
    );
    mostrarError(`No se pudo cargar el detalle. ${error.message}`);
  }
};

const mostrarDetalle = function (empleo) {
  limpiar(detalle);

  if (empleo.employer_logo && /^https?:\/\//.test(empleo.employer_logo)) {
    const logo = crearElemento("img", "logo");
    logo.setAttribute("src", empleo.employer_logo);
    logo.setAttribute("alt", empleo.employer_name || "Logo de la empresa");
    detalle.appendChild(logo);
  }

  detalle.appendChild(crearElemento("h3", "h4", empleo.job_title || "Sin titulo"));
  detalle.appendChild(
    crearElemento("p", "text-secondary mb-2", empleo.employer_name || "Empresa no indicada")
  );

  const datos = [
    empleo.job_employment_type,
    ubicacionDe(empleo),
    empleo.job_is_remote ? "Remoto" : "",
    empleo.job_posted_at || "",
  ].filter((dato) => dato);
  detalle.appendChild(crearElemento("p", "small mb-3", datos.join(" | ")));

  if (empleo.job_min_salary || empleo.job_max_salary) {
    const moneda = empleo.job_salary_currency || "";
    detalle.appendChild(
      crearElemento(
        "p",
        "fw-bold",
        `Salario: ${empleo.job_min_salary || "?"} - ${empleo.job_max_salary || "?"} ${moneda}`.trim()
      )
    );
  }

  detalle.appendChild(crearElemento("h4", "h6", "Descripcion"));
  detalle.appendChild(
    crearElemento("p", "descripcion", empleo.job_description || "Sin descripcion")
  );

  if (empleo.job_apply_link && /^https?:\/\//.test(empleo.job_apply_link)) {
    const enlace = crearElemento("a", "btn btn-dark btn-sm", "Aplicar a la oferta");
    enlace.setAttribute("href", empleo.job_apply_link);
    enlace.setAttribute("target", "_blank");
    enlace.setAttribute("rel", "noopener noreferrer");
    detalle.appendChild(enlace);
  }
};

// EVENTOS
buttonBuscar.onclick = () => {
  buscarEmpleos();
};

inputBusqueda.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    buscarEmpleos();
  }
});
