const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const verifyToken = require("../middleware/auth");
const checkAdmin = require("../middleware/role");

router.post("/", verifyToken, checkAdmin, async (req, res) => {
  const { items } = req.body;
  try {
    const newPost = new Post({
      items,
      userId: req.userId,
      edit: req.edit,
    });
    await newPost.save();
    res.json({ success: true, message: "post success", posts: newPost });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({ success: true, posts: posts[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.delete("/", verifyToken, async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({ userId: req.userId });
    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: "Bạn không đủ quyền thực hiện",
      });

    res.json({ success: true, post: deletedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.put("/", verifyToken, async (req, res) => {
  const { items, data1 } = req.body;

  if (!items)
    return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
  try {
    let updatedPost = {
      items,
    };

    const postUpdateCondition = { edit: req.edit };

    updatedPost = await Post.findOneAndUpdate(
      postUpdateCondition,
      updatedPost,
      { new: true }
    );

    if (!updatedPost)
      return res.status(401).json({
        success: false,
        message: "Bạn không có quyền ",
      });

    res.json({
      success: true,
      message: "Lưu dữ liệu thành công",
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
