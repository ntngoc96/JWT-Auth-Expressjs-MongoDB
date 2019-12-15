const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    match: /[0-9a-zA-z]+\@[a-zA-Z].+/,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 7
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.pre('save', async function (next) {
  // Mã hóa mật khẩu trước khi lưu vào database
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, parseInt(process.env.SALT_ROUND));
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  // Tạo jwt auth token
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  // Nối vào mảng các token hiện tại
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
  // Tìm kiếm user bằng email và password
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  // Kiểm tra mật khẩu trùng khớp hay không
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: 'Invalid login credentials' });
    // throw new Error('Invalid login credentials');
  }
  return user;
}

const User = mongoose.model('User',userSchema);

module.exports = User;