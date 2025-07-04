const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const users = {}

io.on('connection', (socket) => {
  socket.on('new-user', name => {
  users[socket.id] = name
  socket.broadcast.emit('user-connected', name)

  });
  console.log('new User');
  socket.emit('chat-message', 'Welcome to the chat!');

  socket.on('send-chat-message', message => {
  socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]})
  })


socket.on('disconnect', () => {
  socket.broadcast.emit('user-disconnected', users[socket.id])
  delete users[socket.id]
})

});

server.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
