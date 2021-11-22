const img = document.getElementById ('img');
const buttoms = document.getElementById ('buttons');
let colorIndex = 0;
let intervalId = null;

const trafficLight = ( event) => {
    stopAutomatic();
    turnOn[event.target.id]();

}

const nextIndex = () => colorIndex = colorIndex < 2 ? ++colorIndex : 0;

const nextIndexRandom = () => colorIndex = getRandomIntInclusive(0, 2);

const changeColor = () => {
    const colors = ['red', 'yellow', 'green']
    const color  = colors[colorIndex];
    turnOn[color]();
    nextIndex();
}

const stopAutomatic = () => {
    clearInterval (intervalId);
}

const turnOn = {
    'red': () => img.src = '../img/vermelho.png',
    'yellow': () => img.src = '../img/amarelo.png',
    'green': () => img.src = '../img/verde.png',
    'automatic': () => intervalId = setInterval(changeColor, 2000),
    'manual': () => changeColor()
}

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

buttoms.addEventListener('click', trafficLight);