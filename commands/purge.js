const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Remove messages from the guild text channel')
    .addIntegerOption(option => option.setName('amount').setDescription('Enter an amount (between 1 and 99)').setMinValue(1).setMaxValue(99).setRequired(true)),
  cooldown: '10',
  category: 'Moderation',
  guildOnly: true,
  execute (interaction, configuration) {
    if (!interaction.guild.members.me.permissions.has('ManageMessages')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Messages** permission in `Server Settings > Roles` to use this command.' });
    if (!interaction.member.permissions.has('ManageMessages')) return interaction.reply({ embeds: [global.errors[2]] });

    const amountField = interaction.options.getInteger('amount');

      const embed = new EmbedBuilder()
        .setDescription(`Succesfully removed **${amountField}** message(s)`)
        .setColor('Green');
      interaction.reply({ embeds: [embed], ephemeral: true }).then(interaction.channel.bulkDelete(amountField, true));
    }
};
