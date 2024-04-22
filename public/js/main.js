const chatForm = document.getElementById('chat-form');

const socket = io();

socket.on('message', message =>{
    console.log(message);
})

chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const messageInput = document.getElementById('msg');
    const message = messageInput.value;

    console.log('message from you:', message);
})