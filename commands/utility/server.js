const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Affiche les informations du serveur.'),
	async execute(interaction) {
		const guild = interaction.guild;

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(`Informations sur ${guild.name}`)
			.setThumbnail(guild.iconURL())
			.addFields(
				{ name: '👥 Membres', value: `${guild.memberCount}`, inline: true },
				{ name: '📅 Créé le', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
				{ name: '👑 Propriétaire', value: `<@${guild.ownerId}>`, inline: true },
				{ name: '💬 Salons', value: `${guild.channels.cache.size}`, inline: true },
				{ name: '🎭 Rôles', value: `${guild.roles.cache.size}`, inline: true },
				{ name: '🎨 Emojis', value: `${guild.emojis.cache.size}`, inline: true },
				{ name: '🚀 Niveau de boost', value: `${guild.premiumTier}`, inline: true },
				{ name: '💎 Nombre de boosts', value: `${guild.premiumSubscriptionCount || '0'}`, inline: true },
				{ name: '🌍 Région', value: guild.preferredLocale, inline: true },
			)
			.setFooter({ text: `Demandé par ${interaction.user.username} | ID: ${guild.id} | Traitement: ${Date.now() - interaction.createdTimestamp}ms`, iconURL: interaction.user.displayAvatarURL() });

		await interaction.reply({ embeds: [embed] });
	},
};