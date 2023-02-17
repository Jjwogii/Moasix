const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "botDisconnect",
    async execute(queue, wasTriggeredByLeaveCommand) {
        // If the disconnect event was triggered by the leave command, don't send a message
        if (wasTriggeredByLeaveCommand) {
            return;
        }

        const embed = new EmbedBuilder();
        embed.setDescription("The music was stopped because I was disconnected from the channel.");
        embed.setColor(global.config.embedColour);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
