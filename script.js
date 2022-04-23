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

    // clear memory of the previous game
    radomNumbers.clear(); 
    while (board.length) board.pop();
    while (boardState.length) boardState.pop();
    while (clickedOrNot.length) clickedOrNot.pop();
    while (flagList.length) flagList.pop();

    // choose random blocks to place bombs
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
            if (board[i][j] == "&nbsp;") boardHTML += "<td onclick='handleClick(this)' oncontextmenu='rightClick(this);return false;'" + "id=" + (i * numberOfCol + j + 1).toString() + ">" + board[i][j] + "</td>";
            if (board[i][j] != "&nbsp;") boardHTML += "<td class='clicked'>" + board[i][j] + "</td>";
        }
        boardHTML += "</tr>"
    }
    document.getElementById("board").innerHTML = boardHTML;
}

function rightClick(x) {
    const j = (x.id - 1) % numberOfCol;
    const i = (x.id - j - 1) / numberOfCol;
    const block = document.getElementById((i * numberOfCol + j + 1).toString());
    if (block.style.backgroundColor != "red" && !clickedOrNot[i][j]) {
        block.innerHTML = "!";
        block.style.backgroundColor = "red";
        block.style.color = "black";
        flagList.push(x.id);
        if (flagList.length == numberOfBombs) check();
    }
    else if (block.style.backgroundColor == "red" && !clickedOrNot[i][j] && ! endGame) {
        block.innerHTML = "";
        block.style.backgroundColor = "rgb(255, 111, 0)";
        block.style.innerHTML = "";
        flagList.splice(flagList.indexOf(x.id), 1)
        if (flagList.length == numberOfBombs) check();
    }
}

function click(i, j) {
    const top = 0;
    const bottom = numberOfRow - 1;
    const left = 0;
    const right = numberOfCol - 1;

    if (document.getElementById((i * numberOfCol + j + 1).toString()).style.backgroundColor != "red") { //red block cannot be clicked
        clickedOrNot[i][j] = true;
        if (boardState[i][j] == -1 && !endGame) {
            for (let ii = 0; ii < numberOfRow; ii++) {
                for (let jj = 0; jj < numberOfCol; jj++) {
                    if (boardState[ii][jj] == -1) {
                        document.getElementById((ii * numberOfCol + jj + 1).toString()).style.backgroundColor = "black";
                    }
                }
            }
            gameOver(false);   
        }
        if (boardState[i][j] == 0 && !endGame) {
            document.getElementById((i * numberOfCol + j + 1).toString()).className = "clicked"; 
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
        if (boardState[i][j] > 0 && !endGame) {
            let bombsNum;
            let numColor;
            document.getElementById((i * numberOfCol + j + 1).toString()).className = "clicked";
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
            document.getElementById((i * numberOfCol + j + 1).toString()).innerHTML = bombsNum;
            document.getElementById((i * numberOfCol + j + 1).toString()).style.color = numColor;
            // when flag is removed and clicked, .clicked does not change the background-color 
            document.getElementById((i * numberOfCol + j + 1).toString()).style.backgroundColor = "rgb(180, 180, 180)";
        }
    }
}

function handleClick(x) {
    const j = (x.id - 1) % numberOfCol;
    const i = (x.id - j - 1) / numberOfCol;
    click(i, j);
}

function check() {
    let pass = true;
    for (let i = 0; i < flagList.length; i++) {
        if (!radomNumbers.has(parseFloat(flagList[i]))) {
            pass = false;
            break;
        }
    }
    if (pass) gameOver(true);
}

function menu() {
    document.getElementById("txt").innerHTML = "JS Minesweeper";
    document.getElementById("board").innerHTML = "";
    let menuHTML = "";
    menuHTML += "<br><form><br>";
    menuHTML += "<label for='numberOfRows'>Number of Rows:</label><br><input type='text' id='numberOfRows'><br><br>";
    menuHTML += "<label for='numberOfCols'>Number of Columns:</label><br><input type='text' id='numberOfCols'><br><br>";
    menuHTML += "<label for='numberOfMines'>Number of Mines:</label><br><input type='text' id='numberOfMines'><br><br><br>";
    menuHTML += "</form>";
    menuHTML += "<br><button id='submitBtn' onclick='Game()'>Submit</button>";
    document.getElementById("menu").innerHTML = menuHTML;
}

function Game() {
    endGame = false;
    numberOfRow = document.getElementById("numberOfRows").value;
    numberOfCol = document.getElementById("numberOfCols").value;
    numberOfBombs = document.getElementById("numberOfMines").value;
    document.getElementById("menu").innerHTML = "";
    setBombs();
    initializeBoard();
    printBoard();
}

function gameOver(win) {
    if (win) {
        document.getElementById("txt").innerHTML = "<button id='newGameBtn' onclick='menu()'>New Game</botton>"
    }
    if (!win) {
        document.getElementById("txt").innerHTML = "<button id='newGameBtn' onclick='menu()'>Try Again</botton>"
    }

    // not allow user to click after the game is over
    endGame = true;
}

const numberOfRow = 16;
const numberOfCol = 16;
const numberOfBombs = 25;
let endGame = false;
let submit = false;
const board = []; // displayed to player
const boardState = []; // hidden from player
const clickedOrNot = []; // hidden from player
const radomNumbers = new Set();
const flagList = [];

menu();