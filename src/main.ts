const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".size");
const playerTurnElement = document.querySelector(".player.turn") as HTMLHeadingElement;
const resetButton = document.querySelector("h3 button") as HTMLButtonElement;
let currentPlayer: "X" | "O" = "X";
let gameLocked = false; // checking if the game is over

const board: (string | null)[] = Array(9).fill(null);

// combinations to win the game there are no other possible combinations
const winCombinations: number[][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// saving board state and which players turn it is to the local storage
function saveGameState() {
    localStorage.setItem("ticTacToeBoard", JSON.stringify(board));
    localStorage.setItem("ticTacToePlayer", currentPlayer);
    localStorage.setItem("ticTacToeLocked", JSON.stringify(gameLocked));
}

// loading the game state and player form the local storage
function loadGameState() {
    const savedBoard = localStorage.getItem("ticTacToeBoard");
    const savedPlayer = localStorage.getItem("ticTacToePlayer");
    const savedLocked = localStorage.getItem("ticTacToeLocked");

    if (savedBoard && savedPlayer) {
        const loadedBoard: (string | null)[] = JSON.parse(savedBoard);
        loadedBoard.forEach((value, index) => {
            if (value) {
                board[index] = value;
                buttons[index].textContent = value;
            }
        });
        currentPlayer = savedPlayer as "X" | "O";
        gameLocked = JSON.parse(savedLocked);
        playerTurnElement.textContent = `Player turn: ${currentPlayer}`;
    }
}

// function checking if there is a win or a draw
function checkWin(): boolean {
    return winCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

// eventlisteners for each button
buttons.forEach((button, index) => {
    // when button is hovered show a X or O
    button.addEventListener("mouseenter", () => {
        // show temporary X or O
        if (!board[index] && !gameLocked) {
            button.setAttribute("data-hover", currentPlayer);
        }
    });

    // when the mouse dosent hover over the button to remove the hover effect
    button.addEventListener("mouseleave", () => {
        button.removeAttribute("data-hover");
    });

    // button click event this is for when the player makes a move
    button.addEventListener("click", () => {
        if (!board[index] && !gameLocked) {
            board[index] = currentPlayer;
            button.textContent = currentPlayer;
            button.removeAttribute("data-hover");

            // checking if the current move that was made results in a win
            if (checkWin()) {
                playerTurnElement.textContent = `Player ${currentPlayer} wins!`;
                gameLocked = true; // locking game so that no more turns can be made
                buttons.forEach(btn => {
                    btn.disabled = true; // turning of the buttons
                    btn.removeAttribute("data-hover"); // ensuring that the hover effect dosent work when the game is won
                });
                saveGameState(); // saving the final game state
                return;
            }

            // checking if there is a draw
            if (!board.includes(null)) {
                playerTurnElement.textContent = "It's a draw!";
                gameLocked = true;
                buttons.forEach(btn => btn.removeAttribute("data-hover"));
                saveGameState();
                return;
            }

            // alternating between players
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            playerTurnElement.textContent = `Player turn: ${currentPlayer}`;

            saveGameState(); // saving updated game
        }
    });
});

// function for the reset button
resetButton.addEventListener("click", () => {
    board.fill(null);
    gameLocked = false;
    buttons.forEach(button => {
        button.textContent = "";
        button.disabled = false;
        button.removeAttribute("data-hover");
    });
    currentPlayer = "X";
    playerTurnElement.textContent = "Player turn: X";
    localStorage.removeItem("ticTacToeBoard");
    localStorage.removeItem("ticTacToePlayer");
});

// loading the game state
loadGameState();
