const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('emoji')
		.setDescription('Télécharge un émoji du serveur')
		.addStringOption(option =>
			option
				.setName('emoji')
				.setDescription('L\'émoji à télécharger')
				.setRequired(true)),
	async execute(interaction) {
		const emojiInput = interaction.options.getString('emoji');

		// Extraire l'ID de l'émoji du format Discord <:nom:id>
		const emojiMatch = emojiInput.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/);

		if (!emojiMatch) {
			return interaction.reply({ content: 'Veuillez fournir un émoji valide du serveur.', ephemeral: true });
		}

		const isAnimated = emojiMatch[1] === 'a';
		const emojiId = emojiMatch[3];
		const emojiName = emojiMatch[2];
		const extension = isAnimated ? 'gif' : 'png';
		const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.${extension}`;

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(`Émoji : ${emojiName}`)
			.setDescription(`[Télécharger](${emojiUrl})`)
			.setImage(emojiUrl)
			.setFooter({ text: `ID: ${emojiId}` });

		await interaction.reply({ embeds: [embed] });
	},
};
