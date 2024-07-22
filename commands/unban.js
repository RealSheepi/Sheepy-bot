const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user by their ID')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The ID of the user to unban')
                .setRequired(true)),
    async execute(interaction) {
        const userId = interaction.options.getString('userid');

        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            const embed = new EmbedBuilder()
                .setColor('LightGreen')
                .setDescription('You do not have permission to unban members.');
            return interaction.reply({ embeds: [embed] });
        }

        try {
            await interaction.guild.members.unban(userId);
            const successEmbed = new EmbedBuilder()
                .setColor('LightGreen')
                .setDescription(`Successfully unbanned user with ID ${userId}.`);
            await interaction.reply({ embeds: [successEmbed] });

            const channel = interaction.channel;
            const notifyEmbed = new EmbedBuilder()
                .setColor('LightGreen')
                .setDescription(`User with ID ${userId} has been unbanned by ${interaction.user.tag}.`);
            await channel.send({ embeds: [notifyEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('An error occurred while trying to unban the user. Make sure the ID is correct and the user is banned.');
            await interaction.reply({ embeds: [errorEmbed] });
        }
    },
};
