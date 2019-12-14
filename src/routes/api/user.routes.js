const express = require('express');
const router = express.Router();

const { auth } = require('../../middlewares/auth.middlewares');
const { getUserInformation } = require('../../controllers/user.controllers');

router.route('/profile').get(auth, getUserInformation);

module.exports = router;
