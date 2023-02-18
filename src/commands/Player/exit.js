const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("leave").setDescription("Leaves the voice channel."),
  async execute(interaction) {
    interaction instanceof ChatInputCommandInteraction
      ? await interaction.deferReply()
      : await interaction.channel.sendTyping();

    const embed = new EmbedBuilder();
    embed.setColor(global.config.embedColour);

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      embed.setDescription("You aren't currently in a voice channel.");
      return interaction instanceof ChatInputCommandInteraction
        ? await interaction.editReply({ embeds: [embed] })
        : await interaction.channel.send({ embeds: [embed] });
    }

    const queue = global.player.getQueue(interaction.guildId);
    if (!queue || queue.connection.channel.id !== voiceChannel.id) {
      embed.setDescription("I'm not in your voice channel.");
      return interaction instanceof ChatInputCommandInteraction
        ? await interaction.editReply({ embeds: [embed] })
        : await interaction.channel.send({ embeds: [embed] });
    }

    // Check if there is a track playing
    const isPlaying = Boolean(queue.current);
    await queue.connection.disconnect();

    if (isPlaying) {
      // If there is a track playing, send the disconnect event to dc.js
      global.player.emit("botDisconnect", queue, true);
      embed.setDescription(
        "Left voice channel. The music was stopped because I was disconnected from the channel."
      );
    } else {
      embed.setDescription("Left voice channel.");
    }

    return interaction instanceof ChatInputCommandInteraction
      ? await interaction.editReply({ embeds: [embed] })
      : await interaction.channel.send({ embeds: [embed] });
  },
};
