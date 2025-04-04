let users = {};
let currentUser = null;
let score = 0;
let globalBestScore = 0; // Переменная для хранения лучшего счета среди всех пользователей
const grid = new Array(16).fill(0); // Создание массива для игры

// Функция для инициализации игры
function initializeGame() {
    grid.fill(0); // Очищаем сетку
    score = 0; // Сбрасываем счет
    addRandomTile(); // Добавляем плитку
    addRandomTile(); // Добавляем еще одну плитку
    render(); // Отображаем состояние сетки
}

// Функция для добавления случайной плитки
function addRandomTile() {
    const emptyIndices = grid.map((val, index) => val === 0 ? index : -1).filter(val => val !== -1);
    if (emptyIndices.length > 0) {
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        grid[randomIndex] = Math.random() < 0.9 ? 2 : 4; // 90% вероятность добавить 2
    }
}

// Функция для отрисовки сетки
function render() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = ''; // Очищаем контейнер перед отрисовкой

    grid.forEach(value => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-value', value); // Установка значения для стиля
        tile.innerText = value > 0 ? value : ''; // Отображение только ненулевых значений
        gridContainer.appendChild(tile);
    });

    renderBestScore(); // Обновляем отображение лучшего счета
}

// Функция для сохранения пользователей
//function saveUserScores() {
//    localStorage.setItem('users', JSON.stringify(users));
//}
async function saveUserScores() {
    const response = await fetch('http://localhost:3000/save-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: currentUser, score }),
    });

    if (!response.ok) {
        console.error('Failed to save score');
    }
}

// Функция загрузки пользователей
//function loadUserScores() {
//    const storedUsers = localStorage.getItem('users');
//    if (storedUsers) {
//        users = JSON.parse(storedUsers);
//    }
//}
async function loadUserScores() {
    const response = await fetch('http://localhost:3000/load-scores');
    if (response.ok) {
        users = await response.json();
    } else {
        console.error('Failed to load scores');
    }
}

// Функция для обновления лучшего счета
function updateUserScore() {
    if (currentUser && score > users[currentUser]) {
        users[currentUser] = score; // Обновляем лучший счет для текущего пользователя
        saveUserScores(); // Сохраняем пользователей
    }

    // Проверка на глобальный рекорд
    if (score > globalBestScore) {
        globalBestScore = score; // Обновляем глобальный лучший счет
    }
}

// Функция для обновления отображения счетов
function renderBestScore() {
    const bestScoreContainer = document.getElementById('best-score');
    const currentScoreContainer = document.getElementById('player-score');

    if (currentUser) {
        bestScoreContainer.innerText = `Лучший счет: ${users[currentUser] || 0}`; // Используем || 0, если пользователь никогда не играл
        currentScoreContainer.innerText = `Текущий счет: ${score}`;
    } else {
        bestScoreContainer.innerText = 'Выберите игрока для начала.';
        currentScoreContainer.innerText = '';
    }

    // Отображение глобального рекорда
    const globalBestScoreContainer = document.getElementById('global-best-score');
    globalBestScoreContainer.innerText = `Глобальный лучший счет: ${globalBestScore}`;
}

// Функция для установки текущего пользователя
function setCurrentUser(username) {
    currentUser = username;
    if (!users[currentUser]) {
        users[currentUser] = 0; // Инициализируем пользователя с нулевым счетом
    }
}

// Проверка на завершение игры
function checkGameOver() {
    // Проверяем, есть ли пустые плитки
    if (grid.includes(0)) return false;

    // Проверяем, можно ли объединить плитки
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const currentTile = grid[row * 4 + col];
            if (
                (col < 3 && currentTile === grid[row * 4 + (col + 1)]) || // Проверка справа
                (row < 3 && currentTile === grid[(row + 1) * 4 + col]) // Проверка вниз
            ) {
                return false;
            }
        }
    }

    return true; // Нет доступных ходов
}

// Перемещения
function moveUp() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        const column = [grid[col], grid[col + 4], grid[col + 8], grid[col + 12]].filter(n => n);
        const newColumn = mergeTiles(column);
        for (let row = 0; row < 4; row++) {
            if (row < newColumn.length) {
                if (grid[col + row * 4] !== newColumn[row]) {
                    moved = true;
                }
                grid[col + row * 4] = newColumn[row];
            } else {
                grid[col + row * 4] = 0;
            }
        }
    }
    return moved;
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
                }
                grid[row * 4 + (3 - col)] = newRow[col];
            } else {
                grid[row * 4 + (3 - col)] = 0;
            }
        }
    }
    return moved;
}

// Функция для объединения плиток
function mergeTiles(tiles) {
    let newTiles = [];
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === tiles[i + 1]) {
            newTiles.push(tiles[i] * 2);
            score += tiles[i] * 2; // Увеличение счета
            i++; // Пропустить следующий элемент
        } else {
            newTiles.push(tiles[i]);
        }
    }
    return newTiles;
}

// Обработчик формы ввода имени пользователя
document.getElementById('username-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Отменяем стандартное поведение формы
    const username = event.target.username.value.trim();
    if (username) {
        setCurrentUser(username); // Устанавливаем текущего пользователя
        initializeGame(); // Инициализируем игру при успешном вводе имени
        renderBestScore(); // Отображаем лучший счет
    }
});

// Обработчик событий клавиатуры
document.addEventListener('keydown', event => {
    let moved = false; // Флаг, указывающий, произошло ли движение плиток
    switch (event.key) {
        case 'ArrowUp':
            moved = moveUp(); // Функция перемещения вверх
            break;
        case 'ArrowDown':
            moved = moveDown(); // Функция перемещения вниз
            break;
        case 'ArrowLeft':
            moved = moveLeft(); // Функция перемещения влево
            break;
        case 'ArrowRight':
            moved = moveRight(); // Функция перемещения вправо
            break;
    }

    // Предотвратить стандартное поведение прокрутки
    if (moved) {
        event.preventDefault(); // Отключаем прокрутку страницы
        addRandomTile(); // Добавляем новую плитку после любого движения
        updateUserScore(); // Обновляем лучший счет
        render(); // Обновляем отображение
        renderBestScore(); // Обновляем информацию о счетах на экране

        if (checkGameOver()) { // Проверка на завершение игры
            alert("Игра окончена!"); // Сообщение о завершении игры
        }
    }
});

// Обработчик для кнопки "Перезапустить"
document.getElementById('restart').addEventListener('click', () => {
    initializeGame(); // Инициализируем игру заново
    renderBestScore(); // Обновляем отображение счетов
});

// Загрузка пользователей из localStorage
loadUserScores();
renderBestScore(); // Отображаем лучший счет после загрузки

// Инициализация глобального рекорда при загрузке пользователей
Object.values(users).forEach(userScore => {
    if (userScore > globalBestScore) {
        globalBestScore = userScore; // Устанавливаем глобальный лучший счет при загрузке
    }
});
