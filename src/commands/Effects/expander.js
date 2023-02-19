const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("expander").setDescription("Applies the expander effect to the current music."),
    async execute(interaction) {
        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            queue.setFilters({
                expander: !queue.getFiltersEnabled().includes("expander"),
            });
            embed.setDescription(`The **expander** filter is now ${queue.getFiltersEnabled().includes("expander") ? "enabled." : "disabled."}`);
        }

        return interaction instanceof ChatInputCommandInteraction ? await interaction.reply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
    },
};
