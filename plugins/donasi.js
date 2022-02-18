let handler = async m => m.reply(`
╭─「 Donasi & Pembayaran 」
│ • DANA/OVO/GOPAY [089653909054]
╰────
`.trim()) // Tambah sendiri kalo mau
handler.help = ['donasi']
handler.tags = ['info']
handler.command = /^dona(te|si)$/i

module.exports = handler