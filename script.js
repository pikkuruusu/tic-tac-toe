const gameBoard = (function() {
    let board = [[0,0,0],[0,0,0],[0,0,0]];

    const setSquare = (y, x, value) => {
        board[y][x] = _translateMarkerToInt(value);
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
    const mainContainer = doc.querySelector('main');

    const renderGameBoard = () => {
        if(doc && 'querySelector' in doc) {
            const gameBoardContainer = doc.createElement('div');
            gameBoardContainer.id = 'game-board';
            for (let y = 0; y < 3; y++) {
                for (let x = 0; x < 3; x++) {
                    const gameSquare = doc.createElement('div');
                    gameSquare.className = 'game-square';
                    const squareContent = doc.createElement('div');
                    squareContent.className = 'square-content';
                    squareContent.setAttribute('data-yx-coordinate', `${y}${x}`);
                    gameSquare.appendChild(squareContent);
                    gameBoardContainer.appendChild(gameSquare);
                }
            }
            mainContainer.appendChild(gameBoardContainer);
        }
    }

    const writeMarkerToDOM = (y, x, value) => {
        if(doc && 'querySelector' in doc) {
            const square = doc.querySelector(`[data-yx-coordinate="${y}${x}"]`)
            square.textContent = value;
        }
    }

    const clearMarkersFromDOM = () => {
        if(doc && 'querySelector' in doc) {
            const squares = doc.querySelectorAll('.square-content');
            squares.forEach(square => square.textContent = '');
        }
    }

    const renderForm = () => {
        if(doc && 'querySelector' in doc) {
            const playerSelectForm = doc.createElement('form');
            playerSelectForm.id = 'player-select-form';
            playerSelectForm.appendChild(_createFormInputs('player-one', 'What\'s your name?'));
            
            const playerSelectionsDiv = doc.createElement('div');
            playerSelectionsDiv.className = 'player-selections';

            const playerSelectionsOnePlayer = doc.createElement('div');
            playerSelectionsOnePlayer.id = 'selections-one-player';

            const selectFriend = doc.createElement('p');
            selectFriend.className = 'selections';
            selectFriend.id = 'select-friend'
            selectFriend.textContent = 'Play with a friend'

            const playComputer = doc.createElement('p');
            playComputer.className = 'selections';
            playComputer.id = 'play-computer';

            const playComputerButton = doc.createElement('button');
            playComputerButton.textContent = 'Play against a computer';
            const computerImg = doc.createElement('img');
            computerImg.src = 'img/robot.svg';
            computerImg.width = 25;
            playComputerButton.appendChild(computerImg);

            playComputer.appendChild(playComputerButton);

            playerSelectionsOnePlayer.appendChild(selectFriend);
            playerSelectionsOnePlayer.appendChild(playComputer);

            playerSelectionsDiv.appendChild(playerSelectionsOnePlayer);
            playerSelectForm.appendChild(playerSelectionsDiv);

            mainContainer.appendChild(playerSelectForm);
        }
    }

    const _createFormInputs = (id, msg) => {
        const playerInput = doc.createElement('div');
        playerInput.className = 'player-input';
        const label = doc.createElement('label');
        label.setAttribute('for', id);
        label.textContent = msg;
        const input = doc.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('id', id);
        input.setAttribute('name', id);
        playerInput.appendChild(label);
        playerInput.appendChild(input);
        return playerInput;
    }

    const renderPlayerTwoInput = () => {
        if(doc && 'querySelector' in doc) {
            const playerSelectForm = doc.getElementById('player-select-form');
            playerSelectForm.insertBefore(_createFormInputs('player-two', 'What\'s your name friend?'), playerSelectForm.children[0].nextSibling);
            inputController.removeSelectFriendEL();
            //todo remove selections one player and create the selections two player
        }
    }

    return {
        renderGameBoard,
        writeMarkerToDOM,
        clearMarkersFromDOM,
        renderForm,
        renderPlayerTwoInput
    }
})(document);

const inputController = (function(doc) {
    const initBoardInput = () => {
        if(doc && 'querySelector' in doc) {
            const squares = doc.querySelectorAll('.square-content');
            squares.forEach(square => square.addEventListener('click', _playMarkerOnInput));
        };
    };

    const removeBoardInput = () => {
        if(doc && 'querySelector' in doc) {
            const squares = doc.querySelectorAll('.square-content');
            squares.forEach(square => square.removeEventListener('click', _playMarkerOnInput));
        };
    }

    const _playMarkerOnInput = (e) => {
        const coordinates = e.target.dataset.yxCoordinate.split('');
        let yCoordinate = coordinates[0];
        let xCoordinate = coordinates[1];
        gameController.playRound(yCoordinate, xCoordinate);
    }

    const initPlayerSelectInput = () => {
        if(doc && 'querySelector' in doc) {
            const playerSelectForm = doc.getElementById('player-select-form');
            playerSelectForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Form submitted');
            })

            const selectFriend = doc.getElementById('select-friend');
            selectFriend.addEventListener('click', displayController.renderPlayerTwoInput);

/*             const playComputerSubmit = doc.getElementById('play-computer');
            playComputerSubmit.addEventListener('click', () => {
                console.log('Is clicked')
                _playerSelectForm.submit();
            }); */
        };
    }

    const removeSelectFriendEL = () => {
        const selectFriend = doc.getElementById('select-friend');
        selectFriend.removeEventListener('click', displayController.renderPlayerTwoInput);
    }

    return {
        initBoardInput,
        removeBoardInput,
        initPlayerSelectInput,
        removeSelectFriendEL
    }
})(document);

const gameController = (function() {
    let round = 0;
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

    const playRound = (yCoordinate, xCoordinate) => {
        if (gameBoard.getSquare(yCoordinate, xCoordinate)) return;

        players.forEach(player => {
            if (player.getTurn()) {
                _placeMarker(yCoordinate, xCoordinate, player);

                if (_isWin(yCoordinate, xCoordinate)) {
                    console.log(`${player.name} won!`);
                    return;
                }
                if (_isDraw()) {
                    console.log('It\'s a draw');
                    return;
                }

                player.setTurn(false);
                round++;
            } else {
                player.setTurn(true);
            }
        })
    }

    const _placeMarker = (yCoordinate, xCoordinate, player) => {
        let marker = player.getPlayerMarker();
        gameBoard.setSquare(yCoordinate, xCoordinate, marker);
        displayController.writeMarkerToDOM(yCoordinate, xCoordinate, marker);
        console.log(`${player.name} placed ${marker}`);
    }

    const _isWin = (yCoordinate, xCoordinate) => {
        // If row, column or diagonal sum is 3 or -3 a player has won
        let sums = []
        sums.push(gameBoard.sumOfRow(yCoordinate));
        sums.push(gameBoard.sumOfColumn(xCoordinate));
        gameBoard.sumOfDiagonals().forEach(sum => sums.push(sum));

        return (sums.includes(3) || sums.includes(-3))
    }

    const _isDraw = () => {
        return round === 8;
    };

    //TODO maybe we won't need this function at all
    const _endGame = (bool, player) => {
        if (bool) {

        } else {

        }
    }

    return {
        initPlayers,
        playRound,
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
/* displayController.renderGameBoard();
gameController.initPlayers(Player('Staffan'), Player('Stefan'));
inputController.initBoardInput(); */

displayController.renderForm();
inputController.initPlayerSelectInput();