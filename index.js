let gameStatus = 'inactive'
let currentMessage = `To play, press the play button, Player 1 begins.`;

const GameBoard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];
    const updateBoard = (index, player) => {
        if (board[index] === '') {
            board[index] = player.marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    };

    const getBoard = () => board;

    return { updateBoard, resetBoard, getBoard };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const checkTie = () => {
    const board = GameBoard.getBoard();
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            return false;
        }
    }
    for (const combination of winningCombinations) {
        if (
            board[combination[0]] === board[combination[1]] &&
            board[combination[1]] === board[combination[2]] &&
            board[combination[0]] !== ''
        ) {
            return false;
        }
    }

    return true;
}

const checkWin = (player) => {
    const cells = document.querySelectorAll('.cell')
    const marker = player.marker;
    const board = GameBoard.getBoard();

    for (const combination of winningCombinations) {
        if (board[combination[0]] === marker &&
            board[combination[1]] === marker &&
            board[combination[2]] === marker) {
            cells[combination[0]].id = 'winner'
            cells[combination[1]].id = 'winner'
            cells[combination[2]].id = 'winner'
            return true;
        }
    }
    return false;
};

const GameController = (() => {
    let currentPlayer;
    let player1;
    let player2;

    const initialize = () => {
        player1 = Player('Player 1', 'X');
        player2 = Player('Player 2', 'O');
        currentPlayer = player1;
        updateMessage(`Game started, ${player1.name} starts with ${player1.marker}.`);
        gameStatus = 'active';
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        updateMessage(`${currentPlayer.name} turn - ${currentPlayer.marker}`);
    };

    const makeMove = (index) => {
        if (GameBoard.updateBoard(index, currentPlayer)) {
            ScreenController.updateScreen();

            if (checkWin(currentPlayer)) {
                gameStatus = 'stop';                
                updateMessage(`${currentPlayer.name} wins! Press reset to start a new game.`)
                return;
            }
            if (checkTie()) {
                gameStatus = 'stop';
                updateMessage("It's a tie! Press reset to start a new game.");
                return;
            }

            switchPlayer();
        } else {
            updateMessage('Cell already taken! Try a different move.');
        }


    };

    const resetGame = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell) => {
            cell.textContent = '';
            cell.id = '';
        });
        GameBoard.resetBoard();
        ScreenController.updateScreen();
        gameStatus = 'inactive'
        updateMessage('Game has been reset. Press play to start.')
    }

    const startGame = () => {
        if (gameStatus === 'inactive') {
            initialize();
            ScreenController.updateScreen();
        }
    }

    function handleClick(index) {
        if (gameStatus === 'active') {
            makeMove(index)
        }
    }

    return { initialize, makeMove, handleClick, resetGame, startGame };
})();

const ScreenController = (() => {
    const board = GameBoard.getBoard();
    const boardDiv = document.querySelector('.board');
    const containerDiv = document.querySelector('.buttons')

    const createScreen = () => {
        for (let i = 0; i < board.length; i++) {
            const cellDiv = document.createElement('div');
            cellDiv.textContent = board[i];
            boardDiv.appendChild(cellDiv);
            cellDiv.classList.add('cell');
        }

        const statusMessage = document.createElement('p');
        statusMessage.setAttribute('id', 'statusMessage');
        statusMessage.textContent = currentMessage;
        document.querySelector('.statusMessage').appendChild(statusMessage);

        const resetBtn = document.createElement('buttonReset');
        resetBtn.textContent = 'reset';
        resetBtn.setAttribute('id', 'resetBtn')
        containerDiv.appendChild(resetBtn);

        const startBtn = document.createElement('buttonPlay');
        startBtn.textContent = 'play';
        startBtn.setAttribute('id', 'startBtn')
        containerDiv.appendChild(startBtn);
    }

    const updateScreen = () => {
        const cells = document.querySelectorAll('.cell');
        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = board[i];
        }
    }

    createScreen();

    return { createScreen, updateScreen };
})();

const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', () => GameController.resetGame());

const startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', () => GameController.startGame());

const cellEvent = document.querySelectorAll('.cell');
cellEvent.forEach((element, index) => {
    element.addEventListener('click', () => GameController.handleClick(index));
})

function updateMessage(currentMessage) {
    document.querySelector('.statusMessage').textContent = currentMessage;
}
