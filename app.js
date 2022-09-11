// DO NOT EDIT THIS IF YOU DONT KNOW WHAT YOU ARE DOING!!!!
// THIS IS A SENSITIVE FILE
// YOU HAVE BEEN WARNED
//////////////////////////////////////////////////////////////
///////////////DISCORD.JS BRIDGE SIDE CODE BELOW//////////////
//////////////////////////////////////////////////////////////
// Require dotenv for simple use!!!
require("dotenv").config();
// Constant with the Client Enum and Discord.js require
const { Client, GatewayIntentBits } = require("discord.js");
// IRC require
// Requires irc
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

// Below Is the Bot's Discord Activity Status
//client.user.setActivity(process.env.activity);

// Starts the client connection to the API and displays msg to console that you are logged in
client.on("ready", () => {
    console.log(`Logged To Discord.js API As - ${client.user.tag}!`);
});

//////////////////////////////////////////////////////////////
////////////////IRC BRIDGE SIDE CODE BELOW////////////////////
//////////////////////////////////////////////////////////////

var bot = new irc.Client(process.env.irc_server, process.env.nick, {
    channels: ["#" + process.env.channel],
});

(async () => {
    await client.login(process.env.DISCORD_BOT_TOKEN);

    // Need this line below to tell the code later on what channel the bot sends messages to!
    const channel = await client.channels.fetch(process.env.discord_chan_id);
    bot.addListener("message", function (from, to, message) {
        channel.send("[" + from + "]: " + message);
        console.log("%s => %s: %s", from, to, message);
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
})();
