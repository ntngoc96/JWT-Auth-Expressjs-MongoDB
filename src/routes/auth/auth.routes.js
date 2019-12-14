const express = require('express');
const router = express.Router();

const { registerUser,
  signIn,
  signOut,
  signOutAll } = require('../../controllers/auth.controllers');

const { auth } = require('../../middlewares/auth.middlewares');

router.route('/signup').post(registerUser);
router.route('/signin').post(signIn);
router.route('/signout').post(auth, signOut);
router.route('/signoutall').post(auth, signOutAll);

module.exports = router;