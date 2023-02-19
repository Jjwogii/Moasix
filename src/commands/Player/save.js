const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("save").setDescription("Sends you a direct message with details about the current track."),
    async execute(interaction) {
        interaction instanceof ChatInputCommandInteraction ? await interaction.deferReply() : await interaction.channel.sendTyping();

        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue) {
            embed.setDescription("There isn't currently any music playing.");
            return interaction instanceof ChatInputCommandInteraction ? await interaction.editReply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
        }

        const info = new EmbedBuilder();
        info.setColor(global.config.embedColour);

        info.setTitle("Track Saved");

        var message = `
            **Track Name:** [${queue.current.title}](${queue.current.url})
            **Author:** ${queue.current.author}
            **Duration:** ${queue.current.duration}\n`;

        if (queue.current.playlist) {
            message += `**Playlist:** [${queue.current.playlist.title}](${queue.current.playlist.url})\n`;
        }

        message += `**Saved:** <t:${Math.round(Date.now() / 1000)}:R>`;

        info.setDescription(message);
        info.setThumbnail(queue.current.thumbnail);
        info.setFooter({ text: `Track saved from ${interaction.guild.name}` });
        info.setTimestamp();

        (await interaction) instanceof ChatInputCommandInteraction
            ? interaction.user.send({ embeds: [info] }).catch(async (err) => {
                  embed.setDescription("I cannot send you direct messages. Check your privacy settings and try again.");
                  return await interaction.followUp({ embeds: [embed] });
              })
            : interaction.author.send({ embeds: [info] }).catch(async (err) => {
                  embed.setDescription("I cannot send you direct messages. Check your privacy settings and try again.");
                  return await interaction.channel.send({ embeds: [embed] });
              });

        embed.setDescription("Successfully saved the current track to your direct messages!");

        return interaction instanceof ChatInputCommandInteraction ? await interaction.editReply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
    },
};
