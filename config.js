require("dotenv").config();
module.exports.config = {
  PORT: process.env.PORT,
  DBURL: process.env.MONGOOSEURL,
  DBNAME: process.env.DBNAME,
  JWT_SECRET: process.env.JWT_SECRET,
  BCRYPT_KEY: process.env.BCRYPT_KEY,
  BASE_URL: process.env.BASE_URL,
};

