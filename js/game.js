const canvas = document.querySelector('#game');
const tablero = canvas.getContext('2d'); //eje x,y

//vidas
const corazones = document.querySelector('#corazones');
//tiempo
const cronometro = document.querySelector('#tiempo');

//Teclas digitales
const tecArriba = document.querySelector('#up');
const tecIzquierda = document.querySelector('#left');
const tecDerecha = document.querySelector('#right');
const tecAbajo = document.querySelector('#down');

//teclado fisico y digital (events)
window.addEventListener('keydown',tecFisico);
tecArriba.addEventListener('click', moverArriba);
tecIzquierda.addEventListener('click', moverIzquierda);
tecDerecha.addEventListener('click', moverDerecha);
tecAbajo.addEventListener('click', moverAbajo);

let canvasSize;
let itemsSize;
let nivel = 0;
let vidas = 3;

//tiempo
let tiempoInicio;
let tiempoJugador;
let intervalo;

const posicionJugador = {
    x: undefined,
    y: undefined,
};
//coliciones
const posicionRegalo = {
    x: undefined,
    y: undefined,
}

let posicionEnemigo = [];

window.addEventListener('load', resizeScreenGame);
window.addEventListener('resize', resizeScreenGame); //ajustar pantalla al juego

function resizeScreenGame() {

    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    itemsSize = canvasSize / 10;

    // comenzar juego despues del resize de la pantalla
    startGame();
}

function startGame() {

    tablero.font = (itemsSize - 10) + 'px Calistoga';
    tablero.textAlign = 'end';

    /*
    limpiar array maps de espacios .trim()
    y dividir sus elementos .split()
    */

    const mapa = maps[nivel]; // devuelve string
    //si no hay niveles termina la ejecucion del juego
    if (!mapa) {
        juegoGanado();
        return;
    }

    //definimos un valor a tiempo si no lo tiene
    if (!tiempoInicio) {
        tiempoInicio = Date.now();
        intervalo = setInterval(mostrarTiempo,100);
    }

    const filasMapa = mapa.trim().split('\n'); //['IXXXX','IXXXX','IXXXX',7 más..]
    const mapaLimpio = filasMapa.map( filas => filas.trim().split('')); //array de cada caracter del maps en filas

    // vidas jugador
    vidasJugador();


    /*
    Render:
    insertar emojis correspondientes
    al mapa según su posición en nivel.
    */

    tablero.clearRect(0,0, canvasSize, canvasSize);
    posicionEnemigo = [];

    mapaLimpio.forEach((fila, filaIndex) => {
        fila.forEach((columna, columnaIndex) => {
            // variable de emoji
            const emoji = emojis[columna];

            //posiciones
            const posX = itemsSize * (columnaIndex + 1);
            const posY = itemsSize * (filaIndex + 1);

            //render mapa
            tablero.fillText(emoji, posX, posY)

            //posicionar jugador
            if (columna == 'O') {
                if (!posicionJugador.x && !posicionJugador.y) {
                    posicionJugador.x = posX;
                    posicionJugador.y = posY;
                }
            } else if(columna == 'I') {
                posicionRegalo.x = posX;
                posicionRegalo.y = posY;
            } else if(columna == 'X') {
                posicionEnemigo.push({
                    x: posX,
                    y: posY,
                })
            }
        });
    });

    moverJugador();
}

function vidasJugador() {
    const ArrayCorazones = Array(vidas).fill(emojis['HEART']); //[1,2,3]

    corazones.innerHTML = "";
    ArrayCorazones.forEach(corazon => corazones.append(corazon));
}

function mostrarTiempo() {
    cronometro.innerHTML = Date.now() - tiempoInicio;
}

function tecFisico(event) {
    console.log({event});

    if (event.key == 'ArrowUp') moverArriba();
    if (event.key == 'ArrowLeft') moverIzquierda();
    if (event.key == 'ArrowRight') moverDerecha();
    if (event.key == 'ArrowDown') moverAbajo();
}

function siguienteNivel() {
    console.log('Pasaste de nivel, felicidades!');
    nivel++;
    startGame();
}

function nivelPerdido() {
    console.log('Chocaste con el enemigo, pierdes una vida.');
    vidas--;
    console.log(vidas);

    if (vidas <= 0) {
        nivel = 0;
        vidas = 3;
        tiempoInicio = undefined;
    }
    posicionJugador.x = undefined;
    posicionJugador.y = undefined;
    startGame();
}

function juegoGanado() {
    console.log('Juego pasado!!!');
    clearInterval(intervalo);
}

function moverJugador() {
    const colicionRegaloX = posicionJugador.x.toFixed(2) == posicionRegalo.x.toFixed(2);
    const colicionRegaloY = posicionJugador.y.toFixed(2) == posicionRegalo.y.toFixed(2);
    const colicion = colicionRegaloX && colicionRegaloY;

    if (colicion) {
        siguienteNivel();
    }

    const colicionEnemigo = posicionEnemigo.find( enemigo => {
        const colicionEnemigoX = enemigo.x.toFixed(2) == posicionJugador.x.toFixed(2);
        const colicionEnemigoY = enemigo.y.toFixed(2) == posicionJugador.y.toFixed(2);
        return colicionEnemigoX && colicionEnemigoY;
    });

    if (colicionEnemigo) {
        nivelPerdido();
    }


    //renderiza la posicion del jugador segun movimientos
    tablero.fillText(emojis['PLAYER'], posicionJugador.x, posicionJugador.y);
}

function moverArriba() {
    console.log('me muevo arriba');

    //limites del canvas
    if ((posicionJugador.y - itemsSize) < 40) {
        console.log('out of canvas');
    } else {
        posicionJugador.y -= itemsSize;
        startGame();
    }
    
}
function moverIzquierda() {
    console.log('me muevo izquierda');

    //limites del canvas
    if ((posicionJugador.x - itemsSize) < 40) {
        console.log('out of canvas');
    }else {
        posicionJugador.x -= itemsSize;
        startGame();
    }
}
function moverDerecha() {
    console.log('me muevo derecha');

    // limites del canvas
    if((posicionJugador.x + itemsSize) > canvasSize) {
        console.log('out of canvas');
    }else {
        posicionJugador.x += itemsSize;
        startGame();
    }
}
function moverAbajo() {
    console.log('me muevo abajo');

    //limites del canvas
    if ((posicionJugador.y + itemsSize) > canvasSize) {
        console.log('our of canvas');
    } else {
        posicionJugador.y += itemsSize;
        startGame();
    }
}
