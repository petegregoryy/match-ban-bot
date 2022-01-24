const fs = require('fs');
const { Collection, Intents, Client, MessageAttachment } = require('discord.js');
var SqlString = require('sqlstring');
const catchErr = err => {
	console.log(err)
}

const {token, userId , prefix} = require("./config.json");
const { userMention, memberNicknameMention, channelMention, roleMention } = require('@discordjs/builders');

const client = new Client({ intents: ["DIRECT_MESSAGES","GUILDS","GUILD_MESSAGES"], partials: ["CHANNEL"] });

client.commands = new Collection();
client.cooldowns = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

//#region Interaction Create
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction,client, function (data) {
            if(data == "add"){
                var naughtyRead = fs.readFileSync("links.txt","utf-8")
                naughtyWordsList = naughtyRead.split("\n");
                console.log("Refreshed links!")
            }
        });
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
//#endregion


client.once("ready",() => {
	var naughtyRead = fs.readFileSync("links.txt","utf-8")
    naughtyWordsList = naughtyRead.split("\n");
    console.log(`Logged in as ${client.user.tag}`);
    client.guilds.cache.get("854846437967921234").members.fetch()

});

//#region MessageCreate 
client.on("messageCreate", async message =>{
	if(message.author.id == "175279596554551297"){
		if(message.content === "!refresh"){
			var naughtyRead = fs.readFileSync("links.txt","utf-8")
    		naughtyWordsList = naughtyRead.split("\n");
			console.log("Refreshed links!")
			message.delete().catch((err) => {console.log("can't delete refresh message!")});
		}
	}

	if(message.author.id != userId){
        for (naughtyWord of naughtyWordsList){
            if(naughtyWord != ""){
                naughtyWord = naughtyWord.replace(/\r?\n|\r/g,'');
                let found = false
                if(message.content.toLowerCase().includes(naughtyWord.toLowerCase())){
                    found = true
					let reason = "Matched with banned message - " + naughtyWord.toLowerCase();
                    message.guild.members.cache.get(message.author.id).ban({reason: reason});
					message.delete().catch((err) => {
						console.log("No delete perms!")
						message.channel.send("I don't have delete permissions!").catch((err) => { console.log("No message perms either!");});
					})					
					break
                }
            }
        }
		
    }
})


client.login(token);

function between(min, max) {  
	return Math.floor(
	  Math.random() * (max - min) + min
	)
}