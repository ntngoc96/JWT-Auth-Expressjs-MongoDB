const httpStatus = require('http-status');

const User = require('../models/User');

async function registerUser(req, res) {
  try {
    // Tạo user từ thông tin form
    const newUser = new User(req.body);
    // Lưu vào cơ sở dữ liệu
    await newUser.save();
    // Tạo cho user mã token
    const token = await newUser.generateAuthToken();
    // Trả về cho người dùng thông tin user và token
    res.status(httpStatus.CREATED).json({ newUser, token });
  } catch (error) {
    console.log(error);

    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    // Xác thực bằng email và password
    const user = await User.findByCredentials(email, password);

    // Nếu xác thực thành công, tạo cho user mã token
    const token = await user.generateAuthToken();

    // Trả về cho người dùng thông tin user và token
    res.status(httpStatus.OK).json({ user, token });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

async function signOut(req, res) {
  // Đăng xuất thiết bị cụ thế
  try {
    // Trả về mảng token mới không bao gồm token đang đăng nhập
    req.user.tokens = req.user.tokens.filter(token => token.token != req.token);
    // Lưu lại vào cơ sở dữ liệu
    await req.user.save();
    // Thông báo đăng xuất thành công 
    res.status(httpStatus.OK).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

async function signOutAll(req, res) {
  // Đăng xuất toàn bộ thiết bị đang đăng nhập
  try {
    // Xóa tất cả token của user hiện tại
    req.user.tokens.splice(0, req.user.tokens.length);
    // Lưu lại vào cơ sở dữ liệu
    await req.user.save();
    // Thông báo đăng xuất thành công
    res.status(httpStatus.OK).json({ message: "Logout all devices successfully" });
  } catch (error) {
    console.log(error);

    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

module.exports = {
  registerUser,
  signIn,
  signOut,
  signOutAll
}