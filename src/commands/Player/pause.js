const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the current track."),
  async execute(interaction) {
    const queue = global.player.getQueue(interaction.guild.id);

    const embed = new EmbedBuilder();
    embed.setColor(global.config.embedColour);

    if (!queue) {
      embed.setDescription("There isn't currently any music playing.");
      return interaction instanceof ChatInputCommandInteraction
        ? await interaction.editReply({ embeds: [embed] })
        : await interaction.channel.send({ embeds: [embed] });
    }

    if (queue.connection.paused) {
      embed.setDescription("The queue is already paused.");
      return interaction instanceof ChatInputCommandInteraction
        ? await interaction.editReply({ embeds: [embed] })
        : await interaction.channel.send({ embeds: [embed] });
    }

    queue.setPaused(true);

    embed.setDescription(`Successfully paused **[${queue.current.title}](${queue.current.url})**.`);

    return interaction instanceof ChatInputCommandInteraction
      ? await interaction.editReply({ embeds: [embed] })
      : await interaction.channel.send({ embeds: [embed] });
  },
};
