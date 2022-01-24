const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fs = require("fs");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add string to database.')
        .addStringOption(option =>option.setName('link').setDescription("Link to add.").setRequired(true))
        .setDefaultPermission(false),

	async execute(interaction,client,callback) {
		fs.appendFileSync("links.txt",`\n${interaction.options.getString("link")}`);
        interaction.reply({ content: `${interaction.options.getString('link')} added! Please refresh using !refresh`, components:[], ephemeral: true})
        callback("add");
	},
};