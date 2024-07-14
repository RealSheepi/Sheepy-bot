const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway-end')
        .setDescription('End an ongoing giveaway')
        .addStringOption(option =>
            option.setName('message-id')
                .setDescription('The message ID of the giveaway')
                .setRequired(true)),
    async execute(interaction) {
        const messageId = interaction.options.getString('message-id');
        const channel = interaction.channel;

        try {
            const message = await channel.messages.fetch(messageId);
            const reactions = message.reactions.cache.get('🎉');

            if (!reactions) {
                return interaction.reply('No one entered the giveaway.');
            }

            const users = await reactions.users.fetch();
            const participants = users.filter(user => !user.bot);

            if (participants.size === 0) {
                return interaction.reply('No one entered the giveaway.');
            }

            const winner = participants.random();
            await interaction.reply(`Congratulations ${winner}! You won the prize!`);
        } catch (error) {
            console.error('Error fetching message:', error);
            await interaction.reply('There was an error ending the giveaway.');
        }
    },
};
