const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { setTimeout } = require('node:timers/promises');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Start a giveaway')
        .addStringOption(option =>
            option.setName('prize')
                .setDescription('The prize of the giveaway')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('The duration of the giveaway in hours')
                .setRequired(true)),
    async execute(interaction) {
        const prize = interaction.options.getString('prize');
        const duration = interaction.options.getInteger('duration');

        const embed = new EmbedBuilder()
            .setTitle('🎉 **GIVEAWAY** 🎉')
            .setDescription(`**Prize:** ${prize}\n**React with 🎉 to enter!**\n**Duration:** ${duration} hours`)
            .setColor('#ffcc00')
            .setTimestamp(Date.now() + duration * 60 * 60 * 1000)
            .setFooter({ text: 'Ends at' });

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        await message.react('🎉');

        await setTimeout(duration * 60 * 60 * 1000);

        const fetchedMessage = await message.fetch();
        const reactions = fetchedMessage.reactions.cache.get('🎉');

        if (!reactions) {
            return interaction.followUp('No one entered the giveaway.');
        }

        const users = await reactions.users.fetch();
        const participants = users.filter(user => !user.bot);

        if (participants.size === 0) {
            return interaction.followUp('No one entered the giveaway.');
        }

        const winner = participants.random();
        await interaction.followUp(`Congratulations ${winner}! You won the prize: ${prize}`);
    },
};
