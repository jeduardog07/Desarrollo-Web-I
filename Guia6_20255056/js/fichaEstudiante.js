//Accediendo a los elementos html
const inputCarnet = document.getElementById("idTxtCarnet");
const inputNombre = document.getElementById("idTxtNombre");
const inputDui = document.getElementById("idTxtDui");
const inputNit = document.getElementById("idTxtNit");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputEdad = document.getElementById("idTxtEdad");
const inputCorreo = document.getElementById("idTxtCorreo");

const buttonValidar = document.getElementById("idBtnValidar");
const buttonLimpiar = document.getElementById("idBtnLimpiar");
const divResultado = document.getElementById("idResultado");

/*
Expresiones regulares utilizadas para validar cada campo
^ indica el inicio del texto y $ indica el final
\d representa un digito (0-9)
[A-Za-z] representa una letra
{n} indica cuantas veces se repite el caracter anterior
*/

// Carnet: dos letras y tres numeros. Ejemplo: AB001
const regexCarnet = /^[A-Za-z]{2}\d{3}$/;

// Nombre completo: solo letras (con tildes y ñ) separadas por espacios,
// debe tener al menos dos palabras (nombre y apellido)
const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)+$/;

// DUI: ########-#
const regexDui = /^\d{8}-\d$/;

// NIT: ####-######-###-#
const regexNit = /^\d{4}-\d{6}-\d{3}-\d$/;

// Fecha de nacimiento: dd/mm/aaaa
const regexFecha = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

// Edad: solo numeros (hasta 3 digitos)
const regexEdad = /^\d{1,3}$/;

// Correo electronico: usuario@dominio.com
const regexCorreo = /^[A-Za-z0-9._-]+@[A-Za-z0-9-]+(\.[A-Za-z]{2,})+$/;

// Funcion que marca el campo en verde (valido) o en rojo (invalido)
const marcarCampo = (input, esValido) => {
  input.classList.remove("is-valid", "is-invalid");
  input.classList.add(esValido ? "is-valid" : "is-invalid");
};

// Funcion generica: valida el valor de un campo con su expresion regular
const validarCampo = (input, regex) => {
  const esValido = regex.test(input.value.trim());
  marcarCampo(input, esValido);
  return esValido;
};

// La fecha ademas de cumplir el formato debe existir en el calendario
// y no puede ser posterior al dia de hoy
const validarFecha = () => {
  const valor = inputFechaNacimiento.value.trim();
  let esValido = regexFecha.test(valor);

  if (esValido) {
    const partes = valor.split("/");
    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]);
    const anio = parseInt(partes[2]);
    const fecha = new Date(anio, mes - 1, dia);

    // Si el dia no existe (ejemplo 31/02) JavaScript lo cambia a otro mes
    const existe =
      fecha.getDate() == dia &&
      fecha.getMonth() == mes - 1 &&
      fecha.getFullYear() == anio;

    esValido = existe && anio >= 1900 && fecha <= new Date();
  }

  marcarCampo(inputFechaNacimiento, esValido);
  return esValido;
};

// La edad ademas de ser numerica debe estar en un rango razonable
const validarEdad = () => {
  const valor = inputEdad.value.trim();
  const esValido = regexEdad.test(valor) && valor >= 1 && valor <= 120;
  marcarCampo(inputEdad, esValido);
  return esValido;
};

// Funcion que valida toda la ficha del estudiante
const validarFicha = () => {
  // Se validan todos los campos (sin detenerse en el primer error)
  const resultados = [
    validarCampo(inputCarnet, regexCarnet),
    validarCampo(inputNombre, regexNombre),
    validarCampo(inputDui, regexDui),
    validarCampo(inputNit, regexNit),
    validarFecha(),
    validarEdad(),
    validarCampo(inputCorreo, regexCorreo),
  ];

  // Contando los campos que no cumplen
  const errores = resultados.filter((valido) => !valido).length;

  if (errores == 0) {
    divResultado.innerHTML = `<div class="alert alert-success" role="alert">
        <i class="bi bi-check-circle-fill"></i>
        La ficha del estudiante <b>${inputNombre.value.trim()}</b> (carnet
        <b>${inputCarnet.value.trim().toUpperCase()}</b>) es válida.
      </div>`;
  } else {
    divResultado.innerHTML = `<div class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle-fill"></i>
        La ficha tiene ${errores} campo(s) con información incorrecta.
        Revise los campos marcados en rojo.
      </div>`;
  }
};

// Funcion que limpia el formulario y quita las marcas de validacion
const limpiarFicha = () => {
  const campos = [
    inputCarnet,
    inputNombre,
    inputDui,
    inputNit,
    inputFechaNacimiento,
    inputEdad,
    inputCorreo,
  ];

  campos.forEach((campo) => {
    campo.value = "";
    campo.classList.remove("is-valid", "is-invalid");
  });

  divResultado.innerHTML = "";
  inputCarnet.focus();
};

// Validacion en tiempo real: cada campo se valida mientras se escribe
inputCarnet.addEventListener("input", () => validarCampo(inputCarnet, regexCarnet));
inputNombre.addEventListener("input", () => validarCampo(inputNombre, regexNombre));
inputDui.addEventListener("input", () => validarCampo(inputDui, regexDui));
inputNit.addEventListener("input", () => validarCampo(inputNit, regexNit));
inputFechaNacimiento.addEventListener("input", validarFecha);
inputEdad.addEventListener("input", validarEdad);
inputCorreo.addEventListener("input", () => validarCampo(inputCorreo, regexCorreo));

// Agregando eventos a los botones
buttonValidar.onclick = () => {
  validarFicha();
};

buttonLimpiar.onclick = () => {
  limpiarFicha();
};

//Ejecutar funcion al momento de cargar la pagina HTML
inputCarnet.focus();