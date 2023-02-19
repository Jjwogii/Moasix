const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("normalizer").setDescription("Applies the normalizer effect to the current music."),
    async execute(interaction) {
        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            queue.setFilters({
                normalizer2: !queue.getFiltersEnabled().includes("normalizer2"),
            });
            embed.setDescription(`The **normalizer** filter is now ${queue.getFiltersEnabled().includes("normalizer2") ? "enabled." : "disabled."}`);
        }

        return interaction instanceof ChatInputCommandInteraction ? await interaction.reply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
    },
};
