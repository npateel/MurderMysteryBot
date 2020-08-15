# Murder Myster Bot

A bot that helps my friends run their Murder Mystery campaigns. It will allow members of the server to "enter" private chat rooms (each of which has a capacity),
and list the users in each room. The specifics are detailed below

## Configuration

Almost all configuration is handled by the `config.json` file. This file will handle the setup of rooms capacities and global bot settings. Below is an example
config file

```
{
    "rooms": [
        {"name": "Clinic", "id": "clinic", "capacity": 2},
        {"name": "Common Room", "id": "common-room", "capacity": 7},
        {"name": "Kitchen", "id": "kitchen", "capacity": 4},
        {"name": "Sleeping Station", "id": "sleeping-station", "capacity": 5},
        {"name": "Garden", "id": "garden", "capacity": 3},
        {"name": "Mars Surface", "id": "surface", "capacity": 7}
    ],
    "commandsChannel": "explorer-spam",
    "prefix": "!",
    "doctorMessaged": false,
    "doctor": "penelope",
    "admins": ["sputnikhil", "mission control g", "mission control a"]

}
```
Here, we can see a few important settings:

* `rooms` -- An array of rooms. Each room has a name (corresponding to the role name), an id (corresponding to the channel name), and a capacity (the number of people allowed in a room at one time)
* `commandsChannel` -- The channel name where all commands will be executed
* `prefix` -- The command prefix that the bot will recognize as a command. (Example, if `prefix` is `!!`, then `!!enter` and `!!list` will be valid commands)

The rest of the settings are specific to our game, and can be removed or added as needed


After the `config.json` file has been properly set up, it is then important to get both an auth token from Discord (see [here](https://discord.com/developers/docs/topics/oauth2) for more information). This auth token must be saved in a file called `auth.json` in the following format

```
{
    "token": "YOUR_TOKEN_HERE"
}

```

This will allow this code to log into your bot account.

Finally, each channel must be set up. For each `id` in `rooms`, make sure that you create a corresponding private channel in your server, and create a role for each room `name`. The channel must only allow people with the correct role, and the role should prevent people from viewing chat history.


## Commands

There currently are two commands: `list` and `enter`. They are described below

* `list` -- List all players on the server. Simply type `[prefix]list` in your `commandsChannel` to execute this command
* `enter` -- Enter a room. Type `[prefix]list room_name` to enter the room called "room_name". The bot will handle the checking of room sizes and other conditions before allowing you to enter the new room


