import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

@ApplyOptions<Command.Options>({
	name: 'ping',
	description: 'Verifique a latência da aplicação'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const msg = await interaction.reply({ content: 'Pinging...', fetchReply: true });

		const content = `Pong! Latência ${Math.round(this.container.client.ws.ping)}ms. Latência da API ${
			msg.createdTimestamp - interaction.createdTimestamp
		}ms.`;

		return await interaction.editReply({
			content: content
		});
	}
}
