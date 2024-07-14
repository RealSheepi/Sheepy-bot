const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Give a role to a specified person')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to give the role to')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to give to the user')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
        const member = await interaction.guild.members.fetch(user.id);

        try {
            await member.roles.add(role);
            await interaction.reply(`Role "${role.name}" has been given to ${user.tag}.`);
        } catch (error) {
            console.error('Error giving role:', error);
            await interaction.reply({ content: 'There was an error giving the role.', ephemeral: true });
        }
    },
};
