'use strict';

const { CHANNEL_ID_DISCORD, TOKEN_DISCORD } = process.env;
import { Client, GatewayIntentBits } from 'discord.js';

class LoggerService {
	client: Client;
	channelId: string;
	constructor() {
		this.client = new Client({
			intents: [
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
			],
		});

		// add ChannelId
		this.channelId = CHANNEL_ID_DISCORD as string;

		const token = TOKEN_DISCORD;
		this.client.login(token);

		this.client.on('ready', () => {
			console.log(`Logged is as ${this?.client?.user?.tag}!`);
		});
	}

	sendToMessage(message = 'message') {
		const channel = this.client.channels.cache.get(this?.channelId);
		console.log('channel:::', channel);
		if (!channel) {
			console.error(`Couldn't find the channel...`, this?.channelId);
			return;
		}

		channel.send(message).catch((e) => console.error(e));
	}

	sendToFormatCode(logData) {
		const {
			code,
			message = 'This is some additional information about the code.',
			title = 'Code example',
		} = logData;
		const codeMessage = {
			content: message,
			embeds: [
				{
					color: parseInt('00ff00', 16), // Convert hexadecimal color code to integer,
					title,
					description:
						'```json\n' + JSON.stringify(code, null, 2) + '\n```',
				},
			],
		};

		const channel = this.client.channels.cache.get(this?.channelId);
		console.log('channel:::', channel);
		if (!channel) {
			console.error(`Couldn't find the channel...`, this?.channelId);
			return;
		}

		channel.send(codeMessage).catch((e) => console.error(e));
	}
}

const loggerService = new LoggerService();

export default loggerService;
