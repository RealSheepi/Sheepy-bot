const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Send a message with or without a spoiler')
    .addStringOption(option => option.setName('message').setDescription('Enter a message').setRequired(true))
    .addStringOption(option => option.setName('spoiler').setDescription('Select whether message contains spoiler').addChoices({ name: 'No', value: 'false' }, { name: 'Yes', value: 'true' }).setRequired(true)),
  cooldown: '3',
  category: 'Fun',
  guildOnly: true,
  execute (interaction, configuration) {
    const messageField = interaction.options.getString('message');
    const spoilerField = interaction.options.getString('spoiler');

    if (spoilerField === 'false') {
      const embed = new EmbedBuilder()
        .setDescription(`**${interaction.user.username} said:** ${messageField}`)
        .setColor('DarkPurple');
      interaction.reply({ embeds: [embed] });
        }

    if (spoilerField === 'true') {
      const embed = new EmbedBuilder()
                .setDescription(`**${interaction.user.username} said:** ||${messageField}||`)
                .setColor('DarkRed');
            interaction.reply({ embeds: [embed] });
    }

  }
};
