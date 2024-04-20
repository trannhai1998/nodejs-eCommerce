'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const { CHANNEL_ID_DISCORD, TOKEN_DISCORD } = process.env;
const discord_js_1 = require("discord.js");
class LoggerService {
    constructor() {
        this.client = new discord_js_1.Client({
            intents: [
                discord_js_1.GatewayIntentBits.DirectMessages,
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.MessageContent,
            ],
        });
        // add ChannelId
        this.channelId = CHANNEL_ID_DISCORD;
        const token = TOKEN_DISCORD;
        this.client.login(token);
        this.client.on('ready', () => {
            var _a, _b;
            console.log(`Logged is as ${(_b = (_a = this === null || this === void 0 ? void 0 : this.client) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.tag}!`);
        });
    }
    sendToMessage(message = 'message') {
        const channel = this.client.channels.cache.get(this === null || this === void 0 ? void 0 : this.channelId);
        console.log('channel:::', channel);
        if (!channel) {
            console.error(`Couldn't find the channel...`, this === null || this === void 0 ? void 0 : this.channelId);
            return;
        }
        channel.send(message).catch((e) => console.error(e));
    }
    sendToFormatCode(logData) {
        const { code, message = 'This is some additional information about the code.', title = 'Code example', } = logData;
        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16),
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
                },
            ],
        };
        const channel = this.client.channels.cache.get(this === null || this === void 0 ? void 0 : this.channelId);
        console.log('channel:::', channel);
        if (!channel) {
            console.error(`Couldn't find the channel...`, this === null || this === void 0 ? void 0 : this.channelId);
            return;
        }
        channel.send(codeMessage).catch((e) => console.error(e));
    }
}
const loggerService = new LoggerService();
exports.default = loggerService;
