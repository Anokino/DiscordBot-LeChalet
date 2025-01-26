// Importe les classes discord.js nécessaires
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

// Crée une nouvelle instance du client
const client = new Client({
	 intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

// Quand le client est prêt, exécute ce code (une seule fois).
// La distinction entre `client: Client<boolean>` et `readyClient: Client<true>` est importante pour les développeurs TypeScript.
// Cela rend certaines propriétés non-nullables.
/*
client.once(Events.ClientReady, readyClient => {
	console.log(`Prêt! Connecté en tant que ${readyClient.user.tag}`);
});
*/


client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Définit un nouvel élément dans la Collection avec la clé comme nom de commande et la valeur comme module exporté
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[ATTENTION] La commande dans ${filePath} n'a pas de propriété "data" ou "execute" requise.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Connexion à Discord avec le jeton client
client.login(process.env.DISCORD_TOKEN);