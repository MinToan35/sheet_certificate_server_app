const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

const User = require("../models/User");

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Tên đăng nhập không đúng" });
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @desc Register user
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng điền đủ thông tin" });
  try {
    const user = await User.findOne({ username });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Tên người dùng đã tồn tại" });

    //all good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    //Return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "User created successfully",
      accessToken,
      role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng điền đủ thông tin" });
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Người dùng không tồn tại" });

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu không chính xác" });

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "User logged in successfully",
      accessToken,
      role: user.role,
    });
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu không chính xác" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
