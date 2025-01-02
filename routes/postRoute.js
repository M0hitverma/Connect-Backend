const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const PostController = require("../controllers/postController");

//create new post
router.post("/", authMiddleware.authUser, PostController.createPost);

//delete post by id
router.delete("/:id", authMiddleware.authUser, PostController.deletePost);

//like post by id
router.put("/:id/like", authMiddleware.authUser, PostController.likePost);

//dislike post by id
router.delete("/:id/like", authMiddleware.authUser, PostController.dislikePost);

//comment on post by id
router.put("/:id/comment", authMiddleware.authUser, PostController.comment);

//get all posts with pagination
router.get("/",authMiddleware.authUser, PostController.getPosts);

module.exports = router;
