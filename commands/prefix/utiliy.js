const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'listmembers',
    description: 'Liste tous les membres du bot',
    execute(message, args) {
        if (!message.content.startsWith('!') || message.author.bot) return;

        const members = [];
        message.client.guilds.cache.forEach(guild => {
            guild.members.cache.forEach(member => {
                if (!members.includes(member.user.tag)) {
                    members.push(member.user.tag);
                }
            });
        });

        const embed = new MessageEmbed()
            .setTitle('Liste des membres')
            .setDescription(members.join('\n'))
            .setColor('#00FF00');

        message.channel.send({ embeds: [embed] });
    }
};