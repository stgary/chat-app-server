const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router.js');

const { addUser, removeUser, getUser, getUserInRoom } = require('./users.js');

const PORT = process.env.PORT || 8008;

const app = express();
const server = http.createServer(app);
const io = socketio(server).listen(server);

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` })

    socket.join(user.room);
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });
  });

  socket.on('disconnect', () => {
    console.log('User has left!!')
  });
});

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(router);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});


app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
