const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("phaser").setDescription("Applies the phaser effect to the current music."),
    async execute(interaction) {
        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            queue.setFilters({
                phaser: !queue.getFiltersEnabled().includes("phaser"),
            });
            embed.setDescription(`The **phaser** filter is now ${queue.getFiltersEnabled().includes("phaser") ? "enabled." : "disabled."}`);
        }

        return interaction instanceof ChatInputCommandInteraction ? await interaction.reply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
    },
};
