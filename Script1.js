function appendToDisplay(value)
{
    /*document.getElementById('display'): �������� ������� � ��������������� display, �� ���� ������ �����.*/
    document.getElementById('display').value += value;
}

function clearDisplay()
{
    document.getElementById('display').value = '';
}

function calculate()
{
     /*������� ������� ������ ����� � �������� ��� � ���������� display.*/
    const display = document.getElementById('display');
    try
    {
        /*eval(): �������, ������� ��������� ������ � ��������� � ��� ���. https://learn.javascript.ru/eval */
        display.value = eval(display.value); 
    }
    catch (error)
    {
        display.value = 'Error';
    }
}