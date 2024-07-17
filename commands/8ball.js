const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const answers = [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes - definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    'Don\'t count on it.',
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8-ball for some psychic wisdom')
        .addStringOption(option => option.setName('question').setDescription('Enter a question').setRequired(true)),
    cooldown: '3',
    category: 'Fun',
    guildOnly: false,
    execute (interaction, configuration) {
        const questionField = interaction.options.getString('question');

        const embed = new EmbedBuilder()
            .setTitle('8-Ball')
            .addFields(
                { name: 'Question', value: `${questionField}` },
                { name: 'Answer', value: `${answers[Math.floor(Math.random() * answers.length)]}` }
            )
            .setColor('Green');
        interaction.reply({ embeds: [embed] });
    }
};
