const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-channel')
        .setDescription('Delete a channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to delete')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: 'You do not have permission to delete channels.', ephemeral: true });
        }

        try {
            await channel.delete();
            await interaction.reply(`Channel "${channel.name}" deleted successfully.`);
        } catch (error) {
            console.error('Error deleting channel:', error);
            await interaction.reply({ content: 'There was an error deleting the channel.', ephemeral: true });
        }
    },
};
