const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const UserController = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", UserController.registerUser);

router.post("/login", UserController.loginUser);
router.get("/auth", authMiddleware.authUser, UserController.authenticateUser);
router.get("/", authMiddleware.authUser, UserController.getUserProfile);
router.get("/logout", authMiddleware.authUser, UserController.logoutUser);
router.get("/posts", authMiddleware.authUser, UserController.getUserPost);
module.exports = router;
