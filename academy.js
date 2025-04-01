//// JavaScript source code
////document.write("<h1>Academy</h1>");

//class Human {
//	#last_name;
//	#first_name;
//	#age;
//	constructor(last_name, first_name, age) {
//		//console.log(last_name);
//		//document.write(`last_name type: ${typeof (last_name)}`);
//		this.#last_name = last_name;
//		this.#first_name = first_name;
//		this.#age = age;
//		console.log("HConstructor");
//	}
//	get last_name() { return this.#last_name; }
//	get first_name() { return this.#first_name; }
//	get age() { return this.#age; }
//	set last_name(value) { this.#last_name = value; }
//	set first_name(value) { this.#first_name = value; }
//	set age(value) { this.#age = value; }
//	toString() {
//		return `${this.last_name} ${this.first_name} ${this.age}`;
//	}
//}
//class Student extends Human {
//	#speciality;
//	#group;
//	#rating;
//	#attendance;
//	get speciality() { return this.#speciality; }
//	get group() { return this.#group; }
//	get rating() { return this.#rating; }
//	get attendance() { return this.#attendance; }
//	set speciality(value) { this.#speciality = value; }
//	set group(value) { this.#group = value; }
//	set rating(value) { this.#rating = value; }
//	set attendance(value) { this.#attendance = value; }

//	constructor(last_name, first_name, age, speciality, group, rating, attendance) {

//		super(last_name, first_name, age);
//		this.speciality = speciality;
//		this.group = group;
//		this.rating = rating;
//		this.attendance = attendance;
//	}
//	toString() {

//		return "<br>" + super.toString() + `${this.speciality} ${this.group} ${this.rating} ${this.attendance}`;
//	}
//}
//class Teacher extends Human {
//	#speciality;
//	#experience;
//	get speciality() { return this.#speciality; }
//	get experince() { return this.#experience; }
//	set speciality(value) { this.#speciality = value; }
//	set experince(value) { this.#experience = value; }
//	constructor(last_name, first_name, age, speciality, experince) {
//		super(last_name, first_name, age);
//		this.speciality = speciality;
//		this.experince = experince;
//	}
//	toString() {
//		return '<br>' + super.toString() + ` ${this.speciality} ${this.experince}`;
//	}
//}

////let human = new Human("Montana", "Antonio", 25);
////document.write(human);

////let student = new Student("Pinkman", "Jessie", "22", "Chemistry", "WW_220", 90, 99);
////document.write(student);

////let teacher = new Teacher("White", "Walter", 50, "Chemistry", 25);
////document.write(teacher);
////document.write('<hr>');

//let group =
//	[
//		new Human("Montana", "Antonio", 25),
//		new Student("Pinkman", "Jessie", "22", "Chemistry", "WW_220", 90, 99),
//		new Teacher("White", "Walter", 50, "Chemistry", 25),
//	];

//for (let i in group) {
//	document.write(group[i] + '<hr>');
//}

class Human {
    #last_name;
    #first_name;
    #age;
    constructor(last_name, first_name, age) {
        // Использование сеттера для валидации возраста
        this.#last_name = last_name;
        this.#first_name = first_name;
        this.age = age; // Изменение: вызов сеттера для валидации
    }

    get last_name() { return this.#last_name; }
    get first_name() { return this.#first_name; }

    set age(value) {
        // Валидация: проверка, что возраст — положительное число
        if (typeof value !== 'number' || value < 0) {
            throw new Error("Age must be a positive number.");
        }
        this.#age = value;
    }

    toString() {
        return `${this.last_name} ${this.first_name} (Age: ${this.age})`; // Изменение: добавлено представление возраста
    }
}

class Student extends Human {
    #speciality;
    #group;
    #rating;
    #attendance;

    constructor(last_name, first_name, age, speciality, group, rating, attendance) {
        super(last_name, first_name, age);
        this.#speciality = speciality;
        this.#group = group;
        this.#rating = rating;
        this.#attendance = attendance;
    }

    toString() {
        // Изменение: улучшено представление строки
        return `${super.toString()} (Speciality: ${this.#speciality}, Group: ${this.#group}, Rating: ${this.#rating}, Attendance: ${this.#attendance})`;
    }
}

class Teacher extends Human {
    #speciality;
    #experience;

    constructor(last_name, first_name, age, speciality, experience) {
        super(last_name, first_name, age);
        this.#speciality = speciality;
        this.#experience = experience;
    }

    toString() {
        // Изменение: улучшено представление строки
        return `${super.toString()} (Speciality: ${this.#speciality}, Experience: ${this.#experience} years)`;
    }
}

// Функция для сохранения группы в файл
function saveGroupToFile(group) {
    const json = JSON.stringify(group, null, 2); // Сериализация массива объектов в JSON
    const blob = new Blob([json], { type: 'application/json' }); // Создание бинарного объекта
    const url = URL.createObjectURL(blob); // Создание URL для загрузки

    const a = document.createElement('a'); // Создание временной ссылки
    a.href = url;
    a.download = 'group.json'; // Имя файла для сохранения
    a.click(); // Автоматический клик для начала загрузки
    URL.revokeObjectURL(url); // Освобождение URL после загрузки
}

// Функция для загрузки группы из файла
function loadGroupFromFile(event) {
    const file = event.target.files[0]; // Получение выбранного файла
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const JSONData = e.target.result; // Получение результата чтения
            const loadedGroup = JSON.parse(JSONData); // Десериализация JSON-строки в массив объектов

            // Создание объектов из загруженных данных
            const groupObjects = loadedGroup.map(item => {
                if (item.type === 'Student') {
                    return new Student(item.last_name, item.first_name, item.age, item.speciality, item.group, item.rating, item.attendance);
                } else if (item.type === 'Teacher') {
                    return new Teacher(item.last_name, item.first_name, item.age, item.speciality, item.experience);
                }
                return new Human(item.last_name, item.first_name, item.age); // Падает обратно на Human
            });

            // Обновление отображения группы на странице
            updateOutput(groupObjects);
        } catch (error) {
            console.error('Error loading the group:', error);
        }
    };

    reader.readAsText(file); // Чтение содержимого файла текстом
}

// Функция для обновления отображения группы
function updateOutput(group) {
    // Очистка предыдущего вывода
    output.innerHTML = '';

    // Вывод данных группы на страницу
    group.forEach(person => {
        const personDiv = document.createElement('div');
        personDiv.innerHTML = person.toString(); // Использование метода toString для отображения информации
        output.appendChild(personDiv);
    });
}

// Пример группы
let group = [
    { type: 'Human', last_name: "Montana", first_name: "Antonio", age: 25 },
    { type: 'Student', last_name: "Pinkman", first_name: "Jessie", age: 22, speciality: "Chemistry", group: "WW_220", rating: 90, attendance: 99 },
    { type: 'Teacher', last_name: "White", first_name: "Walter", age: 50, speciality: "Chemistry", experience: 25 },
];

// Создание кнопки для сохранения группы в файл
const saveButton = document.createElement('button');
saveButton.textContent = 'Save Group to File';
saveButton.onclick = () => saveGroupToFile(group);
document.body.appendChild(saveButton);

// Создание элемента для загрузки файла
const inputFile = document.createElement('input');
inputFile.type = 'file';
inputFile.accept = '.json'; // Ограничение выбора только для файлов json
inputFile.addEventListener('change', loadGroupFromFile); // Добавление обработчика события
document.body.appendChild(inputFile); // Добавление элемента на страницу

// Элемент для отображения данных группы
const output = document.createElement('div');
document.body.appendChild(output); // Добавление элемента на страницу

// Изначальный вывод данных группы
updateOutput(group);


