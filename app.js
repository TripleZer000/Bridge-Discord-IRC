// DO NOT EDIT THIS IF YOU DONT KNOW WHAT YOU ARE DOING!!!!
// THIS IS A SENSITIVE FILE
// YOU HAVE BEEN WARNED

// Require dotenv for simple use!!!
require("dotenv").config();
// Constant with the Client Enum and Discord.js require
const { Client, GatewayIntentBits } = require("discord.js");
// IRC require
var irc = require("irc");

// These are the intents to ask the API for certain things
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
    ],
});

// Starts the client connection to the API and displays msg to console that you are logged in
client.on("ready", () => {
    console.log(`Logged To Discord.js API As - ${client.user.tag}!`);
});
// Starts the IRC bot with a new irc.CLient to connect to the API also logs into IRC here
var bot = new irc.Client(process.env.irc_server, process.env.nick, {
    channels: ["#" + process.env.channel],
});

// Creating an async await function (needed to properly use discord.js channel for channel.send)
// THIS IN ITSELF IS A BITCH
(async () => {
    // Logs in client to discord API
    await client.login(process.env.DISCORD_BOT_TOKEN);
    // Need this line below to tell the code later on what channel the bot sends messages to!
    const discordchannel = await client.channels.fetch(process.env.discord_chan_id);
    // Create our first IRC MSG READER
    bot.addListener("message", function (from, to, message) {
        discordchannel.send("[" + from + "]: " + message);
        console.log("%s => %s: %s", from, to, message);
    });
    // Below put simply is 4 ways to interpret IRC actions, join, quit, and kick msgs to IRC
    bot.addListener('action', function (from, to, text, message) {
        console.log('***' + from + ' ' + text + '***')
        discordchannel.send('***' + from + ' ' + text + '***')
    });
    bot.addListener('join', function (channel, nick, message) {
        console.log('**```' + nick + ' has joined IRC ' + '#' + process.env.channel + '      [' + process.env.irc_server + ']```**')
        discordchannel.send('**```' + nick + ' has joined IRC ' + '#' + process.env.channel + '      [' + process.env.irc_server + ']```**');
    });
    bot.addListener('quit', function (nick) {
        console.log('**```' + nick + ' has left IRC ' + '#' + process.env.channel + '      [' + process.env.irc_server + ']```**')
        discordchannel.send('**```' + nick + ' has left IRC ' + '#' + process.env.channel + '      [' + process.env.irc_server + ']```**');
    });
    bot.addListener('kick', function (channel, who, by, reason) {
        console.log('**```' + who + ' was kicked by ' + by + '      [' + process.env.irc_server + ']```**')
        discordchannel.send('**```' + who + ' was kicked by ' + by + '      [' + process.env.irc_server + ']```**');
    });
    // Creates a function to wait for any messages created in discord
    client.on("messageCreate", async (message) => {
        // If the message is from the bot itself, ignore it
        if (message.author === client.user) return;

        // Narrows new messages down to process.env.discord_chan_id
        if (message.channel.id === process.env.discord_chan_id) {
            // Checks to see is user has a nick. This is caused by message.member.nickname == null
            if (message.member.nickname == undefined) {
                // If user has no nick then use message.author.username which is the normal username example Tester#0123
                console.log("[" + message.author.username + "]: " + message.content);
                bot.send("PRIVMSG", "#" + process.env.channel, "[" + message.author.username + "]: " + message.content);
            } else {
                // If message.member.nickname has a value it will do this below
                console.log("[" + message.member.nickname + "]: " + message.content);
                bot.send("PRIVMSG", "#" + process.env.channel, "[" + message.member.nickname + "]: " + message.content);
            }
        }
    });
    // MY FAV FEAUTURE by Samathingamajig
    // This Takes input from the console and allows you to send it to IRC and Discord as [console]:
    // Displaying some werid error on irc if you wanna test it denote the next 4 lines
    //process.stdin.on("data", (data) => {
    //    discordchannel.send("[console]: " + data.toString().trim());
    //    bot.send("PRIVMSG", process.env.channel, "[console]: " + data.toString().trim());
    //});
})();
