const router = require('express').Router();
const { getCurrentUser, updateProfileUser } = require('../controllers/user');

router.get('/me', getCurrentUser);
router.patch('/me', updateProfileUser);

module.exports = router;
