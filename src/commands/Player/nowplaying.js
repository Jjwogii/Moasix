const { SlashCommandBuilder, ButtonBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("nowplaying").setDescription("View information about the current track."),
    async execute(interaction) {
        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.current) {
            // Added null check for queue and queue.current
            embed.setDescription("There isn't currently any music playing.");
            return interaction instanceof ChatInputCommandInteraction ? await interaction.reply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
        }

        const progress = queue.createProgressBar();
        if (!progress) {
            // Added null check for progress
            embed.setDescription("There isn't currently any music playing.");
            return interaction instanceof ChatInputCommandInteraction ? await interaction.reply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
        }

        embed.setDescription(`${progress}\n \n**[${queue.current.title}](${queue.current.url})** by **${queue.current.author}** is currently playing in **${interaction.guild.name}**. This track was requested by <@${queue.current.requestedBy.id}>.`);

        embed.setThumbnail(queue.current.thumbnail);

        const user_id = interaction instanceof ChatInputCommandInteraction ? interaction.user.id : interaction.author.id;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`melody_back_song-${user_id}`)
                .setEmoji(global.config.backEmoji.length <= 3 ? { name: global.config.backEmoji.trim() } : { id: global.config.backEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_pause_song-${user_id}`)
                .setEmoji(global.config.pauseEmoji.length <= 3 ? { name: global.config.pauseEmoji.trim() } : { id: global.config.pauseEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_skip_song-${user_id}`)
                .setEmoji(global.config.pauseEmoji.length <= 3 ? { name: global.config.skipEmoji.trim() } : { id: global.config.skipEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_stop-${user_id}`)
                .setEmoji(global.config.stopEmoji.length <= 3 ? { name: global.config.stopEmoji.trim() } : { id: global.config.stopEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_song_lyrics-${user_id}`)
                .setEmoji(global.config.lyricsEmoji.length <= 3 ? { name: global.config.lyricsEmoji.trim() } : { id: global.config.lyricsEmoji.trim() })
                .setStyle(ButtonStyle.Secondary)
        );

        return interaction instanceof ChatInputCommandInteraction ? await interaction.reply({ embeds: [embed], components: [row] }) : await interaction.channel.send({ embeds: [embed], components: [row] });
    },
};
