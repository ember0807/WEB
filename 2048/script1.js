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

    grid.forEach((value, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-value', value);
        tile.setAttribute('data-index', index);
        tile.innerText = value > 0 ? value : '';

        // Установка цвета фона в зависимости от значения плитки
        tile.style.backgroundColor = getTileColor(value);

        gridContainer.appendChild(tile);
    });

    renderBestScore(); // Вызываем функцию обновления счета
}
// Функция для получения цвета плитки по значению
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
        default: return '#cdc1b4'; // Цвет для нулевых значений
    }
}
// Функция для сохранения пользователей
function saveUserScores() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Функция загрузки пользователей
function loadUserScores() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
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
    }
    else {
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

// Перемещения с анимацией
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
                    animateTileMove(originalIndex, col, row); // Запускаем анимацию
                }
                grid[originalIndex] = newColumn[row];
            } else {
                grid[originalIndex] = 0;
            }
        }
    }
    return moved; // Вернем, произошло ли движение плиток
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
                    animateTileMove(col + (3 - row) * 4, col, 3 - row); // Анимация
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
                    animateTileMove(row * 4 + col, col, row); // Анимация
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
                    animateTileMove(row * 4 + (3 - col), 3 - col, row); // Анимация
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

// Функция анимации плитки
function animateTileMove(originalIndex, newCol, newRow) {
    const tile = document.querySelector(`[data-index="${originalIndex}"]`);

    // Получение координат текущего положения плитки
    const currentX = (originalIndex % 4) * 105; // 105 = размер плитки + отступ
    const currentY = Math.floor(originalIndex / 4) * 105;

    // Сохраним начальное положение
    tile.style.transform = `translate(${currentX}px, ${currentY}px)`;

    // Замедлим его движение к новому положению
    const xPos = newCol * 105;
    const yPos = newRow * 105;

    tile.style.transition = 'transform 0.2s ease'; // Убедитесь, что у нас есть переход
    tile.style.transform = `translate(${xPos}px, ${yPos}px)`;

    // Здесь мы можем удалить анимацию, если это необходимо
    setTimeout(() => {
        tile.classList.remove('moving');
    }, 200); // Убедитесь, что время соответствует стилю перехода
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
            moved = moveUp(); // Перемещение вверх
            break;
        case 'ArrowDown':
            moved = moveDown(); // Перемещение вниз
            break;
        case 'ArrowLeft':
            moved = moveLeft(); // Перемещение влево
            break;
        case 'ArrowRight':
            moved = moveRight(); // Перемещение вправо
            break;
    }

    // Действия после перемещения
    if (moved) {
        addRandomTile(); // Добавляем новую плитку
        updateUserScore(); // Обновляем лучший счет
    }
    render(); // Обновляем отображение
    if (checkGameOver()) { // Проверка на завершение игры
        alert("Игра окончена!"); // Сообщение о завершении игры
    }
});

// Вызываем начальную отрисовку
initializeGame();

// Обработчик для кнопки "Перезапустить"
document.getElementById('restart').addEventListener('click', () => {
    initializeGame(); // Инициализируем игру заново
    renderBestScore(); // Обновляем отображение счетов
});
function animateTileMove(originalIndex, newCol, newRow) {
    const tile = document.querySelector(`[data-index="${originalIndex}"]`);
    tile.classList.add('moving'); // Добавляем класс для анимации

    // Рассчитываем новую позицию
    const xPos = newCol * 105; // ширина плитки
    const yPos = newRow * 105; // высота плитки

    // Обновляем стиль плитки
    tile.style.transition = 'transform 0.2s ease'; // Убедитесь, что у нас есть переход
    tile.style.transform = `translate(${xPos}px, ${yPos}px)`; // Позиционирование

    // Возвращаем плитку в начальное состояние
    setTimeout(() => {
        tile.classList.remove('moving');
    }, 200); // Убедитесь, что время соответствует стилю перехода
}
// Загрузка пользователей из localStorage
loadUserScores();
renderBestScore(); // Отображаем лучший счет после загрузки

// Инициализация глобального рекорда при загрузке пользователей
Object.values(users).forEach(userScore => {
    if (userScore > globalBestScore) {
        globalBestScore = userScore; // Устанавливаем глобальный лучший счет при загрузке
    }
});
