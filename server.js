const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'User X';

// Run when clients connect
io.on('connection', socket => {
 
    //welcome the current user
    socket.emit('message',formatMessage(botName, 'Welcome to Chatify'));

    //broadcast when a user connects;
    socket.broadcast.emit('message',formatMessage(botName, 'A user has Joined the chat'));

    //Runs when user disconnects;
    socket.on('disconnect', () =>{
        socket.broadcast.emit('message',formatMessage(botName, 'A user has left the chat'))
    });

    //listen for the chta message
    socket.on('chatMessage', (message) =>{
        console.log("the message from chat:", message);
        io.emit('message', formatMessage('User',message));
    })
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));