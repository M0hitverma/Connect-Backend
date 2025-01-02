const postModel = require("../models/postSchema");
const postService = require("../services/postService");

module.exports.createPost = async (req, res, next) => {
  try {
    const { imageurl, desc } = req.body;
    const userId = req.user._id;
    const username =
      req.user.fullname.firstname +" "+ req.user.fullname.lastname;
    const post = await postService.createPost({
      imageurl,
      desc,
      ownerId: userId,
      ownerName: username,
    });

    return res
      .status(201)
      .json({ ok: true, post, message: "Post created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};

module.exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    await postService.deletePost({ postId, userId: req.user._id });

    return res
      .status(200)
      .json({ ok: true, message: "Post deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};

module.exports.likePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    await postService.likePost({
      postId,
      userId,
    });
    return res
      .status(200)
      .json({ ok: true, message: "Post liked successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};

module.exports.dislikePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    await postService.dislikePost({
      postId,
      userId,
    });
    return res
      .status(200)
      .json({ ok: true, message: "Post disliked successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};

module.exports.comment = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { comment } = req.body;
    await postService.comment({ postId, userId, comment });

    return res
      .status(200)
      .json({ ok: true, message: "Commmented successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error ", error });
  }
};

module.exports.getPosts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limt) || 10;
    const skip = (page - 1) * limit;
    const data = await postService.getPosts({
      page,
      limit,
      skip,
    });
    const postsWithLikeStatus = data.posts.map((post) => ({
      ...post._doc,
      isLikedByUser: post.likes.includes(userId),
    }));
    return res.status(200).json({
      ok: true,
      posts: postsWithLikeStatus,
      currentPage: page,
      totalPages: Math.ceil(data.totalPost / limit),
      totalPosts: data.totalPost,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};
