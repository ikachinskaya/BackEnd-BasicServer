const express = require('express');
const cors = require('cors');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandlers')
const app = express();

app.use(cors());  // разрешение на подключение к серверу, связано с политикой безопасности браузеров и серверов

app.use(express.json());

app.use(express.static('public')); // отдача статических файлов из папки public

app.use('/api', router);

app.use(errorHandler);

module.exports = app;
