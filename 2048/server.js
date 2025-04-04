const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const scoresFilePath = './scores.json';

// ������� ��� ������ ������
const readScoresFromFile = () => {
    if (fs.existsSync(scoresFilePath)) {
        return JSON.parse(fs.readFileSync(scoresFilePath, 'utf8'));
    }
    return {};
};

// ������� ��� ������ ������
const writeScoresToFile = (scores) => {
    fs.writeFileSync(scoresFilePath, JSON.stringify(scores, null, 4));
};

// ��������� ��������� ������ � �������������
app.get('/scores', (req, res) => {
    const scores = readScoresFromFile();
    res.json(scores);
});

// ��������� ���������� ����� ������������
app.post('/scores', (req, res) => {
    const { username, score } = req.body;
    const scores = readScoresFromFile();
    scores[username] = Math.max(scores[username] || 0, score); // ��������� ������������ ����
    writeScoresToFile(scores);
    res.sendStatus(200);
});

// ������ �������
app.listen(3000, () => {
    console.log('������ �������� �� ����� 3000');
});
