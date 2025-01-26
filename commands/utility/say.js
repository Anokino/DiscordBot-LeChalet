const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Fait dire quelque chose au bot')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('Le message à faire dire')
				.setRequired(true)),
	async execute(interaction) {
		// Vérifie si l'utilisateur est l'admin
		if (interaction.user.id !== process.env.adminId) {
			return interaction.reply({
				content: 'Vous n\'avez pas la permission d\'utiliser cette commande.',
				ephemeral: true,
			});
		}

		const message = interaction.options.getString('message');

		// Envoie le message et supprime la commande originale
		await interaction.channel.send(message);
		await interaction.reply({ content: 'Message envoyé', ephemeral: true });
	},
};
