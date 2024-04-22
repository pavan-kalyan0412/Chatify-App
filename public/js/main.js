const chatForm = document.getElementById('chat-form');

const socket = io();

socket.on('message', message =>{
    console.log(message);
})

chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();


    //fetch the text from client// DOM manipulation
    const messageInput = document.getElementById('msg');
    const message = messageInput.value;
    
    console.log('the messagr from the input field:', message);
    //emit mssage to the server
    socket.emit('chatMessage', message)
})