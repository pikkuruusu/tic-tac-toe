const gameBoard = (function() {
    let board = [[],[],[]];

    const setSquare = (y, x, value) => {
        board[y][x] = value;
    }

    const getSquare = (y, x) => {
        return board[y][x];
    }

    return {
        setSquare,
        getSquare
    }
})();

const displayController = (function(doc) {
    const writeToDOM = (y, x, value) => {
        if(doc && "querySelector" in doc) {
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
        if(doc && "querySelector" in doc) {
            const squares = doc.querySelectorAll(".square-content");
            squares.forEach(square => square.addEventListener('click', function(e) {
                const coordinates = e.target.dataset.yxCoordinate.split('');
                //Test:
                displayController.writeToDOM(coordinates[0], coordinates[1], "O");
            }));
        };
    };

    return {
        init,
    }
})(document);

inputController.init();