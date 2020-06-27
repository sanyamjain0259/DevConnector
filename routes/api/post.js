const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Post = require("../../models/post");

//@route    POST api/post
//@desc     insert new post
//@access   Public
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      return res.json(post);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server error");
    }
  }
);

//@route    GET api/post
//@desc     get all posts
//@access   Public
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
});

//@route    GET api/post/:post_id
//@desc     get single posts
//@access   Public
router.get("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.json(post);
  } catch (err) {
    console.log(err.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.status(500).send("Server Error");
  }
});

//@route    DELETE api/post/:post_id
//@desc     delete specific posts
//@access   Private
router.delete("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not Authorized" });
    }
    await post.deleteOne();
    return res.send("Post deleted");
  } catch (err) {
    console.log(err.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.status(500).send("Server Error");
  }
});

//@route    PUT api/post/likes/:post_id
//@desc     get single posts
//@access   Public
router.put("/likes/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      const removeIndex = post.likes
        .map((like) => like.user.toString())
        .indexOf(req.user.id);
      post.likes.splice(removeIndex, 1);
      await post.save();
      return res.json(post.likes);
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.status(500).send("Server Error");
  }
});

//@route    POST api/post/comments/:post_id
//@desc     insert new comment
//@access   Public
router.post(
  "/comments/:post_id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.post_id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      return res.json(post.comments);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server error");
    }
  }
);

//@route    DELETE api/post/comments/:post_id/:comment_id
//@desc     delete specific comment
//@access   Private
router.delete("/comments/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(400).json({ msg: "Comment not found" });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: "User not Authorized" });
    }
    // const removeIndex = post.comments
    //   .map((comment) => comment.user.toString())
    //   .indexOf(req.user.id);
    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );
    // post.comments.splice(removeIndex, 1);
    await post.save();
    return res.send("Comment deleted");
  } catch (err) {
    console.log(err.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
