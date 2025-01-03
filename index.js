const express = require('express');
const app = express();
const connectToDatabase = require('./db/db');
const postRoute = require("./routes/postRoute")
const userRoute = require('./routes/userRoute');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {config} = require('./config');
connectToDatabase();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", config.BASE_URL);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: config.BASE_URL,
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization',
  exposedHeaders: 'Authorization',
}))

app.use('/user',userRoute);
app.use('/post',postRoute);
app.get('/',(req,res)=>{
  return res.status(200).json({message: "ok"});
})
app.listen(config.PORT,()=>{
  console.log(`Server started at port no ${config.PORT} successfully`);
})