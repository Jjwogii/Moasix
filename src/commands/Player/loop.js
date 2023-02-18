const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Allows you to change the current loop mode, or enable autoplay.")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Loop mode")
        .setRequired(true)
        .addChoices(
          { name: "off", value: "off" },
          { name: "queue", value: "queue" },
          { name: "track", value: "track" },
          { name: "autoplay", value: "autoplay" }
        )
    ),
  async execute(interaction) {
    const queue = global.player.getQueue(interaction.guild.id);
    const mode =
      interaction instanceof ChatInputCommandInteraction
        ? interaction.options.getString("mode")
        : interaction.content.split(" ").slice(1).join(" ");

    const modes = ["off", "queue", "track", "autoplay"];

    const embed = new EmbedBuilder();
    embed.setColor(global.config.embedColour);

    if (!modes.includes(mode)) {
      embed.setDescription("Mode not supported (or doesn't exist).");
      return interaction instanceof ChatInputCommandInteraction
        ? await interaction.editReply({ embeds: [embed] })
        : await interaction.channel.send({ embeds: [embed] });
    }

    if (!queue || !queue.playing) {
      embed.setDescription("There isn't currently any music to loop.");
    } else {
      if (mode == "off") {
        const success = queue.setRepeatMode(0);
        success
          ? embed.setDescription("Looping is now **disabled**.")
          : embed.setDescription("Looping is already **disabled**.");
      } else if (mode == "queue") {
        const success = queue.setRepeatMode(2);
        success
          ? embed.setDescription("The **queue** will now repeat endlessly.")
          : embed.setDescription("Looping is already set to **queue** repeat.");
      } else if (mode == "track") {
        const success = queue.setRepeatMode(1);
        success
          ? embed.setDescription("The **track** will now repeat endlessly.")
          : embed.setDescription("Looping is already set to **track** repeat.");
      } else {
        const success = queue.setRepeatMode(3);
        success
          ? embed.setDescription("The queue will now **autoplay**.")
          : embed.setDescription("The queue is already set to **autoplay**.");
      }
    }

    return interaction instanceof ChatInputCommandInteraction
      ? await interaction.editReply({ embeds: [embed] })
      : await interaction.channel.send({ embeds: [embed] });
  },
};
