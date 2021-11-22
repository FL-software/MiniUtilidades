const turnOn = document.getElementById ('turnOn');
const turnOff = document.getElementById ('turnOff');
const lamp = document.getElementById ('lamp');

function isLampBroken () {
    return lamp.src.indexOf ('quebrada') > 1
}

function lampOnOff () {
    if (!isLampBroken () ) {
        if (!isLampOff () ) {
           lamp.src = '../img/desligada.jpg'; 
        }
        else {
            lamp.src = '../img/ligada.jpg';
        }
    
    }
}

function lampOff () {
    if (!isLampBroken () ) {
    lamp.src = '../img/desligada.jpg';
    }
}

function lampOn () {
    if (!isLampBroken () ) {
    lamp.src = '../img/ligada.jpg';
    }
}

function lampBroken () {
    lamp.src = '../img/quebrada.jpg';
}

function isLampOff () {
    return lamp.src.indexOf ('desligada') > 1
}

turnOnOff.addEventListener ('click', lampOnOff);
turnOn.addEventListener ('click', lampOn);
turnOff.addEventListener ('click', lampOff);
lamp.addEventListener ('mouseover', lampOn);
lamp.addEventListener ('mouseleave', lampOff);
lamp.addEventListener ('click', lampBroken);
