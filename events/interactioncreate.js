const { EmbedBuilder, Collection, InteractionType } = require('discord.js');
const cooldowns = new Collection();

module.exports = async interaction => {
    const { client } = interaction;
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    if (command.guildOnly && interaction.channel.type === 1) {
        return interaction.reply({ embeds: [global.errors[0]] });
    }

    if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;

            const inCooldown = new EmbedBuilder()
                .setTitle('Cooldown')
                .setDescription(`Please wait \`${timeLeft.toFixed(1)}\` more second(s) before reusing the **${command.data.name}** command.`)
                .setColor('#ffaa00');
            return interaction.reply({ embeds: [inCooldown], ephemeral: true });
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
        const configuration = require('../config.json');
        await command.execute(interaction, configuration);
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ embeds: [global.errors[4]] });
    }
};
