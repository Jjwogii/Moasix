const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("help").setDescription("Shows all Melody commands available."),
    async execute(interaction) {
        const embed = new EmbedBuilder();
        embed.setTitle("Melody Help");
        embed.setDescription("Thank you for using **Melody**! To view all available commands, choose a category from the select menu below.");
        embed.setColor(global.config.embedColour);

        const user_id = interaction instanceof ChatInputCommandInteraction ? interaction.user.id : interaction.author.id;

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId(`melody_help_category_select_${user_id}`).setPlaceholder("Select a category to view commands.").addOptions(
                {
                    label: "General",
                    description: "Commands available in Melody that do not relate to music.",
                    value: "melody_help_category_general",
                },
                {
                    label: "Music Controls",
                    description: "Commands that are used to control the music being played.",
                    value: "melody_help_category_music",
                },
                {
                    label: "Effects",
                    description: "Commands that control the effects currently applied to music.",
                    value: "melody_help_category_effects",
                }
            )
        );

        return interaction instanceof ChatInputCommandInteraction ? await interaction.reply({ embeds: [embed], components: [row] }) : await interaction.channel.send({ embeds: [embed], components: [row] });
    },
};
