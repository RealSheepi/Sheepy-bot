const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-channel')
        .setDescription('Create a new channel')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('The name of the new channel')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of the new channel (text, voice)')
                .setRequired(true)
                .addChoices(
                    { name: 'text', value: 'text' },
                    { name: 'voice', value: 'voice' }
                )),
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const type = interaction.options.getString('type');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: 'You do not have permission to create channels.', ephemeral: true });
        }

        try {
            await interaction.guild.channels.create({
                name,
                type: type === 'text' ? ChannelType.GuildText : ChannelType.GuildVoice
            });
            await interaction.reply(`Channel "${name}" created successfully.`);
        } catch (error) {
            console.error('Error creating channel:', error);
            await interaction.reply({ content: 'There was an error creating the channel.', ephemeral: true });
        }
    },
};
