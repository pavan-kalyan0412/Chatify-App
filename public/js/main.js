const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and room from the URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);

const socket = io();

// join chatroom
socket.emit('joinRoom', { username, room});

//get room and users
socket.on('roomUsers', ({ room, users }) =>{
    outputRoomName(room);
    outputUsers(users);

})

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
};

//add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// //add users to DON
function outputUsers(users){
    userList.innerHTML = `
   ${users.map(user => `<li>${user.username}<li>`).join('')}`
};

const messageInput = document.getElementById('msg');

// Listen for typing events from the server
socket.on('typing', username => {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.innerText = `${username} is typing...`;
});

// Add event listener to the message input field
messageInput.addEventListener('input', () => {
    // Emit a typing event to the server
    socket.emit('typing', { username, room });
});

