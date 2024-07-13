const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for kicking the user')
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = interaction.guild.members.cache.get(user.id);
        if (!member) {
            return interaction.reply({ content: 'User not found', ephemeral: true });
        }

        await member.kick(reason);

        const kickEmbed = new EmbedBuilder()
            .setColor('#ff9900')
            .setTitle('User Kicked')
            .addFields(
                { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                { name: 'Reason', value: reason, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Kicked by ' + interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [kickEmbed] });
    },
};
