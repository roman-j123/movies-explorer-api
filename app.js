require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');
const limiter = require('./middlewares/ratelimit');

const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());
const options = {
  origin: [
    'https://roman-j123.nomoredomains.monster',
    'http://roman-j123.nomoredomains.monster',
    'https://api.nomoredomains.monster',
    'http://api.nomoredomains.monster',
    'http://localhost:3000',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

app.use('*', cors(options));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);
app.use(limiter);
app.use('/', router);

app.use(errors());
app.use(handleError);
app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`App listining on port: ${PORT}`);
});
