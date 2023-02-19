const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");
const { PlayerError } = require("discord-player");
const fs = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playshuffle")
        .setDescription("Plays the specified playlist with a random track order.")
        .addStringOption((option) => option.setName("playlist").setDescription("Enter a playlist URL here to playshuffle.").setRequired(true)),
    async execute(interaction) {
        interaction instanceof ChatInputCommandInteraction ? await interaction.deferReply() : await interaction.channel.sendTyping();

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!interaction.member.voice.channelId) {
            embed.setDescription("You aren't currently in a voice channel.");
            return interaction instanceof ChatInputCommandInteraction ? await interaction.editReply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            embed.setDescription("I can't play music in that voice channel.");
            return interaction instanceof ChatInputCommandInteraction ? await interaction.editReply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
        }

        const query = interaction instanceof ChatInputCommandInteraction ? interaction.options.getString("playlist") : interaction.content.split(" ").slice(1).join(" ");

        const queue = global.player.createQueue(interaction.guild, {
            leaveOnEnd: true,
            leaveOnStop: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 300000,
            autoSelfDeaf: false,
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
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch (err) {
            await queue.destroy();
            embed.setDescription("I can't join that voice channel.");
            return interaction instanceof ChatInputCommandInteraction ? await interaction.editReply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
        }

        const res = await global.player.search(query, {
            requestedBy: interaction.user,
        });

        if (!res) {
            embed.setDescription(`I couldn't find a playlist with the name **${query}**`);
            await queue.destroy();
            return interaction instanceof ChatInputCommandInteraction ? await interaction.editReply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
        }

        if (!res.playlist) {
            embed.setDescription("The query specified doesn't appear to be a playlist.");
            await queue.destroy();
            return interaction instanceof ChatInputCommandInteraction ? await interaction.editReply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
        }

        try {
            queue.addTracks(res.tracks);
            await queue.shuffle();
            if (!queue.playing) await queue.play();
        } catch (err) {
            if (err instanceof PlayerError) {
                if (err.statusCode == "InvalidTrack") {
                    embed.setDescription(`I couldn't find a playlist with the name **${query}**.`);
                    await queue.destroy();
                    return interaction instanceof ChatInputCommandInteraction ? await interaction.editReply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
                }
            }

            console.error(err);

            await queue.destroy();
            embed.setDescription("This media doesn't seem to be working right now, please try again later.");
            return interaction instanceof ChatInputCommandInteraction ? await interaction.followUp({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
        }

        const data = fs.readFileSync("src/data.json");
        const parsed = JSON.parse(data);

        parsed["queues-shuffled"] += 1;

        fs.writeFileSync("src/data.json", JSON.stringify(parsed));

        embed.setDescription(`**${res.tracks.length} tracks** from the ${res.playlist.type} **[${res.playlist.title}](${res.playlist.url})** have been loaded into the server queue.`);

        return interaction instanceof ChatInputCommandInteraction ? await interaction.editReply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
    },
};
