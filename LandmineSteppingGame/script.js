let boardSize = 8;
let mineCount = 10;
let mines = [];
let revealed = [];
let timer;
let gameStarted = false;
let seconds = 0;
let isMiddlePressed = false;

function startGame() {
    gameStarted = true;
    seconds = 0;
    document.getElementById('timer').textContent = `Time: ${seconds}s`;
    mines = generateMines();
    revealed = Array(boardSize).fill().map(() => Array(boardSize).fill(false));

    const board = document.getElementById('game-board');
    board.innerHTML = '';  // 清空遊戲板

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const button = document.createElement('button');
            button.dataset.row = i;
            button.dataset.col = j;
            button.addEventListener('click', handleCellClick);
            button.addEventListener('mousedown', handleMiddleDown);
            button.addEventListener('contextmenu', (e) => e.preventDefault()); // 攔截右鍵選單事件
            button.addEventListener('mousedown', handleRightDown);
            board.appendChild(button);
        }
    }

    startTimer();
}

function generateMines() {
    const mines = [];
    while (mines.length < mineCount) {
        let row = Math.floor(Math.random() * boardSize);
        let col = Math.floor(Math.random() * boardSize);
        if (!mines.some(mine => mine.row === row && mine.col === col)) {
            mines.push({ row, col });
        }
    }
    return mines;
}


/**
 * 格子滑鼠點擊事件
 * @param {any} event
 * @returns
 */
function handleCellClick(event) {
    if (!gameStarted) return; // 結束後不再回應點擊

    const button = event.target;
    const row = parseInt(button.dataset.row);
    const col = parseInt(button.dataset.col);

    // 如果點擊的是地雷，結束遊戲
    if (mines.some(mine => mine.row === row && mine.col === col)) {
        button.classList.add('mine');
        gameStarted = false;
        stopTimer();
        setTimeout(() => {
            alert('遊戲結束！你踩到地雷！');
        }, 10); // 延遲一點點時間，讓畫面有機會更新，格子先變紅再跳提示
    } else {
        revealCell(row, col);  // 揭開安全格子
    }

    // 檢查是否勝利
    if (checkWin()) {
        gameStarted = false;
        stopTimer();
        setTimeout(() => {
            alert('恭喜，你贏了！');
        }, 10); // 延遲一點點時間，讓畫面有機會更新，格子先揭開再跳提示
    }
}

/**
 * 格子滑鼠中鍵事件
 * @param {any} event
 * @returns
 */
function handleMiddleDown(event) {
    if (event.button !== 1 || !gameStarted) return;

    isMiddlePressed = true;
    const button = event.target;
    const row = parseInt(button.dataset.row);
    const col = parseInt(button.dataset.col);

    highlightNeighbors(row, col);
    event.preventDefault(); // 防止頁面滾動
}
function handleMiddleUp(event) {
    isMiddlePressed = false;
    clearHighlight();
}
function handleMouseMove(event) {
    if (!isMiddlePressed) return;

    const button = event.target;
    if (!button || !button.dataset.row || !button.dataset.col) return;

    const row = parseInt(button.dataset.row);
    const col = parseInt(button.dataset.col);

    clearHighlight();
    highlightNeighbors(row, col);
}
function highlightNeighbors(row, col) {
    const neighbors = getNeighbors(row, col);
    neighbors.push([row, col]);

    neighbors.forEach(([r, c]) => {
        const cell = document.querySelector(`button[data-row="${r}"][data-col="${c}"]`);
        if (cell) cell.classList.add('highlight');
    });
}
function clearHighlight() {
    document.querySelectorAll('.highlight').forEach(btn => {
        btn.classList.remove('highlight');
    });
}

/**
 * 格子滑鼠右鍵事件
 * @param {any} event
 * @returns
 */
function handleRightDown(event) {
    if (event.button !== 2 || !gameStarted) return;

    const button = event.target;
    const row = parseInt(button.dataset.row);
    const col = parseInt(button.dataset.col);

    markingMines(row, col, button);
}
function markingMines(row, col, button) {
    if (revealed[row][col]) return;
    button.classList.toggle('mark');
}

/**
 * 揭開格子
 * @param {any} row
 * @param {any} col
 * @returns
 */
function revealCell(row, col) {
    const button = document.querySelector(`button[data-row="${row}"][data-col="${col}"]`);
    if (revealed[row][col]) return;

    revealed[row][col] = true;
    button.classList.add('revealed');

    // 計算周圍的雷數
    const mineCountAround = countMinesAround(row, col);
    if (mineCountAround > 0) {
        button.textContent = mineCountAround;  // 顯示周圍地雷數
    } else {
        // 如果周圍沒有地雷，則遞迴地揭開鄰近的格子
        const neighbors = getNeighbors(row, col);
        neighbors.forEach(neighbor => {
            const [r, c] = neighbor;
            if (!revealed[r][c]) {
                revealCell(r, c);
            }
        });
    }
}

function countMinesAround(row, col) {
    const neighbors = getNeighbors(row, col);
    return neighbors.filter(([r, c]) => mines.some(mine => mine.row === r && mine.col === c)).length;
}

function getNeighbors(row, col) {
    const neighbors = [];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
            neighbors.push([newRow, newCol]);
        }
    }
    return neighbors;
}

function checkWin() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (!revealed[i][j] && !mines.some(mine => mine.row === i && mine.col === j)) {
                return false;
            }
        }
    }
    return true;
}

function startTimer() {
    if (!gameStarted) return;
    timer = setInterval(() => {
        seconds++;
        document.getElementById('timer').textContent = `Time: ${seconds}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('game-board').addEventListener('mousemove', handleMouseMove);
document.getElementById('game-board').addEventListener('mouseup', handleMiddleUp);
