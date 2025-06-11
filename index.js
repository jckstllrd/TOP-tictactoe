const displayController = (function () {
  // Set grid variable for use in the object
  const grid = document.querySelector(".grid");

  function createCell(x, y) {
    const newCell = document.createElement("div");
    newCell.classList.toggle("cell");
    newCell.setAttribute("data-x", x);
    newCell.setAttribute("data-y", y);
    newCell.addEventListener("click", (e) => {
        console.log(e.target);
        
    })
    grid.appendChild(newCell);
  }

  function initiateGridCells() {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        createCell(x, y);
      }
    }
  }

  return { initiateGridCells };
})();

const gameboard = (function () {
  let board = ([, ,], [, ,], [, ,]);
})();

const game = (function () {
  function play() {
    // initialise board
    displayController.initiateGridCells();
  }

  return { play };
})();

function createPlayer(name) {
  // Stuff
  return { name };
}

game.play();
