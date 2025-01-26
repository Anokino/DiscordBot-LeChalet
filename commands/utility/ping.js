const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Répond avec Pong et le temps de réponse!'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pong!', fetchReply: true });
		const latence = sent.createdTimestamp - interaction.createdTimestamp;
		await interaction.editReply(`Pong! Temps de réponse: ${latence}ms`);
	},
};