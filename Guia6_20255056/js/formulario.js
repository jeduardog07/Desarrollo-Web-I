//Accediendo a los elementos html
const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
// Componente de Bootstrap
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

//Componente modal
const idModal = document.getElementById("idModal");

//Arreglo global de pacientes
let arrayPaciente = [];

// Ejercicio 1: posicion del paciente que se esta editando (-1 = ninguno)
let indiceEdicion = -1;

// Ejercicio 1: contenido del boton principal segun el modo (guardar o actualizar)
const textoGuardar = `<i class="bi bi-person-plus-fill"></i> Guardar Datos`;
const textoActualizar = `<i class="bi bi-pencil-square"></i> Actualizar Datos`;

// Ejercicio 2: persistencia de los pacientes con LocalStorage
const guardarPacientes = () => {
  localStorage.setItem("pacientes", JSON.stringify(arrayPaciente));
};

const cargarPacientes = () => {
  try {
    const datos = localStorage.getItem("pacientes");
    arrayPaciente = datos ? JSON.parse(datos) : [];
  } catch (error) {
    // Si los datos guardados estan danados se inicia con un arreglo vacio
    arrayPaciente = [];
  }
};

/*
Creando una funcion para que limpie el formulario
siempre que se cargue la pagina o cuando se presione
el boton limpiar del formulario
*/

const limpiarForm = () => {
  inputNombre.value = "";
  inputApellido.value = "";
  inputFechaNacimiento.value = "";
  inputRdMasculino.checked = false;
  inputRdFemenino.checked = false;
  cmbPais.value = 0;
  inputDireccion.value = "";
  inputNombrePais.value = "";

  // Ejercicio 1: se cancela cualquier edicion en curso
  indiceEdicion = -1;
  buttonAgregarPaciente.innerHTML = textoGuardar;

  inputNombre.focus();
};

/*
 Funcion para validar el ingreso del paciente
*/

const addPaciente = function () {
  let nombre = inputNombre.value;
  let apellido = inputApellido.value;
  let fechaNacimiento = inputFechaNacimiento.value;
  let sexo =
    inputRdMasculino.checked == true
      ? "Hombre"
      : inputRdFemenino.checked == true
      ? "Mujer"
      : "";
  let pais = cmbPais.value;
  let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
  let direccion = inputDireccion.value;

  if (
    nombre != "" &&
    apellido != "" &&
    fechaNacimiento != "" &&
    sexo != "" &&
    pais != 0 &&
    direccion != ""
  ) {
    let paciente = new Array(
      nombre,
      apellido,
      fechaNacimiento,
      sexo,
      labelPais,
      direccion
    );

    if (indiceEdicion >= 0) {
      // Ejercicio 1: actualizando la informacion del paciente editado
      arrayPaciente[indiceEdicion] = paciente;
      mensaje.innerHTML = "Se ha actualizado el paciente";
    } else {
      //Agregando informacion al arreglo paciente
      arrayPaciente.push(paciente);

      //Asignando un mensaje a nuestra notificacion
      mensaje.innerHTML = "Se ha registrado un nuevo paciente";
    }

    // Ejercicio 2: guardando los cambios en LocalStorage
    guardarPacientes();

    //Llamando al componente de Bootstrap
    toast.show();

    //Limpiando formulario
    limpiarForm();

    // Ejercicio 1: actualizando la tabla con los cambios
    imprimirPacientes();
  } else {
    //Asignando un mensaje a nuestra notificacion
    mensaje.innerHTML = "Faltan campos por completar";
    //Llamando al componente de Bootstrap
    toast.show();
  }
};

// Ejercicio 1: carga los datos del paciente en el formulario para editarlo
const editarPaciente = (indice) => {
  const paciente = arrayPaciente[indice];

  inputNombre.value = paciente[0];
  inputApellido.value = paciente[1];
  inputFechaNacimiento.value = paciente[2];
  inputRdMasculino.checked = paciente[3] == "Hombre";
  inputRdFemenino.checked = paciente[3] == "Mujer";
  inputDireccion.value = paciente[5];

  // Se busca el pais por su nombre dentro del select
  let opcion = Array.from(cmbPais.options).find(
    (item) => item.text == paciente[4]
  );
  if (!opcion) {
    // Si el pais fue agregado antes y ya no esta en el select, se vuelve a crear
    opcion = document.createElement("option");
    opcion.textContent = paciente[4];
    opcion.value = cmbPais.children.length + 1;
    cmbPais.appendChild(opcion);
  }
  cmbPais.selectedIndex = opcion.index;

  // Se activa el modo edicion
  indiceEdicion = indice;
  buttonAgregarPaciente.innerHTML = textoActualizar;
  inputNombre.focus();

  mensaje.innerHTML = "Edite los datos y presione Actualizar Datos";
  toast.show();
};

// Ejercicio 1: elimina el paciente seleccionado
const eliminarPaciente = (indice) => {
  const paciente = arrayPaciente[indice];

  if (confirm(`¿Desea eliminar al paciente ${paciente[0]} ${paciente[1]}?`)) {
    arrayPaciente.splice(indice, 1);

    // Ejercicio 2: guardando los cambios en LocalStorage
    guardarPacientes();

    // Si se estaba editando, se cancela para no perder la referencia
    if (indiceEdicion >= 0) {
      limpiarForm();
    }

    imprimirPacientes();

    mensaje.innerHTML = "Se ha eliminado el paciente";
    toast.show();
  }
};

//Funcion que imprime la ficha de los pacientes registrados
function imprimirFilas() {
  let $fila = "";
  let contador = 1;

  arrayPaciente.forEach((element) => {
    $fila += `<tr>
                    <td scope="row" class="text-center fw-bold">${contador}</td>
                    <td>${element[0]}</td>
                    <td>${element[1]}</td>
                    <td>${element[2]}</td>
                    <td>${element[3]}</td>
                    <td>${element[4]}</td>
                    <td>${element[5]}</td>
                    <td>
                        <button id="idBtnEditar${contador}" type="button" class="btn btn-primary" alt="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button id="idBtnEliminar${contador}" type="button" class="btn btn-danger" alt="Eliminar">
                            <i class="bi bi-trash3-fill"></i>
                        </button>
                    </td>
                </tr>`;
    contador++;
  });
  return $fila;
}

const imprimirPacientes = () => {
  let $table = `<div class="table-responsive">
                <table class="table table-striped table-hover table-bordered">
                    <tr>
                        <th scope="col" class="text-center" style="width:5%">#</th>
                        <th scope="col" class="text-center" style="width:15%">Nombre</th>
                        <th scope="col" class="text-center" style="width:15%">Apellido</th>
                        <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
                        <th scope="col" class="text-center" style="width:10%">Sexo</th>
                        <th scope="col" class="text-center" style="width:10%">Pais</th>
                        <th scope="col" class="text-center" style="width:25%">Dirección</th>
                        <th scope="col" class="text-center" style="width:10%">Opciones</th>
                    </tr>
                    ${imprimirFilas()}
                </table>
            </div>
            `;
  document.getElementById("idTablaPacientes").innerHTML = $table;

  // Ejercicio 1: asignando los eventos a los botones Editar y Eliminar de cada fila
  arrayPaciente.forEach((element, indice) => {
    document.getElementById(`idBtnEditar${indice + 1}`).onclick = () => {
      editarPaciente(indice);
    };
    document.getElementById(`idBtnEliminar${indice + 1}`).onclick = () => {
      eliminarPaciente(indice);
    };
  });
};

// Contador global de los option correspondiente
// al select (cmb) pais
let contadorGlobalOption = cmbPais.children.length;
const addPais = () => {
  let paisNew = inputNombrePais.value;

  if (paisNew != "") {
    // Creando nuevo option con la API DOM
    let option = document.createElement("option");
    option.textContent = paisNew;
    option.value = contadorGlobalOption + 1;

    //Agregando el nuevo option en el select
    cmbPais.appendChild(option);

    //Asignando un mensaje a nuestra notificacion
    mensaje.innerHTML = "Pais agregado correctamente";
    //Llamando al componente de Bootstrap
    toast.show();
  } else {
    //Asignando un mensaje a nuestra notificacion
    mensaje.innerHTML = "Faltan campos por completar";
    //Llamando al componente de Bootstrap
    toast.show();
  }
};

// Agregando eventos a los botones y utilizando funciones tipo flecha
buttonLimpiarPaciente.onclick = () => {
  limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
  addPaciente();
};

buttonMostrarPaciente.onclick = () => {
  imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
  addPais();
};

// Se agrega el focus en el campo nombre pais del modal
idModal.addEventListener("shown.bs.modal", () => {
  inputNombrePais.value = "";
  inputNombrePais.focus();
});

//Ejecutar funcion al momento de cargar la pagina HTML
limpiarForm();

// Ejercicio 2: cargando los pacientes guardados y mostrándolos en la tabla
cargarPacientes();
if (arrayPaciente.length > 0) {
  imprimirPacientes();
}