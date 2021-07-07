const express = require('express');
const mongoose = require('mongoose');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
});

app.use(requestLogger);
// cookies
// routes

app.use(errorLogger);
// errors

app.listen(PORT, () => {
  console.log(`App listining on port: ${PORT}`);
});
