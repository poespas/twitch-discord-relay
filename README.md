# Twitch Discord Relay

This program will log messages to Discord sent by certain users in a twitch channel.
Useful for things like streamer setting up their stream, recent updates, etc. 
without needing to open the Twitch channel.

![Demo](./assets/screenshot.png)

## Features

- Log multiple users inside a twitch channel chat
- Notify the server when a user sends a message after a while
- Add a user badge to a specific user so you can quickly identify a user

## Config

```js
{
    "username": "", // Username of your twitch bot account
    "password": "", // Oauth token of your twitch bot account

    "target_channel": "", // Twitch channel you want to target
    "notify_after": 1800000, // Max amount of time to elapse after @here'ing
    "target_users": [
        {
			"user": "peepoMan", // User to log
			"user_badge": "👑", // (optional) Badge to display in front of name
			"notice": true, // (optional) Send message when they send a message first time in a long while
			"notice_message": "@here Peepo Man is here!" // Specify which message to send on "notice"
		},
	],
	"webhook_url": "" // Specify webhook url for discord
}
```