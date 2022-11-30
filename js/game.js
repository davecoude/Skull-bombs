const canvas = document.querySelector('#game');
const tablero = canvas.getContext('2d'); //eje x,y

let canvasSize;
let itemsSize;

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

    mapaLimpio.forEach((fila, filaIndex) => {
        fila.forEach((columna, columnaIndex) => {
            // variable de emoji
            const emoji = emojis[columna];

            //posiciones
            const posX = itemsSize * (columnaIndex + 1);
            const posY = itemsSize * (filaIndex + 1);

            //render mapa
            tablero.fillText(emoji, posX, posY)
        });
    });
}
