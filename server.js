const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when clients connect
io.on('connection', socket => {
 
    //welcome the current user
    socket.emit('message', 'Welcome to Chatify');

    //broadcast when a user connects;
    socket.broadcast.emit('message', 'A user has Joined the chat');

    //Runs when user disconnects;
    socket.on('disconnect', () =>{
        io.emit('message', 'A user has left the chat')
    })
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));