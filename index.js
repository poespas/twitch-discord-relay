const tmi = require('tmi.js');
const fs = require('fs');
const Axios = require('axios');

const config = require("./config.json");

// check if data.json exists
if (!fs.existsSync("./data.json"))
    fs.writeFileSync("./data.json", JSON.stringify({}));

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: config.username,
        password: config.password
    },
    channels: [config.target_channel]
});

const onMessage = async (channel, tags, message, self) => {
    let author = tags['display-name'];

    
    if (author.toLowerCase() != config.target_user.toLowerCase())
        return;
    
    console.log(`${author} -> ${message}`);
    
    let data = JSON.parse(fs.readFileSync("./data.json"));

    fs.writeFileSync("./data.json", JSON.stringify({ ...data, lastSent: new Date() }));

    // console.log({lastSent: new Date(data.lastSent), now: new Date(), diff:  new Date() - new Date(data.lastSent)})
    console.log(`<${author}> ${message}`);
    message = `${author}: ${message}`;

    if ((new Date() - new Date(data.lastSent)) > config.notify_after) {
        // everyone
        message = config.notice_message + "\n" + message;
    }

    notifyServer(message);
}

const notifyServer = async (message) => {
    console.log({message});
    
    return;

    return Axios({
        method: "POST",
        url: "https://discordapp.com/api/webhooks/729358959923953666/KLz1CfYMPtznSakk7OABWP0EuqKma7yQtf7ahd5CuFzuALLQ66hzlNVK4qdSdQaKHRBq",
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            content: message
        }
    });
}

client.connect();
client.on('message', onMessage);

console.log(`Bot started! Targeting for ${config.target_user}`);