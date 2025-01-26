const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	// cooldown: 86400,
	data: new SlashCommandBuilder()
		.setName('mystere')
		.setDescription('Joue au jeu de la boîte mystère')
		.addBooleanOption(option =>
			option
				.setName('test')
				.setDescription('Mode test (debug)')
				.setRequired(false)),
	async execute(interaction) {
		const testMode = interaction.options.getBoolean('test') ?? false;
		let essaisRestants = 3;
		const gridHeight = 3; // Réduit à 3 lignes
		const gridWidth = 5; // Réduit à 5 colonnes pour respecter la limite Discord
		const totalButtons = gridHeight * gridWidth;
		const winningCell = Math.random() < 0.67 ? Math.floor(Math.random() * totalButtons) : -1;

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('🎮 La Boîte Mystère')
			.setImage('https://cdn.discordapp.com/attachments/1331826319951921155/1331829504649461760/UltraTrophyBox_BrawlStars.png?ex=67930a62&is=6791b8e2&hm=41bc542d0110a27842fc526a8c55ed27dffc089e3cb8579d7a5192bd08653987&')
			.setDescription('Trouve la boîte gagnante ! Tu as 3 essais.\n\n**Essais restants:** 3')
			.setFooter({ text: 'Bonne chance !' });

		const rows = [];
		for (let i = 0; i < gridHeight; i++) {
			const row = new ActionRowBuilder();
			for (let j = 0; j < gridWidth; j++) {
				const buttonId = i * gridWidth + j;
				const button = new ButtonBuilder()
					.setCustomId(`box_${buttonId}`)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(testMode && buttonId === winningCell ? '🎁' : '<:Box:1331829539051143249>');
				row.addComponents(button);
			}
			rows.push(row);
		}

		const message = await interaction.reply({
			embeds: [embed],
			components: rows,
			fetchReply: true,
		});

		const collector = message.createMessageComponentCollector({
			time: 60000,
		});

		const clickedButtons = new Set();

		collector.on('collect', async i => {
			if (i.user.id !== interaction.user.id) {
				return i.reply({ content: 'Ce n\'est pas ton jeu !', ephemeral: true });
			}

			const buttonId = parseInt(i.customId.split('_')[1]);
			const button = rows[Math.floor(buttonId / gridWidth)].components[buttonId % gridWidth];

			if (button.data.disabled) {
				return i.reply({ content: 'Cette case a déjà été ouverte !', ephemeral: true });
			}

			clickedButtons.add(i.customId);
			essaisRestants--;
			button.setDisabled(true);

			if (buttonId === winningCell) {
				button.setStyle(ButtonStyle.Success).setEmoji('🎉');
				embed.setDescription(`🎉 FÉLICITATIONS ! Tu as gagné !\nTu as trouvé la boîte gagnante avec ${3 - essaisRestants} essai(s) !`);
				await i.update({ embeds: [embed], components: rows });

				setTimeout(async () => {
					const colors = [ButtonStyle.Primary, ButtonStyle.Secondary, ButtonStyle.Success, ButtonStyle.Danger];
					const emojis = ['🎈', '🎊', '✨', '🎉'];

					// Animation de victoire plus élaborée
					for (let flash = 0; flash < 7; flash++) {
						for (const row of rows) {
							for (const btn of row.components) {
								if (btn.data.custom_id !== `box_${buttonId}`) {
									// Alterne entre les couleurs et les emojis
									btn.setStyle(colors[flash % colors.length])
									   .setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
								}
							}
						}
						await message.edit({ components: rows });
						await new Promise(resolve => setTimeout(resolve, 300));
					}

					// État final avec des emojis festifs et boutons verts
					for (const row of rows) {
						for (const btn of row.components) {
							if (btn.data.custom_id !== `box_${buttonId}`) {
								btn.setStyle(ButtonStyle.Success)
								   .setEmoji('❤️‍🔥');
							}
						}
					}
					await message.edit({ components: rows });
				}, 1000);

				collector.stop('win');
			}
			else {
				button.setStyle(ButtonStyle.Danger).setEmoji('<:Feu:1331133400031039489>');

				if (essaisRestants === 0) {
					embed.setDescription(`❌ PERDU !\n${winningCell === -1 ? 'Il n\'y avait aucune boîte gagnante cette fois !' : 'Tu n\'as pas trouvé la boîte gagnante 🎁\n Son emplacement est marqué d\'un <:Box:1331829539051143249> '}`);
					embed.setFooter({ text: 'Bien tenté, tu auras peut être plus de chance la prochaine fois !' });
					if (winningCell !== -1) {
						for (const row of rows) {
							for (const btn of row.components) {
								if (!clickedButtons.has(btn.data.custom_id) && btn.data.custom_id !== `box_${winningCell}`) {
									btn.setEmoji('❌');
								}
							}
						}
						rows[Math.floor(winningCell / gridWidth)].components[winningCell % gridWidth].setEmoji('<:Box:1331829539051143249>');
					}
					else {
						for (const row of rows) {
							for (const btn of row.components) {
								if (!clickedButtons.has(btn.data.custom_id)) {
									btn.setEmoji('❌');
								}
							}
						}
					}
					collector.stop('lose');
				}
				else {
					embed.setDescription(`Continue de chercher !\n\n**Essais restants:** ${essaisRestants}`);
				}

				await i.update({ embeds: [embed], components: rows });
			}
		});

		collector.on('end', (collected, reason) => {
			if (reason === 'time') {
				embed.setDescription('⏱️ Temps écoulé ! La partie est terminée.');
				message.edit({ embeds: [embed], components: [] });
			}
		});
	},
};
