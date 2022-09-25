const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const verifyToken = require("../middleware/auth");
const checkAdmin = require("../middleware/role");

router.post("/", verifyToken, checkAdmin, async (req, res) => {
  const { items, postName } = req.body;

  try {
    const user = await Post.findOne({ postName });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Tên file đã tồn tại" });
    }

    const newPost = new Post({
      items,
      userId: req.userId,
      edit: req.edit,
      postName,
      postId: randomid(18),
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
    res.json({ success: true, posts: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/search/:id", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ postId: req.params.id });
    if (posts.length === 0)
      res
        .status(400)
        .json({ success: false, message: "Không tìm thấy dữ liệu" });
    res.json({ success: true, posts: posts[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.delete("/:id", verifyToken, checkAdmin, async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({ postId: req.params.id });
    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: "Bạn không đủ quyền thực hiện",
      });

    res.json({ success: true, posts: deletedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const { items } = req.body;

  if (!items)
    return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
  try {
    let updatedPost = {
      items,
    };

    const postUpdateCondition = { edit: req.edit, postId: req.params.id };

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
      posts: updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

function randomid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
