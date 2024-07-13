const { SlashCommandBuilder } = require('discord.js');

let filteredWords = ['badword1', 'badword2', 'badphrase'];
let chatFilterEnabled = true;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatfilter')
        .setDescription('Manage chat filter settings.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('toggle')
                .setDescription('Toggle chat filter on or off.')
                .addBooleanOption(option =>
                    option.setName('enable')
                        .setDescription('Enable or disable the filter')
                        .setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a word or phrase to the filter.')
                .addStringOption(option =>
                    option.setName('word')
                        .setDescription('Word or phrase to add to the filter')
                        .setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a word or phrase from the filter.')
                .addStringOption(option =>
                    option.setName('word')
                        .setDescription('Word or phrase to remove from the filter')
                        .setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all filtered words and phrases.')
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'toggle':
                const enable = interaction.options.getBoolean('enable');
                chatFilterEnabled = enable;
                await interaction.reply(`Chat filter has been ${enable ? 'enabled' : 'disabled'}.`);
                break;
            case 'add':
                const wordToAdd = interaction.options.getString('word').toLowerCase();
                if (!filteredWords.includes(wordToAdd)) {
                    filteredWords.push(wordToAdd);
                    await interaction.reply(`Successfully added "${wordToAdd}" to the filter.`);
                } else {
                    await interaction.reply(`"${wordToAdd}" is already in the filter.`);
                }
                break;
            case 'remove':
                const wordToRemove = interaction.options.getString('word').toLowerCase();
                const index = filteredWords.indexOf(wordToRemove);
                if (index !== -1) {
                    filteredWords.splice(index, 1);
                    await interaction.reply(`Successfully removed "${wordToRemove}" from the filter.`);
                } else {
                    await interaction.reply(`"${wordToRemove}" is not in the filter.`);
                }
                break;
            case 'list':
                await interaction.reply(`Current filtered words and phrases:\n${filteredWords.join(', ')}`);
                break;
            default:
                await interaction.reply('Unknown subcommand.');
                break;
        }
    },
};
