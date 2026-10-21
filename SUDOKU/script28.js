var numSelected = null;
var tileSelected = null;
var errors = 0;
var score = 0;

var gamestarted = false;
var secondElapsed = 0;
var timerInterval = null;

var completedRows = new Set();
var completedCols = new Set();
var completedBoxes = new Set();
var completedTiers = new Set();
var completedTowers = new Set();
var gameFinished = false;

var board = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
];

var solution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
];

window.onload = function() {
    setGame();
    document.getElementById("start-btn").addEventListener("click", startGame);
    
    // Bind click event to reset button
    let resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", resetGame);
    }
};

function startGame() {
    if (gamestarted) return;

    gamestarted = true;
    document.getElementById("start-btn").disabled = true;

    secondElapsed = 0;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    secondElapsed++;
    let minutes = Math.floor(secondElapsed / 60);
    let seconds = secondElapsed % 60;

    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    let timerElement = document.getElementById("timer");
    if (timerElement) {
        timerElement.innerText = formattedMinutes + ":" + formattedSeconds;
    }
}

function resetGame() {
    // 1. Clear timer interval and reset clock
    if (timerInterval) clearInterval(timerInterval);
    secondElapsed = 0;
    let timerElement = document.getElementById("timer");
    if (timerElement) timerElement.innerText = "00:00";

    // 2. Reset game state variables
    gamestarted = false;
    gameFinished = false;
    score = 0;
    errors = 0;

    completedRows.clear();
    completedCols.clear();
    completedBoxes.clear();
    completedTiers.clear();
    completedTowers.clear();

    // 3. Clear selected number highlight
    if (numSelected) {
        numSelected.classList.remove("number-selected");
        numSelected = null;
    }

    // 4. Reset board tiles back to starting configuration
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            if (tile) {
                if (board[r][c] !== "-") {
                    tile.innerText = board[r][c];
                    tile.className = "tile tile-start";
                } else {
                    tile.innerText = "";
                    tile.className = "tile";
                }

                if (r == 2 || r == 5) tile.classList.add("horizontal-line");
                if (c == 2 || c == 5) tile.classList.add("vertical-line");
            }
        }
    }

    // 5. Update UI counters and reset number button states
    updateUI();
    checkDigitCounts();

    // 6. Re-enable start button
    document.getElementById("start-btn").disabled = false;
}

function setGame() {
    document.getElementById("digits").innerHTML = "";
    document.getElementById("board").innerHTML = "";

    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }

    // Initial check for digits present 9 times at load
    checkDigitCounts();
}

function selectNumber() {
    if (!gamestarted) return;
    if (this.classList.contains("disabled-number")) return; // Prevent selection if number is finished

    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (!gamestarted || gameFinished) return;

    if (numSelected) {
        if (this.innerText != "") {
            return;
        }

        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;
            score += 2;

            checkDigitCounts(); // Update finished number states
            checkScoreBonuses(r, c);
            updateUI();
        } else {
            errors += 1;
            score -= 5;
            updateUI();
        }
    }
}

function updateUI() {
    let scoreElement = document.getElementById("score");
    if (scoreElement) scoreElement.innerText = score;

    let errorsElement = document.getElementById("errors");
    if (errorsElement) errorsElement.innerText = errors;
}

// Function to check and disable numbers that have been fully placed (9 times)
function checkDigitCounts() {
    for (let num = 1; num <= 9; num++) {
        let count = 0;

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                if (tile && tile.innerText === num.toString()) {
                    count++;
                }
            }
        }

        let numBtn = document.getElementById(num.toString());
        if (numBtn) {
            if (count >= 9) {
                numBtn.classList.add("disabled-number");
                numBtn.title = "this number cant be used anymore";

                // Unselect if the active digit just got completed
                if (numSelected === numBtn) {
                    numSelected.classList.remove("number-selected");
                    numSelected = null;
                }
            } else {
                numBtn.classList.remove("disabled-number");
                numBtn.removeAttribute("title");
            }
        }
    }
}

function checkScoreBonuses(r, c) {
    if (!completedRows.has(r) && isRowComplete(r)) {
        completedRows.add(r);
        score += 4;
    }

    if (!completedCols.has(c) && isColComplete(c)) {
        completedCols.add(c);
        score += 4;
    }

    let boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    if (!completedBoxes.has(boxIndex) && isBoxComplete(boxIndex)) {
        completedBoxes.add(boxIndex);
        score += 6;
    }

    let tierIndex = Math.floor(r / 3);
    if (!completedTiers.has(tierIndex) && isTierComplete(tierIndex)) {
        completedTiers.add(tierIndex);
        score += 8;
    }

    let towerIndex = Math.floor(c / 3);
    if (!completedTowers.has(towerIndex) && isTowerComplete(towerIndex)) {
        completedTowers.add(towerIndex);
        score += 8;
    }

    if (completedBoxes.size === 9) {
        score += 10;
        gameFinished = true;
        clearInterval(timerInterval);
        alert("Congratulations! Puzzle completed with score: " + score);
    }
}

function getTileValue(row, col) {
    let el = document.getElementById(row + "-" + col);
    return el ? el.innerText : "";
}

function isRowComplete(row) {
    for (let col = 0; col < 9; col++) {
        if (getTileValue(row, col) !== solution[row][col]) return false;
    }
    return true;
}

function isColComplete(col) {
    for (let row = 0; row < 9; row++) {
        if (getTileValue(row, col) !== solution[row][col]) return false;
    }
    return true;
}

function isBoxComplete(boxIndex) {
    let startRow = Math.floor(boxIndex / 3) * 3;
    let startCol = (boxIndex % 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (getTileValue(r, c) !== solution[r][c]) return false;
        }
    }
    return true;
}

function isTierComplete(tierIndex) {
    return completedBoxes.has(tierIndex * 3) &&
           completedBoxes.has(tierIndex * 3 + 1) &&
           completedBoxes.has(tierIndex * 3 + 2);
}

function isTowerComplete(towerIndex) {
    return completedBoxes.has(towerIndex) &&
           completedBoxes.has(towerIndex + 3) &&
           completedBoxes.has(towerIndex + 6);
}