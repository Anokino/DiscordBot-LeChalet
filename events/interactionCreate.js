const { Events, MessageFlags, Collection } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		const { cooldowns } = interaction.client;

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1000);
				return interaction.reply({
					content: `Veuillez patienter, vous êtes en cooldown pour \`${command.data.name}\`. Vous pourrez l'utiliser à nouveau <t:${expiredTimestamp}:R>.`,
					flags: MessageFlags.Ephemeral,
				});
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'Une erreur est survenue lors de l\'exécution de cette commande!', flags: MessageFlags.Ephemeral });
			}
			else {
				await interaction.reply({ content: 'Une erreur est survenue lors de l\'exécution de cette commande!', flags: MessageFlags.Ephemeral });
			}
		}
	},
};