const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const AuthError = require('../errors/authError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: [validator.isEmail, 'Проверьте написание почты'],
    minLength: [2, 'Минимум 2 символа'],
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
    minLength: [2, 'Минимум 2 символа'],
    maxLength: [30, 'Максимум 30 символов'],
  },
});
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
