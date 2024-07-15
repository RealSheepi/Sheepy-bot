const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to warn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the warning')
                .setRequired(false)),
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const member = interaction.member;
            if (!member || !member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                return await interaction.followUp({ content: 'You do not have permission to use this command.' });
            }

            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'No reason provided';

            try {
                await user.send(`You have been warned in ${interaction.guild.name} for: ${reason}`);
            } catch (error) {
                console.error(`Failed to send DM to ${user.tag}`);
            }

            const embed = new MessageEmbed()
                .setTitle('User Warned')
                .setDescription(`${user.tag} has been warned.`)
                .addField('Reason', reason)
                .setColor('RED') 
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

            const modChannelId = 'MODERATION_CHANNEL_ID';
            const modChannel = interaction.guild.channels.cache.get(modChannelId);
            if (modChannel) {
                const logEmbed = new MessageEmbed()
                    .setTitle('User Warned')
                    .setDescription(`${user.tag} has been warned by ${interaction.user.tag}.`)
                    .addField('Reason', reason)
                    .setColor('RED') 
                    .setTimestamp();

                modChannel.send({ embeds: [logEmbed] });
            }

            console.log(`User ${user.tag} warned by ${interaction.user.tag} for: ${reason}`);
        } catch (error) {
            console.error('Error executing warn command:', error);
            return await interaction.followUp({ content: 'There was an error while executing this command.' });
        }
    },
};
