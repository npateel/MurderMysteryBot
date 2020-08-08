// Murder Mystery bot!
// Written by Nikhil Pateel

// Top level variables
var Discord = require('discord.js');
var logger = require('winston');
const config = require('./config.json');
const auth = require('./auth.json');



var roomsList = config.rooms;
var rooms = {};
for (let i = 0; i < roomsList.length; i++) {
    room = roomsList[i];
    rooms[room.name.toLowerCase()] = room.capacity;
}


//Configure the logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

logger.info(rooms);

//Initialize the Discord Bot
var bot = new Discord.Client();

bot.once('ready', () => {
    logger.info('Ready!');
});



bot.on('message', message => {
    //Execute commands that start with `!` only!
    if (!message.content.startsWith(config.prefix) || message.author.bot)
        return;

    const args = message.content.split(/ +/);
    const cmd = args.shift().toLowerCase();



    switch (cmd) {
        // !enter
    case '!enter':
        if (message.channel.name.toLowerCase() === config.commandsChannel)
            enterRoom(message.member, message.channel, message.guild, args, rooms );
        break;
    case '!list':
        if (message.channel.name.toLowerCase() === config.commandsChannel)
            listUsers(message);
        break;
    }
});

async function listUsers(message) {
    var str = 'The ticket masters\' spies have found the following people in these rooms:\n\n' ;
    for (var key in rooms) {
        let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === key.toLowerCase());
        str += role.toString() + ': ';


        for (var member of message.guild.roles.cache.get(role.id).members) {
            str += member[1].toString() + ', ';
        }
        str = str.slice(0, -1);
        str += '\n';
    }

    message.channel.send(str, {"allowedMentions": { "users" : []}});

}

async function enterRoom(user,channel , guild,  args, rooms) {
    room = args.join(' ').toLowerCase();
    // If the room same
    logger.info('Try to enter room: ' + room);
    let role = guild.roles.cache.find(r => r.name.toLowerCase() === room);
    if (role === undefined) {
        channel.send( "<@!" + user.id + ">" + " tried jumping off the train to reach the " + room +  ", but was thrown back by an invisible force.");
        return;
    }


    if (user.roles.cache.has(role.id)) {
        // Send message that you're already there
        channel.send("<@" + user.id + ">" +  ' gyrates in confusion upon realizing they are already in the ' + role.name);
        return;
    }

    if (rooms[room] > guild.roles.cache.get(role.id).members.size ) {
        let [roles, _ ] = user.roles.cache.partition(r => r.name.toLowerCase() in rooms && r.name.toLowerCase() !== role.name.toLowerCase() );
        await user.roles.remove(roles).catch(console.error);
        await user.roles.add(role).catch(console.error);
        channel.send("<@" + user.id + ">" + ' has just boarded the ' + role.name +  '!');
    } else {
        channel.send("<@" + user.id + ">" + ' bangs on the door to the ' + role.name + '. It doesn\'t open');
    }
}

bot.login(auth.token);



