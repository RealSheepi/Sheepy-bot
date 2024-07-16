const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js');
const { evaluate } = require('mathjs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculator')
        .setDescription('Bring up a simple calculator'),
    cooldown: '5',
    category: 'Utility',
    guildOnly: false,
    async execute (interaction) {
        let content = '';
    let data = '';

        const generateComponents = () => {
            const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('clear').setLabel('C').setStyle('Danger'),
                new ButtonBuilder().setCustomId('(').setLabel('(').setStyle('Primary'),
                new ButtonBuilder().setCustomId(')').setLabel(')').setStyle('Primary'),
                new ButtonBuilder().setCustomId('^').setLabel('^').setStyle('Primary')
            );
            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('7').setLabel('7').setStyle('Secondary'),
                new ButtonBuilder().setCustomId('8').setLabel('8').setStyle('Secondary'),
                new ButtonBuilder().setCustomId('9').setLabel('9').setStyle('Secondary'),
                new ButtonBuilder().setCustomId('/').setLabel('÷').setStyle('Primary')
            );
            const row3 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('4').setLabel('4').setStyle('Secondary'),
                new ButtonBuilder().setCustomId('5').setLabel('5').setStyle('Secondary'),
                new ButtonBuilder().setCustomId('6').setLabel('6').setStyle('Secondary'),
                new ButtonBuilder().setCustomId('*').setLabel('×').setStyle('Primary')
            );
            const row4 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('1').setLabel('1').setStyle('Secondary'),
                new ButtonBuilder().setCustomId('2').setLabel('2').setStyle('Secondary'),
                new ButtonBuilder().setCustomId('3').setLabel('3').setStyle('Secondary'),
                new ButtonBuilder().setCustomId('-').setLabel('−').setStyle('Primary')
            );
            const row5 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('0').setLabel('0').setStyle('Secondary'),
                new ButtonBuilder().setCustomId('.').setLabel('.').setStyle('Secondary'),
                new ButtonBuilder().setCustomId('=').setLabel('=').setStyle('Success'),
                new ButtonBuilder().setCustomId('+').setLabel('+').setStyle('Primary')
            );
            return [row1, row2, row3, row4, row5];
        };

    const components = generateComponents();

    interaction.reply({ content: '```\n \n ```', components });

    const message = await interaction.fetchReply();

    const filter = compInt => compInt.user.id === interaction.user.id;
    const collector = message.createMessageComponentCollector(filter, { time: 10e3 });

    collector.on('collect', compInt => {
    const value = compInt.customId;

    switch (value) {
      case 'clear':
        data = '';
        content = '```\n \n ```';
        break;
      case '=':
        try {
          const res = evaluate(data);
          content = `\`\`\`\n${data}\n= ${res}\`\`\``;
          data = `${res}`;
        }
            catch (err) {
          content = '```Error: Something went wrong while trying to evaluate this expression.```';
          data = '';
        }
          break;
      default:
        data += value;
        content = `\`\`\`\n${data} \n \`\`\``;
        break;
      }

      collector.resetTimer();
      compInt.update({ content, components });
    });

  }
};
