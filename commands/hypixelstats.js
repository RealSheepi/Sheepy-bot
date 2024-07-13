const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hypixelstats')
        .setDescription('Get general Hypixel stats and Bedwars stats for a Minecraft player')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The Minecraft username')
                .setRequired(true)
        ),
    async execute(interaction) {
        const username = interaction.options.getString('username');
        const apiKey = 'api-key';

        try {
            const uuidResponse = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);
            if (!uuidResponse.data || !uuidResponse.data.id) {
                await interaction.reply('Username not found. Please make sure the username is correct.');
                return;
            }
            const uuid = uuidResponse.data.id;

            const hypixelResponse = await axios.get(`https://api.hypixel.net/player?key=${apiKey}&uuid=${uuid}`);
            if (!hypixelResponse.data.success || !hypixelResponse.data.player) {
                await interaction.reply('Failed to fetch Hypixel stats. Please try again later.');
                return;
            }

            const playerStats = hypixelResponse.data.player;

            const { displayname, networkExp, achievementPoints, karma, firstLogin, lastLogin } = playerStats;
            const firstLoginDate = new Date(firstLogin).toLocaleString();
            const lastLoginDate = new Date(lastLogin).toLocaleString();

            const bedwarsStats = playerStats.stats.Bedwars || {};
            const {
                wins_bedwars = 0,
                losses_bedwars = 0,
                kills_bedwars = 0,
                deaths_bedwars = 0,
                beds_broken_bedwars = 0,
                beds_lost_bedwars = 0,
                coins = 0
            } = bedwarsStats;

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Hypixel Stats for ${displayname}`)
                .setDescription('General and Bedwars statistics')
                .addFields(
                    { name: 'General Stats', value: `**Network Experience:** ${networkExp}\n**Achievement Points:** ${achievementPoints}\n**Karma:** ${karma}\n**First Login:** ${firstLoginDate}\n**Last Login:** ${lastLoginDate}`, inline: false },
                    { name: 'Bedwars Stats', value: `**Wins:** ${wins_bedwars}\n**Losses:** ${losses_bedwars}\n**Kills:** ${kills_bedwars}\n**Deaths:** ${deaths_bedwars}\n**Beds Broken:** ${beds_broken_bedwars}\n**Beds Lost:** ${beds_lost_bedwars}\n**Coins:** ${coins}`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Hypixel Stats', iconURL: 'https://hypixel.net/favicon.ico' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching Hypixel stats:', error);
            await interaction.reply('There was an error retrieving the Hypixel stats. Please try again later.');
        }
    },
};
