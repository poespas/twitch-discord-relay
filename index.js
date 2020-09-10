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

    let getUser = config.target_users
        .filter(i => i.user.toLowerCase() == author.toLowerCase());

    if (getUser.length != 1)
        return;

    getUser = getUser[0];

    console.log(`${author} -> ${message}`);

    let data = JSON.parse(fs.readFileSync("./data.json"));

    fs.writeFileSync("./data.json", JSON.stringify({ ...data, [`lastSent_${getUser.user}`]: new Date() }));

    console.log(`<${author}> ${message}`);
    message = `${getUser.user_badge || ""} ${author}: ${message}`;

    if (getUser.notice && (new Date() - new Date(data[`lastSent_${getUser.user}`])) > config.notify_after) {
        message = getUser.notice_message + "\n" + message;
    }

    notifyServer(message);
}

const notifyServer = async (message) => {
    console.log({message});
    return Axios({
        method: "POST",
        url: config.webhook_url,
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

console.log(`Bot started! Targeting for ${config.target_users.length} users`);
