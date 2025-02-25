function appendToDisplay(value)
{
    /*document.getElementById('display'): Получает элемент с идентификатором display, то есть строку ввода.*/
    document.getElementById('display').value += value;
}

function clearDisplay()
{
    document.getElementById('display').value = '';
}

function calculate()
{
     /*Получаю элемент строки ввода и сохраняю его в переменную display.*/
    const display = document.getElementById('display');
    try
    {
        /*eval(): Функция, которая принимает строку и выполняет её как код. https://learn.javascript.ru/eval */
        display.value = eval(display.value); 
    }
    catch (error)
    {
        display.value = 'Ошибка';
    }
}