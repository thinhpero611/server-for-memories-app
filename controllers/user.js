import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


import UserModel from '../models/user.js';
const secret = 'test';

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserModel.findOne({ email });

    if (oldUser) return res.status(404).send({ message: 'User already exist!'});

    /**
     * Asynchronously generates a hash for the giving tring
     * @return -- Promise with resulting hasg, if callback has been omitted
     */
    const hashedPassword = await bcrypt.hash(password, 12);
  
    const result = await UserModel.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`});

    const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h"});
    console.log(result);
    res.status(201).json({ result, token });
  } catch (err) {
    res.status(500).json({ message: 'somthing went wrong' });
  }
}

export const signin = async (req, res) => {
  const { email, password } = req.body;// nhận dữ liệu json từ body của request

  try {
    const oldUser = await UserModel.findOne({ email });// tìm user với email được gửi từ request

    // kiểm tra user đó có tồn tại trong database hay không
    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    // so sánh mật khẩu gửi vào và mật khẩu được giải mã trong database
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    // mật khẩu không đúng 
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    // tạo access token để server xác nhận cho những lần đăng nhập sau, thời hạn là 1 giờ
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}