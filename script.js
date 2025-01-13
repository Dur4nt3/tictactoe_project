// IIFE for performing various actions on DOM elements

const elementManipulator = (function (){
    const hide = (element) => (element.classList.add("hide"));
    const show = (element) => (element.classList.remove("hide"));

    // Specifically made for this project where it will be used for parents with 2 children (a class set for each)
    const resetChildClasses = (parentElement, classSet1, classSet2) => {
        let childArray = Array.from(parentElement.children);
        childArray.forEach((item, index) => {
            if (index % 2 == 0) {
                item.removeAttribute("class");
                item.classList.add(...classSet1);
            }
            else {
                item.removeAttribute("class");
                item.classList.add(...classSet2);
            } 
        });
    };

    const playAnimation = (element, animationClass, remove, removalDelay = 0) => {
        element.classList.add(animationClass);
        if (remove) {
            setTimeout(() => { element.classList.remove(animationClass) }, removalDelay);
        }
    }


    return { hide, show, playAnimation, resetChildClasses };
})();


// Player factory function
function playerFactory(name) {
    let playerStats = [0,0,0];
    let mark;
    let turnPriority;

    // Formatted - for display purposes || Pure - for code functionality
    const getPlayerStatsFormatted = () => {
        return `${playerStats[0]} Wins | ${playerStats[1]} Losses | ${playerStats[2]} Draws`
    }
    const getPlayerStatsPure = () => playerStats;
    const assignPlayerStats = (stat) => {
        switch(stat) {
            case 'w':
                playerStats[0]++;
                break;

            case 'l':
                playerStats[1]++;
                break;

            case 'd':
                playerStats[2]++;
                break;
        }
    }

    const getMark = () => mark;
    const assignMark = (type) => (mark = type);

    const getTurnPriority = () => turnPriority;
    const assignTurnPriority = (priority) => (turnPriority = priority);

    return { name, getPlayerStatsFormatted, getPlayerStatsPure, assignPlayerStats, getMark, assignMark, getTurnPriority, assignTurnPriority };
}

// Game flow factory function

function gameFlow(player1, player2) {
    let gameBoard = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
    let turnNum = 1;
    // -1: Not started; 0: Ongoing; 1: Concluded
    let gameStatus = -1;
    let latestResult;

    // Verify results without bloating the below function
    function checkBoard(position, mark) {
        let result = false;
        switch (position) {
            case "row":
                // Check each row
                if ((gameBoard[0] == gameBoard[1] && gameBoard[1] == gameBoard[2] && gameBoard[2] == mark) || 
                (gameBoard[3] == gameBoard[4] && gameBoard[4] == gameBoard[5] && gameBoard[5] == mark) || 
                (gameBoard[6] == gameBoard[7] && gameBoard[7] == gameBoard[8] && gameBoard[8] == mark)) {
                    result = true;
                }
                break;

            case "column":
                // Check each column
                if ((gameBoard[0] == gameBoard[3] && gameBoard[3] == gameBoard[6] && gameBoard[6] == mark) || 
                (gameBoard[1] == gameBoard[4] && gameBoard[4] == gameBoard[7] && gameBoard[7] == mark) || 
                (gameBoard[2] == gameBoard[5] && gameBoard[5] == gameBoard[8] && gameBoard[8] == mark)) {
                    result = true;
                }
                break;

            case "diagonal":
                // Check diagonally
                if ((gameBoard[0] == gameBoard[4] && gameBoard[4] == gameBoard[8] && gameBoard[8] == mark) || 
                (gameBoard[2] == gameBoard[4] && gameBoard[4] == gameBoard[6] && gameBoard[6] == mark)) {
                    result = true;
                }
                break;
        }
        return result;
    }

    function winCondition(mark) {
        if (checkBoard("row", mark)) {
            return mark;
        }
        
        else if (checkBoard("column", mark)) {
            return mark;
        }
        
        else if (checkBoard("diagonal", mark)) {
            return mark;
        }
        
        // Tie or game is still ongoing
        else if (turnNum == 9) {
            return "d";
        }
        else {
            return -1;
        }
    }

    function finishGame(result) {
        // Game is over regardless of the results - reset board and turns
        for (index in gameBoard) {
            gameBoard[index] = " ";
        }
        turnNum = 1;

        if (result == "d") {
            player1.assignPlayerStats("d");
            player2.assignPlayerStats("d");
            latestResult = "d";
        }

        else if (result == "X") {
            if (player1.getMark() == "X") {
                player1.assignPlayerStats("w");
                player2.assignPlayerStats("l");
                latestResult = "p1w";
            }
            else {
                player2.assignPlayerStats("w");
                player1.assignPlayerStats("l");
                latestResult = "p2w";
            }
        }

        else if (result == "O") {
            if (player1.getMark() == "O") {
                player1.assignPlayerStats("w");
                player2.assignPlayerStats("l");
                latestResult = "p1w";
            }
            else {
                player2.assignPlayerStats("w");
                player1.assignPlayerStats("l");
                latestResult = "p2w";
            }
        }

        gameStatus = 1;
    }

    const beginGame = () => {
        // Decide who goes first
        let coinToss = Math.floor(Math.random() * 2) + 1;
        gameStatus = 0;
        if (coinToss == 1) {
            player1.assignTurnPriority(1);
            player1.assignMark("X");
            player2.assignTurnPriority(2);
            player2.assignMark("O");
        }
        else {
            player2.assignTurnPriority(1);
            player2.assignMark("X");
            player1.assignTurnPriority(2);
            player1.assignMark("O");
        }
    }

    const playTurn = (move) => {
        let gameResult;
        // Player who goes first - always X
        if (turnNum % 2 != 0) {
            if (gameBoard[move] == " ") {
                gameBoard[move] = "X";
                gameResult = winCondition("X");
                
                if (gameResult != -1) {
                    finishGame(gameResult);
                }
                else {
                    turnNum++;
                }
            }
        }
        // Player who goes second - always O
        else {
            if (gameBoard[move] == " ") {
                gameBoard[move] = "O";
                console.log(gameBoard);
                gameResult = winCondition("O");
                
                if (gameResult != -1) {
                    finishGame(gameResult);
                }
                else {
                    turnNum++;
                }
            }
        }
        console.log(gameBoard);
    }

    const getTurn = () => turnNum;
    const getGameStatus = () => gameStatus;
    const getLatestResults = () => latestResult;

    return { player1, player2, beginGame, playTurn, getTurn, getGameStatus, getLatestResults };
};

let player1, player2, gameFlowVar;

document.querySelector(".main").addEventListener("click", (e) => {
    let target = e.target.classList[0];

    // Control name changing
    if (target == "edit-name") {
        if (e.target.classList[1] == "player1-edit-name") {
            elementManipulator.hide(document.querySelectorAll(".name-display")[0]);
            elementManipulator.show(document.querySelectorAll(".name-edit")[0]);
        }
        else {
            elementManipulator.hide(document.querySelectorAll(".name-display")[1]);
            elementManipulator.show(document.querySelectorAll(".name-edit")[1]);
        }
    }

    if (target == "submit-player1-name") {
        let player1Name = document.querySelector("#player1-name-input").value;
        elementManipulator.hide(document.querySelectorAll(".name-edit")[0]);
        elementManipulator.show(document.querySelectorAll(".name-display")[0]);
        document.querySelector(".player1-title").textContent = player1Name;
        document.querySelector(".player1-name").textContent = player1Name;
        player1.name = player1Name;
    }
    else if (target == "submit-player2-name") {
        let player2Name = document.querySelector("#player2-name-input").value;
        elementManipulator.hide(document.querySelectorAll(".name-edit")[1]);
        elementManipulator.show(document.querySelectorAll(".name-display")[1]);
        document.querySelector(".player2-title").textContent = player2Name;
        document.querySelector(".player2-name").textContent = player2Name;
        player2.name = player2Name;
    }

    // When attempting to start the first game - create the players
    function createPlayers() {
        let player1Name = document.querySelector("#player1-name-input").value;
        let player2Name = document.querySelector("#player2-name-input").value;
        if (player1Name == "") {
            player1 = playerFactory("Player1");
        }
        else {
            player1 = playerFactory(player1Name);
        }

        if (player2Name == "") {
            player2 = playerFactory("Player2")
        }
        else {
            player2 = playerFactory(player2Name);
        }

        gameFlowVar = gameFlow(player1, player2);
    }

    // DOM sequence to trigger when starting a new game
    function playerStartSequence() {
        let starterName = (player1.getTurnPriority() < player2.getTurnPriority()) ? player1.name : player2.name;
        let starterAlert = document.querySelector(".starter-name");
        let player1Piece = document.querySelector(".player1-piece");
        let player2Piece = document.querySelector(".player2-piece");

        starterAlert.textContent = starterName;
        elementManipulator.playAnimation(starterAlert.parentElement, "alert-animation", true, 3000);
        if (starterName == player1.name) {
            elementManipulator.show(document.querySelector(".left-pointer"));

            elementManipulator.hide(player1Piece.querySelector(".circle"))
            elementManipulator.show(player1Piece.querySelector(".cross"))
            elementManipulator.playAnimation(player1Piece.querySelector(".cross"), "play-animation", false);

            elementManipulator.hide(player2Piece.querySelector(".cross"))
            elementManipulator.show(player2Piece.querySelector(".circle"))
            elementManipulator.playAnimation(player2Piece.querySelector(".circle"), "play-animation", false);
        }
        else {
            elementManipulator.show(document.querySelector(".right-pointer"));

            elementManipulator.hide(player2Piece.querySelector(".circle"))
            elementManipulator.show(player2Piece.querySelector(".cross"))
            elementManipulator.playAnimation(player2Piece.querySelector(".cross"), "play-animation", false);

            elementManipulator.hide(player1Piece.querySelector(".cross"))
            elementManipulator.show(player1Piece.querySelector(".circle"))
            elementManipulator.playAnimation(player1Piece.querySelector(".circle"), "play-animation", false);
        }
    }

    // Initiate game start - whether first game or subsequent games
    if (target == "start-game") {
        let coinSvg = document.querySelector(".coin-svg");
        elementManipulator.hide(document.querySelector(".start-game"));
        elementManipulator.show(coinSvg);
        elementManipulator.playAnimation(coinSvg, "rotate-animation", true, 1750);
        setTimeout(() => {elementManipulator.hide(coinSvg)}, 2000);

        // If true - this is the first game
        if (player1 == undefined && player2 == undefined) {
            createPlayers();
        }
        // Else - subsequent games
        document.querySelector(".turn-counter").textContent = gameFlowVar.getTurn();
        gameFlowVar.beginGame();
        setTimeout(() => {elementManipulator.show(document.querySelector(".turn-wrapper"))}, 2000);
        setTimeout(() => { playerStartSequence()}, 1750);
    }

    // Completely reset board
    function resetBoard() {
        let cellArray = Array.from(document.querySelectorAll(".board-cell"));
        for (i in cellArray) {
            elementManipulator.resetChildClasses(cellArray[i], ["circle", "hide"], ["cross", "hide"]);
        }
        elementManipulator.resetChildClasses(document.querySelector(".player1-piece"), ["circle"], ["cross", "hide"]);
        elementManipulator.resetChildClasses(document.querySelector(".player2-piece"), ["circle"], ["cross", "hide"]);
    }

    // DOM sequence when game is over
    function gameOverSequence(latestResult) {
        let resultSpan = document.querySelector(".result-span");
        if (latestResult == "p1w") {
            resultSpan.textContent = player1.name + " WON!";
            elementManipulator.playAnimation(resultSpan.parentElement, "alert-animation", true, 3000);
        }
        else if (latestResult == "p2w") {
            resultSpan.textContent = player2.name + " WON!";
            elementManipulator.playAnimation(resultSpan.parentElement, "alert-animation", true, 3000);
        }
        else {
            resultSpan.textContent = "It's a DRAW!";
            elementManipulator.playAnimation(resultSpan.parentElement, "alert-animation", true, 3000);
        }
        document.querySelector(".player1-statistics").textContent = player1.getPlayerStatsFormatted();
        document.querySelector(".player2-statistics").textContent = player2.getPlayerStatsFormatted();
        setTimeout(() => {
            elementManipulator.hide(document.querySelector(".turn-wrapper"));
            elementManipulator.show(document.querySelector(".start-game"));
            resetBoard();
        },2750);
    }

    if (target == "empty-cell") {
        let gameStatus;
        try {
            gameStatus = gameFlowVar.getGameStatus();
        }
        catch (error) {
            gameStatus = null;
        }

        if (gameStatus == 0){
            let cellID = e.target.id.slice(-1) - 1;
            let cellElement = e.target.children;
            let currentTurn = gameFlowVar.getTurn();
            gameFlowVar.playTurn(cellID);
            let nextTurn = gameFlowVar.getTurn();
            // Regular turn
            if (nextTurn - 1 == currentTurn) {
                if (currentTurn % 2 != 0) {
                    elementManipulator.show(cellElement[1]);
                    elementManipulator.playAnimation(cellElement[1], "play-animation", false);
                }
                else {
                    elementManipulator.show(cellElement[0]);
                    elementManipulator.playAnimation(cellElement[0], "play-animation", false);
                }
                document.querySelector(".turn-counter").textContent = nextTurn;
            }
            // Game ended if the below statement is true
            else if (nextTurn < currentTurn) {
                // Last turn - always X
                if (currentTurn == 9) {
                    elementManipulator.show(cellElement[1]);
                    elementManipulator.playAnimation(cellElement[1], "play-animation", false);
                }
                // Some player won
                else {
                    if (currentTurn % 2 != 0) {
                        elementManipulator.show(cellElement[1]);
                        elementManipulator.playAnimation(cellElement[1], "play-animation", false);
                    }
                    else {
                        elementManipulator.show(cellElement[0]);
                        elementManipulator.playAnimation(cellElement[0], "play-animation", false);
                    }
                }
                gameOverSequence(gameFlowVar.getLatestResults());
            }
        }
    }
});