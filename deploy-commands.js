const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const commands = [];
// Récupère tous les dossiers de commandes du répertoire commands créé précédemment
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Récupère tous les fichiers de commandes du répertoire commands créé précédemment
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Récupère la sortie SlashCommandBuilder#toJSON() des données de chaque commande pour le déploiement
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON()),
			console.log(command);
		}
		else {
			console.log(`[ATTENTION] La commande dans ${filePath} n'a pas de propriété "data" ou "execute" requise.`);
		}
	}
}

// Construit et prépare une instance du module REST
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// et déploie vos commandes !
(async () => {
	try {
		// Vérifie si l'argument "delete" est présent
		const shouldDelete = process.argv.includes('delete');

		if (shouldDelete) {
			console.log('Début de la suppression des commandes existantes...');

			// for guild-based commands
			await rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), { body: [] });
			console.log('Commandes de guilde supprimées avec succès.');

			// for guild-based commands (test)
			await rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildIdTest), { body: [] });
			console.log('Commandes de guilde de test supprimées avec succès.');

			// for global commands
			await rest.put(Routes.applicationCommands(process.env.clientId), { body: [] });
			console.log('Commandes globales supprimées avec succès.');
		}

		console.log(`Début du déploiement global de ${commands.length} commandes (/) d'application.`);

		// Déploie les nouvelles commandes globalement
		const data = await rest.put(
			Routes.applicationCommands(process.env.clientId),
			{ body: commands },
		);

		console.log(`${data.length} commandes (/) d'application ont été déployées globalement avec succès.`);
	}
	catch (error) {
		// Et bien sûr, assurez-vous d'intercepter et de journaliser les erreurs !
		console.error(error);
	}
})();