const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');


//get username and room from the URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);

const socket = io();

// join chatroom
socket.emit('joinRoom', { username, room});

//message from server
socket.on('message', message =>{
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();


    //fetch the text from client// DOM manipulation
    const messageInput = document.getElementById('msg');
    const message = messageInput.value;
    
    console.log('the messagr from the input field:', message);


    //emit mssage to the server
    socket.emit('chatMessage', message);

    //clear the input once user the send the message
   messageInput.value = '';

   //set the focus on the input field.
   messageInput.focus();
});

//Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}