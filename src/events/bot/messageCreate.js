const yaml = require("js-yaml");
const fs = require("node:fs");

if (!fs.existsSync("config.yml")) {
    return console.error("[Aborted] Unable to find config.yml file. Please copy the default configuration into a file named config.yml in the root directory. (The same directory as package.json)");
}

const configFile = yaml.load(fs.readFileSync("./config.yml"));

const commands = require("../../commands-metadata.json");

module.exports = {
    name: "messageCreate",
    once: false,

    /**
     * @param {import('discord.js').Message} message
     * @returns {void}
     */
    async execute(message) {
        if (message.author.bot) return;
        if (message.content.charAt(0) !== configFile.prefix) return;

        // Transform Interaction instance to Message.
        // This is to basically trick the slash command.
        const interaction = message;

        // Get the command
        const command = message.content.split(" ").shift().slice(1);
        const metadata = commands.find((c) => c.command === command || c.aliases.includes(command));

        // Return if metadata is undefined
        if (typeof metadata === "undefined") return;

        // Run the slash command using prefix
        // Tricky, but it works lol.
        require(`../../commands/${metadata.folder}/${metadata.command}`).execute(interaction);
    },
};
