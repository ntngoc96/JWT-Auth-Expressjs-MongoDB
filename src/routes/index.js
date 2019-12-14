const express = require('express');
const router = express.Router();

const authRoute = require('./auth/auth.routes');
const userRoute = require('./api/user.routes');

/* GET home page. */
router.get('/', async function (req, res, next) {
  // const body = {
  //   'name': 'vannguyen',
  //   'email': 'vannguyen2019@gmail.com',
  //   'password': '123456'
  // }
  // console.log(body);

  // const user = new User(body);
  // await user.save();
  res.render('index', { title: 'Express' });
});

router.use('/auth', authRoute);
router.use('/api/v1/users', userRoute);


module.exports = router;
