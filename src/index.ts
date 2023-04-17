import { Logger } from '@suzuki3jp/logger';
import { Env } from '@suzuki3jp/utils';
import { TwitchClient } from '@suzuki3jp/twitch.js';
import { config } from 'dotenv';
config();

import { DataManger } from './class/DataManager';

if (!process.env.TOKEN || !process.env.REFRESHTOKEN || !process.env.CLIENTID || !process.env.CLIENTSECRET) {
    throw new Error('.env contents invalid.');
} else {
    const DM = new DataManger();
    const {
        twitch: { channels },
    } = DM.getSettings();

    const logger = new Logger(false);
    const client = new TwitchClient(
        {
            clientId: process.env.CLIENTID,
            clientSecret: process.env.CLIENTSECRET,
            accessToken: process.env.TOKEN,
            refreshToken: process.env.REFRESHTOKEN,
            onRefresh: (token) => {
                const newToken = token.accessToken;
                const newRefreshToken = token.refreshToken;
                const envDataObj = {
                    TOKEN: newToken,
                    REFRESHTOKEN: newRefreshToken,
                    CLIENTID: process.env.CLIENTID,
                    CLIENTSECRET: process.env.CLIENTSECRET,
                };
                const newEnvData = Env.parseToEnv(envDataObj);

                DM.setEnv(newEnvData);

                logger.info(`Twitch token has been refreshed.`);
            },
        },
        { channels }
    );

    // events
    client.on('ready', () => {
        logger.info(`Connected twitch chat to ${channels.join(', ')}`);
        logger.system('Twitch client is ready.');
    });

    client.on('messageCreate', (message) => {
        if (message.content === '!ping') {
            message.reply('pong!');
        }
    });

    logger.on('system', (message) => console.log(message));

    logger.on('info', (message) => console.log(message));

    client.login();
}
