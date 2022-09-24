const User = require("../models/User");

const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (user.role === "admin") next();
    else res.json({ success: false, message: "Bạn không có quyền admin" });
  } catch (error) {
    console.log("error");
  }
};
module.exports = checkAdmin;
