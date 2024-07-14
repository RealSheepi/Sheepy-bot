const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Create a new role')
        .addStringOption(option =>
            option.setName('role-name')
                .setDescription('The name of the new role!')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('The color of the new role in HEX (e.g., #ff0000)')
                .setRequired(true)),
    async execute(interaction) {
        const roleName = interaction.options.getString('role-name');
        const roleColor = interaction.options.getString('color');

        if (!/^#[0-9A-F]{6}$/i.test(roleColor)) {
            return interaction.reply({ content: 'Please provide a valid HEX color code.', ephemeral: true });
        }

        try {
            await interaction.guild.roles.create({
                name: roleName,
                color: roleColor,
                reason: `Role created by ${interaction.user.tag}`,
            });

            await interaction.reply(`Role "${roleName}" created successfully with color ${roleColor}.`);
        } catch (error) {
            console.error('Error creating role:', error);
            await interaction.reply({ content: 'There was an error creating the role.', ephemeral: true });
        }
    },
};
