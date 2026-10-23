//Generamos un numero aleatorio que se encuentre en el rango del 1 al 25
const numeroAleatorio = Math.floor(Math.random() * 25) + 1;
// Creamos una constante que permite identificar el maximo de intentos
const numeroIntentos = 3;
// Guardara el numero de intentos que realiza el usuario
let intentos = 1;
function generarNumeroAleatorio() {
  //Definimos una variable para impresion de mensajes
  let mensaje;
  // Utilizamos el dom para acceder al parrafo creado
  const parrafo = document.querySelector("#idParrafo");

  // Verificamos en que intento esta el usuario
  if (intentos <= numeroIntentos) {
    let entrada = prompt(
      "¿Que número se ha generado (Intento " + intentos + ")?"
    );

    // EJERCICIO 1:
    let numero = Number(entrada);

    // EJERCICIO 1:
    if (entrada === null || entrada.trim() === "" || Number.isNaN(numero)) {
      parrafo.innerHTML = `Debe ingresar un número válido. Intento ${intentos} de ${numeroIntentos}.`;
      return;
    }

    //verificamos el numero aleatorio con el ingresado por el usuario
    if (numero === numeroAleatorio) {
      mensaje = `¡Es sorprente, pudiste adivinar el numero oculto (${numeroAleatorio}).
        Refresque la página para volver a jugar.`;
    } else if (intentos == numeroIntentos) {
      // Ultimo intento fallido: ya se revela el numero oculto
      mensaje = `Su numero de intentos ha terminado.
          El numero oculto era: ${numeroAleatorio}. Refresque la página para volver a jugar.`;
    } else {
      // EJERCICIO 1 (cambio): pista de "mas alto" o "mas bajo".
      // Si lo que escribio el usuario es menor que el oculto, el oculto es mas alto.
      let pista = numero < numeroAleatorio ? "más alto" : "más bajo";
      mensaje = `Vuelve a intentar. El número que buscas es ${pista} que ${numero}.
        Quedan ${numeroIntentos - intentos} intentos`;
    }

    //aumentamos el valor de los intentos
    intentos++;
  } else {
    mensaje = `Su numero de intentos ha terminado.
      El numero oculto era: ${numeroAleatorio}. Refresque la página para volver a jugar.`;
  }

  parrafo.innerHTML = mensaje;
}
