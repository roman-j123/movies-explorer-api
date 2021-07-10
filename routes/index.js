const router = require('express').Router();
const userRoute = require('./user');
const movieRoute = require('./movie');
const auth = require('../middlewares/auth');
const { createNewUser, loginUser } = require('../controllers/user');

router.post('/signup', createNewUser);
router.post('/signin', loginUser);
router.use('/users', auth, userRoute);
router.use('/movies', auth, movieRoute);

module.exports = router;
