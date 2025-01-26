const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Prêt! Connecté en tant que ${client.user.tag}`);

		let memberCount = 0;
		for (const guild of client.guilds.cache.values()) {
			const members = await guild.members.fetch();
			memberCount += members.filter(member => !member.user.bot).size;
		}

		client.user.setActivity({
			name: `réchauffer le chalet avec ${memberCount} membres`,
			type: ActivityType.Playing,
			state: 'En train de réchauffer le chalet',
		});
	},
};