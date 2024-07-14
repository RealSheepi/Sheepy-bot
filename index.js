const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { token } = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "Something went wrong!",
            ephemeral: true,
        });
    }
});

client.on('guildMemberAdd', async member => {
    try {
        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.InviteCreate
        });
        const inviteLog = fetchedLogs.entries.first();

        let inviter = 'Unknown';

        if (inviteLog) {
            const { executor, target } = inviteLog;

            if (target.id === member.id) {
                inviter = executor.tag;
            }
        }

        const welcomeChannelId = 'your-channel-id'; 
        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

        if (!welcomeChannel) return;

        const welcomeEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('Welcome!')
            .setDescription(`Welcome to the server, ${member.user.tag}!\nYou were invited by ${inviter}.`)
            .setImage('welcome-gif') 
            .setTimestamp();

        await welcomeChannel.send({ embeds: [welcomeEmbed] });

    } catch (error) {
        console.error('Error fetching audit logs:', error);
    }
});


client.login(token);
