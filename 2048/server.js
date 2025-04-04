const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const scoresFilePath = './scores.json';

// Функция для чтения данных
const readScoresFromFile = () => {
    if (fs.existsSync(scoresFilePath)) {
        return JSON.parse(fs.readFileSync(scoresFilePath, 'utf8'));
    }
    return {};
};

// Функция для записи данных
const writeScoresToFile = (scores) => {
    fs.writeFileSync(scoresFilePath, JSON.stringify(scores, null, 4));
};

// Обработка получения данных о пользователях
app.get('/scores', (req, res) => {
    const scores = readScoresFromFile();
    res.json(scores);
});

// Обработка сохранения счета пользователя
app.post('/scores', (req, res) => {
    const { username, score } = req.body;
    const scores = readScoresFromFile();
    scores[username] = Math.max(scores[username] || 0, score); // Сохраняем максимальный счет
    writeScoresToFile(scores);
    res.sendStatus(200);
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Сервер работает на порту 3000');
});
