const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const User = require('../models/User');


async function auth(req, res, next) {
  try {
    // Lấy ra token từ header
    const token = req.header('Authorization').replace('Bearer ', '');
    // Kiểm tra token có giá trị hay không
    const data = jwt.verify(token, process.env.JWT_KEY);
    // Tìm thông tin user bằng id
    const user = await User.findOne({ _id: data._id, 'tokens.token': token });
    // Nếu không tồn tại user trả về error
    if (!user) {
      throw new Error();
    }
    // Gán thông tin user và token vào request
    req.user = user;
    req.token = token;
    // Chuyển đến function tiếp theo
    next();
  } catch (error) {
    console.log(error);
    res.status(httpStatus.UNAUTHORIZED).json({ error: 'Not authorized to access this resource' });
  }
}

module.exports = { auth }