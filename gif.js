const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomgif')
        .setDescription('Get a random GIF'),
    async execute(interaction) {
        try {
            const apiKey = 'api-key';
            const giphyResponse = await axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&rating=g`);

            if (!giphyResponse.data || !giphyResponse.data.data || !giphyResponse.data.data.image_url) {
                await interaction.reply('Failed to fetch a random GIF. Please try again later.');
                return;
            }

            const gifUrl = giphyResponse.data.data.image_url;

            await interaction.reply(gifUrl);
        } catch (error) {
            console.error('Error fetching random GIF:', error);
            await interaction.reply('There was an error retrieving a random GIF. Please try again later.');
        }
    },
};
