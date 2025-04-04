// Создаем массив размером 16 (4x4 сетка) и инициализируем все значения нулями
const grid = Array(16).fill(0);
// Инициализируем переменную для счета
let score = 0;

// Функция для инициализации игры
function initializeGame()
{
    // Заполняем сетку нулями (очищаем игру)
    grid.fill(0);
    // Сбрасываем счет
    score = 0;
    // Добавляем две случайные плитки на старт
    addRandomTile();
    addRandomTile();
    // Отображаем состояние сетки
    render();
}

// Функция для добавления случайной плитки (2 или 4) на пустую позицию
function addRandomTile()
{
    // Находим пустые плитки (нулевые позиции)
    const emptyTiles = grid.map((value, index) => value === 0 ? index : null).filter(x => x !== null);
    // Если есть пустые плитки, выбираем одну случайную и заполняем ее 2 или 4
    if (emptyTiles.length > 0) {
        const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        grid[randomIndex] = Math.random() < 0.9 ? 2 : 4; // 90% вероятность добавить 2, 10% вероятность 4
    }
}

// Функция для отображения сетки на экране
function render()
{
    grid.forEach((value, index) =>
    {
        const tile = document.getElementById(`tile-${index}`); // Получаем элемент плитки по индексу
        tile.innerText = value > 0 ? value : ''; // Устанавливаем текст (значение плитки или пусто)
        tile.style.backgroundColor = getTileColor(value); // Устанавливаем цвет фона плитки
    });
}

// Функция возвращает цвет плитки в зависимости от ее значения
function getTileColor(value)
{
    switch (value)
    {
        case 2: return '#eee4da'; // Цвет для 2
        case 4: return '#ede0c8'; // Цвет для 4
        case 8: return '#f2b179'; // Цвет для 8
        case 16: return '#f59563'; // Цвет для 16
        case 32: return '#f67c5f'; // Цвет для 32
        case 64: return '#f67c5f'; // Цвет для 64
        case 128: return '#f9f86e'; // Цвет для 128
        case 256: return '#f9f86e'; // Цвет для 256
        case 512: return '#eccd59'; // Цвет для 512
        case 1024: return '#edc53f'; // Цвет для 1024
        case 2048: return '#edc22e'; // Цвет для 2048
        default: return '#ccc0b3'; // Цвет по умолчанию для пустых плиток
    }
}

// Обработчик событий для нажатий клавиш
document.addEventListener('keydown', event =>
{
    let moved = false; // Флаг, указывающий, произошло ли движение плиток
    // Проверяем, какая клавиша была нажата
    switch (event.key)
    {
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

    // Если плитки были перемещены, добавляем новую плитку и обновляем отображение
    if (moved)
    {
        addRandomTile();
        render();
    }
});

// Функция для перемещения плиток вверх
function moveUp()
{
    let moved = false; // Флаг движения
    // Перебираем каждую колонку
    for (let col = 0; col < 4; col++)
    {
        // Получаем текущие плитки из колонки
        const originalTiles = [grid[col], grid[col + 4], grid[col + 8], grid[col + 12]];
        // Объединяем плитки и получаем новый массив плиток
        const newTiles = mergeTiles(originalTiles);

        // Обновляем оригинальные плитки в сетке
        for (let row = 0; row < 4; row++)
        {
            if (grid[col + row * 4] !== newTiles[row])
            {
                moved = true; // Если плитки изменились, устанавливаем флаг движения
            }
            grid[col + row * 4] = newTiles[row]; // Обновляем значение плитки
        }
    }
    return moved; // Возвращаем, произошло ли движение
}

// Функция для перемещения плиток вниз
function moveDown()
{
    let moved = false; // Флаг движения
    // Перебираем каждую колонку
    for (let col = 0; col < 4; col++)
    {
        // Получаем текущие плитки из колонки в обратном порядке
        const originalTiles = [grid[col + 12], grid[col + 8], grid[col + 4], grid[col]];
        // Объединяем плитки и получаем новый массив плиток
        const newTiles = mergeTiles(originalTiles);

        // Обновляем оригинальные плитки в сетке
        for (let row = 0; row < 4; row++)
        {
            if (grid[col + (3 - row) * 4] !== newTiles[row])
            {
                moved = true; // Если плитки изменились, устанавливаем флаг движения
            }
            grid[col + (3 - row) * 4] = newTiles[row]; // Обновляем значение плитки
        }
    }
    return moved; // Возвращаем, произошло ли движение
}

// Функция для перемещения плиток влево
function moveLeft()
{
    let moved = false; // Флаг движения
    // Перебираем каждую строку
    for (let row = 0; row < 4; row++)
    {
        // Получаем текущие плитки из строки
        const originalTiles = [grid[row * 4], grid[row * 4 + 1], grid[row * 4 + 2], grid[row * 4 + 3]];
        // Объединяем плитки и получаем новый массив плиток
        const newTiles = mergeTiles(originalTiles);

        // Обновляем оригинальные плитки в сетке
        for (let col = 0; col < 4; col++)
        {
            if (grid[row * 4 + col] !== newTiles[col])
            {
                moved = true; // Если плитки изменились, устанавливаем флаг движения
            }
            grid[row * 4 + col] = newTiles[col]; // Обновляем значение плитки
        }
    }
    return moved; // Возвращаем, произошло ли движение
}

// Функция для перемещения плиток вправо
function moveRight()
{
    let moved = false; // Флаг движения
    // Перебираем каждую строку
    for (let row = 0; row < 4; row++)
    {
        // Получаем текущие плитки из строки в обратном порядке
        const originalTiles = [grid[row * 4 + 3], grid[row * 4 + 2], grid[row * 4 + 1], grid[row * 4]];
        // Объединяем плитки и получаем новый массив плиток
        const newTiles = mergeTiles(originalTiles);

        // Обновляем оригинальные плитки в сетке
        for (let col = 0; col < 4; col++)
        {
            if (grid[row * 4 + (3 - col)] !== newTiles[col])
            {
                moved = true; // Если плитки изменились, устанавливаем флаг движения
            }
            grid[row * 4 + (3 - col)] = newTiles[col]; // Обновляем значение плитки
        }
    }
    return moved; // Возвращаем, произошло ли движение
}

// Функция для объединения плиток
function mergeTiles(tiles)
{
    // Отфильтровываем плитки, оставляя только непустые
    let newTiles = tiles.filter(t => t !== 0);
    // Объединяем равные плитки
    for (let i = 0; i < newTiles.length - 1; i++)
    {
        if (newTiles[i] === newTiles[i + 1])
        {
            // Удваливаем плитки и удваиваем значение
            newTiles[i] *= 2;
            score += newTiles[i]; // Увеличиваем счет на сумму объединенных плиток
            newTiles.splice(i + 1, 1); // Удаляем объединенную плитку
        }
    }
    // Заполняем оставшиеся плитки нулями до 4 элементов
    while (newTiles.length < 4)
    {
        newTiles.push(0);
    }
    return newTiles; // Возвращаем новый массив плиток
}

// Обработчик событий для кнопки "Перезапустить"
document.getElementById('restart').addEventListener('click', () =>
{
    initializeGame(); // Инициализируем игру заново при нажатии кнопки
});

// Запускаем игру
initializeGame();
