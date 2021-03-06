const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/validationError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const AuthError = require('../errors/authError');

const { NODE_ENV, JWT_SECRET } = process.env;

function getCurrentUser(req, res, next) {
  const id = req.user._id;
  return User.findById(id)
    .orFail(() => {
      throw new ValidationError('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError('Пользователь не найден');
        next(error);
      }
      next(err);
    });
}
function updateProfileUser(req, res, next) {
  return User.findByIdAndUpdate(req.user._id, req.body,
    {
      new: true,
      runValidators: true,
      upsert: false,
    })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные');
        next(error);
      } else if (err.name === 'MongoError' && err.code === 11000) {
        const error = new ConflictError('Почта уже используется');
        next(error);
      }
      next(err);
    });
}
function createNewUser(req, res, next) {
  if (!req.body.email || !req.body.password) {
    const error = new ValidationError('Переданы некорректные данные');
    next(error);
  }
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные');
        next(error);
      } else if (err.name === 'MongoError' && err.code === 11000) {
        const error = new ConflictError('Почта уже используется');
        next(error);
      }
      next(err);
    });
}
function loginUser(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ValidationError('Переданы некорректные данные');
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ token });
      return bcrypt.compare(password, user.password);
    })
    .catch(() => {
      const error = new AuthError('Неправильные почта или пароль');
      next(error);
    });
}
function logoutUser(req, res) {
  res.clearCookie('jwt');
  res.redirect('/');
}

module.exports = {
  getCurrentUser,
  updateProfileUser,
  createNewUser,
  loginUser,
  logoutUser,
};
