const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { 
    userJoin, 
    getCurrentUser, 
    userLeave, 
    getRoomUsers
 } = require('./utils/users')

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


        //send users and rooms info
        io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
        });


        // Listen for 'typing' event
    socket.on('typing', ({ username, room }) => {
        socket.to(room).emit('typing', username);
    });

    // Listen for 'stopTyping' event
socket.on('stopTyping', ({ username, room }) => {
    io.to(room).emit('stopTyping', username);
});


});

    //listen for the chta message
    socket.on('chatMessage', (message) =>{
        console.log("the message from chat:", message);

        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username,message));
    })

    //Runs when user disconnects;
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);

        if(user){
        io.to(user.room).emit('message',formatMessage(botName, `${user.username} has left the chat`))

        //send users and rooms info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));