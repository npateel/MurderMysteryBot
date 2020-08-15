// Murder Mystery bot!
// Written by Nikhil Pateel

// Top level variables
let fs = require('fs');
let Discord = require('discord.js');
let logger = require('winston');
let config = require('./config.json');
const auth = require('./auth.json');



let roomsList = config.rooms;
let rooms = {};
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
let bot = new Discord.Client();

bot.once('ready', () => {
    logger.info('Ready!');
});



bot.on('message', message => {
    if (!message.channel.name) {
        return;
    }
    if (!message.author.bot && message.channel.name.toLowerCase() === 'garden') {
        tokens = message.content.split(/ +/);
        code = tokens.find(tok => tok === '1202');
        if (code) {
            openRoom(message.channel, message.guild, !config.doctorMessaged );
        }
    }

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

async function openRoom(channel, guild, dm) {
    channel.send('*An unidentified plant has been uncovered*');
    if (dm) {
        logger.info(channel.members);
        let doctor = channel.members.find(m => m.displayName.toLowerCase() === config.doctor);
        if (!doctor) {
            return;
        }
        doctor.send('*You\'ve thoroughly analyzed the plant and have deduced that it is poisonous. What a surprise.*');
        let admins = channel.members.filter(member => {config.admins.includes(member.displayName.toLowerCase());});

        admins.map(admin => {admin.send('*Plant noticed*');});
        config.doctorMessaged = true;
        fs.writeFile("./config.json", JSON.stringify(config), (err) => {
            if (err) {
                console.log(err);
            }});
    }
}


async function listUsers(message) {
    let str = 'The Explorer has found the following astronauts in these locations:\n\n' ;
    for (let key in rooms) {
        let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === key.toLowerCase());
        str += role.toString() + ': ';


        for (let member of message.guild.roles.cache.get(role.id).members) {
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
        channel.send( "<@!" + user.id + ">" + " tried opening the airlock for a room that doesn't exist");
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
        channel.send("<@" + user.id + ">" + ' has just floated to the ' + role.name +  '!');
    } else {
        channel.send("<@" + user.id + ">" + ' bangs on the door to the ' + role.name + '. It doesn\'t open');
    }
}

bot.login(auth.token);



