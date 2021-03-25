'use strict'

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function startTimer() {
    gInterval = setInterval(function () {
        gGame.secsPassed = gGame.secsPassed + 11;
        elTimer.innerHTML = Math.floor(gGame.secsPassed / 1000);
    }, 10)
}


function hard(){
    gLevel = {
        SIZE: 12,
        MINES: 30
    }
    init()
}

function medium(){
    gLevel = {
        SIZE: 8,
        MINES: 12
    }
    init()
}

function easy(){
    gLevel = {
        SIZE: 4,
        MINES: 2
    }
    init()
}

