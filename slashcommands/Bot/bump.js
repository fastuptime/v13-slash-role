module.exports = {
  name: "bump",
  usage: "/bump",
  category: "Bot",
  description: "Rol verir.",
  run: async (client, interaction) => {
     try {
        const role = interaction.member.guild.roles.cache.find(
          (role) => role.name === "Üye"
        );
        await interaction.member.roles.add(role).then(() => {
          interaction.reply({ content: "Rol verildi.", emphemeral: true });
        });
     } catch (e) {
        interaction.reply({ content: "Bir Hata Oluştu", emphemeral: true });
     }
  },
};
