const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Provides information about a specific role.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to get information about')
                .setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');

        const roleInfoEmbed = new EmbedBuilder()
            .setColor(role.hexColor)
            .setTitle('Role Information')
            .addFields(
                { name: 'Role Name', value: role.name, inline: true },
                { name: 'Role ID', value: role.id, inline: true },
                { name: 'Role Color', value: role.hexColor, inline: true },
                { name: 'Created At', value: role.createdAt.toDateString(), inline: true },
                { name: 'Members with this Role', value: role.members.size.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Requested by ' + interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [roleInfoEmbed] });
    },
};
