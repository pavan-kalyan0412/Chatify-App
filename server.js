const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser } = require('./utils/users')

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'User X';

// Run when clients connect
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room}) =>{
        const user = userJoin(socket.id, username, room)

        socket.join(user.room);
        
        //welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Chatify'))
  


    //broadcast when a user connects;
    socket.broadcast
        .to(user.room)
        .emit('message',formatMessage(botName, `${user.username} has Joined the chat`));

});

    //listen for the chta message
    socket.on('chatMessage', (message) =>{
        console.log("the message from chat:", message);

        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username,message));
    })

    //Runs when user disconnects;
    socket.on('disconnect', () =>{
        socket.broadcast.emit('message',formatMessage(botName, 'A user has left the chat'))
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));