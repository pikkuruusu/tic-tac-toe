const gameBoard = (function() {
    let board = [[0,0,0],[0,0,0],[0,0,0]];

    const setSquare = (y, x, value) => {
        board[y][x] = _translateMarkerToInt(value);
        console.log(board);
    };

    const getSquare = (y, x) => {
        return board[y][x];
    };

    // We want our markers to be 1 or -1 on the board to be able to check winning combinations
    const _translateMarkerToInt = (marker) => {
        return (marker === 'X') ? 1 : -1;
    };

    const sumOfRow = (y) => {
        let sum = 0;
        board[y].forEach(cell => sum += cell);
        return sum;
    };

    const sumOfColumn = (x) => {
        let sum = 0;
        board.forEach(row => sum += row[x]);
        return sum;
    };

    const sumOfDiagonals = () => {
        let sum = [];

        let sumOfFirstDiagonal = 0;
        let sumOfSecondDiagonal = 0;
        let reverseColumnCounter = board.length - 1;
        for (let i = 0; i < board.length; i++) {
            sumOfFirstDiagonal += board[i][i];
            sumOfSecondDiagonal += board[i][reverseColumnCounter - i];
        }
        sum.push(sumOfFirstDiagonal, sumOfSecondDiagonal);

        return sum;
    };

    return {
        setSquare,
        getSquare,
        sumOfRow,
        sumOfColumn,
        sumOfDiagonals
    }
})();

const displayController = (function(doc) {
    const writeToDOM = (y, x, value) => {
        if(doc && 'querySelector' in doc) {
            const square = doc.querySelector(`[data-yx-coordinate="${y}${x}"]`)
            square.textContent = value;
        }
    }
    return {
        writeToDOM,
    }
})(document);

const inputController = (function(doc) {
    const init = () => {
        if(doc && 'querySelector' in doc) {
            const squares = doc.querySelectorAll('.square-content');
            squares.forEach(square => square.addEventListener('click', function(e) {
                const coordinates = e.target.dataset.yxCoordinate.split('');
                let yCoordinate = coordinates[0];
                let xCoordinate = coordinates[1];
                gameController.placeMarker(yCoordinate, xCoordinate);
            }));
        };
    };

    return {
        init,
    }
})(document);

const gameController = (function() {
    const players = [];

    const initPlayers = (firstPlayer, secondPlayer) => {
        let playerOne = firstPlayer;
        let playerTwo = secondPlayer;
        playerOne.setTurn(true);
        playerOne.setPlayerMarker('X');
        playerTwo.setTurn(false);
        playerTwo.setPlayerMarker('O');
        players.push(playerOne, playerTwo);
    }

    const placeMarker = (yCoordinate, xCoordinate) => {
        if (gameBoard.getSquare(yCoordinate, xCoordinate)) return;

        players.forEach(player => {
            if (player.getTurn()) {
                let marker = player.getPlayerMarker();
                gameBoard.setSquare(yCoordinate, xCoordinate, marker);
                displayController.writeToDOM(yCoordinate, xCoordinate, marker);
                console.log(`${player.name} placed ${marker}`);
                if (_isWin(yCoordinate, xCoordinate)) {
                    console.log(`${player.name} won!`);
                }
                player.setTurn(false);
            } else {
                player.setTurn(true);
            }
        })
    }

    const _isWin = (yCoordinate, xCoordinate) => {
        // If row, column or diagonal sum is 3 or -3 a player has won
        let sums = []
        sums.push(gameBoard.sumOfRow(yCoordinate));
        sums.push(gameBoard.sumOfColumn(xCoordinate));
        gameBoard.sumOfDiagonals().forEach(sum => sums.push(sum));

        return (sums.includes(3) || sums.includes(-3))
    }

    return {
        initPlayers,
        placeMarker,
    }
})();

const Player = function(name) {
    let isTurn = false;
    let playerMarker = "";

    const setTurn = (bool) => {
        isTurn = bool;
    };

    const getTurn = () => {
        return isTurn;
    };

    const setPlayerMarker = (marker) => {
        playerMarker = marker;
    };

    const getPlayerMarker = () => {
        return playerMarker;
    }

    return {
        name,
        setTurn,
        getTurn,
        setPlayerMarker,
        getPlayerMarker,
    }
}

//This should probably move into a function and some other thing should start the game
gameController.initPlayers(Player('Staffan'), Player('Stefan'));
inputController.init();