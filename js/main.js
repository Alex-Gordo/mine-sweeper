'use strict'

var gBoard;
var gLevel = {
    SIZE: 8,
    MINES: 12
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}
var gGameIsOn = false
var gCurrentTime = 0;
var elTimer = document.querySelector('.timer');
var gInterval;
var mines = [];


function init() {
    gGameIsOn = true
    clearInterval(gInterval);
    gCurrentTime = 0;
    elTimer.innerHTML = '0.000';
    mines = []
    gBoard = buildBoard();
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

    console.table(board);
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
            if (cell.isShown) className += ' shown'
            if (cell.isMarked) className += ' marked'
            var tdId = `cell-${i}-${j}`;
            if (cell.isMine) {
                className += ' mine'
            }
            if (cell.isMine && cell.isShown) {
                className += ' show-mine'
            }
            strHtml += `<td id="${tdId}" class="${className}" onclick="cellClicked(this, ${i}, ${j})" 
            oncontextmenu="return false">
            ${gBoard[i][j].minesAroundCount}</td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}


function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    if (gGameIsOn) {
        gGameIsOn = false
        clearInterval(gInterval);
        // gCurrentTime = 0;
        startTimer()
    }
    
    if (elCell.classList.contains('mine')) { // game over after clicking a mine
        cell.isShown = true;
        elCell.classList.add('shown');
        elCell.classList.add('show-mine'); 
        checkGameOver()
    }

    if (!cell.isShown && !cell.isMine) {   // show cells after click
        cell.isShown = true;
        elCell.classList.add('shown');
        expandShown(gBoard, elCell, { i, j })
    }
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
}


function expandShown(gBoard, elCell, pos) { // expand negs if not a mine
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue
            if (i === pos.i && j === pos.j) continue
            var cell = gBoard[i][j]
            if (cell.isShown) continue;
            if (!cell.isMine) {
                cell.isShown = true;
                elCell.classList.add('shown');
            }
        }
    }
    //console.table(gBoard)
}

function checkGameOver() {
    gGameIsOn = false
    clearInterval(gInterval);
    gCurrentTime = 0;
    elTimer.innerHTML = '0.000';
    var elImg = document.querySelector('.smiley')
    elImg.src = ('./img/lose.png');
    console.log('You lose');
}


function setRandomMines(board) {
    var numOfMines = gLevel.MINES
    var count = 0
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) { //running on the entire board 
            var currCell = board[getRandomInt(0, gLevel.SIZE-1)][getRandomInt(0, gLevel.SIZE-1)]
            if (count === numOfMines) break;
            if (currCell.isMine === true) continue
            if (currCell.isMine === false) { 
                currCell.isMine = true
                count++
                mines.push(currCell)
                console.log(mines);
            }
        }
    }
}