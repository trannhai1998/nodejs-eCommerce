'use strict';

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

const token = `MTIyMDU4ODEzOTc4NjAxMDc3NA.GRr5Qo.-h9PKay-vRdun9h5jlKZ6kSqHhMNkrhMA-yrzo`;
client.login(token);

client.on('ready', () => {
	console.log(`Logged is as ${client.user.tag}!`);
});

client.on('messageCreate', (msg) => {
	if (msg.author.bot) return;
	if (msg.content === 'hello') {
		msg.reply(`Hello! How can i assist ${msg.author.displayName} today`);
	}
});
