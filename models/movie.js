const validator = require('validator');

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minLength: [2, 'Минимум 2 символа'],
  },
  director: {
    type: String,
    required: true,
    minLength: [2, 'Минимум 2 символа'],
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
    minLength: [2, 'Минимум 2 символа'],
  },
  image: {
    type: String,
    validate: [validator.isURL, 'Проверьте написание url'],
    required: true,
  },
  trailer: {
    type: String,
    validate: [validator.isURL, 'Проверьте написание url'],
    required: true,
  },
  thumbnail: {
    type: String,
    validate: [validator.isURL, 'Проверьте написание url'],
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
