'use strict'

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function startTimer() {
    gInterval = setInterval(function () {
        gCurrentTime = gCurrentTime + 11;
        elTimer.innerHTML = (gCurrentTime / 1000);
    }, 10)
}