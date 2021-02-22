//Helper function
const copyArray = (arr) => {
    let newArr = [];

    arr.forEach(elem => {
        if(Array.isArray(elem)) {
            newArr.push(copyArray(elem))
        } else {
            newArr.push(elem)
        }
    });

    return newArr;
}

//Factory functions
const GameBoard = function(boardInput = [[0,0,0],[0,0,0],[0,0,0]]) {
    //Problem, this passes reference need to
    let board = copyArray(boardInput);

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

    const isWinningBoard = () => {
        let sums = [];
        for (yx = 0; yx < 3; yx++) {
            sums.push(sumOfRow(yx));
            sums.push(sumOfColumn(yx));
        }
        sumOfDiagonals().forEach(sum => sums.push(sum));

        return (sums.includes(3) || sums.includes(-3));
    }

    const getBoard = () => {
        return board;
    }

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

    const isFullBoard = () => {
        return getFreeSquares().length === 0;
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
        getBoard,
        getFreeSquares,
        isWinningBoard,
        isFullBoard,
        clearBoard
    }
};

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
};

//Modules
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

            const playImpossibleComputer = doc.createElement('p');
            playImpossibleComputer.className = 'difficulty';
            const impossibleEasyText = doc.createTextNode('Easy computer');
            const impossibleComputerSwitchLabel = doc.createElement('label');
            impossibleComputerSwitchLabel.className = 'switch';
            const impossibleInputCheckbox = doc.createElement('input');
            impossibleInputCheckbox.setAttribute('type', 'checkbox');
            impossibleInputCheckbox.id = 'impossible-computer';
            const impossibelSliderSpan = doc.createElement('span');
            impossibelSliderSpan.className = 'slider round';
            const impossibleImpossibleText = doc.createTextNode('Impossible computer!')

            impossibleComputerSwitchLabel.appendChild(impossibleInputCheckbox);
            impossibleComputerSwitchLabel.appendChild(impossibelSliderSpan);

            playImpossibleComputer.appendChild(impossibleEasyText);
            playImpossibleComputer.appendChild(impossibleComputerSwitchLabel);
            playImpossibleComputer.appendChild(impossibleImpossibleText);

            playComputer.appendChild(playComputerButton);

            playerSelectionsOnePlayer.appendChild(selectFriend);
            playerSelectionsOnePlayer.appendChild(playComputer);
            playerSelectionsOnePlayer.appendChild(playImpossibleComputer);

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

        gameController.resetMainGameBoard();
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
            let isMiniMaxGame = doc.getElementById('impossible-computer').checked;
            gameController.initPlayers(Player(playerOne), Player(playerTwo), true, isMiniMaxGame);
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
    let players = [];
    let mainGameBoard = GameBoard();
    let isMiniMaxGame;

    //This need to be changed to get computer player, maybe just a bool
    const initPlayers = (firstPlayer, secondPlayer, computerGame = false, miniMaxGame = false) => {
        let playerOne = firstPlayer;
        let playerTwo = secondPlayer;
        playerOne.setTurn(true);
        playerOne.setPlayerMarker('X');
        playerTwo.setTurn(false);
        playerTwo.setPlayerMarker('O');
        if (computerGame) playerTwo.setIsComputer(true);
        isMiniMaxGame = miniMaxGame;
        players.push(playerOne, playerTwo);
    }

    const playRound = (yCoordinate, xCoordinate) => {
        if (mainGameBoard.getSquare(yCoordinate, xCoordinate)) return;

        for (i = 0; i < players.length; i++) {
            if (players[i].getTurn()) {
                _placeMarker(yCoordinate, xCoordinate, players[i]);

                if (mainGameBoard.isWinningBoard()) {
                    displayController.renderEndScreen(true, players[i]);
                    return;
                }
                //If we don't have a win and the board is full, it is a draw
                if (mainGameBoard.isFullBoard()) {
                    displayController.renderEndScreen(false);
                    return;
                }

                players[i].setTurn(false);
            } else {
                players[i].setTurn(true);
            }
            //here we can check if it is computer players turn and call some functions that calls playRound
            (function(i) {setTimeout(function () {
                if (players[i].getIsComputer() && players[i].getTurn()) {
                    isMiniMaxGame ? _impossibleComputerMove() : _randomComputerMove();
                }
            }, 500)})(i);


        };
    }

    const _placeMarker = (yCoordinate, xCoordinate, player) => {
        let marker = player.getPlayerMarker();
        mainGameBoard.setSquare(yCoordinate, xCoordinate, marker);
        displayController.writeMarkerToDOM(yCoordinate, xCoordinate, marker);
    }

    const resetMainGameBoard = () => {
        mainGameBoard.clearBoard();
    };

    const getPlayers = () => {
        return players;
    };

    const _randomComputerMove = () => {
        const freeSquares = mainGameBoard.getFreeSquares();
        if (freeSquares.length > 0) {
            const randomFreeSquare = freeSquares[Math.floor(Math.random() * freeSquares.length)];
            playRound(randomFreeSquare[0], randomFreeSquare[1]);
        }
    };

    const _impossibleComputerMove = () => {
        const freeSquares = mainGameBoard.getFreeSquares();
        let highestValueMove = -Infinity;
        let bestMove = [];

        //Lets test get a value for all free moves
        for (i = 0; i < freeSquares.length; i++) {
            //We create a temporary copy of the main gameboard
            let testBoard = GameBoard(mainGameBoard.getBoard());

            //We set a test move
            testBoard.setSquare(freeSquares[i][0], freeSquares[i][1], 'O');

            //Then we evaluate the move
            let moveValue = _miniMax(testBoard, 0, false);
            //Change values if new best move is found
            if (moveValue >= highestValueMove) {
                highestValueMove = moveValue;
                bestMove = freeSquares[i];
            };
        }

        playRound(bestMove[0], bestMove[1]);

    };

    const _miniMax = (board, depth, isMaximising) => {
        //First we check if previous board is winning
        if(board.isWinningBoard()) {
            return isMaximising ? depth - 10 : 10 - depth; 
        }

        const freeSquares = board.getFreeSquares();
        //If there are no free moves left and no win it is a draw
        if(freeSquares.length === 0) return 0;

        let highestMoveValue = -Infinity;
        let lowestMoveValue = Infinity;

        freeSquares.forEach(move => {
            //We create a temporary copy of the board
            let testBoard = GameBoard(board.getBoard());

            if(isMaximising) {
                testBoard.setSquare(move[0], move[1], 'O');
                let moveValue =_miniMax(testBoard, depth + 1, false)
                highestMoveValue = Math.max(moveValue, highestMoveValue);
            } else {
                testBoard.setSquare(move[0], move[1], 'X');
                let moveValue =_miniMax(testBoard, depth + 1, true)
                lowestMoveValue = Math.min(moveValue, lowestMoveValue);
            }
        })

        return isMaximising ? highestMoveValue : lowestMoveValue;
    };

    return {
        initPlayers,
        playRound,
        resetMainGameBoard,
        getPlayers
    }
})();

//Inital function calls
displayController.renderForm();
inputController.initPlayerSelectInput();