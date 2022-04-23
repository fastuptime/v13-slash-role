const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const { Client, Collection, Intents } = require("discord.js");
const client = new Client({
    intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_BANS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "GUILD_PRESENCES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
    ],
});

const Discord = require('discord.js');
client.discord = Discord;
client.commands = new Collection();
client.slashCommands = new Collection();


client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return interaction.followUp({ content: 'an Erorr' });

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === 'SUB_COMMAND') {
        if (option.name) args.push(option.name);
          option.options?.forEach(x =>  {
            if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    } try {
      command.run(client, interaction, args)
    } catch (e) {
      interaction.followUp({ content: e.message });
    }
  }
});

handler(client);
async function handler(client) {
  const slashCommands = await globPromise(
      `${process.cwd()}/slashcommands/**/*.js`
  );

  const arrayOfSlashCommands = [];
  slashCommands.map((value) => {
      const file = require(value);
      if (!file.name) return;
      client.slashCommands.set(file.name, file);
      arrayOfSlashCommands.push(file);
  });
  client.on("ready", async () => {
      await client.application.commands.set(arrayOfSlashCommands).catch(console.error);
  });
}

client.on("ready", () => {
    console.log(`Giriş, ${client.user.tag}! ByCan`);
});

client.login("token");
