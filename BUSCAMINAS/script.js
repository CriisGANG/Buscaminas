let filas = 7; // definir filas predeterminado
let columnas = 7; // definir columnas predeterminado
let lado = 30; // tamaño de las celdas px
let marcas = 0; // contador de banderas
let minas = Math.ceil(filas * columnas * 0.1); // calcular es total de minas que hi ha de haver dependiendo de ses columnes i ses columnas math.ceil redondea i es fa el 10% de minas predeterminadament
let tablero = []; //representa estado des joc
let enJuego = true; //controlar s'estado del juego
let juegoIniciado = false; //controlar s'estado del juego
let cantidadmonedas = 0; //monedas iniciales
let temaSeleccionado = 'Militar'; // tema por defecto

nuevoJuego();

function nuevoJuego() {
  reiniciarVariables(); //Reiniciar variables des joc
  generarTableroHTML(); //Gernera la estructura visual de la matriz
  generarTableroJuego(); //Generar las minas y los numeros para que sean descubiertos
  añadirEventos(); //se añaden los eventos de mouse para las celdas
  refrescarTablero(); //Se encarga del comportamiento logic para mostrar los elementos
  cambiarTema(); // Estableix el tema visual anteriorment selecionat
}

function cambiarTema(tema) {
  const body = document.body; // agafa body de html
  const tableroHTML = document.getElementById("tablero");

  temaSeleccionado = tema || temaSeleccionado; // Actualiza el tema seleccionado

  switch (temaSeleccionado) {
    case 'Militar':
      body.style.background = '#4a5b3d';
      tableroHTML.style.background = '#4a5b3d';
      break;
    case 'Diamante':
      body.style.background = '#a8ffff';
      tableroHTML.style.background = '#22d8c7';
      break;
    case 'Moneda':
      body.style.background = '#feff9b';
      tableroHTML.style.background = '#99a800';
      break;
    
  }

  return tableroHTML.style.background; // si posam nueva partida no canvia es tema
}

cambiarTema();

const ajustesBtn = document.getElementById("ajustes-btn");
const ajustesContainer = document.getElementById("ajustes-container");
const dificultadInput = document.getElementById("dificultad");
const filasInput = document.getElementById("filas");
const columnasInput = document.getElementById("columnas");
const establecerBtn = document.getElementById("establecer-btn");
const cancelarBtn = document.getElementById("cancelar-btn"); //enlazar html amb es js, qua quan se pitji cancelar-btn se guardi a sa const cancelarBtn

  ajustesBtn.addEventListener("click", function() { //eventos de quan fasis click alternar es mostrar en aquest cas es contenedor
    ajustesContainer.classList.toggle("mostrar");
  });
  establecerBtn.addEventListener("click", function() {
    filas = parseInt(filasInput.value);
    columnas = parseInt(columnasInput.value);
    minas = Math.floor(columnas * filas * dificultadInput.value / 100);
    nuevoJuego();
    ajustesContainer.classList.remove("mostrar");
  });
  cancelarBtn.addEventListener("click", function() {
    ajustesContainer.classList.remove("mostrar"); //quan pitjis cancelar que se tanqui es contendor
  });

function activarBotonEspecial() {
 
  if (cantidadmonedas >= 10) { //Verificar si el jugador tiene al menos 10 monedas
    mostrarMinas();// Cambiar el estilo de las celdas que contienen minas
    cantidadmonedas -= 10;// Restar 10 monedas al contador
    document.getElementById('cantidad-monedas').textContent = cantidadmonedas;// Actualizar el contador de monedas en la interfaz
  } else {
    alert("No tienes suficientes monedas para usar esta función especial.");
  }
}

function mostrarMinas() {
  // Contador para llevar la cuenta de las minas reveladas
  let minasReveladas = 0;

  // Recorrer todo el tablero y cambiar el estilo de las celdas que contienen minas
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      if (tablero[c][f].valor == -1 && minasReveladas < 2) { // quan trobi en el tablero 1 mina es a dir un valor igual -1 i si encara no se han revelat ses dues minas pues cambia es color de fondo de esa celda a rojo
        let celda = document.getElementById(`celda-${c}-${f}`); // actualitza per cambiar el color 
        celda.style.backgroundColor = "red"; // Cambiar el color de fondo de la celda que contiene una mina
        minasReveladas++; //sumar 1 mina revelada
      }
    }
    // Si ya hemos revelado las dos minas, salimos del bucle
    if (minasReveladas >= 2) {
      break;
    }
  }
}

function reiniciarVariables() {
  marcas = 0;
  enJuego = true;
  juegoIniciado = false;
}

function generarTableroHTML() {
  let html = "";
  for (let f = 0; f < filas; f++) { // va fila per fila fins que el valor sigui menor a res numero de files asignades les cuals podem cabiar
    html += `<tr>`;
    for (let c = 0; c < columnas; c++) {
      html += `<td id="celda-${c}-${f}" style="width:${lado}px;height:${lado}px"></td>`;
    }
    html += `</tr>`;
  }
  let tableroHTML = document.getElementById("tablero"); // ho actualizam
  tableroHTML.innerHTML = html;
  tableroHTML.style.width = columnas * lado + "px";
  tableroHTML.style.height = filas * lado + "px";
  cambiarTema(temaSeleccionado); //posar el tema que tenim selecionat
}

function añadirEventos() {
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      let celda = document.getElementById(`celda-${c}-${f}`);
      celda.addEventListener("mouseup", function(me) {
        clicSimple(celda, c, f, me);
      });
    }
  }
}

function clicSimple(celda, c, f, me) {
  if (!enJuego) {
    return; //El juego ha finalizado
  }
  if (tablero[c][f].estado == "descubierto") {
    return; //Las celdas descubiertas no pueden ser redescubiertas o marcadas
  }
  switch (me.button) {
    case 0: //0 es el código para el clic izquierdo
      if (tablero[c][f].estado == "marcado") { //la celda está protegida
        break;
      }
      while (!juegoIniciado && tablero[c][f].valor == -1) { //Si el juego aún no ha iniciado y la celda es una mina (tablero[c][f].valor == -1), se genera un nuevo tablero (para evitar que el jugador haga clic en una mina en el primer intento).
        generarTableroJuego();
      }
      tablero[c][f].estado = "descubierto";
      juegoIniciado = true; //aquí se avisa que el jugador ha descubierto más de 1 celda por ello el joc ha començat
      if (tablero[c][f].valor == 0) {
        abrirArea(c, f);
      }
      break;
    case 1: //1 es el código para el clic medio o scroll
      break;
    case 2: //2 es el código para el clic derecho
      if (tablero[c][f].estado == "marcado") {
        tablero[c][f].estado = undefined;
        marcas--;
      } else {
        tablero[c][f].estado = "marcado";
        marcas++;
      }
      break;
    default:
      break;
  }
  refrescarTablero();
}

function abrirArea(c, f) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i == 0 && j == 0) {
        continue;
      }
      try { //Hay que cuidarse de las posiciones negativas
        if (tablero[c + i][f + j].estado != "descubierto") {
          if (tablero[c + i][f + j].estado != "marcado") {
            tablero[c + i][f + j].estado = "descubierto"; //aquí es donde se abren las celdas circundantes
            if (tablero[c + i][f + j].valor == 0) { //si la celda que se abre es otro 0, se le pasa la responsabilidad
              abrirArea(c + i, f + j);
            }
          }
        }
      } catch (e) {}
    }
  }
}

function refrescarTablero() {
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      let celda = document.getElementById(`celda-${c}-${f}`);
      let estado = tablero[c][f].estado;

      if (estado === "descubierto") {
        switch (tablero[c][f].valor) {
          case -1:
            celda.innerHTML = `<img src="bomba.svg" alt="Bomba">`;
            celda.style.color = "black";
            celda.style.background = "white";
            break;
          case 0:
            break;
          default:
            celda.innerHTML = tablero[c][f].valor;
            // Asignar colores según el valor de la celda
            celda.style.color = getColorPorValor(tablero[c][f].valor);
            break;
        }
        celda.style.boxShadow = "none";
      } else if (estado === "marcado") {
        celda.innerHTML = `<img src="flag.svg" alt="Bomba">`;
        celda.style.background = "cadetblue";
      } else {
        celda.innerHTML = "";
        celda.style.background = "";
      }
    }
  }
  verificarGanador();
  verificarPerdedor();
  actualizarPanelMinas();
}

function getColorPorValor(valor) {
  switch (valor) {
    case 1:
      return "black";
    case 2:
      return "yellow";
    case 3:
      return "red";
    case 4:
      return "#FF9900";
    case 5:
      return "#57623F";
    case 6:
      return "#730F00";

    default:
      return "black";
  }
}

function actualizarPanelMinas() {
  let panel = document.getElementById("minas");
  panel.innerHTML = minas - marcas;
}

function verificarGanador() {
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      if (tablero[c][f].estado != `descubierto`) { //Si la mina está cubeirta
        if (tablero[c][f].valor == -1) { //y es una mina
          continue;
        } else {
          return;
        }
      }
    }
  }
  let tableroHTML = document.getElementById("tablero");
  tableroHTML.style.background = "green";
  enJuego = false;
  // Después de ganar una partida, aumenta la cantidad de monedas y actualiza la interfaz
  cantidadmonedas += 15;
  document.getElementById('cantidad-monedas').textContent = cantidadmonedas;
}

function verificarPerdedor() {
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      if (tablero[c][f].valor == -1) {
        if (tablero[c][f].estado == `descubierto`) {
          let tableroHTML = document.getElementById("tablero");
          tableroHTML.style.background = "red";
          tableroHTML.classList.add('shake');
          setTimeout(() => {
            tableroHTML.classList.remove('shake'); 
          }, 400);
          enJuego = false;

          let bombSound = document.getElementById("bombSound");
          bombSound.play();
        }
      }
    }
  }
  if (enJuego) {
    return;
  }
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      if (tablero[c][f].valor == -1) {
        let celda = document.getElementById(`celda-${c}-${f}`);
        celda.innerHTML = `<img src="bomba.svg" alt="Bomba">`;
        celda.style.color = "black";
      }
    }
  }
  if (cantidadmonedas > 0) {
    cantidadmonedas -= 5;
    document.getElementById('cantidad-monedas').textContent = cantidadmonedas;
  }
}

function generarTableroJuego() {
  vaciarTablero(); //para que no hayan interferencias con posibles partidas pasadas
  ponerMinas(); //representadas númericamente con el número -1
  contadoresMinas(); //son los números que dan pistas de las minas
}

function vaciarTablero() {
  tablero = [];
  for (let c = 0; c < columnas; c++) {
    tablero.push([]);
  }
}

function ponerMinas() {
  for (let i = 0; i < minas; i++) {
    let c;
    let f;

    do {
      c = Math.floor(Math.random() * columnas); //Genera una columna aleatoria en el tablero
      f = Math.floor(Math.random() * filas); //Genera una fila aleatoria en el tablero
    } while (tablero[c][f]); //Se encarga de verificar que en la celda no haya una mina

    tablero[c][f] = {
      valor: -1
    }; //Se inserta la mina en la celda disponible
  }
}

function contadoresMinas() {
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      if (!tablero[c][f]) {
        let contador = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) {
              continue;
            }
            try { //hay que evitar errores con las posiciones negativas
              if (tablero[c + i][f + j].valor == -1) {
                contador++;
              }
            } catch (e) {}
          }
        }
        tablero[c][f] = {
          valor: contador
        };
      }
    }
  }

}