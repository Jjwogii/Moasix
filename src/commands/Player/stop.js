const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("stop").setDescription("Stops the current track."),
    async execute(interaction) {
        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            // Set a timeout for 5 minutes (300000 milliseconds) to leave the voice channel after stopping the music
            setTimeout(() => {
                const connection = queue.connection;
                if (connection) {
                    connection.disconnect();
                }
            }, 300000);
            queue.stop();
            embed.setDescription("The music has been stopped.");
        }

        return interaction instanceof ChatInputCommandInteraction ? await interaction.reply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
    },
};
