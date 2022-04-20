function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min); 
}

function searchNeighbors(i, j) {
    let r = 0;
    const top = 0;
    const bottom = numberOfRow - 1;
    const left = 0;
    const right = numberOfCol - 1;
    if (i - 1 >= top) {
        if (boardState[i - 1][j] == -1) r++;
        if (j - 1 >= left) {
            if (boardState[i - 1][j - 1] == -1) r++;
        }
        if (j + 1 <= right) {
            if (boardState[i - 1][j + 1] == -1) r++;
        }
    }
    if (i + 1 <= bottom) {
        if (boardState[i + 1][j] == -1) r++;
        if (j - 1 >= left) {
            if (boardState[i + 1][j - 1] == -1) r++;
        }
        if (j + 1 <= right) {
            if (boardState[i + 1][j + 1] == -1) r++;
        }
    } 
    if (j - 1 >= left) {
        if (boardState[i][j - 1] == -1) r++;
    }
    if (j + 1 <= right) {
        if (boardState[i][j + 1] == -1) r++;
    }
    return r;
}

function setBombs() {
    // -2: TBD
    // -1: a bomb is in the block
    // 0 to 8: number of bombs surrounding the block

    // choose random blocks to place bombs
    const radomNumbers = new Set();
    while (radomNumbers.size < numberOfBombs) {
        let randomNumber = getRndInteger(1, numberOfRow * numberOfCol);
        if (!radomNumbers.has(randomNumber)) radomNumbers.add(randomNumber);
    }

    // place the bombs
    for (let i = 0; i < numberOfRow; i++) {
        const tmp = [];
        for (let j = 0; j < numberOfCol; j++) {
            if (radomNumbers.has(i * numberOfCol + j + 1)) tmp.push(-1);
            if (!radomNumbers.has(i * numberOfCol + j + 1)) tmp.push(-2);
        }
        boardState.push(tmp);
    }

    // calculate how many bombs surrounding blocks with no bomb
    for (let i = 0; i < numberOfRow; i++) {
        for (let j = 0; j < numberOfCol; j++) {
            if (boardState[i][j] == -2) boardState[i][j] = searchNeighbors(i, j);
        }
    }
}

function initializeBoard() {
    for (let i = 0; i < numberOfRow; i++) {
        const tmp = [];
        for (let j = 0; j < numberOfCol; j++) tmp.push("&nbsp;");
        board.push(tmp);
    }
}

function printBoard() {
    let boardHTML = "";
    for (let i = 0; i < numberOfRow; i++) {
        boardHTML += "<tr>";
        for (let j = 0; j < numberOfCol; j++) {
            if (board[i][j] == "&nbsp;") boardHTML += "<td>" + board[i][j] + "</td>";
            if (board[i][j] != "&nbsp;") boardHTML += "<td class='clicked'>" + board[i][j] + "</td>";
        }
        boardHTML += "</tr>"
    }
    document.getElementById("board").innerHTML = boardHTML;
}

const numberOfRow = 16;
const numberOfCol = 16;
const numberOfBombs = 8;
const board = []; // displayed to player
const boardState = []; // hidden from player

setBombs();
initializeBoard();
printBoard();