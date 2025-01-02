const express = require('express');
const app = express();
const connectToDatabase = require('./db/db');
const postRoute = require("./routes/postRoute")
const userRoute = require('./routes/userRoute');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {config} = require('./config');
connectToDatabase();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: config.BASE_URL,
  credentials: true,
}))

app.use('/user',userRoute);
app.use('/post',postRoute);
app.get('/',(req,res)=>{
  return res.status(200).json({message: "ok"});
})
module.exports = app;