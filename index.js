const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 판매 상품
const products = [
  { name: "상품 A", price: 1000 },
  { name: "상품 B", price: 2000 },
  { name: "상품 C", price: 3000 }
];

client.once("ready", async () => {
  console.log(`${client.user.tag} 온라인!`);

  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);

    if (!channel) {
      console.log("채널을 찾을 수 없습니다.");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("🛒 • 구매하기에 오신 걸 환영합니다!")
      .setDescription(
        "원하시는 메뉴를 아래 버튼에서 선택해주세요.\n\n" +
        "📢 공지 — 공지사항 확인\n" +
        "📦 제품 — 판매 제품 확인\n" +
        "💰 충전 — 잔액 충전\n" +
        "👤 정보 — 내 정보 확인\n" +
        "🛒 구매 — 제품 구매"
      )
      .setColor(0x5865f2);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("notice")
        .setLabel("공지")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("products")
        .setLabel("제품")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("charge")
        .setLabel("충전")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("info")
        .setLabel("정보")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("buy")
        .setLabel("구매")
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({
      embeds: [embed],
      components: [row]
    });

    console.log("자판기 메시지를 보냈습니다.");
  } catch (error) {
    console.error("메시지 전송 오류:", error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "notice") {
    await interaction.reply({
      content: "📢 현재 등록된 공지사항이 없습니다.",
      ephemeral: true
    });
  }

  if (interaction.customId === "products") {
    const text = products
      .map(
        (product) =>
          `📦 **${product.name}** — ${product.price.toLocaleString()}원`
      )
      .join("\n");

    await interaction.reply({
      content: `🛍️ **판매 제품**\n\n${text}`,
      ephemeral: true
    });
  }

  if (interaction.customId === "charge") {
    await interaction.reply({
      content: "💰 충전 기능은 다음 단계에서 연결할 수 있어요.",
      ephemeral: true
    });
  }

  if (interaction.customId === "info") {
    await interaction.reply({
      content: `👤 사용자: ${interaction.user.username}`,
      ephemeral: true
    });
  }

  if (interaction.customId === "buy") {
    const text = products
      .map(
        (product, index) =>
          `${index + 1}. ${product.name} — ${product.price.toLocaleString()}원`
      )
      .join("\n");

    await interaction.reply({
      content: `🛒 **구매 메뉴**\n\n${text}`,
      ephemeral: true
    });
  }
});

// 디스코드 봇 로그인
client.login(process.env.DISCORD_TOKEN);
