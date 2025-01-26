const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Affiche les informations d\'un utilisateur')
		.addUserOption(option =>
			option
				.setName('utilisateur')
				.setDescription('L\'utilisateur dont vous voulez voir les informations')
				.setRequired(false)),
	async execute(interaction) {
		const targetUser = interaction.options.getUser('utilisateur') ?? interaction.user;
		const member = await interaction.guild.members.fetch(targetUser.id);

		const embed = new EmbedBuilder()
			.setColor(member.displayHexColor)
			.setTitle(`Informations sur ${targetUser.username}`)
			.setThumbnail(targetUser.displayAvatarURL())
			.addFields(
				{ name: '🆔 ID', value: targetUser.id, inline: true },
				{ name: '🎭 Pseudo sur le serveur', value: member.nickname || 'Aucun', inline: true },
				{ name: '🤖 Bot', value: targetUser.bot ? 'Oui' : 'Non', inline: true },
				{ name: '📅 Compte créé le', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`, inline: true },
				{ name: '📥 A rejoint le serveur le', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
				{ name: '🎨 Couleur', value: member.displayHexColor, inline: true },
				{ name: '🏷️ Rôles', value: member.roles.cache.size > 1
					? member.roles.cache.filter(role => role.id !== interaction.guild.id).map(role => `<@&${role.id}>`).join(', ')
					: 'Aucun rôle' },
			)
			.setFooter({ text: `Demandé par ${interaction.user.username} | Traitement: ${Date.now() - interaction.createdTimestamp}ms`, iconURL: interaction.user.displayAvatarURL() })
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};