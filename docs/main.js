const buttons = document.querySelectorAll(".size");
const playerTurnElement = document.querySelector(".player.turn");
const resetButton = document.querySelector("h3 button");
let currentPlayer = "X";
let gameLocked = false;
const board = Array(9).fill(null);
const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
function saveGameState() {
  localStorage.setItem("ticTacToeBoard", JSON.stringify(board));
  localStorage.setItem("ticTacToePlayer", currentPlayer);
  localStorage.setItem("ticTacToeLocked", JSON.stringify(gameLocked));
}
function loadGameState() {
  const savedBoard = localStorage.getItem("ticTacToeBoard");
  const savedPlayer = localStorage.getItem("ticTacToePlayer");
  const savedLocked = localStorage.getItem("ticTacToeLocked");
  if (savedBoard && savedPlayer) {
    const loadedBoard = JSON.parse(savedBoard);
    loadedBoard.forEach((value, index) => {
      if (value) {
        board[index] = value;
        buttons[index].textContent = value;
      }
    });
    currentPlayer = savedPlayer;
    gameLocked = JSON.parse(savedLocked);
    playerTurnElement.textContent = `Player turn: ${currentPlayer}`;
  }
}
function checkWin() {
  return winCombinations.some((combination) => {
    const [a, b, c] = combination;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}
buttons.forEach((button, index) => {
  button.addEventListener("mouseenter", () => {
    if (!board[index] && !gameLocked) {
      button.setAttribute("data-hover", currentPlayer);
    }
  });
  button.addEventListener("mouseleave", () => {
    button.removeAttribute("data-hover");
  });
  button.addEventListener("click", () => {
    if (!board[index] && !gameLocked) {
      board[index] = currentPlayer;
      button.textContent = currentPlayer;
      button.removeAttribute("data-hover");
      if (checkWin()) {
        playerTurnElement.textContent = `Player ${currentPlayer} wins!`;
        gameLocked = true;
        buttons.forEach((btn) => {
          btn.disabled = true;
          btn.removeAttribute("data-hover");
        });
        saveGameState();
        return;
      }
      if (!board.includes(null)) {
        playerTurnElement.textContent = "It's a draw!";
        gameLocked = true;
        buttons.forEach((btn) => btn.removeAttribute("data-hover"));
        saveGameState();
        return;
      }
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      playerTurnElement.textContent = `Player turn: ${currentPlayer}`;
      saveGameState();
    }
  });
});
resetButton.addEventListener("click", () => {
  board.fill(null);
  gameLocked = false;
  buttons.forEach((button) => {
    button.textContent = "";
    button.disabled = false;
    button.removeAttribute("data-hover");
  });
  currentPlayer = "X";
  playerTurnElement.textContent = "Player turn: X";
  localStorage.removeItem("ticTacToeBoard");
  localStorage.removeItem("ticTacToePlayer");
});
loadGameState();
//# sourceMappingURL=main.js.map
