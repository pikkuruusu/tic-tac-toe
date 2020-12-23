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

    const getFreeSquares = () => {
        let freeSquares =[];
        for (y = 0; y < 3; y++) {
            for (x = 0; x < 3; x++) {
                if (board[y][x] === 0) {
                    freeSquares.push([y, x]);
                }
            }
        }
        return freeSquares;
    }

    const clearBoard = () => {
        board = [[0,0,0],[0,0,0],[0,0,0]];
    }

    return {
        setSquare,
        getSquare,
        sumOfRow,
        sumOfColumn,
        sumOfDiagonals,
        getFreeSquares,
        clearBoard
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

    const _clearGameBoard = () => {
        inputController.removeBoardInput();
        if(doc && 'querySelector' in doc) {
            const gameBoardContainer = doc.getElementById('game-board');
            gameBoardContainer.remove();
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
            playerSelectionsDiv.id = 'player-selections';

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
            doc.getElementById('selections-one-player').remove();

            const playerSelectionsTwoPlayer = doc.createElement('div');
            playerSelectionsTwoPlayer.id = 'selections-two-player';

            const playFriend = doc.createElement('p');
            playFriend.className = 'selections';
            playFriend.id = 'play-friend'

            const playFriendButton = doc.createElement('button');
            playFriendButton.textContent = 'Play!';

            playFriend.appendChild(playFriendButton);
            playerSelectionsTwoPlayer.appendChild(playFriend);

            const playerSelections = doc.getElementById('player-selections');
            playerSelections.appendChild(playerSelectionsTwoPlayer);
        }
    }

    const removeForm = () => {
        const playerSelectForm = doc.getElementById('player-select-form');
        playerSelectForm.remove();
    }

    const renderEndScreen = (haveWinner, player) => {
        if(doc && 'querySelector' in doc) {
            _clearGameBoard();
            const endScreen = doc.createElement('div');
            endScreen.id = 'end-screen';
            if (haveWinner) {
                endScreen.textContent = `${player.name} won!`;
            } else {
                endScreen.textContent = 'It\'s a draw';
            }
            const playAgain = doc.createElement('p');
            playAgain.id = 'play-again';
            playAgain.textContent = 'Play again?';

            endScreen.appendChild(playAgain);

            mainContainer.appendChild(endScreen);
            inputController.initEndScreenInput();
        }
    }

    const renderReplay = () => {
        const endScreen = doc.getElementById('end-screen');
        endScreen.remove();

        gameBoard.clearBoard();
        gameController.resetRound();
        let players = gameController.getPlayers();
        players[0].setTurn(true);
        players[1].setTurn(false);
        renderGameBoard()
        inputController.initBoardInput();
    }

    return {
        renderGameBoard,
        writeMarkerToDOM,
        clearMarkersFromDOM,
        renderForm,
        renderPlayerTwoInput,
        removeForm,
        renderEndScreen,
        renderReplay
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
            playerSelectForm.addEventListener('submit', _handleFormSubmit);

            const selectFriend = doc.getElementById('select-friend');
            selectFriend.addEventListener('click', displayController.renderPlayerTwoInput);
        };
    }

    const _removeFormEL = () => {
        const playerSelectForm = doc.getElementById('player-select-form');
        playerSelectForm.removeEventListener('submit', _handleFormSubmit);

        if (doc.getElementById('select-friend')) {
            removeSelectFriendEL();
        }
    }

    const removeSelectFriendEL = () => {
        const selectFriend = doc.getElementById('select-friend');
        selectFriend.removeEventListener('click', displayController.renderPlayerTwoInput);
    }

    const _handleFormSubmit = function(e) {
        e.preventDefault();
        let playerOne = doc.getElementById('player-one').value;
        if (playerOne === "") playerOne = "Player One";
        let playerTwo = ""
        if (doc.getElementById('player-two')) {
            playerTwo = doc.getElementById('player-two').value;
            if (playerTwo === "") playerTwo = "Player Two";
            gameController.initPlayers(Player(playerOne), Player(playerTwo));
        } else {
            playerTwo = "Computer"
            gameController.initPlayers(Player(playerOne), Player(playerTwo), true);
        }

        _removeFormEL();
        displayController.removeForm();

        displayController.renderGameBoard();
        
        inputController.initBoardInput();
    }

    const initEndScreenInput = () => {
        const playAgain = doc.getElementById('play-again');
        playAgain.addEventListener('click', displayController.renderReplay);
    }

    const removeEndScreenInput = () => {
        const playAgain = doc.getElementById('play-again');
        playAgain.removeEventListener('click', displayController.renderReplay);
    }

    return {
        initBoardInput,
        removeBoardInput,
        initPlayerSelectInput,
        removeSelectFriendEL,
        initEndScreenInput,
        removeEndScreenInput
    }
})(document);

const gameController = (function() {
    let round = 0;
    let players = [];

    //This need to be changed to get computer player, maybe just a bool
    const initPlayers = (firstPlayer, secondPlayer, computerGame = false) => {
        let playerOne = firstPlayer;
        let playerTwo = secondPlayer;
        playerOne.setTurn(true);
        playerOne.setPlayerMarker('X');
        playerTwo.setTurn(false);
        playerTwo.setPlayerMarker('O');
        if (computerGame) playerTwo.setIsComputer(true); 
        players.push(playerOne, playerTwo);
    }

    const playRound = (yCoordinate, xCoordinate) => {
        if (gameBoard.getSquare(yCoordinate, xCoordinate)) return;

        players.forEach(player => {
            if (player.getTurn()) {
                _placeMarker(yCoordinate, xCoordinate, player);

                if (_isWin(yCoordinate, xCoordinate)) {
                    displayController.renderEndScreen(true, player);
                    return;
                }
                if (_isDraw()) {
                    displayController.renderEndScreen(false);
                    return;
                }

                player.setTurn(false);
                round++;
            } else {
                player.setTurn(true);
            }
            //here we can check if it is computer players turn and call some functions that calls play round
            setTimeout(function () {
                if (player.getIsComputer() && player.getTurn()) _randomComputerMove();
            }, 500)


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

    const resetRound = () => {
        round = 0;
    }

    const getPlayers = () => {
        return players;
    }

    const _randomComputerMove = () => {
        const freeSquares = gameBoard.getFreeSquares();
        if (freeSquares.length > 0) {
            const randomFreeSquare = freeSquares[Math.floor(Math.random() * freeSquares.length)];
            playRound(randomFreeSquare[0], randomFreeSquare[1]);
        }
        
    }

    return {
        initPlayers,
        playRound,
        resetRound,
        getPlayers
    }
})();

const Player = function(name) {
    let isTurn = false;
    let playerMarker = "";
    let isComputer = false;

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

    const setIsComputer = (bool) => {
        isComputer = bool;
    }

    const getIsComputer = () => {
        return isComputer;
    }

    return {
        name,
        setTurn,
        getTurn,
        setPlayerMarker,
        getPlayerMarker,
        setIsComputer,
        getIsComputer,
    }
}

displayController.renderForm();
inputController.initPlayerSelectInput();