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
const board = [];

initializeBoard();
printBoard();