import { isEmail } from 'validator';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: [isEmail, 'Ошибка заполнения, тут должна быть почта'],
    required: true,
    uniquie: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);
