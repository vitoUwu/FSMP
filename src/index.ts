import { LogLevel, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { isRunningDev } from './lib/constants';
import './lib/setup';

const client = new SapphireClient({
	defaultPrefix: '!',
	caseInsensitiveCommands: true,
	logger: {
		level: isRunningDev ? LogLevel.Debug : LogLevel.Warn
	},
	shards: 'auto',
	intents: [GatewayIntentBits.Guilds]
});

const main = async () => {
	try {
		await client.login();
		client.logger.info(`Logged in as ${client.user!.tag}`);
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();
