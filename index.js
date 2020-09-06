const express = require('express');
const helmet = require('helmet');
const server = express();

server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => {
    res.send('Chat App Server');
});

const port = process.env.PORT || 8008;
server.listen(port);
