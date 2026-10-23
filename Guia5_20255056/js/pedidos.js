const pedidos = [];

let precioMaximoActivo = null;

const formulario = document.querySelector("#formPedido");
const inputProducto = document.querySelector("#inputProducto");
const inputPrecio = document.querySelector("#inputPrecio");
const inputCantidad = document.querySelector("#inputCantidad");
const inputPrecioMaximo = document.querySelector("#inputPrecioMaximo");
const cuerpoTabla = document.querySelector("#cuerpoTabla");
const spanTotalUnidades = document.querySelector("#totalUnidades");
const spanMontoTotal = document.querySelector("#montoTotal");

const crearPedido = (producto, precio, cantidad) => ({ producto, precio, cantidad });

const calcularSubtotal = (pedido) => pedido.precio * pedido.cantidad;

const formatearDinero = (valor) => `$${valor.toFixed(2)}`;

const filtrarPorPrecioMaximo = (lista, maximo) =>
  lista.filter((pedido) => pedido.precio <= maximo);

const calcularTotalUnidades = (lista) =>
  lista.reduce((acumulado, pedido) => acumulado + pedido.cantidad, 0);

const calcularMontoTotal = (lista) =>
  lista.reduce((acumulado, pedido) => acumulado + calcularSubtotal(pedido), 0);

const obtenerPedidosVisibles = () =>
  precioMaximoActivo === null
    ? pedidos
    : filtrarPorPrecioMaximo(pedidos, precioMaximoActivo);


const validarPedido = (producto, precioTexto, cantidadTexto) => {
  const errores = {};
  const precio = Number(precioTexto);
  const cantidad = Number(cantidadTexto);

  if (producto.trim() === "") {
    errores.producto = "El nombre del producto no puede estar vacío.";
  }
  if (precioTexto.trim() === "" || !Number.isFinite(precio) || precio <= 0) {
    errores.precio = "El precio debe ser un número mayor que cero.";
  }
  if (cantidadTexto.trim() === "" || !Number.isInteger(cantidad) || cantidad <= 0) {
    errores.cantidad = "La cantidad debe ser un número entero positivo.";
  }
  return errores;
};

const crearCelda = (texto, claseExtra = "") => {
  const celda = document.createElement("td");
  celda.textContent = texto; 
  if (claseExtra) celda.className = claseExtra;
  return celda;
};

const crearFila = (pedido) => {
  const fila = document.createElement("tr");
  fila.append(
    crearCelda(pedido.producto),
    crearCelda(formatearDinero(pedido.precio), "text-end"),
    crearCelda(pedido.cantidad, "text-end"),
    crearCelda(formatearDinero(calcularSubtotal(pedido)), "text-end")
  );
  return fila;
};

const crearFilaVacia = () => {
  const fila = document.createElement("tr");
  const celda = crearCelda("No hay pedidos para mostrar.", "text-center text-muted");
  celda.colSpan = 4;
  fila.append(celda);
  return fila;
};

const mostrarTabla = (lista) => {
  const filas = lista.length > 0 ? lista.map(crearFila) : [crearFilaVacia()];
  cuerpoTabla.replaceChildren(...filas);
};

const mostrarIndicadores = (lista) => {
  spanTotalUnidades.textContent = calcularTotalUnidades(lista);
  spanMontoTotal.textContent = formatearDinero(calcularMontoTotal(lista));
};

const actualizarVista = () => {
  const visibles = obtenerPedidosVisibles();
  mostrarTabla(visibles);
  mostrarIndicadores(visibles);
};

const mostrarErrorCampo = (input, idMensaje, mensaje) => {
  const contenedorMensaje = document.querySelector(idMensaje);
  input.classList.toggle("is-invalid", Boolean(mensaje));
  contenedorMensaje.textContent = mensaje || "";
};

const agregarPedido = (evento) => {
  evento.preventDefault();

  const errores = validarPedido(
    inputProducto.value,
    inputPrecio.value,
    inputCantidad.value
  );

  mostrarErrorCampo(inputProducto, "#errorProducto", errores.producto);
  mostrarErrorCampo(inputPrecio, "#errorPrecio", errores.precio);
  mostrarErrorCampo(inputCantidad, "#errorCantidad", errores.cantidad);

  if (Object.keys(errores).length > 0) return; 

  pedidos.push(
    crearPedido(
      inputProducto.value.trim(),
      Number(inputPrecio.value),
      Number(inputCantidad.value)
    )
  );

  formulario.reset();
  inputProducto.focus();
  actualizarVista();
};

const filtrarProductos = () => {
  const texto = inputPrecioMaximo.value;
  const maximo = Number(texto);

  if (texto.trim() === "" || !Number.isFinite(maximo) || maximo < 0) {
    mostrarErrorCampo(inputPrecioMaximo, "#errorPrecioMaximo", "Ingresa un precio máximo válido (0 o mayor).");
    return;
  }

  mostrarErrorCampo(inputPrecioMaximo, "#errorPrecioMaximo", "");
  precioMaximoActivo = maximo;
  actualizarVista();
};

const mostrarTodos = () => {
  precioMaximoActivo = null;
  inputPrecioMaximo.value = "";
  mostrarErrorCampo(inputPrecioMaximo, "#errorPrecioMaximo", "");
  actualizarVista();
};

const limpiarPedidos = () => {
  pedidos.length = 0; 
  actualizarVista();
};

formulario.addEventListener("submit", agregarPedido);
document.querySelector("#btnFiltrar").addEventListener("click", filtrarProductos);
document.querySelector("#btnMostrarTodos").addEventListener("click", mostrarTodos);
document.querySelector("#btnLimpiar").addEventListener("click", limpiarPedidos);

actualizarVista();
