const postModel = require("../models/postSchema");

module.exports.createPost = async ({ imageurl, desc, ownerId, ownerName }) => {
  if (!ownerId) {
    throw new Error("Owner is required");
  }
  const post = await postModel.create({
    content: {
      imageurl,
      desc,
    },
    ownerId,
    ownerName
  });
  return post;
};

module.exports.deletePost = async ({ postId, userId }) => {
  if (!postId) {
    throw new Error("Post Id is required");
  }
  if (!userId) {
    throw new Error("Not a valid request");
  }
  const post = await postModel.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  if (post.ownerId.toString() != userId) {
    throw new Error("Invalid request");
  }
  await postModel.findByIdAndDelete(postId);
  return;
};

module.exports.likePost = async ({ postId, userId }) => {
  if (!postId || !userId) {
    throw new Error("Invalid request");
  }
  const post = await postModel.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  if (post.likes.includes(userId)) {
    throw new Error("Post already liked by user");
  }
  post.likes.push(userId);
  post.likesCount = post.likes.length;
  await post.save();
  return;
};

module.exports.dislikePost = async ({ postId, userId }) => {
  if (!postId || !userId) {
    throw new Error("Invalid request");
  }
  const post = await postModel.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  if (!post.likes.includes(userId)) {
    throw new Error("Post not Liked by user");
  }
  post.likes = post.likes.filter((id) => id == userId);
  post.likesCount = post.likes.length;
  await post.save();
  return;
};

module.exports.comment = async ({ postId, userId, comment }) => {
  if (!postId || !userId || !comment) {
    throw new Error("Invalid request");
  }
  const post = await postModel.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  post.comments.push({
    user: userId,
    comment: comment,
  });
  post.commentCount = post.comments.length;
  await post.save();
  return;
};

module.exports.getPosts = async ({ page = 1, limit = 10, skip = 0 }) => {
  const posts = await postModel
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const totalPost = await postModel.countDocuments();
  return {
    posts,
    totalPost,
  };
};
