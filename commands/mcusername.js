const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraft')
        .setDescription('Get a Minecraft player\'s details from Mojang Studios')
        .addStringOption(option => option.setName('username').setDescription('Enter a username').setRequired(true)),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute(interaction) {
        try {
            console.log("Executing minecraft command...");

            if (interaction.deferred || interaction.replied) {
                console.log("Interaction already acknowledged.");
                return;
            }

            await interaction.deferReply();
            console.log("Deferred reply...");

            const usernameField = interaction.options.getString('username');
            const fetch = await import('node-fetch').then(mod => mod.default);

            const Mojang = await fetch(`https://api.mojang.com/users/profiles/minecraft/${usernameField}`)
                .then(res => res.json());

            if (!Mojang || Mojang.errorMessage) {
                console.log("Invalid username or error message received from Mojang.");
                return interaction.editReply({ content: 'Error: Invalid username or username does not exist.' });
            }

            const embed = new EmbedBuilder()
                .setTitle(`${Mojang.name}`)
                .addFields({ name: 'UUID', value: `\`${Mojang.id}\`` })
                .setImage(`https://mc-heads.net/body/${Mojang.id}/128.png`)
                .setFooter({ text: 'Powered by Mojang Studios' })
                .setColor('#ef323d');

            const button = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                    .setURL(`https://namemc.com/profile/${usernameField}`)
                    .setLabel('View on NameMC')
                    .setStyle('Link'));

            console.log("Editing reply with embed...");
            return interaction.editReply({ embeds: [embed], components: [button] });
        } catch (error) {
            console.error("Error executing command:", error);
            if (interaction.deferred || interaction.replied) {
                return interaction.editReply({ content: 'Error: An error has occurred while trying to process your request.' });
            } else {
                return interaction.reply({ content: 'Error: An error has occurred while trying to process your request.', ephemeral: true });
            }
        }
    }
};
