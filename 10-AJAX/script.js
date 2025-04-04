function loadFile()
{
    let request = new XMLHttpRequest();
    request.onreadystatechange = function ()
    {
        if (this.readyState === 4)
        { // Запрос завершён
            console.log("Запрос завершён. Статус:", this.status); // Дебаг-информация о статусе запроса
            if (this.status === 200)
            { // Ошибки нет, файл найден
                console.log("Файл загружен успешно.");
                formatXML(this.responseXML);
            } else
            {
                console.error("Ошибка при загрузке файла - статус:", this.status, this.statusText);
            }
        }
    };
    // Добавляем текущую метку времени к URL для отключения кэширования
    request.open("GET", "DataBase.xml?t=" + new Date().getTime(), true);
    request.send();
}

function formatXML(file)
{
    if (!file)
    { // Проверка на случай, если файл не загружен
        console.error("Не удалось получить XML файл.");
        return;
    }

    console.log("Обрабатываем XML файл..."); // Дебаг-информация
    let group = file.documentElement;
    let groupName = group.getAttribute("name");
    let tableHTML = `<h2>Group: ${groupName}</h2>`;

    // Students table
    //https://www.w3schools.com/html/html_tables.asp
    tableHTML += "<h3>Students</h3><table border='1'><tr><th>Last Name</th><th>First Name</th><th>Age</th><th>Speciality</th></tr>";
    let students = group.getElementsByTagName("student");
    for (let i = 0; i < students.length; i++)
    {
        let lastName = students[i].getElementsByTagName("last_name")[0].textContent.trim();
        let firstName = students[i].getElementsByTagName("first_name")[0].textContent.trim();
        let age = students[i].getElementsByTagName("age")[0].textContent.trim();
        let speciality = students[i].getElementsByTagName("speciality")[0].textContent.trim();

        console.log(`Студент ${i + 1}: ${lastName}, ${firstName}, ${age}, ${speciality}`); // Дебаг-информация о студентах

        tableHTML += `<tr>
            <td>${lastName}</td>
            <td>${firstName}</td>
            <td>${age}</td>
            <td>${speciality}</td>
        </tr>`;
    }
    tableHTML += "</table>";

    // Teachers table
    tableHTML += "<h3>Teachers</h3><table border='1'><tr><th>Last Name</th><th>First Name</th><th>Age</th><th>Speciality</th></tr>";
    let teachers = group.getElementsByTagName("teacher");
    for (let i = 0; i < teachers.length; i++) {
        let lastName = teachers[i].getElementsByTagName("last_name")[0].textContent.trim();
        let firstName = teachers[i].getElementsByTagName("first_name")[0].textContent.trim();
        let age = teachers[i].getElementsByTagName("age")[0].textContent.trim();
        let speciality = teachers[i].getElementsByTagName("speciality")[0].textContent.trim();

        console.log(`Учитель ${i + 1}: ${lastName}, ${firstName}, ${age}, ${speciality}`); // Дебаг-информация о учителях

        tableHTML += `<tr>
            <td>${lastName}</td>
            <td>${firstName}</td>
            <td>${age}</td>
            <td>${speciality}</td>
        </tr>`;
    }
    tableHTML += "</table>";

    // Display the tables
    document.getElementById("response").innerHTML = tableHTML;
}
