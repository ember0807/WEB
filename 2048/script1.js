// ������� ������ �������� 16 (4x4 �����) � �������������� ��� �������� ������
const grid = Array(16).fill(0);
// �������������� ���������� ��� �����
let score = 0;

// ������� ��� ������������� ����
function initializeGame()
{
    // ��������� ����� ������ (������� ����)
    grid.fill(0);
    // ���������� ����
    score = 0;
    // ��������� ��� ��������� ������ �� �����
    addRandomTile();
    addRandomTile();
    // ���������� ��������� �����
    render();
}

// ������� ��� ���������� ��������� ������ (2 ��� 4) �� ������ �������
function addRandomTile()
{
    // ������� ������ ������ (������� �������)
    const emptyTiles = grid.map((value, index) => value === 0 ? index : null).filter(x => x !== null);
    // ���� ���� ������ ������, �������� ���� ��������� � ��������� �� 2 ��� 4
    if (emptyTiles.length > 0) {
        const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        grid[randomIndex] = Math.random() < 0.9 ? 2 : 4; // 90% ����������� �������� 2, 10% ����������� 4
    }
}

// ������� ��� ����������� ����� �� ������
function render()
{
    grid.forEach((value, index) =>
    {
        const tile = document.getElementById(`tile-${index}`); // �������� ������� ������ �� �������
        tile.innerText = value > 0 ? value : ''; // ������������� ����� (�������� ������ ��� �����)
        tile.style.backgroundColor = getTileColor(value); // ������������� ���� ���� ������
    });
}

// ������� ���������� ���� ������ � ����������� �� �� ��������
function getTileColor(value)
{
    switch (value)
    {
        case 2: return '#eee4da'; // ���� ��� 2
        case 4: return '#ede0c8'; // ���� ��� 4
        case 8: return '#f2b179'; // ���� ��� 8
        case 16: return '#f59563'; // ���� ��� 16
        case 32: return '#f67c5f'; // ���� ��� 32
        case 64: return '#f67c5f'; // ���� ��� 64
        case 128: return '#f9f86e'; // ���� ��� 128
        case 256: return '#f9f86e'; // ���� ��� 256
        case 512: return '#eccd59'; // ���� ��� 512
        case 1024: return '#edc53f'; // ���� ��� 1024
        case 2048: return '#edc22e'; // ���� ��� 2048
        default: return '#ccc0b3'; // ���� �� ��������� ��� ������ ������
    }
}

// ���������� ������� ��� ������� ������
document.addEventListener('keydown', event =>
{
    let moved = false; // ����, �����������, ��������� �� �������� ������
    // ���������, ����� ������� ���� ������
    switch (event.key)
    {
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

    // ���� ������ ���� ����������, ��������� ����� ������ � ��������� �����������
    if (moved)
    {
        addRandomTile();
        render();
    }
});

// ������� ��� ����������� ������ �����
function moveUp()
{
    let moved = false; // ���� ��������
    // ���������� ������ �������
    for (let col = 0; col < 4; col++)
    {
        // �������� ������� ������ �� �������
        const originalTiles = [grid[col], grid[col + 4], grid[col + 8], grid[col + 12]];
        // ���������� ������ � �������� ����� ������ ������
        const newTiles = mergeTiles(originalTiles);

        // ��������� ������������ ������ � �����
        for (let row = 0; row < 4; row++)
        {
            if (grid[col + row * 4] !== newTiles[row])
            {
                moved = true; // ���� ������ ����������, ������������� ���� ��������
            }
            grid[col + row * 4] = newTiles[row]; // ��������� �������� ������
        }
    }
    return moved; // ����������, ��������� �� ��������
}

// ������� ��� ����������� ������ ����
function moveDown()
{
    let moved = false; // ���� ��������
    // ���������� ������ �������
    for (let col = 0; col < 4; col++)
    {
        // �������� ������� ������ �� ������� � �������� �������
        const originalTiles = [grid[col + 12], grid[col + 8], grid[col + 4], grid[col]];
        // ���������� ������ � �������� ����� ������ ������
        const newTiles = mergeTiles(originalTiles);

        // ��������� ������������ ������ � �����
        for (let row = 0; row < 4; row++)
        {
            if (grid[col + (3 - row) * 4] !== newTiles[row])
            {
                moved = true; // ���� ������ ����������, ������������� ���� ��������
            }
            grid[col + (3 - row) * 4] = newTiles[row]; // ��������� �������� ������
        }
    }
    return moved; // ����������, ��������� �� ��������
}

// ������� ��� ����������� ������ �����
function moveLeft()
{
    let moved = false; // ���� ��������
    // ���������� ������ ������
    for (let row = 0; row < 4; row++)
    {
        // �������� ������� ������ �� ������
        const originalTiles = [grid[row * 4], grid[row * 4 + 1], grid[row * 4 + 2], grid[row * 4 + 3]];
        // ���������� ������ � �������� ����� ������ ������
        const newTiles = mergeTiles(originalTiles);

        // ��������� ������������ ������ � �����
        for (let col = 0; col < 4; col++)
        {
            if (grid[row * 4 + col] !== newTiles[col])
            {
                moved = true; // ���� ������ ����������, ������������� ���� ��������
            }
            grid[row * 4 + col] = newTiles[col]; // ��������� �������� ������
        }
    }
    return moved; // ����������, ��������� �� ��������
}

// ������� ��� ����������� ������ ������
function moveRight()
{
    let moved = false; // ���� ��������
    // ���������� ������ ������
    for (let row = 0; row < 4; row++)
    {
        // �������� ������� ������ �� ������ � �������� �������
        const originalTiles = [grid[row * 4 + 3], grid[row * 4 + 2], grid[row * 4 + 1], grid[row * 4]];
        // ���������� ������ � �������� ����� ������ ������
        const newTiles = mergeTiles(originalTiles);

        // ��������� ������������ ������ � �����
        for (let col = 0; col < 4; col++)
        {
            if (grid[row * 4 + (3 - col)] !== newTiles[col])
            {
                moved = true; // ���� ������ ����������, ������������� ���� ��������
            }
            grid[row * 4 + (3 - col)] = newTiles[col]; // ��������� �������� ������
        }
    }
    return moved; // ����������, ��������� �� ��������
}

// ������� ��� ����������� ������
function mergeTiles(tiles)
{
    // ��������������� ������, �������� ������ ��������
    let newTiles = tiles.filter(t => t !== 0);
    // ���������� ������ ������
    for (let i = 0; i < newTiles.length - 1; i++)
    {
        if (newTiles[i] === newTiles[i + 1])
        {
            // ���������� ������ � ��������� ��������
            newTiles[i] *= 2;
            score += newTiles[i]; // ����������� ���� �� ����� ������������ ������
            newTiles.splice(i + 1, 1); // ������� ������������ ������
        }
    }
    // ��������� ���������� ������ ������ �� 4 ���������
    while (newTiles.length < 4)
    {
        newTiles.push(0);
    }
    return newTiles; // ���������� ����� ������ ������
}

// ���������� ������� ��� ������ "�������������"
document.getElementById('restart').addEventListener('click', () =>
{
    initializeGame(); // �������������� ���� ������ ��� ������� ������
});

// ��������� ����
initializeGame();
