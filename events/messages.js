const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		// Vérifie que le message provient du serveur spécifié
		if (message.guildId !== '1329516330420011059') return;


		// Vérifie si le message contient "merci" (insensible à la casse)
		const messageContent = message.content.toLowerCase();
		const merciRegex = /merci+/i;
		if (merciRegex.test(messageContent)) {
			// Vérifie que le message n'est pas envoyé par un bot
			if (message.author.bot) return;
			try {
				await message.react('<a:TresContente:1332187694540918845>');
			}
			catch (error) {
				console.error('Impossible d\'ajouter la réaction:', error);
			}
		}

		// Vérifie un le message contient un embed avec "Ce ticket concerne : 🎁 Mystère"
		if (message.embeds.length > 0) {

			const embedContent = message.embeds[0].description || '';
			console.log(new Date().toLocaleTimeString(),embedContent);
			if (embedContent.includes('Mystère')) {
				const jeuEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle('🎮 Jeu de la Boîte Mystère')
					.setDescription('Quand tu te sens prêt(e), lance le jeu avec /mystere')
					.setImage('https://cdn.discordapp.com/attachments/1331826319951921155/1331829504649461760/UltraTrophyBox_BrawlStars.png?ex=67930a62&is=6791b8e2&hm=41bc542d0110a27842fc526a8c55ed27dffc089e3cb8579d7a5192bd08653987&');

				await message.channel.send({ embeds: [jeuEmbed] });
			}
		}
	},
};