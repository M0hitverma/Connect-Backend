const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const {config} = require('./config')
server.listen(config.PORT,()=>{
    console.log(`Server started at port no ${config.PORT} successfully`);
})

