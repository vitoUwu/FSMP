import { ApplyOptions } from '@sapphire/decorators';
import { Listener, type Store } from '@sapphire/framework';
import { envParseString } from '@skyra/env-utilities';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import { AttachmentBuilder, ChannelType, EmbedBuilder } from 'discord.js';
import type { OfflineServerResponse, OnlineServerResponse } from '../@types/requestResponse';
import { isRunningDev } from '../lib/constants';

const channelId = envParseString('CHANNEL_ID');
const ip = envParseString('IP');

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
	private readonly style = isRunningDev ? yellow : blue;

	public async run() {
		this.printBanner();
		this.printStoreDebugInformation();
		await this.updateServerStatus();
		setInterval(async () => {
			await this.updateServerStatus().catch((err) => this.container.logger.error(err));
		}, 60_000);
	}

	private async updateServerStatus() {
		const channel = this.container.client.channels.cache.get(channelId);
		if (!channel || channel.type !== ChannelType.GuildText) {
			return;
		}

		const data = await fetch(`https://mcapi.us/server/status?ip=${ip}`, { cache: 'no-cache' })
			.then((res) => res.json() as Promise<OnlineServerResponse | OfflineServerResponse>)
			.catch((err) => this.container.logger.error(err));

		if (!data) {
			return;
		}

		const arrayBuffer = await fetch(`https://mcapi.us/server/image?ip=${ip}`, { cache: 'no-cache' })
			.then((res) => res.arrayBuffer())
			.catch((err) => this.container.logger.error(err));

		const attachment = arrayBuffer ? new AttachmentBuilder(Buffer.from(arrayBuffer), { name: 'image.png' }) : null;

		const embed = new EmbedBuilder()
			.setTitle(`FSMP - ${ip}`)
			.setImage('attachment://image.png')
			.setColor(data.online ? 'Green' : 'Red')
			.setDescription(data.online ? data.motd : 'Servidor Offline')
			.setFields([
				{
					name: `Jogadores ${data.online ? data.players.now : 0}/${data.online ? data.players.max : 0}`,
					value: data.online
						? data.players.sample.map((player) => player.name).join('\n') ?? 'Nenhum jogador online'
						: 'Nenhum jogador online'
				}
			])
			.setFooter({ text: data.online ? data.server.name : 'Versão não identificada' })
			.setTimestamp();

		const message = await channel.messages.fetch({ limit: 1 }).then((collection) => collection.first());

		const payload = {
			embeds: [embed],
			...(attachment ? { files: [attachment] } : {})
		};

		if (!message || message.author.id !== this.container.client.user!.id) {
			await channel.send(payload);
			return;
		}

		await message.edit(payload);
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
