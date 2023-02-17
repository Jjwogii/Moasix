const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { PlayerError } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("summon")
        .setDescription("Joins the voice channel you're currently in."),
    async execute(interaction) {
        await interaction.deferReply();

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!interaction.member.voice.channelId) {
            embed.setDescription("You aren't currently in a voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            embed.setDescription("I'm already in a voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        const queue = global.player.createQueue(interaction.guild, {
            leaveOnEnd: false,
            leaveOnStop: false,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 300000,
            autoSelfDeaf: true,
            spotifyBridge: true,
            ytdlOptions: {
                filter: "audioonly",
                opusEncoded: true,
                quality: "highestaudio",
                highWaterMark: 1 << 30,
            },
            metadata: {
                channel: interaction.channel,
            },
        });

        try {
            await queue.connect(interaction.member.voice.channel);
        } catch (err) {
            queue.destroy();
            embed.setDescription("I can't join that voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        embed.setDescription("Joined voice channel.");
        return await interaction.editReply({ embeds: [embed] });
    },
};
