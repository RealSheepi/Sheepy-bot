const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botnick')
        .setDescription('Change bot\'s nickname in current server')
        .addStringOption(option => option.setName('nickname').setDescription('Enter a nickname (max 32 characters)').setMaxLength(32).setRequired(true)),
    cooldown: '15',
    category: 'Utility',
    guildOnly: true,
    execute (interaction, configuration) {
        if (!interaction.guild.members.me.permissions.has('ManageNicknames')) {
            return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Nicknames** permission in `Server Settings > Roles` to use this command.' });
        }
        if (!interaction.member.permissions.has('ManageNicknames')) {
            if (global.errors && global.errors[2]) {
                return interaction.reply({ embeds: [global.errors[2]] });
            } else {
                return interaction.reply({ content: 'Error: You do not have the required permissions to manage nicknames.' });
            }
        }

        const nicknameField = interaction.options.getString('nickname');

        const embed = new EmbedBuilder()
            .setTitle('Bot Nickname')
            .setDescription(`Nickname successfully changed to **${nicknameField}**`)
            .setColor('DarkBlue');

        interaction.guild.members.me.setNickname(nicknameField).then(() => {
            interaction.reply({ embeds: [embed] });
        }).catch(error => {
            interaction.reply({ content: 'An error occurred while changing the nickname.' });
            console.error(error);
        });
    }
};
