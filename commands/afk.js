const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set yourself as AFK and receive the AFK role'),
    async execute(interaction) {
        const afkRoleId = 'ur-id';
        const member = interaction.member;

        const afkRole = interaction.guild.roles.cache.get(afkRoleId);

        if (!afkRole) {
            return interaction.reply({ content: 'AFK role not found.', ephemeral: true });
        }

        try {
            await member.roles.add(afkRole);
            await interaction.reply({ content: 'You are now AFK.', ephemeral: true });
        } catch (error) {
            console.error('Error adding AFK role:', error);
            await interaction.reply({ content: 'There was an error setting you as AFK.', ephemeral: true });
        }
    },
};
