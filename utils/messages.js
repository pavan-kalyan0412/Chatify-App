const momemt = require('moment');

function formatMessage( username, text) {
    return {
        username,
        text, 
        time: momemt().format('h:mm a')
    }
}

module.exports = formatMessage;