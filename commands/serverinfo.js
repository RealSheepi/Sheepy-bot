const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Provides information about the server."),
    async execute(interaction) {
        const { guild } = interaction;
        const { name, memberCount, ownerId, createdAt } = guild;
        const owner = await guild.members.fetch(ownerId);

        const serverInfoEmbed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("Server Information")
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: "Server Name", value: name, inline: true },
                {
                    name: "Total Members",
                    value: memberCount.toString(),
                    inline: true,
                },
                { name: "Owner", value: `<@${ownerId}>`, inline: true },
                {
                    name: "Created At",
                    value: createdAt.toDateString(),
                    inline: true,
                },
            )
            .setTimestamp()
            .setFooter({
                text: "Requested by " + interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            });

        await interaction.reply({ embeds: [serverInfoEmbed] });
    },
};
