// DO NOT EDIT THIS IF YOU DONT KNOW WHAT YOU ARE DOING!!!!
// THIS IS A SENSITIVE FILE
// YOU HAVE BEEN WARNED
//////////////////////////////////////////////////////////////
///////////////DISCORD.JS BRIDGE SIDE CODE BELOW//////////////
//////////////////////////////////////////////////////////////
// Require dotenv for simple use!!!
require('dotenv').config();
// Constant with the Client Enum and Discord.js require
const { Client, GatewayIntentBits } = require('discord.js');
// These are the intents to ask the API for certain things
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers] });
// Need this line below to tell the code later on what channel the bot sends messages to!
//const DiscChan = client.channels.cache.get(process.env.discord_chan_id);
//const channel = client.channels.fetch(process.env.discord_chan_id);

// Below Is the Bot's Discord Activity Status
//client.user.setActivity(process.env.activity);


// Starts the client connection to the API and displays msg to console that you are logged in
client.on('ready', () => {
    console.log(`Logged To Discord.js API As - ${client.user.tag}!`);
});

// Creates a function to wait for any messages created in discord
client.on('messageCreate', async (message) => {
    // Narrows new messages down to process.env.discord_chan_id
    if (message.channel.id === process.env.discord_chan_id) {
        // Checks to see is user has a nick. This is caused by message.member.nickname == null
        if (message.member.nickname == undefined) {
            // If user has no nick then use message.author.username which is the normal username example Tester#0123
            console.log('[' + message.author.username + ']: ' + message.content)
            channel.send('test')
        } else {
            // If message.member.nickname has a value it will do this below
            console.log('[' + message.member.nickname + ']: ' + message.content);
            //channel.send('test')
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
//////////////////////////////////////////////////////////////
////////////////IRC BRIDGE SIDE CODE BELOW////////////////////
//////////////////////////////////////////////////////////////
// IRC require
// Requires irc
var irc = require('irc');

var bot = new irc.Client(process.env.irc_server, process.env.nick, {
    password: (process.env.pass),
    channels: [process.env.channel],
});

bot.addListener('message', function (from, to, message) {
    //client.on(channel.send('[' + from + ']: ' + message));
    channel.send('[' + from + ']: ' + message)
    console.log('%s => %s: %s', from, to, message);
});

// channel.sendTyping();
