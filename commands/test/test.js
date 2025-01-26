const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Affiche une rangée de boutons de test'),
	async execute(interaction) {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary')
					.setLabel('Primaire')
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder() 
					.setCustomId('secondary')
					.setLabel('Secondaire')
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('success')
					.setLabel('Succès')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('danger') 
					.setLabel('Danger')
					.setStyle(ButtonStyle.Danger),
				new ButtonBuilder()
					.setLabel('Lien')
					.setURL('https://discord.js.org')
					.setStyle(ButtonStyle.Link),
			);

		await interaction.reply({
			content: 'Voici une rangée avec tous les types de boutons disponibles!',
			components: [row],
		});
	},
};
