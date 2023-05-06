require('dotenv').config();

const http = require('http');
const app = require('./app');

const port = require('./constants/env').SERVER_PORT || 5000;

const server = http.createServer(app);

server.listen(port)
console.log(`Server started at port: ${port}`);