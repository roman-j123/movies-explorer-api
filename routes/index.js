const router = require('express').Router();
const userRoute = require('./user');
const movieRoute = require('./movie');
const auth = require('../middlewares/auth');
const { createNewUser, loginUser, logoutUser } = require('../controllers/user');
const NotFoundError = require('../errors/notFoundError');

router.post('/signup', createNewUser);
router.post('/signin', loginUser);
router.post('/signout', auth, logoutUser);
router.use('/users', auth, userRoute);
router.use('/movies', auth, movieRoute);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
