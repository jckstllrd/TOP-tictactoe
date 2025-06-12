const gameboard = (function () {
  let board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];
  let currentPlayer = "X";

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function togglePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }

  function makeMove(x, y) {
    board[x][y] = currentPlayer;
    togglePlayer();
    if (boardState()) {
      endGame(boardState());
    }
    return board;
  }

  function boardState() {
    let winningMarker;

    // Diagonal Winning States check
    if (
      // First diagonal (top-left to bottom-right)
      (board[0][0] === board[1][1] &&
        board[1][1] === board[2][2] &&
        board[1][1] !== " ") ||
      // Second diagonal (bottom-left to top-right)
      (board[2][0] === board[1][1] &&
        board[1][1] === board[0][2] &&
        board[1][1] !== " ")
    ) {
      winningMarker = board[0][0];
    }

    if (
      board[0][0] === board[0][1] &&
      board[0][1] === board[0][2] &&
      board[0][2] !== " "
    ) {
      winningMarker = board[0][0];
    }
    if (
      board[1][0] === board[1][1] &&
      board[1][1] === board[1][2] &&
      board[1][2] !== " "
    ) {
      winningMarker = board[1][0];
    }
    if (
      board[2][0] === board[2][1] &&
      board[2][1] === board[2][2] &&
      board[2][2] !== " "
    ) {
      winningMarker = board[2][0];
    }
    // Vertical Checks

    if (
      // First diagonal (top-left to bottom-right)
      board[0][0] === board[1][0] &&
      board[1][0] === board[2][0] &&
      board[2][0] !== " "
    ) {
      winningMarker = board[0][0];
    }
    if (
      // First diagonal (top-left to bottom-right)
      board[0][1] === board[1][1] &&
      board[1][1] === board[2][1] &&
      board[2][1] !== " "
    ) {
      winningMarker = board[0][1];
    }
    if (
      board[0][2] === board[1][2] &&
      board[1][2] === board[2][2] &&
      board[2][2] !== " "
    ) {
      winningMarker = board[0][2];
    }

    return winningMarker;
  }

  function endGame(marker) {
    console.log(`${marker} has won, ending game`);

    displayController.disableGridCells();
  }

  return { getCurrentPlayer, makeMove };
})();

const displayController = (function () {
  // Set grid variable for use in the object
  const grid = document.querySelector(".grid");

  function createCell(x, y) {
    const newCell = document.createElement("div");
    newCell.classList.toggle("cell");
    newCell.setAttribute("data-x", x);
    newCell.setAttribute("data-y", y);
    grid.appendChild(newCell);
  }

  function initiateCellEvents() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
  }

  function handleCellClick(e) {
    const x = e.target.getAttribute("data-x");
    const y = e.target.getAttribute("data-y");

    gameboard.makeMove(x, y);

    updateCell(e.target, gameboard.getCurrentPlayer());
  }

  function updateCell(cell, player) {
    // Handle visual updates only
    cell.textContent = player === "X" ? "O" : "X";
  }

  function initiateGridCells() {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        createCell(x, y);
      }
    }
  }

  const removeEventListenerAll = (
    targets,
    type,
    listener,
    options,
    useCapture
  ) => {
    targets.forEach((target) =>
      target.removeEventListener(type, listener, options, useCapture)
    );
  };

  function disableGridCells() {
    removeEventListenerAll(
      document.querySelectorAll(".cell"),
      "click",
      handleCellClick
    );
  }

  return { initiateGridCells, disableGridCells, initiateCellEvents };
})();

const game = (function () {
  function play() {
    // initialise board

    displayController.initiateCellEvents();
  }

  function start() {
    displayController.initiateGridCells();
    play()
  }

  return { start };
})();

function createPlayer(name) {
  // Stuff
  return { name };
}

game.start();
