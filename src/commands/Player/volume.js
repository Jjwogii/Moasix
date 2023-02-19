const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Adjusts the volume of the current music.")
        .addIntegerOption((option) => option.setName("volume").setDescription("The volume to set the music to.").setRequired(true)),
    async execute(interaction) {
        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            const vol = interaction instanceof ChatInputCommandInteraction ? interaction.options.getString("volume") : interaction.content.split(" ")[1];

            if (queue.volume === vol) {
                embed.setDescription(`The current queue volume is already set to ${vol}%.`);
                return interaction instanceof ChatInputCommandInteraction ? await interaction.reply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
            }

            const maxVolume = 1000;

            if (vol < 0 || vol > maxVolume) {
                embed.setDescription(`The number that you have specified is not valid. Please enter a number between **0 and ${maxVolume}**.`);
                return interaction instanceof ChatInputCommandInteraction ? await interaction.reply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
            }

            const success = queue.setVolume(vol);
            success ? embed.setDescription(`The current music's volume was set to **${vol}%**.`) : embed.setDescription("An error occurred whilst attempting to set the volume.");
        }

        return interaction instanceof ChatInputCommandInteraction ? await interaction.reply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
    },
};
