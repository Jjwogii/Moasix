const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");
const { lyricsExtractor } = require("@discord-player/extractor");

const lyricsClient = lyricsExtractor(global.config.geniusKey);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("View lyrics for the specified track.")
        .addStringOption((option) => option.setName("query").setDescription("Enter a track name, artist name, or URL.").setRequired(true)),
    async execute(interaction) {
        interaction instanceof ChatInputCommandInteraction ? await interaction.deferReply() : await interaction.channel.sendTyping();

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        const query = interaction instanceof ChatInputCommandInteraction ? interaction.options.getString("query") : interaction.content.split(" ").slice(1).join(" ");

        await lyricsClient
            .search(query)
            .then((x) => {
                embed.setAuthor({
                    name: `${x.title} - ${x.artist.name}`,
                    url: x.url,
                });
                embed.setDescription(x.lyrics);
                embed.setFooter({ text: "Courtesy of Genius" });
            })
            .catch(() => {
                embed.setDescription(`I couldn't find a track with the name **${query}**.`);
            });

        return interaction instanceof ChatInputCommandInteraction ? await interaction.editReply({ embeds: [embed] }) : await interaction.channel.send({ embeds: [embed] });
    },
};
