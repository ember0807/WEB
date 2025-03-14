let currentInput = "0"; // ������ ������� �������� �����
let operator = null; // ������ ������� ��������
let firstOperand = null; // ������ ������ ����� ��� ��������
let memory = 0; // ������

const display = document.querySelector('input[type=text]'); // �������� ���� ������

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
        currentInput = number; // �������� "0" �� ������ �����
    } else if (currentInput.includes('.') && number === '.') {
        return; // ���������� ���������� ������ �����
    } else {
        currentInput += number; // ��������� ������� ����� � �������� �����
    }
    display.value = currentInput; // ��������� �����������
}

function chooseOperation(op) {
    if (currentInput === "") return; // ����������, ���� ������ �� �������
    if (firstOperand === null) {
        firstOperand = parseFloat(currentInput); // ��������� ������ �����
    } else if (operator) {
        calculate(); // ��������� ���������� ��� ���������� ��������
    }

    operator = op;
    currentInput = ""; // ���������� ������� ���� ��� ���������� �����
}

const performCalculation = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
};

function calculate() {
    if (operator === null || currentInput === "") return; // ���� �� ���������� �������� ��� ������ �� �������
    let result;

    if (currentInput.includes('%')) {
        const percentageValue = parseFloat(currentInput.replace('%', '')); // �������� �������� ��������
        result = operator === '+'
            ? firstOperand + (firstOperand * (percentageValue / 100)) // ��������� �������
            : performCalculation[operator](firstOperand, parseFloat(currentInput)); // ������ ��������
    } else {
        result = performCalculation[operator](firstOperand, parseFloat(currentInput)); // ��������� ������� ��������
    }

    currentInput = String(result); // ��������� ���������
    display.value = currentInput; // ��������� �����������
    operator = null; // ���������� ��������
    firstOperand = null; // ���������� ������ �����
}

// ������� ��� ������ � �������
//������ ��������
function memoryClear()
{
    memory = 0;
}
//�������������� ���������� ������������ ��������
function memoryRecall()
{
    currentInput = String(memory);
    display.value = currentInput;
}
//���������� �������� �������� � ������
function memoryStore()
{
    memory = parseFloat(currentInput);
}
//��������� ������� �������� � ��� ������������ � ������
function memoryAdd()
{
    memory += parseFloat(currentInput);
}

// ����������� ����������� ������� � �������
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
        // ���������� ������� �� %: ������� % � currentInput
        button.addEventListener('click', () =>
        {
            if (!currentInput.includes('%'))
            {
                currentInput += '%'; // ��������� % � �������� �����
                display.value = currentInput; // ��������� �������
            }
        });
    }
    else
    {
        button.addEventListener('click', () => chooseOperation(button.textContent));
    }
});

// ����������� ��� �������������� ������
document.querySelector('.display-buttons button:nth-child(2)').addEventListener('click', backspace); // Backspace
document.querySelector('.display-buttons button:nth-child(3)').addEventListener('click', clearEntry); // CE
document.querySelector('.display-buttons button:nth-child(4)').addEventListener('click', clearDisplay); // C

// ������ ������
document.querySelector('#memory-buttons button:nth-child(1)').addEventListener('click', memoryClear); // MC
document.querySelector('#memory-buttons button:nth-child(2)').addEventListener('click', memoryRecall); // MR
document.querySelector('#memory-buttons button:nth-child(3)').addEventListener('click', memoryStore); // MS
document.querySelector('#memory-buttons button:nth-child(4)').addEventListener('click', memoryAdd); // M+
