export const contactLinks = {
  telegram: import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/YOUR_USERNAME',
  discord: import.meta.env.VITE_DISCORD_URL || 'https://discord.gg/YOUR_INVITE',
  whatsapp: import.meta.env.VITE_WHATSAPP_URL || 'https://wa.me/15555555555'
};

export const hasRealContactLinks = Object.values(contactLinks).every(
  (value) =>
    value &&
    !value.includes('YOUR_USERNAME') &&
    !value.includes('YOUR_INVITE') &&
    !value.includes('15555555555')
);
