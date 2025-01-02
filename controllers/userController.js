const userModel = require("../models/userSchema");
const postModel = require("../models/postSchema");
const userService = require("../services/userService");
const { validationResult } = require("express-validator");
const { config } = require("../config");
module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, error: errors.array() });
  }
  try {
    const { fullname, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ ok: false, message: "User already exists" });
    }
    const hashPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashPassword,
    });
    const token = user.generateAuthToken();
    res.cookie("token", token);
    return res
      .status(201)
      .json({ ok: true, user: user, message: "User created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, error: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid Email or Password" });
    }

    const token = user.generateAuthToken();
    res.cookie("token", token);
    return res
      .status(200)
      .json({ ok: true, token, user, message: "Login Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, error, message: "Internal server error" });
  }
};

module.exports.authenticateUser = async (req, res, next) => {
  try {
    return res.status(200).json({ ok: true, user: req.user });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }
    return res.status(200).json({ ok: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};
module.exports.getUserPost = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await postModel
      .find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await postModel.countDocuments({ ownerId: userId });
    const postsWithLikeStatus = posts.map((post) => ({
      ...post._doc,
      isLikedByUser: post.likes.includes(userId),
    }));
    return res.status(200).json({
      ok: true,
      posts : postsWithLikeStatus,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};
module.exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ ok: true, message: "Logout Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Interval server error", error });
  }
};
