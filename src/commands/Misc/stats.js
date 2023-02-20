const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("stats").setDescription("Shows global Melody statistics."),
    async execute(interaction, client) {
        let rawdata = fs.readFileSync("src/data.json");
        var data = JSON.parse(rawdata);

        const embed = new EmbedBuilder();
        embed.setDescription(`Melody is currently in **${client.guilds.cache.size} servers**, has played **${data["songs-played"]} tracks**, skipped **${data["songs-skipped"]} tracks**, and shuffled **${data["queues-shuffled"]} queues**.`);
        embed.setColor(global.config.embedColour);

        return interaction instanceof ChatInputCommandInteraction ? await interaction.reply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
    },
};