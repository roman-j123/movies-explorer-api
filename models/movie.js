import { isURL } from 'validator';

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: [isURL, 'Ошибка заполнения, тут должна быть ссылка'],
    required: true,
  },
  trailer: {
    type: String,
    validate: [isURL, 'Ошибка заполнения, тут должна быть ссылка'],
    required: true,
  },
  thumbnail: {
    type: String,
    validate: [isURL, 'Ошибка заполнения, тут должна быть ссылка'],
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
