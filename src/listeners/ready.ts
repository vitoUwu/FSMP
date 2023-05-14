import { ApplyOptions } from '@sapphire/decorators';
import { Listener, type Store } from '@sapphire/framework';
import { envParseString } from '@skyra/env-utilities';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import { ChannelType, EmbedBuilder } from 'discord.js';
import type { Response } from '../@types/requestResponse';
import { isRunningDev } from '../lib/constants';

const channelId = envParseString('CHANNEL_ID');

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
	private readonly style = isRunningDev ? yellow : blue;

	public async run() {
		this.printBanner();
		this.printStoreDebugInformation();
		await this.updateServerStatus();
		setInterval(async () => await this.updateServerStatus(), 60_000);
	}

	private async updateServerStatus() {
		const channel = this.container.client.channels.cache.get(channelId);
		if (!channel || channel.type !== ChannelType.GuildText) {
			return;
		}

		const data = await fetch('https://api.mcsrvstat.us/2/132.145.138.149:25566', { cache: 'no-cache' })
			.then((res) => res.json() as Promise<Response>)
			.catch(this.container.logger.error);

		if (!data) {
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle(`FSMP - ${data.ip}:${data.port}`)
			.setColor(data.online ? 'Green' : 'Red')
			.setDescription(data.motd.clean.join(' '))
			.setFields([
				{
					name: `Jogadores ${data.players.online}/${data.players.max}`,
					value: data.players.list.join('\n')
				}
			])
			.setFooter({ text: data.version })
			.setTimestamp();

		const message = await channel.messages.fetch({ limit: 1 }).then((collection) => collection.first());
		if (!message || message.author.id !== this.container.client.user!.id) {
			await channel.send({ embeds: [embed] });
		} else {
			await message.edit({ embeds: [embed] });
		}
	}

	private printBanner() {
		const success = green('+');

		const llc = isRunningDev ? magentaBright : white;
		const blc = isRunningDev ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01} ${pad}${blc('1.0.0')}
${line02} ${pad}[${success}] Gateway
${line03}${isRunningDev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}
}
