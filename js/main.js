'use strict'
var cellSound = new Audio('sound/click.wav');
var mineSound = new Audio('sound/wrong.wav');
var markSound = new Audio('sound/mark.wav');

var gBoard;
var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

var gLives = 3;
var elTimer = document.querySelector('.timer');
var gInterval;
var mines = [];

function init() {
    gLives = 3;
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    clearInterval(gInterval);
    gGame.secsPassed = 0;
    elTimer.innerHTML = '0';
    mines = []
    gBoard = buildBoard();
    document.querySelector('p span').innerText = gLives
    var elImg = document.querySelector('.smiley')
    elImg.innerHTML = '<img src="./img/smile.png" alt="" />'
    setMinesNegsCount(gBoard);
    renderBoard(gBoard);
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {  // object inside cell
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                i,
                j
            };
            board[i][j] = cell;
        }
    }
    setRandomMines(board)
    return board;
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            var className = 'cell';
            var tdId = `cell-${i}-${j}`;
            if (cell.isShown) className += ' shown'
            if (cell.isMarked) className += ' marked'
            if (cell.isMine) className += ' mine'
            if (cell.isMine && cell.isShown) {
                className += ' show-mine'
            }
            strHtml += `<td id="${tdId}" class="${className}" onclick="cellClicked(this, ${i}, ${j})" 
            oncontextmenu="markCell(this,${i},${j});return false">
            ${gBoard[i][j].minesAroundCount}</td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}

function markCell(elCell, i, j) {
    var cell = gBoard[i][j];
    if (!gGame.isOn) return;
    if (cell.isShown) return;
    if (cell.isMarked) {
        gGame.markedCount--
        elCell.classList.remove('marked');
        cell.isMarked = false
    } else {
        elCell.classList.add('marked');
        cell.isMarked = true
        markSound.play()
    }
    if (cell.isMine && cell.isMarked) gGame.markedCount++
    checkWin()
}

function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    if (!gGame.isOn) return;
    if (gGame.isOn) {
        clearInterval(gInterval);
        startTimer()
    }
    if (elCell.classList.contains('marked')) return;
    if (elCell.classList.contains('mine')) { // game over after 3 steps on a mine
        mineSound.play()
        gLives--
        document.querySelector('p span').innerText = gLives
        checkGameOver()
        cell.isShown = true;
        renderBoard(gBoard);
    }
    if (!cell.isShown && !cell.isMine && !cell.isMarked) {   // show cells after click
        cellSound.play()
        cell.isShown = true;
        elCell.classList.add('shown');
        gGame.shownCount++
        expandShown(gBoard, elCell, { i, j })
    }
    checkWin()
    renderBoard(gBoard);
}


function setMinesNegsCount(gBoard) {
    var count = 0
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) { //running on the entire board to count negs
            var currCell = gBoard[i][j]
            if (currCell.isMine === true) continue
            if (currCell.isMine === false) { // if its not a mine - count negs and update DOM
                countNegs(currCell)
                count++
            }
        }
    }
}


function countNegs(cell) { //count mines around cell and add to DOM
    var count = 0
    for (var i = cell.i - 1; i <= cell.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cell.j - 1; j <= cell.j + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === cell.i && j === cell.j) continue
            var currCell = gBoard[i][j]
            if (currCell.isMine) count++
        }
    }
    cell.minesAroundCount = count
    if (count === 0) cell.minesAroundCount = '' // empty cell if no negs
}


function expandShown(gBoard, elCell, pos) { // expand negs if not a mine
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue
            if (i === pos.i && j === pos.j) continue
            var cell = gBoard[i][j]
            if (cell.isShown) continue;
            if (cell.isMarked) continue;
            if (!cell.isMine && !cell.isMarked) {
                cell.isShown = true;
                elCell.classList.add('shown');
                gGame.shownCount++
                checkWin()
            }
        }
    }
}

function checkGameOver() {
    if (gLives === 0) {
        gGame.isOn = false
        clearInterval(gInterval);
        gGame.secsPassed = 0;
        var elImg = document.querySelector('.smiley')
        elImg.innerHTML = '<img src="./img/lose.png" alt="lose" />'
    }

}

function checkWin() {
    if (gGame.markedCount > gLevel.MINES) return;
    if ((gGame.markedCount === gLevel.MINES) || (gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES))) {
        gGame.isOn = false
        clearInterval(gInterval);
        gGame.secsPassed = 0;
        var elImg = document.querySelector('.smiley')
        elImg.innerHTML = '<img src="./img/win.png" alt="win" />'
    }
}

function setRandomMines(board) {
    var numOfMines = gLevel.MINES
    var count = 0
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) { //running on the entire board 
            var currCell = board[getRandomInt(0, gLevel.SIZE - 1)][getRandomInt(0, gLevel.SIZE - 1)]
            if (count === numOfMines) break;
            if (currCell.isMine === true) continue
            if (currCell.isMine === false) {
                currCell.isMine = true
                count++
                mines.push(currCell)
            }
        }
    }
}