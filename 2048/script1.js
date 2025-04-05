let users = {};
let currentUser = null;
let score = 0;
let globalBestScore = 0; // ���������� ��� �������� ������� ����� ����� ���� �������������
const grid = new Array(16).fill(0); // �������� ������� ��� ����

// ������� ��� ������������� ����
function initializeGame() {
    grid.fill(0); // ������� �����
    score = 0; // ���������� ����
    addRandomTile(); // ��������� ������
    addRandomTile(); // ��������� ��� ���� ������
    render(); // ���������� ��������� �����
}

// ������� ��� ���������� ��������� ������
function addRandomTile() {
    const emptyIndices = grid.map((val, index) => val === 0 ? index : -1).filter(val => val !== -1);
    if (emptyIndices.length > 0) {
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        grid[randomIndex] = Math.random() < 0.9 ? 2 : 4; // 90% ����������� �������� 2
    }
}

// ������� ��� ��������� �����
function render() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = ''; // ������� ��������� ����� ����������

    grid.forEach((value, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-value', value);
        tile.setAttribute('data-index', index);
        tile.innerText = value > 0 ? value : '';

        // ��������� ����� ���� � ����������� �� �������� ������
        tile.style.backgroundColor = getTileColor(value);

        gridContainer.appendChild(tile);
    });

    renderBestScore(); // �������� ������� ���������� �����
}
// ������� ��� ��������� ����� ������ �� ��������
function getTileColor(value) {
    switch (value) {
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f67c5f';
        case 128: return '#f9f68c';
        case 256: return '#f9f68c';
        case 512: return '#f9f68c';
        case 1024: return '#edc22e';
        case 2048: return '#edc22e';
        default: return '#cdc1b4'; // ���� ��� ������� ��������
    }
}
// ������� ��� ���������� �������������
function saveUserScores() {
    localStorage.setItem('users', JSON.stringify(users));
}

// ������� �������� �������������
function loadUserScores() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
}

// ������� ��� ���������� ������� �����
function updateUserScore() {
    if (currentUser && score > users[currentUser]) {
        users[currentUser] = score; // ��������� ������ ���� ��� �������� ������������
        saveUserScores(); // ��������� �������������
    }

    // �������� �� ���������� ������
    if (score > globalBestScore) {
        globalBestScore = score; // ��������� ���������� ������ ����
    }
}

// ������� ��� ���������� ����������� ������
function renderBestScore() {
    const bestScoreContainer = document.getElementById('best-score');
    const currentScoreContainer = document.getElementById('player-score');

    if (currentUser) {
        bestScoreContainer.innerText = `������ ����: ${users[currentUser] || 0}`; // ���������� || 0, ���� ������������ ������� �� �����
        currentScoreContainer.innerText = `������� ����: ${score}`;
    }
    else {
        bestScoreContainer.innerText = '�������� ������ ��� ������.';
        currentScoreContainer.innerText = '';
    }

    // ����������� ����������� �������
    const globalBestScoreContainer = document.getElementById('global-best-score');
    globalBestScoreContainer.innerText = `���������� ������ ����: ${globalBestScore}`;
}

// ������� ��� ��������� �������� ������������
function setCurrentUser(username) {
    currentUser = username;
    if (!users[currentUser]) {
        users[currentUser] = 0; // �������������� ������������ � ������� ������
    }
}

// �������� �� ���������� ����
function checkGameOver() {
    // ���������, ���� �� ������ ������
    if (grid.includes(0)) return false;

    // ���������, ����� �� ���������� ������
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const currentTile = grid[row * 4 + col];
            if (
                (col < 3 && currentTile === grid[row * 4 + (col + 1)]) || // �������� ������
                (row < 3 && currentTile === grid[(row + 1) * 4 + col]) // �������� ����
            ) {
                return false;
            }
        }
    }

    return true; // ��� ��������� �����
}

// ����������� � ���������
function moveUp() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        const column = [grid[col], grid[col + 4], grid[col + 8], grid[col + 12]].filter(n => n);
        const newColumn = mergeTiles(column);
        for (let row = 0; row < 4; row++) {
            const originalIndex = col + row * 4;
            if (row < newColumn.length) {
                if (grid[originalIndex] !== newColumn[row]) {
                    moved = true;
                    animateTileMove(originalIndex, col, row); // ��������� ��������
                }
                grid[originalIndex] = newColumn[row];
            } else {
                grid[originalIndex] = 0;
            }
        }
    }
    return moved; // ������, ��������� �� �������� ������
}

function moveDown() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        const column = [grid[col + 12], grid[col + 8], grid[col + 4], grid[col]].filter(n => n);
        const newColumn = mergeTiles(column);
        for (let row = 0; row < 4; row++) {
            if (row < newColumn.length) {
                if (grid[col + (3 - row) * 4] !== newColumn[row]) {
                    moved = true;
                    animateTileMove(col + (3 - row) * 4, col, 3 - row); // ��������
                }
                grid[col + (3 - row) * 4] = newColumn[row];
            } else {
                grid[col + (3 - row) * 4] = 0;
            }
        }
    }
    return moved;
}

function moveLeft() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
        const rowData = [grid[row * 4], grid[row * 4 + 1], grid[row * 4 + 2], grid[row * 4 + 3]].filter(n => n);
        const newRow = mergeTiles(rowData);
        for (let col = 0; col < 4; col++) {
            if (col < newRow.length) {
                if (grid[row * 4 + col] !== newRow[col]) {
                    moved = true;
                    animateTileMove(row * 4 + col, col, row); // ��������
                }
                grid[row * 4 + col] = newRow[col];
            } else {
                grid[row * 4 + col] = 0;
            }
        }
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
        const rowData = [grid[row * 4 + 3], grid[row * 4 + 2], grid[row * 4 + 1], grid[row * 4]].filter(n => n);
        const newRow = mergeTiles(rowData);
        for (let col = 0; col < 4; col++) {
            if (col < newRow.length) {
                if (grid[row * 4 + (3 - col)] !== newRow[col]) {
                    moved = true;
                    animateTileMove(row * 4 + (3 - col), 3 - col, row); // ��������
                }
                grid[row * 4 + (3 - col)] = newRow[col];
            } else {
                grid[row * 4 + (3 - col)] = 0;
            }
        }
    }
    return moved;
}

// ������� ��� ����������� ������
function mergeTiles(tiles) {
    let newTiles = [];
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === tiles[i + 1]) {
            newTiles.push(tiles[i] * 2);
            score += tiles[i] * 2; // ���������� �����
            i++; // ���������� ��������� �������
        } else {
            newTiles.push(tiles[i]);
        }
    }
    return newTiles;
}

// ������� �������� ������
function animateTileMove(originalIndex, newCol, newRow) {
    const tile = document.querySelector(`[data-index="${originalIndex}"]`);

    // ��������� ��������� �������� ��������� ������
    const currentX = (originalIndex % 4) * 105; // 105 = ������ ������ + ������
    const currentY = Math.floor(originalIndex / 4) * 105;

    // �������� ��������� ���������
    tile.style.transform = `translate(${currentX}px, ${currentY}px)`;

    // �������� ��� �������� � ������ ���������
    const xPos = newCol * 105;
    const yPos = newRow * 105;

    tile.style.transition = 'transform 0.2s ease'; // ���������, ��� � ��� ���� �������
    tile.style.transform = `translate(${xPos}px, ${yPos}px)`;

    // ����� �� ����� ������� ��������, ���� ��� ����������
    setTimeout(() => {
        tile.classList.remove('moving');
    }, 200); // ���������, ��� ����� ������������� ����� ��������
}

// ���������� ����� ����� ����� ������������
document.getElementById('username-form').addEventListener('submit', (event) => {
    event.preventDefault(); // �������� ����������� ��������� �����
    const username = event.target.username.value.trim();
    if (username) {
        setCurrentUser(username); // ������������� �������� ������������
        initializeGame(); // �������������� ���� ��� �������� ����� �����
        renderBestScore(); // ���������� ������ ����
    }
});

// ���������� ������� ����������
document.addEventListener('keydown', event => {
    let moved = false; // ����, �����������, ��������� �� �������� ������
    switch (event.key) {
        case 'ArrowUp':
            moved = moveUp(); // ����������� �����
            break;
        case 'ArrowDown':
            moved = moveDown(); // ����������� ����
            break;
        case 'ArrowLeft':
            moved = moveLeft(); // ����������� �����
            break;
        case 'ArrowRight':
            moved = moveRight(); // ����������� ������
            break;
    }

    // �������� ����� �����������
    if (moved) {
        addRandomTile(); // ��������� ����� ������
        updateUserScore(); // ��������� ������ ����
    }
    render(); // ��������� �����������
    if (checkGameOver()) { // �������� �� ���������� ����
        alert("���� ��������!"); // ��������� � ���������� ����
    }
});

// �������� ��������� ���������
initializeGame();

// ���������� ��� ������ "�������������"
document.getElementById('restart').addEventListener('click', () => {
    initializeGame(); // �������������� ���� ������
    renderBestScore(); // ��������� ����������� ������
});
function animateTileMove(originalIndex, newCol, newRow) {
    const tile = document.querySelector(`[data-index="${originalIndex}"]`);
    tile.classList.add('moving'); // ��������� ����� ��� ��������

    // ������������ ����� �������
    const xPos = newCol * 105; // ������ ������
    const yPos = newRow * 105; // ������ ������

    // ��������� ����� ������
    tile.style.transition = 'transform 0.2s ease'; // ���������, ��� � ��� ���� �������
    tile.style.transform = `translate(${xPos}px, ${yPos}px)`; // ����������������

    // ���������� ������ � ��������� ���������
    setTimeout(() => {
        tile.classList.remove('moving');
    }, 200); // ���������, ��� ����� ������������� ����� ��������
}
// �������� ������������� �� localStorage
loadUserScores();
renderBestScore(); // ���������� ������ ���� ����� ��������

// ������������� ����������� ������� ��� �������� �������������
Object.values(users).forEach(userScore => {
    if (userScore > globalBestScore) {
        globalBestScore = userScore; // ������������� ���������� ������ ���� ��� ��������
    }
});
