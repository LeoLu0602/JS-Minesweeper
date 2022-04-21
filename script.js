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
    for (let i = 0; i < numberOfRow; i++) {
        const tmp = [];
        for (let j = 0; j < numberOfCol; j++) tmp.push(false);
        clickedOrNot.push(tmp);
    }
}

function printBoard() {
    let boardHTML = "";
    for (let i = 0; i < numberOfRow; i++) {
        boardHTML += "<tr>";
        for (let j = 0; j < numberOfCol; j++) {
            if (board[i][j] == "&nbsp;") boardHTML += "<td onclick='handleClick(this)'" + "id=" + (i * numberOfRow + j + 1).toString() + ">" + board[i][j] + "</td>";
            if (board[i][j] != "&nbsp;") boardHTML += "<td class='clicked'>" + board[i][j] + "</td>";
        }
        boardHTML += "</tr>"
    }
    document.getElementById("board").innerHTML = boardHTML;
}

function click(i, j) {
    const top = 0;
    const bottom = numberOfRow - 1;
    const left = 0;
    const right = numberOfCol - 1;

    clickedOrNot[i][j] = true;
    if (boardState[i][j] == -1) {
        document.getElementById((i * numberOfRow + j + 1).toString()).style.backgroundColor = "purple";
        for (let ii = 0; ii < numberOfRow; i++) {
            for (let jj = 0; jj < numberOfCol; j++) {
                if (boardState[ii][jj] == -1) {
                    document.getElementById((i * numberOfRow + j + 1).toString()).style.backgroundColor = "purple";
                }
            }
        }
    }
    if (boardState[i][j] == 0) {
        document.getElementById((i * numberOfRow + j + 1).toString()).className = "clicked"; 
        if (i - 1 >= top) {
            if (!clickedOrNot[i - 1][j]) click(i - 1, j);
            if (j - 1 >= left && !clickedOrNot[i - 1][j - 1]) click(i - 1, j - 1);
            if (j + 1 <= right && !clickedOrNot[i - 1][j + 1]) click(i - 1, j + 1);
        }
        if (i + 1 <= bottom) {
            if (!clickedOrNot[i + 1][j]) click(i + 1, j);
            if (j - 1 >= left && !clickedOrNot[i + 1][j - 1]) click(i + 1, j - 1);
            if (j + 1 <= right && !clickedOrNot[i + 1][j + 1]) click(i + 1, j + 1);
        }
        if (j - 1 >= left) {
            if (!clickedOrNot[i][j - 1]) click(i, j - 1);
        }
        if (j + 1 <= right) {
            if (!clickedOrNot[i][j + 1]) click(i, j + 1);
        }
    }
    if (boardState[i][j] > 0) {
        let bombsNum;
        let numColor;
        document.getElementById((i * numberOfRow + j + 1).toString()).className = "clicked";
        if (boardState[i][j] == 1) {
            bombsNum = "1";
            numColor = "blue";
        }
        if (boardState[i][j] == 2) {
            bombsNum = "2";
            numColor = "green";
        }
        if (boardState[i][j] == 3) {
            bombsNum = "3";
            numColor = "red";
        }
        if (boardState[i][j] == 4) {
            bombsNum = "4";
            numColor = "blue";
        }
        if (boardState[i][j] == 5) {
            bombsNum = "5";
            numColor = "brown";
        }
        if (boardState[i][j] == 6) {
            bombsNum = "6";
            numColor = "lightseagreen";
        }
        if (boardState[i][j] == 7) {
            bombsNum = "7";
            numColor = "black";
        }
        if (boardState[i][j] == 8) {
            bombsNum = "8";
            numColor = "white";
        }
        document.getElementById((i * numberOfRow + j + 1).toString()).innerHTML = bombsNum;
        document.getElementById((i * numberOfRow + j + 1).toString()).style.color = numColor;
    }
}

function handleClick(x) {
    const j = (x.id - 1) % numberOfRow;
    const i = (x.id - j - 1) / numberOfRow;
    click(i, j);
}

function Game() {
    setBombs();
    initializeBoard();
    printBoard();
}

const numberOfRow = 16;
const numberOfCol = 16;
const numberOfBombs = 25;
const board = []; // displayed to player
const boardState = []; // hidden from player
const clickedOrNot = []; // hidden from player
const endGame = false;

Game();