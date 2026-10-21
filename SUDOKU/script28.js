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
    initTheme(); // Load saved theme preference on startup
    
    let startBtn = document.getElementById("start-btn");
    if (startBtn) {
        startBtn.addEventListener("click", startGame);
    }
    
    // Bind click event to reset button
    let resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", resetGame);
    }

    // Bind click event to theme toggle button
    let themeBtn = document.getElementById("theme-toggel");
    if (themeBtn) {
        themeBtn.addEventListener("click", toggleTheme);
    }
};

/* --- Theme Management Functions --- */

function initTheme() {
    let savedTheme = localStorage.getItem("sudoku-theme");
    let themeBtn = document.getElementById("theme-toggel");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        if (themeBtn) {
            themeBtn.innerHTML = 'Night <i class="fa-solid fa-moon"></i>';
        }
    } else {
        document.body.classList.remove("dark-theme");
        if (themeBtn) {
            themeBtn.innerHTML = 'Day <i class="fa-regular fa-sun"></i>';
        }
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-theme");
    let isDark = document.body.classList.contains("dark-theme");
    let themeBtn = document.getElementById("theme-toggel");

    if (isDark) {
        if (themeBtn) themeBtn.innerHTML = 'Night <i class="fa-solid fa-moon"></i>';
        localStorage.setItem("sudoku-theme", "dark");
    } else {
        if (themeBtn) themeBtn.innerHTML = 'Day <i class="fa-regular fa-sun"></i>';
        localStorage.setItem("sudoku-theme", "light");
    }
}

/* --- Core Game Functions --- */

function startGame() {
    if (gamestarted) return;

    gamestarted = true;
    let startBtn = document.getElementById("start-btn");
    if (startBtn) startBtn.disabled = true;

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
    document.querySelectorAll(".score-feedback").forEach(function(feedback) {
        feedback.remove();
    });

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
    let startBtn = document.getElementById("start-btn");
    if (startBtn) startBtn.disabled = false;
}

function setGame() {
    let digitsElem = document.getElementById("digits");
    let boardElem = document.getElementById("board");

    if (digitsElem) digitsElem.innerHTML = "";
    if (boardElem) boardElem.innerHTML = "";

    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i.toString();
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        if (digitsElem) digitsElem.appendChild(number);
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
            if (boardElem) boardElem.append(tile);
        }
    }

    // Initial check for digits present 9 times at load
    checkDigitCounts();
}

function selectNumber() {
    if (!gamestarted) return;
    if (this.classList.contains("disabled-number")) return;

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
            animateTiles([this], "completed-unit");
            let scoreChanges = [2];
            score += 2;

            checkDigitCounts();
            checkScoreBonuses(r, c, scoreChanges);
            updateUI();
            animateScoreChange(scoreChanges);
        } else {
            errors += 1;
            score -= 5;
            updateUI();
            animateTiles([this], "incorrect-placement");
            animateScoreChange([-5]);
        }
    }
}

function updateUI() {
    let scoreElement = document.getElementById("score");
    if (scoreElement) scoreElement.innerText = score;

    let errorsElement = document.getElementById("errors");
    if (errorsElement) errorsElement.innerText = errors;
}

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
                numBtn.title = "This number can't be used anymore";

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

function checkScoreBonuses(r, c, scoreChanges) {
    if (!completedRows.has(r) && isRowComplete(r)) {
        completedRows.add(r);
        score += 4;
        scoreChanges.push(4);
        animateTiles(getRowTiles(r), "completed-unit");
    }

    if (!completedCols.has(c) && isColComplete(c)) {
        completedCols.add(c);
        score += 4;
        scoreChanges.push(4);
        animateTiles(getColumnTiles(c), "completed-unit");
    }

    let boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    if (!completedBoxes.has(boxIndex) && isBoxComplete(boxIndex)) {
        completedBoxes.add(boxIndex);
        score += 6;
        scoreChanges.push(6);
        animateTiles(getBoxTiles(boxIndex), "completed-unit");
    }

    let tierIndex = Math.floor(r / 3);
    if (!completedTiers.has(tierIndex) && isTierComplete(tierIndex)) {
        completedTiers.add(tierIndex);
        score += 8;
        scoreChanges.push(8);
    }

    let towerIndex = Math.floor(c / 3);
    if (!completedTowers.has(towerIndex) && isTowerComplete(towerIndex)) {
        completedTowers.add(towerIndex);
        score += 8;
        scoreChanges.push(8);
    }

    if (completedBoxes.size === 9) {
        score += 10;
        scoreChanges.push(10);
        gameFinished = true;
        clearInterval(timerInterval);
        alert("Congratulations! Puzzle completed with score: " + score);
    }
}

function animateScoreChange(changes) {
    let scoreLabel = document.getElementById("score-txt");
    if (!scoreLabel || changes.length === 0) return;

    let feedback = document.createElement("span");
    feedback.className = "score-feedback " + (changes.some(change => change < 0) ? "score-deduction" : "score-increase");
    feedback.innerText = changes.map(change => (change > 0 ? "+" : "") + change).join(" ");
    scoreLabel.appendChild(feedback);
    feedback.addEventListener("animationend", function() {
        feedback.remove();
    });
}

function animateTiles(tiles, animationClass) {
    tiles.forEach(function(tile) {
        tile.classList.remove(animationClass);
        void tile.offsetWidth;
        tile.classList.add(animationClass);
        let animationName = animationClass === "completed-unit" ? "completed-unit-glow" : "incorrect-placement-glow";
        let removeAnimationClass = function(event) {
            if (event.animationName !== animationName) return;
            tile.classList.remove(animationClass);
            tile.removeEventListener("animationend", removeAnimationClass);
        };
        tile.addEventListener("animationend", removeAnimationClass);
    });
}

function getRowTiles(row) {
    return Array.from({ length: 9 }, function(_, col) {
        return document.getElementById(row + "-" + col);
    }).filter(Boolean);
}

function getColumnTiles(col) {
    return Array.from({ length: 9 }, function(_, row) {
        return document.getElementById(row + "-" + col);
    }).filter(Boolean);
}

function getBoxTiles(boxIndex) {
    let startRow = Math.floor(boxIndex / 3) * 3;
    let startCol = (boxIndex % 3) * 3;
    let tiles = [];
    for (let row = startRow; row < startRow + 3; row++) {
        for (let col = startCol; col < startCol + 3; col++) {
            let tile = document.getElementById(row + "-" + col);
            if (tile) tiles.push(tile);
        }
    }
    return tiles;
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