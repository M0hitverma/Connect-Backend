const {config} = require('../config')
const userModel = require('../models/userSchema')
module.exports.authUser = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ ok: false, message: "Unauthorized access" });
    }
    try {
      const decoded = userModel.verifyToken(token);
      req.user = await userModel.findById(decoded._id);
      next();
    } catch (error) {
      return res.status(401).json({ ok: false, message: "Unauthorized access" });
    }
  };