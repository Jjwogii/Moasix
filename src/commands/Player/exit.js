const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leaves the voice channel."),
    async execute(interaction) {
        await interaction.deferReply();

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            embed.setDescription("You aren't currently in a voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        const queue = global.player.getQueue(interaction.guildId);
        if (!queue || queue.connection.channel.id !== voiceChannel.id) {
            embed.setDescription("I'm not in your voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        await queue.connection.disconnect();
        embed.setDescription("Left voice channel.");
        return await interaction.editReply({ embeds: [embed] });
    },
};
