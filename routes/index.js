const router = require('express').Router();
const userRoute = require('./user');
const auth = require('../middlewares/auth');
const { createNewUser, loginUser } = require('../controllers/user');

router.post('/signup', createNewUser);
router.post('/signin', loginUser);
router.use('/users', auth, userRoute);

module.exports = router;
