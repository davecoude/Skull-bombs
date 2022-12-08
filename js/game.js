const canvas = document.querySelector('#game');
const tablero = canvas.getContext('2d'); //eje x,y

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

    const mapa = maps[0]; // devuelve string
    const filasMapa = mapa.trim().split('\n'); //['IXXXX','IXXXX','IXXXX',7 más..]
    const mapaLimpio = filasMapa.map( filas => filas.trim().split('')); //array de cada caracter del maps en filas


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


function tecFisico(event) {
    console.log({event});

    if (event.key == 'ArrowUp') moverArriba();
    if (event.key == 'ArrowLeft') moverIzquierda();
    if (event.key == 'ArrowRight') moverDerecha();
    if (event.key == 'ArrowDown') moverAbajo();
}

function moverJugador() {
    const colicionRegaloX = posicionJugador.x.toFixed(2) == posicionRegalo.x.toFixed(2);
    const colicionRegaloY = posicionJugador.y.toFixed(2) == posicionRegalo.y.toFixed(2);
    const colicion = colicionRegaloX && colicionRegaloY;

    if (colicion) {
        console.log('pasaste de nivel');
    }

    const colicionEnemigo = posicionEnemigo.find( enemigo => {
        const colicionEnemigoX = enemigo.x.toFixed(2) == posicionJugador.x.toFixed(2);
        const colicionEnemigoY = enemigo.y.toFixed(2) == posicionJugador.y.toFixed(2);
        return colicionEnemigoX && colicionEnemigoY;
    });

    if (colicionEnemigo) {
        console.log('Chocaste con el enemigo, pierdes una vida.');
    }


    //remderiza la posicion del jugador segun movimientos
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
