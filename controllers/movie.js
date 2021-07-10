const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const ValidationError = require('../errors/validationError');
const ConflictError = require('../errors/conflictError');

function getAllMovies(req, res, next) {
  return Movie.find({})
    .then((movies) => {
      return res.send({movies});
    })
    .catch(next);
}
function createMovie(req, res, next) {
  return Movie.create({
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailer: req.body.trailer,
    thumbnail: req.body.thumbnail,
    owner: req.user._id,
    movieId: req.body.movieId,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные');
        next(error);
      } else if (err.name === 'MongoError' && err.code === 11000) {
        const error = new ConflictError('Такой фильм уже существует');
        next(error);
      }
      next(err);
    });
}
function deleteMovie(req, res, next) {
  return Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм не найден');
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Вы не можете удалять фильмы других пользователей');
      }
      movie.remove();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError('Передан неверный идентификатор фильма');
        next(error);
      }
      next(err);
    });
}

module.exports = {
  getAllMovies,
  createMovie,
  deleteMovie,
};
