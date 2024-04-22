const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
 const server = http.createServer(app);
 const io = socketio(server);


// set static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) =>{
    console.log('New WS connected');
});

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));