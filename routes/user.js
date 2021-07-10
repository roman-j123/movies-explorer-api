const router = require('express').Router();
const { getCurrentUser } = require('../controllers/user');

router.get('/me', getCurrentUser);

module.exports = router;
