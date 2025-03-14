let currentInput = "0"; // Хранит текущее значение ввода
let operator = null; // Хранит текущий оператор
let firstOperand = null; // Хранит первое число для операции
let memory = 0; // Память

const display = document.querySelector('input[type=text]'); // Получаем поле вывода

function clearDisplay() {
    currentInput = "0";
    display.value = currentInput;
}

function clearEntry() {
    currentInput = "0";
    display.value = currentInput;
}

function backspace() {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
    display.value = currentInput;
}

function appendNumber(number) {
    if (currentInput === "0" && number !== '.') {
        currentInput = number; // Заменяем "0" на первое число
    } else if (currentInput.includes('.') && number === '.') {
        return; // Игнорируем добавление второй точки
    } else {
        currentInput += number; // Добавляем нажатую цифру к текущему вводу
    }
    display.value = currentInput; // Обновляем отображение
}

function chooseOperation(op) {
    if (currentInput === "") return; // Игнорируем, если ничего не введено
    if (firstOperand === null) {
        firstOperand = parseFloat(currentInput); // Сохраняем первое число
    } else if (operator) {
        calculate(); // Выполняем вычисление для предыдущей операции
    }

    operator = op;
    currentInput = ""; // Сбрасываем текущий ввод для следующего числа
}

const performCalculation = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
};

function calculate() {
    if (operator === null || currentInput === "") return; // Если не установлен оператор или ничего не введено
    let result;

    if (currentInput.includes('%')) {
        const percentageValue = parseFloat(currentInput.replace('%', '')); // Получаем значение процента
        result = operator === '+'
            ? firstOperand + (firstOperand * (percentageValue / 100)) // Вычисляем процент
            : performCalculation[operator](firstOperand, parseFloat(currentInput)); // Другие операции
    } else {
        result = performCalculation[operator](firstOperand, parseFloat(currentInput)); // Выполняем обычные операции
    }

    currentInput = String(result); // Сохраняем результат
    display.value = currentInput; // Обновляем отображение
    operator = null; // Сбрасываем оператор
    firstOperand = null; // Сбрасываем первое число
}

// Функции для работы с памятью
//полное очишение
function memoryClear()
{
    memory = 0;
}
//восстановление последнего сохраненного значения
function memoryRecall()
{
    currentInput = String(memory);
    display.value = currentInput;
}
//сохранение текущего значения в память
function memoryStore()
{
    memory = parseFloat(currentInput);
}
//суммируем текущее значение к уже сохраненному в памяти
function memoryAdd()
{
    memory += parseFloat(currentInput);
}

// Привязываем обработчики событий к кнопкам
document.querySelectorAll('#digits button').forEach(button =>
{
    button.addEventListener('click', () => appendNumber(button.textContent));
});

document.querySelectorAll('#operations button').forEach(button =>
{
    if (button.textContent === '=')
    {
        button.addEventListener('click', calculate);
    }
    else if (button.textContent === '%') {
        // Обработаем нажатие на %: добавим % к currentInput
        button.addEventListener('click', () =>
        {
            if (!currentInput.includes('%'))
            {
                currentInput += '%'; // Добавляем % к текущему вводу
                display.value = currentInput; // Обновляем дисплей
            }
        });
    }
    else
    {
        button.addEventListener('click', () => chooseOperation(button.textContent));
    }
});

// Обработчики для дополнительных кнопок
document.querySelector('.display-buttons button:nth-child(2)').addEventListener('click', backspace); // Backspace
document.querySelector('.display-buttons button:nth-child(3)').addEventListener('click', clearEntry); // CE
document.querySelector('.display-buttons button:nth-child(4)').addEventListener('click', clearDisplay); // C

// Кнопки памяти
document.querySelector('#memory-buttons button:nth-child(1)').addEventListener('click', memoryClear); // MC
document.querySelector('#memory-buttons button:nth-child(2)').addEventListener('click', memoryRecall); // MR
document.querySelector('#memory-buttons button:nth-child(3)').addEventListener('click', memoryStore); // MS
document.querySelector('#memory-buttons button:nth-child(4)').addEventListener('click', memoryAdd); // M+
