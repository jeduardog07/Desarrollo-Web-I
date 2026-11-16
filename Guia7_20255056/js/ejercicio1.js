// EJERCICIO COMPLEMENTARIO 1
// Validacion del formulario de ejemplo2.html (sin utilizar innerHTML)

const formulario = document.forms["frmRegistro"];
const button = document.forms["frmRegistro"].elements["btnRegistro"];

// CREANDO MODAL CON BOOTSTRAP
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

// OBTENIENDO LA REFERENCIA DEL CUERPO DEL MODAL
const bodyModal = document.getElementById("idBodyModal");

// REFERENCIAS A LOS CONTROLES (por tipo, asi no dependen de los id del HTML)
const textos = formulario.querySelectorAll('input[type="text"]');
const passwords = formulario.querySelectorAll('input[type="password"]');
const email = formulario.querySelector('input[type="email"]');
const fecha = formulario.querySelector('input[type="date"]');
const intereses = formulario.querySelectorAll('input[type="checkbox"]');
const carreras = formulario.querySelectorAll('input[type="radio"]');
const pais = formulario.querySelector("select");
const avatar = formulario.querySelector('input[type="file"]');

// Expresion regular para validar el correo electronico
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Obtiene el texto del label asociado a un control
const textoLabel = function (control, porDefecto) {
  if (control.id) {
    const label = formulario.querySelector(`label[for="${control.id}"]`);
    if (label) {
      return label.textContent.trim();
    }
  }
  const labelPadre = control.closest("label");
  if (labelPadre) {
    return labelPadre.textContent.trim();
  }
  return porDefecto;
};

// Marca o desmarca un control como invalido (clases de Bootstrap)
const marcar = function (control, esInvalido) {
  if (esInvalido) {
    control.classList.add("is-invalid");
  } else {
    control.classList.remove("is-invalid");
  }
};

// Convierte el value de un input date (aaaa-mm-dd) en un objeto Date local
const fechaLocal = function (valor) {
  const partes = valor.split("-").map(Number);
  return new Date(partes[0], partes[1] - 1, partes[2]);
};

// VALIDACION: devuelve un arreglo con los mensajes de error
const validarFormulario = function () {
  const errores = [];

  // a. Campos no vacios
  textos.forEach((texto, i) => {
    const vacio = texto.value.trim() === "";
    marcar(texto, vacio);
    if (vacio) {
      errores.push(`El campo ${textoLabel(texto, "Texto " + (i + 1))} es obligatorio`);
    }
  });

  const emailVacio = email.value.trim() === "";
  marcar(email, emailVacio);
  if (emailVacio) {
    errores.push("El campo correo electronico es obligatorio");
  }

  const fechaVacia = fecha.value === "";
  marcar(fecha, fechaVacia);
  if (fechaVacia) {
    errores.push("El campo fecha de nacimiento es obligatorio");
  }

  passwords.forEach((pass, i) => {
    const vacio = pass.value === "";
    marcar(pass, vacio);
    if (vacio) {
      errores.push(`El campo ${textoLabel(pass, "Contrasena " + (i + 1))} es obligatorio`);
    }
  });

  const sinAvatar = avatar.files.length === 0;
  marcar(avatar, sinAvatar);
  if (sinAvatar) {
    errores.push("Debe seleccionar la imagen de su avatar");
  }

  // b. La fecha de nacimiento no puede superar la fecha actual
  if (!fechaVacia) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaLocal(fecha.value) > hoy) {
      marcar(fecha, true);
      errores.push("La fecha de nacimiento no puede ser mayor a la fecha actual");
    }
  }

  // c. Correo electronico con expresion regular
  if (!emailVacio && !regexEmail.test(email.value.trim())) {
    marcar(email, true);
    errores.push("El correo electronico no tiene un formato valido");
  }

  // d. Contrasena y repetir contrasena iguales
  if (
    passwords.length >= 2 &&
    passwords[0].value !== "" &&
    passwords[0].value !== passwords[1].value
  ) {
    marcar(passwords[0], true);
    marcar(passwords[1], true);
    errores.push("Las contrasenas no coinciden");
  }

  // e. Al menos un interes seleccionado
  const hayInteres = Array.from(intereses).some((check) => check.checked);
  if (!hayInteres) {
    errores.push("Debe seleccionar al menos un interes");
  }

  // f. Una carrera seleccionada
  const hayCarrera = Array.from(carreras).some((radio) => radio.checked);
  if (!hayCarrera) {
    errores.push("Debe seleccionar la carrera que estudia");
  }

  // g. Un pais de origen seleccionado
  // La primera opcion ("Seleccione una opcion") no tiene value, se valida por indice
  const sinPais = pais.selectedIndex === 0;
  marcar(pais, sinPais);
  if (sinPais) {
    errores.push("Debe seleccionar un pais de origen");
  }

  return errores;
};

// Crea una fila (tr) con dos celdas usando funciones de DOM
const crearFila = function (campo, valor) {
  const tr = document.createElement("tr");

  const th = document.createElement("th");
  th.setAttribute("scope", "row");
  th.textContent = campo;

  const td = document.createElement("td");
  td.textContent = valor;

  tr.appendChild(th);
  tr.appendChild(td);
  return tr;
};

// Construye la tabla con la informacion capturada (sin innerHTML)
const crearTabla = function () {
  const tabla = document.createElement("table");
  tabla.setAttribute("class", "table table-bordered table-striped");

  const thead = document.createElement("thead");
  const filaHead = document.createElement("tr");
  ["Campo", "Valor"].forEach((titulo) => {
    const th = document.createElement("th");
    th.textContent = titulo;
    filaHead.appendChild(th);
  });
  thead.appendChild(filaHead);
  tabla.appendChild(thead);

  const tbody = document.createElement("tbody");

  textos.forEach((texto, i) => {
    tbody.appendChild(crearFila(textoLabel(texto, "Texto " + (i + 1)), texto.value.trim()));
  });

  tbody.appendChild(crearFila("Fecha de nacimiento", fecha.value));
  tbody.appendChild(crearFila("Correo electronico", email.value.trim()));
  tbody.appendChild(crearFila("Contrasena", "*".repeat(passwords[0].value.length)));

  const listaIntereses = Array.from(intereses)
    .filter((check) => check.checked)
    .map((check) => textoLabel(check, check.value));
  tbody.appendChild(crearFila("Intereses", listaIntereses.join(", ")));

  const carrera = Array.from(carreras).find((radio) => radio.checked);
  tbody.appendChild(crearFila("Carrera", textoLabel(carrera, carrera.value)));

  tbody.appendChild(crearFila("Pais de origen", pais.options[pais.selectedIndex].text));
  tbody.appendChild(crearFila("Avatar", avatar.files[0].name));

  tabla.appendChild(tbody);
  return tabla;
};

// Limpia el cuerpo del modal sin usar innerHTML
const limpiarModal = function () {
  while (bodyModal.firstChild) {
    bodyModal.removeChild(bodyModal.firstChild);
  }
};

// EVENTO DEL BOTON
button.onclick = (event) => {
  event.preventDefault();

  const errores = validarFormulario();

  if (errores.length > 0) {
    alert("Corrija lo siguiente:\n- " + errores.join("\n- "));
    return;
  }

  limpiarModal();
  bodyModal.appendChild(crearTabla());

  const tituloModal = document.querySelector("#idModal .modal-title");
  if (tituloModal) {
    tituloModal.textContent = "Informacion del registro";
  }

  modal.show();
};
