const game = (function () {
  let playerOne;
  let playerTwo;
  let currentPlayer;

  function twoPlayer() {
    // initialise board
    displayController.initiateCellEvents();
  }

  function singlePlayer() {
    displayController.initiateCellEvents();
    if (currentPlayer === playerTwo) {
      takeBotTurn();
    }
  }

  function getWinner(marker) {
    return currentPlayer;
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  // Update the togglePlayerTurn function in game module
  function togglePlayerTurn() {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    // Check if playerTwo is a bot and it's their turn
    if (
      typeof playerTwo.validateBot === "function" &&
      currentPlayer === playerTwo
    ) {
      setTimeout(takeBotTurn, 500); // Add 500ms delay for better UX
    }
  }

  // Update setPlayers in game module
  function setPlayers(player1, player2) {
    playerOne = player1;
    playerOne.setMarker("X");
    playerTwo = player2;
    playerTwo.setMarker("O");
    currentPlayer = playerOne;
    try {
      playerTwo.validateBot();
      singlePlayer();
    } catch (error) {
      twoPlayer();
    }
  }

  function start() {
    displayController.initiateGridCells();
    displayController.initialiseGameForm();
  }
  // Add this inside the game IIFE
  function takeBotTurn() {
    displayController.setBotTurn(true);

    const availableMoves = getAvailableMoves();
    if (availableMoves.length > 0) {
      const randomMove =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
      const cell = document.querySelector(
        `[data-x="${randomMove.x}"][data-y="${randomMove.y}"]`
      );

      if (cell) {
        setTimeout(() => {
          gameboard.makeMove(randomMove.x, randomMove.y);
          displayController.updateCell(cell, gameboard.getCurrentMarker());
          cell.removeEventListener("click", displayController.handleCellClick);
          displayController.displayCurrentPlayer();
          displayController.setBotTurn(false);
        }, 500);
      }
    }
  }

  function getAvailableMoves() {
    const moves = [];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (gameboard.getBoard()[x][y] === " ") {
          moves.push({ x, y });
        }
      }
    }
    return moves;
  }

  return { start, setPlayers, togglePlayerTurn, getCurrentPlayer, getWinner };
})();

const gameboard = (function () {
  let board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  let currentMarker = "X";

  function getCurrentMarker() {
    return currentMarker;
  }

  function toggleMarker() {
    currentMarker = currentMarker === "X" ? "O" : "X";
  }

  function makeMove(x, y) {
    board[x][y] = currentMarker;
    toggleMarker();

    if (boardState()) {
      endGame(boardState());
    } else {
      game.togglePlayerTurn();
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
    displayController.disableGridCells();
    displayController.displayWinner(game.getWinner());
  }

  function getBoard() {
    return board;
  }

  return { getCurrentMarker, makeMove, getBoard };
})();

const displayController = (function () {
  // Set grid variable for use in the object
  let isBotTurn = false;
  const grid = document.querySelector(".grid");

  function createCell(x, y) {
    const newCell = document.createElement("div");
    newCell.classList.toggle("cell");
    newCell.setAttribute("data-x", x);
    newCell.setAttribute("data-y", y);
    grid.appendChild(newCell);
  }

  function displayWinner(player) {
    const playerTurn = document.querySelector(".player-turn-div");
    const winner = document.querySelector(".winner-div");
    const winnerName = document.querySelector(".winner-name");
    playerTurn.classList.toggle("hidden");
    winner.classList.toggle("hidden");
    winnerName.textContent = player.name;
  }

  function displayCurrentPlayer() {
    const name = game.getCurrentPlayer().name;
    const playerTurn = document.querySelector(".player-turn");
    playerTurn.textContent = name;
  }

  function initiateCellEvents() {
    const cells = document.querySelectorAll(".cell");
    displayCurrentPlayer();
    cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
  }
  function handleCellClick(e) {
    if (isBotTurn) return;

    const x = e.target.getAttribute("data-x");
    const y = e.target.getAttribute("data-y");

    // Check if cell is already taken
    if (e.target.textContent !== "") return;

    gameboard.makeMove(x, y);
    updateCell(e.target, gameboard.getCurrentMarker());
    e.target.removeEventListener("click", handleCellClick);
    displayCurrentPlayer();
  }

  function updateCell(cell, player) {
    // Handle visual updates only
    cell.textContent = player;
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

  function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target.parentNode;
    const scoreboard = document.querySelector(".scoreboard");

    scoreboard.classList.toggle("hidden");
    form.classList.toggle("hidden");

    if (form.players.value == "two") {
      const playerOne = createPlayer(form.player1.value);
      const playerTwo = createPlayer(form.player2.value);
      game.setPlayers(playerOne, playerTwo);
    }

    if (form.players.value == "one") {
      const playerOne = createPlayer(form.player1.value);
      const bot = createBot();
      game.setPlayers(playerOne, bot);
    }
  }

  function initialiseGameForm() {
    const formBtn = document.querySelector(".game-form-submit");
    formBtn.addEventListener("click", handleFormSubmit);
  }

  function setBotTurn(isBot) {
    isBotTurn = isBot;
  }

  return {
    initiateGridCells,
    disableGridCells,
    initiateCellEvents,
    initialiseGameForm,
    displayWinner,
    handleCellClick,
    setBotTurn,
    updateCell,
    displayCurrentPlayer
  };
})();

function createPlayer(name) {
  let marker;
  function setMarker(m) {
    marker = m;
  }
  function getMarker() {
    return marker;
  }
  return { name, setMarker, getMarker };
}

function createBot() {
  const { name, setMarker, getMarker } = createPlayer("Bot");
  function validateBot() {
    return true;
  }
  function takeTurn() {}
  return { name, setMarker, getMarker, validateBot };
}

game.start();
